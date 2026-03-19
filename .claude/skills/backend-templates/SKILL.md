---
name: backend-templates
description: 產生或修復後端基礎設施檔案（AppError、error middleware、validate middleware、env config）。當使用者說「初始化後端」、「缺少 AppError」、「幫我建 middleware」時使用。
argument-hint: "AppError | error | validate | env | all"
---

根據 `$ARGUMENTS` 產生對應的後端基礎設施檔案。若未指定引數則產生全部。

## 可產生的檔案

| 引數 | 目標檔案 |
|------|---------|
| `AppError` | `src/utils/AppError.ts` |
| `error` | `src/middlewares/error.middleware.ts` |
| `validate` | `src/middlewares/validate.middleware.ts` |
| `env` | `src/config/env.ts` |
| `response` | `src/utils/response.ts` |
| `all` 或未指定 | 以上全部 |

## 執行規則

1. 先用 `Read` 工具確認目標檔案是否已存在
2. **若已存在**：比對現有內容，只補充缺少的部分，不覆蓋已有邏輯
3. **若不存在**：依照以下規格建立

## 各檔案規格

### `src/utils/AppError.ts`
繼承 Error，constructor 接受 `code: string`、`message: string`、`statusCode: number = 500`。

### `src/middlewares/error.middleware.ts`
Express 4 參數 error handler，依序處理：`AppError`（回傳 code/message/statusCode）→ `ZodError`（400 VALIDATION_ERROR，含 details）→ 其他（500 INTERNAL_ERROR）。

### `src/middlewares/validate.middleware.ts`
接受 `ZodSchema`，回傳 Express middleware，parse `req.body` 後呼叫 `next()`，失敗時 `next(error)`。

### `src/config/env.ts`
用 Zod 定義並 parse `process.env`，匯出 `env` 物件。包含：NODE_ENV、PORT、GEMINI_API_KEY（非空字串）、CORS_ORIGIN、LOG_LEVEL。
可選擴充：ANTHROPIC_API_KEY（Claude API，待擴充用）、AI_PROVIDER（'gemini' | 'claude'，預設 'gemini'）。

### `src/utils/response.ts`
匯出 `success(res, data, statusCode?, message?)` 工具函式。
