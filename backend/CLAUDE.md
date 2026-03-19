# Backend — CLAUDE.md

> 後端開發指南。詳細任務請使用對應 skill 指令（見下方）。

---

## 可用 Skills（按需呼叫，節省 context）

| 指令 | 觸發時機 |
|------|---------|
| `/backend-crud <ResourceName>` | 新增完整 AI 分析模組（Controller/Service/Routes/Schema） |
| `/backend-test <resource>` | 為指定資源產生整合測試 |
| `/backend-templates [AppError\|error\|validate\|env\|all]` | 產生或修復後端基礎設施檔案 |
| `/backend-prisma [prompt\|model\|parse\|debug]` | AI API 操作協助（Gemini / Claude） |

---

## 目錄結構

```
backend/
├── src/
│   ├── config/
│   │   ├── env.ts           # 環境變數驗證 (Zod)
│   │   └── swagger.ts       # Swagger 設定
│   ├── controllers/         # HTTP 層，只處理 req/res
│   │   └── analyze.controller.ts
│   ├── services/            # AI API 呼叫層
│   │   └── analyze.service.ts
│   ├── routes/              # Express Router
│   │   ├── index.ts
│   │   └── analyze.routes.ts
│   ├── middlewares/
│   │   ├── validate.middleware.ts
│   │   └── error.middleware.ts
│   ├── schemas/             # Zod 驗證 Schema
│   │   └── analyze.schema.ts
│   ├── utils/
│   │   ├── AppError.ts
│   │   ├── response.ts
│   │   └── logger.ts
│   └── app.ts
├── tests/
└── .env.example
```

---

## 環境變數清單

```env
NODE_ENV=development
PORT=3001
GEMINI_API_KEY=          # Google Gemini API Key（必填）
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info           # error | warn | info | debug
```
