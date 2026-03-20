import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env'
import { AppError } from '../utils/AppError'
import { logApiCall } from './api-log.service'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)

// Model fallback list: default → attempt1 → attempt2 → attempt3 → attempt4
const FALLBACK_MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-flash-lite-latest',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite-preview',
]

// 需要 fallback 到下一個模型的 HTTP 狀態碼
// 404 = 模型不存在 / 該版本不支援
// 429 = 配額超限
// 503 = 服務不可用
const FALLBACK_ERROR_CODES = [404, 429, 503]

function isFallbackError(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase()
    if (
      msg.includes('quota') ||
      msg.includes('rate limit') ||
      msg.includes('too many requests') ||
      msg.includes('not found') ||
      msg.includes('is not supported')
    ) {
      return true
    }
  }
  // @google/generative-ai attaches a `status` property
  const e = err as { status?: number }
  return typeof e.status === 'number' && FALLBACK_ERROR_CODES.includes(e.status)
}

/**
 * 清理 AI 回傳文字，移除可能包裹的 markdown code block
 * 例：```json { ... } ``` → { ... }
 */
function cleanJsonResponse(raw: string): string {
  // 移除 ```json ... ``` 或 ``` ... ```
  const codeBlockMatch = raw.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/)
  if (codeBlockMatch) return codeBlockMatch[1].trim()
  return raw.trim()
}

async function generateWithFallback(
  systemInstruction: string,
  prompt: string,
): Promise<string> {
  let lastErr: unknown

  for (const modelName of FALLBACK_MODELS) {
    const model = genAI.getGenerativeModel({ model: modelName, systemInstruction })
    try {
      const result = await model.generateContent(prompt)
      const raw = result.response.text().trim()
      const cleaned = cleanJsonResponse(raw)
      console.info(`[generateWithFallback] 使用模型：${modelName}，原始回傳前100字：${raw.slice(0, 100)}`)

      // 記錄成功的 API 呼叫
      logApiCall({
        companyType: 'gemini',
        modelType: modelName,
        status: 200,
        request: { systemInstruction, prompt },
        response: { raw: raw.slice(0, 5000) },
      })

      return cleaned
    } catch (err) {
      lastErr = err
      const e = err as { status?: number }
      const status = e.status ?? 500

      // 記錄失敗的 API 呼叫
      logApiCall({
        companyType: 'gemini',
        modelType: modelName,
        status,
        request: { systemInstruction, prompt },
        response: { error: err instanceof Error ? err.message : String(err) },
      })

      if (isFallbackError(err)) {
        console.warn(`[generateWithFallback] 模型 ${modelName} 不可用（status: ${status}），嘗試下一個模型…`)
        continue
      }
      // Non-quota error → rethrow immediately
      throw err
    }
  }

  // All models exhausted due to quota
  console.error('[generateWithFallback] 所有模型配額均已耗盡', lastErr)
  throw new AppError('QUOTA_EXCEEDED', 'API 額度限制，請稍後再試或升級 Gemini 方案', 429)
}

export interface EmotionTip {
  icon: string
  title: string
  detail: string
}

export interface EmotionResult {
  emotion_type: string
  intensity: number
  intensity_desc: string
  tips: EmotionTip[]
  letter: string
}

export interface LieSentence {
  text: string
  risk: 'safe' | 'warning' | 'danger'
  reason: string
}

export interface LieFeature {
  type: string
  example: string
}

export interface LieResult {
  credibility_score: number
  risk_level: 'low' | 'medium' | 'high'
  risk_level_zh: string
  sentences: LieSentence[]
  features: LieFeature[]
  summary: string
}

export const analyzeEmotion = async (text: string): Promise<EmotionResult> => {
  const systemInstruction = `你是一位溫暖專業的情緒支持顧問，擅長分析使用者的情緒狀態並給出實際可行的紓壓建議。
請以 JSON 格式回覆，不要輸出其他文字、不要使用 markdown code block，直接輸出純 JSON。`

  const prompt = `使用者描述：「${text}」

請分析並回傳以下 JSON：
{
  "emotion_type": "主要情緒類型（繁體中文，2–4字）",
  "intensity": 0到100的整數,
  "intensity_desc": "一句話描述情緒強度",
  "tips": [
    { "icon": "emoji", "title": "建議標題", "detail": "詳細說明（30字內）" },
    { "icon": "emoji", "title": "建議標題", "detail": "詳細說明（30字內）" },
    { "icon": "emoji", "title": "建議標題", "detail": "詳細說明（30字內）" }
  ],
  "letter": "給使用者的鼓勵信（100到150字，溫暖語氣，第二人稱）"
}`

  try {
    const raw = await generateWithFallback(systemInstruction, prompt)
    const data = JSON.parse(raw) as EmotionResult
    return data
  } catch (err) {
    if (err instanceof AppError) throw err
    if (err instanceof SyntaxError) {
      throw new AppError('PARSE_ERROR', 'AI 回傳格式異常，請稍後再試', 502)
    }
    console.error('[analyzeEmotion error]', err)
    throw new AppError('AI_ERROR', 'AI 服務暫時無法使用，請稍後再試', 502)
  }
}

export const analyzeLie = async (text: string): Promise<LieResult> => {
  const systemInstruction = `你是一位語言行為分析專家，擅長識別文字中的欺騙性語言模式。
分析時保持客觀，基於語言學特徵而非主觀判斷。
請以 JSON 格式回覆，不要輸出其他文字、不要使用 markdown code block，直接輸出純 JSON。`

  const prompt = `請分析以下文字的可信度：
「${text}」

請回傳以下 JSON：
{
  "credibility_score": 0到100的整數,
  "risk_level": "low" 或 "medium" 或 "high",
  "risk_level_zh": "低風險" 或 "中風險" 或 "高風險",
  "sentences": [
    {
      "text": "原始句子文字",
      "risk": "safe" 或 "warning" 或 "danger",
      "reason": "風險原因（15字內，若safe則為空字串）"
    }
  ],
  "features": [
    { "type": "矛盾陳述" 或 "模糊表達" 或 "迴避回應" 或 "情緒誇大" 或 "資訊缺漏", "example": "具體例子" }
  ],
  "summary": "2到3句分析總結"
}`

  try {
    const raw = await generateWithFallback(systemInstruction, prompt)
    const data = JSON.parse(raw) as LieResult
    return data
  } catch (err) {
    if (err instanceof AppError) throw err
    if (err instanceof SyntaxError) {
      throw new AppError('PARSE_ERROR', 'AI 回傳格式異常，請稍後再試', 502)
    }
    console.error('[analyzeLie error]', err)
    throw new AppError('AI_ERROR', 'AI 服務暫時無法使用，請稍後再試', 502)
  }
}
