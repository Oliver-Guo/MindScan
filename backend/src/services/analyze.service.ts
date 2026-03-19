import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env'
import { AppError } from '../utils/AppError'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)

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
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-flash-lite-preview',
    systemInstruction: `你是一位溫暖專業的情緒支持顧問，擅長分析使用者的情緒狀態並給出實際可行的紓壓建議。
請以 JSON 格式回覆，不要輸出其他文字、不要使用 markdown code block，直接輸出純 JSON。`,
  })

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
    const result = await model.generateContent(prompt)
    const raw = result.response.text().trim()
    const data = JSON.parse(raw) as EmotionResult
    return data
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new AppError('PARSE_ERROR', 'AI 回傳格式異常，請稍後再試', 502)
    }
    console.error('[analyzeEmotion error]', err)
    throw new AppError('AI_ERROR', 'AI 服務暫時無法使用，請稍後再試', 502)
  }
}

export const analyzeLie = async (text: string): Promise<LieResult> => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-flash-latest',
    systemInstruction: `你是一位語言行為分析專家，擅長識別文字中的欺騙性語言模式。
分析時保持客觀，基於語言學特徵而非主觀判斷。
請以 JSON 格式回覆，不要輸出其他文字、不要使用 markdown code block，直接輸出純 JSON。`,
  })

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
    const result = await model.generateContent(prompt)
    const raw = result.response.text().trim()
    const data = JSON.parse(raw) as LieResult
    return data
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new AppError('PARSE_ERROR', 'AI 回傳格式異常，請稍後再試', 502)
    }
    console.error('[analyzeLie error]', err)
    throw new AppError('AI_ERROR', 'AI 服務暫時無法使用，請稍後再試', 502)
  }
}
