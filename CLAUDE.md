# CLAUDE.md — MindScan AI 開發指南

> 本文件是 Claude AI 開發本專案的核心說明文件。
> 每次開始新的開發任務前，請先閱讀此文件。
> 各子目錄有對應的 CLAUDE.md，包含更詳細的實作細節。

---

## 📁 專案結構

```
project/
├── backend/          # Node.js + Express + TypeScript（Gemini API Proxy）
├── frontend/         # React 18 + Vite + TypeScript + shadcn/ui
├── docs/             # 需求與架構規劃文件
└── ops/              # Docker / Nginx / CI 部署設定
```

---

## 🧠 開發原則（Claude 必讀）

1. **型別優先**：所有變數、函式參數、回傳值必須有 TypeScript 型別，禁止使用 `any`
2. **三層架構**：後端嚴格遵守 Controller → Service 分層，Controller 只處理 req/res，Service 負責呼叫 Gemini API
3. **單一職責**：每個檔案只做一件事，超過 200 行考慮拆分
4. **錯誤處理**：所有 async 函式必須有 try/catch，統一透過 errorHandler middleware 回應
5. **環境變數**：所有敏感資訊從 `.env` 讀取，禁止硬編碼在代碼中（尤其是 `GEMINI_API_KEY`）

---

## ⚙️ 技術棧總覽

### Backend
| 項目 | 技術 | 版本 |
|------|------|------|
| Runtime | Node.js | 20 LTS |
| 框架 | Express | ^4.18 |
| 語言 | TypeScript | ^5.3 |
| AI SDK | @google/generative-ai（主）/ @anthropic-ai/sdk（擴充）| ^0.x |
| ORM | Prisma | ^7.x |
| 資料庫 | MySQL | 8.0 |
| 驗證 | Zod | ^3.x |
| 日誌 | Winston + Morgan | - |
| API 文檔 | Swagger UI (OpenAPI 3.0) | - |

### Frontend
| 項目 | 技術 | 版本 |
|------|------|------|
| 框架 | React | 18 |
| 建構工具 | Vite | ^5.x |
| 語言 | TypeScript | ^5.3 |
| UI 框架 | shadcn/ui + Tailwind CSS | - |
| 狀態管理 | Zustand | ^4.x |
| 資料請求 | TanStack Query v5 | - |
| 路由 | React Router v6 | - |
| 表單 | React Hook Form + Zod | - |
| HTTP | Axios | ^1.x |
| 圖示 | Lucide React | - |

---

## 📏 命名規範

### 檔案命名
```
# Backend（kebab-case + 層級後綴）
analyze.controller.ts / analyze.service.ts
analyze.routes.ts / analyze.schema.ts / error.middleware.ts

# Frontend
EmotionTab.tsx     # PascalCase（React 元件）
LieTab.tsx
useEmotion.ts      # camelCase + use 前綴（hooks）
analyze.api.ts     # kebab-case（API 呼叫）
appStore.ts        # camelCase + Store 後綴
```

### 變數與函式
- 一般變數/函式 → `camelCase`（`analyzeEmotion`、`isLoading`）
- 常數 → `UPPER_SNAKE_CASE`（`MAX_INPUT_LENGTH`、`API_BASE_URL`）
- React 元件 → `PascalCase`（`EmotionResultCard`）
- TypeScript 型別/介面/enum → `PascalCase`（`EmotionResult`、`LieResult`）

---

## 🌐 API 設計規範

### MindScan API 端點
```
POST /api/v1/analyze/emotion   # 情緒急救包分析
POST /api/v1/analyze/lie       # 謊言偵測器分析
GET  /api/v1/health            # 健康檢查（確認 API Key 已設定）
```

### 統一回應格式
```typescript
// 成功
{ "success": true, "data": { ... }, "message": "分析完成" }

// 錯誤
{ "success": false, "error": "INVALID_INPUT", "message": "輸入內容不得為空" }
```

### HTTP 狀態碼
| 情況 | 狀態碼 |
|------|--------|
| 分析成功 | 200 |
| 驗證失敗 / 空輸入 | 400 |
| API Key 未設定 | 401 |
| 伺服器錯誤 | 500 |

---

## 📝 Git Commit 規範

遵循 [Conventional Commits](https://www.conventionalcommits.org/)，格式：`type(scope): 描述`

| 類型 | 用途 |
|------|------|
| feat | 新功能 |
| fix | 修復 bug |
| docs | 文檔更新 |
| refactor | 重構（不影響功能） |
| test | 測試相關 |
| chore | 建置/工具/依賴 |
| style | 樣式/格式（不影響邏輯） |

範例：`feat(analyze): 新增情緒急救包 API 端點`

---

## ⚠️ Claude 開發注意事項

1. **Gemini API Key**：必須設定 `GEMINI_API_KEY` 環境變數，切勿暴露在前端代碼或 git 提交中
   - 主要 AI：Gemini（`@google/generative-ai`，預設 `gemini-2.0-flash`）
   - 待擴充：Claude API（`@anthropic-ai/sdk`）可透過 `AI_PROVIDER=claude` 切換
2. **Prompt 格式**：回傳格式必須為純 JSON，System Prompt 需加上「請以 JSON 格式回覆，不要輸出其他文字」
3. **新增 API 端點後**，必須在 Swagger 文件中補充對應的 JSDoc 註解
4. **新增環境變數後**，必須同步更新 `.env.example`
5. **前端新增 API 呼叫**，統一在 `src/api/` 目錄下建立對應檔案，不在元件內直接呼叫 axios
6. **所有錯誤**透過 `throw new AppError(code, message, statusCode)` 拋出，由 errorHandler 統一處理
7. **輸入長度限制**：前後端都需驗證，防止過長輸入送入 Gemini API（建議上限 2000 字元）
