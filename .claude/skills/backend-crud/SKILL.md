---
name: backend-crud
description: 產生完整的後端 API 功能模組（Controller/Service/Routes/Schema）。當使用者說「新增 xxx 模組」、「幫我建立 xxx 功能」時使用。
argument-hint: "ResourceName"
---

為資源 `$ARGUMENTS` 產生完整的 API 功能模組，遵循專案 Controller → Service 兩層架構。

## 執行步驟

### 1. 推導命名

從 `$ARGUMENTS`（PascalCase，例如 `Analyze`）推導：
- 小寫單數（kebab-case 檔案名稱）：`analyze`
- 小寫複數（URL path）：`analyzes` 或依語意調整（`analyze` 路徑可保持單數）
- 大寫底線（錯誤代碼前綴）：`ANALYZE`

### 2. 建立 Zod Schema

檔案：`src/schemas/<小寫單數>.schema.ts`

定義請求 body 的驗證 Schema，包含欄位型別與長度限制（避免過長輸入送入 Gemini API）。

### 3. 依序建立以下檔案

| 檔案路徑 | 職責 |
|---------|------|
| `src/services/<小寫單數>.service.ts` | 組裝 Prompt、呼叫 Gemini API（主）、解析回傳 JSON |
| `src/controllers/<小寫單數>.controller.ts` | 只處理 req/res，catch 後 next(error) |
| `src/routes/<小寫單數>.routes.ts` | 掛 validate middleware |

### 4. 掛載路由

在 `src/app.ts` import 並加入 `app.use('/api/v1/<路徑>', ...)`

### 5. 提示後續動作

完成後告知使用者：
- 執行 `/backend-test` 補充測試
- 在 Controller 補 Swagger JSDoc 註解

## 架構限制（必須遵守）

- Controller 禁止直接呼叫 Claude SDK，必須透過 Service
- Service 負責所有 Prompt 邏輯與 Gemini API 呼叫（主要），可擴充 Claude API
- 所有錯誤透過 `throw new AppError(code, message, statusCode)` 拋出
- 所有 TypeScript 型別明確定義，禁止 `any`
- 輸入文字長度限制於 Schema 中定義（建議 max 2000 字元）
