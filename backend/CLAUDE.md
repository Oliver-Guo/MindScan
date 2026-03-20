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
├── prisma/
│   ├── schema.prisma        # Prisma schema (MySQL)
│   ├── prisma.config.ts     # Prisma 7 設定（datasource URL）
│   └── migrations/          # Database migrations
├── src/
│   ├── config/
│   │   ├── env.ts           # 環境變數驗證 (Zod)
│   │   ├── prisma.ts        # Prisma Client 單例
│   │   └── swagger.ts       # Swagger 設定
│   ├── controllers/         # HTTP 層，只處理 req/res
│   │   └── analyze.controller.ts
│   ├── services/            # AI API 呼叫層
│   │   ├── analyze.service.ts
│   │   └── api-log.service.ts  # AI API 呼叫日誌（寫入 MySQL）
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
├── prisma.config.ts         # Prisma 7 config（位於專案根目錄）
├── vitest.config.ts         # Vitest 測試設定
├── tests/
│   ├── setup.ts             # 全域測試 setup（mock env/prisma/logger）
│   ├── schemas/
│   │   └── analyze.schema.test.ts
│   ├── utils/
│   │   ├── AppError.test.ts
│   │   └── response.test.ts
│   ├── middlewares/
│   │   ├── error.middleware.test.ts
│   │   └── validate.middleware.test.ts
│   ├── services/
│   │   ├── analyze.service.test.ts
│   │   └── api-log.service.test.ts
│   └── controllers/
│       └── analyze.controller.test.ts
└── .env.example
```

---

## 測試

```bash
npm test              # 執行所有測試
npm run test:watch    # 監聽模式
npm run test:coverage # 產生覆蓋率報告
```

- 測試框架：Vitest ^1.3 + Supertest
- 測試檔案放在 `tests/` 目錄，結構對應 `src/`
- `tests/setup.ts` 會自動 mock `env.ts`、`prisma.ts`、`logger.ts`，避免測試時需要真實環境變數或資料庫
- Mock 策略：`@google/generative-ai` 使用 `vi.hoisted` + `vi.mock` 控制 AI 回傳

---

## 環境變數清單

```env
NODE_ENV=development
PORT=3001
GEMINI_API_KEY=          # Google Gemini API Key（必填）
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info           # error | warn | info | debug
DATABASE_URL=mysql://root:rootpass@localhost:3306/mind_scan  # MySQL 連線字串（必填）
```
