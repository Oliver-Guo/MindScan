---
name: backend-ai-api
description: 協助處理 AI API 相關操作（主：Gemini / 擴充：Claude），包含 Prompt 設計、模型選擇、回傳 JSON 解析。當使用者說「調整 prompt」、「換模型」、「解析 AI 回傳」時使用。
argument-hint: "prompt | model | parse | debug"
---

根據 `$ARGUMENTS` 協助處理 AI API 相關任務。若未指定則分析當前需求決定動作。

## 可處理的任務

### `prompt`
1. 讀取 `src/services/` 下對應的 service 檔案，確認現有 Prompt 結構
2. 根據需求調整 System Instruction 或 User Prompt
3. 確保 System Instruction 包含「請以 JSON 格式回覆，不要輸出其他文字」
4. 驗證 JSON Schema 與 Zod Schema 欄位一致

### `model`
說明可用的 AI 模型選項：

**Gemini（主要）：**
- `gemini-2.0-flash` — 快速、高效能（預設推薦）
- `gemini-1.5-pro` — 更高智能，適合複雜分析（較慢）
- `gemini-1.5-flash` — 超快，適合簡單任務

**Claude（待擴充）：**
- `claude-opus-4-6` — 最高智能，適合複雜分析
- `claude-sonnet-4-6` — 平衡效能與速度（Claude 預設）
- `claude-haiku-4-5-20251001` — 最快

在 service 中透過 `env.AI_PROVIDER`（可選環境變數）切換，預設使用 Gemini。

### `parse`
協助撰寫 AI API 回傳 JSON 的解析與容錯邏輯：
- 使用 `JSON.parse()` 包在 try/catch 中
- 配合 Zod Schema 驗證結構
- 解析失敗時 throw AppError('PARSE_ERROR', 'AI 回傳格式異常', 502)

### `debug`
協助排查 AI API 呼叫問題：
- 確認 `GEMINI_API_KEY` 是否正確設定
- 確認 Prompt 是否明確要求 JSON 格式回傳
- 印出完整 Prompt 供檢查

## Gemini SDK 呼叫範本（主要）

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  systemInstruction: 'System Prompt...',
})

const result = await model.generateContent(userInput)
const raw = result.response.text()
const data = JSON.parse(raw)
```

## Claude SDK 呼叫範本（待擴充）

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { env } from '../config/env'

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })

const message = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  system: 'System Prompt...',
  messages: [{ role: 'user', content: userInput }],
})

const raw = message.content[0].type === 'text' ? message.content[0].text : ''
const result = JSON.parse(raw)
```

## 注意事項

- 禁止在前端直接呼叫 AI API（API Key 安全性）
- Prompt 內容不得包含用戶原始輸入以外的敏感資訊
- 輸入長度建議在 service 層限制（超過 2000 字元拒絕呼叫）
