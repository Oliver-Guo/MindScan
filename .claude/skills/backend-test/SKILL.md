---
name: backend-test
description: 為後端 API 端點產生測試檔案。當使用者說「寫測試」、「新增測試」或「幫我測 xxx API」時使用。
argument-hint: "resource-name"
---

為 `$ARGUMENTS` 撰寫後端整合測試。

## 執行步驟

1. 從 `$ARGUMENTS` 推導命名：小寫單數作為檔案名稱（例如 `analyze`），大寫底線作為錯誤代碼前綴（例如 `ANALYZE`）
2. 讀取 `src/controllers/$ARGUMENTS（小寫）.controller.ts` 了解所有端點
3. 讀取 `src/schemas/$ARGUMENTS（小寫）.schema.ts` 了解驗證規則
4. 在 `tests/$ARGUMENTS（小寫）.test.ts` 建立測試檔案，涵蓋：
   - 每個端點的成功情境（mock Gemini API 回傳）
   - 驗證失敗（400）：空輸入、輸入過長
   - Gemini API 呼叫失敗的錯誤處理（500 / 502）

## 測試規範

- 使用 Vitest + Supertest
- mock `@google/generative-ai`，避免在測試中實際呼叫 Gemini API（節省費用）
- 每個 `describe` 對應一個端點（`METHOD /api/v1/...`）
- 測試名稱用英文，清楚描述情境

## 範本

```typescript
import { describe, it, expect, vi, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../src/app'

// Mock Google Generative AI SDK
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: vi.fn().mockResolvedValue({
        response: {
          text: vi.fn().mockReturnValue(JSON.stringify({
            emotion_type: '焦慮',
            intensity: 75,
            intensity_desc: '情緒強度偏高',
            tips: [],
            letter: '你好'
          }))
        }
      })
    })
  }))
}))

describe('POST /api/v1/analyze/emotion', () => {
  it('should return emotion analysis when input is valid', async () => {
    const res = await request(app)
      .post('/api/v1/analyze/emotion')
      .send({ text: '今天工作壓力很大，感覺很焦慮' })
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty('emotion_type')
    expect(res.body.data).toHaveProperty('intensity')
  })

  it('should return 400 when text is empty', async () => {
    const res = await request(app)
      .post('/api/v1/analyze/emotion')
      .send({ text: '' })
    expect(res.status).toBe(400)
  })

  it('should return 400 when text exceeds max length', async () => {
    const res = await request(app)
      .post('/api/v1/analyze/emotion')
      .send({ text: 'a'.repeat(2001) })
    expect(res.status).toBe(400)
  })
})
```

5. 完成後輸出測試執行指令：`npx vitest run tests/<小寫資源名>.test.ts`
