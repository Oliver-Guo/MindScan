# Plan: 新增 MySQL + Prisma 記錄 AI API 呼叫日誌 ✅ 已實作

## Context

> **狀態：已完成實作並部署 ✅** — 所有步驟已執行，MySQL 日誌正常記錄。
目前 `analyze.service.ts` 呼叫 Gemini API 時沒有留下任何持久化紀錄。為了追蹤 API 使用狀況（成功/失敗、模型切換、配額耗盡等），需要新增 MySQL 資料庫，並在每次 API 呼叫後以 fire-and-forget 方式寫入 `ai_api_logs` 表。

---

## 實作步驟

### 1. 安裝 Prisma 依賴
```bash
cd backend
npm install @prisma/client
npm install -D prisma
```

### 2. 建立 Prisma Schema
新建 `backend/prisma/schema.prisma`：
```prisma
generator client {
  provider = "prisma-client-js"
}
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
model AiApiLog {
  id          Int      @id @default(autoincrement())
  companyType String   @map("company_type") @db.VarChar(50)
  modelType   String   @map("model_type") @db.VarChar(100)
  status      Int
  request     Json
  response    Json?
  createdAt   DateTime @default(now()) @map("created_at")
  @@map("ai_api_logs")
}
```

### 3. 新建 Prisma Client 單例
新建 `backend/src/config/prisma.ts` — 使用 globalThis 單例模式避免 hot-reload 重複建立連線。

### 4. 修改環境變數驗證
修改 `backend/src/config/env.ts` — Zod schema 加入 `DATABASE_URL: z.string().min(1)`。

### 5. 新建 API Log Service
新建 `backend/src/services/api-log.service.ts`：
- 匯出 `logApiCall(entry)` 函式
- Fire-and-forget（不 await），`.catch()` 用 Winston logger 記錄錯誤
- 型別：`{ companyType, modelType, status, request, response }`

### 6. 修改 analyze.service.ts — 整合日誌
修改 `backend/src/services/analyze.service.ts`：
- import `logApiCall`
- 在 `generateWithFallback` 的 **每次模型嘗試** 中記錄：
  - **成功**：status=200，記錄 request（prompt 摘要）和 response（截斷至 5000 字）
  - **失敗**：記錄對應 status code 和 error message
- 每個 fallback 嘗試都獨立記一筆，可完整追蹤模型切換過程

### 7. 修改 Docker Compose
修改 `ops/docker-compose.yml`：
- 新增 `mysql` service（使用者提供的設定，container_name 改為 `mindscan-mysql`）
- backend 加入 `DATABASE_URL: mysql://root:rootpass@mysql:3306/mind_scan`
- backend 加入 `depends_on: mysql (condition: service_healthy)`
- 底部新增 `volumes: mysql_data:`

### 8. 修改 Dockerfile.backend
修改 `ops/Dockerfile.backend`：
- Build stage：`COPY prisma ./prisma` + `RUN npx prisma generate`（在 `npm run build` 之前）
- Runner stage：`COPY --from=builder /app/prisma ./prisma`
- CMD 改為：`sh -c "npx prisma migrate deploy && node dist/app.js"`

### 9. 更新 .env.example
- `backend/.env.example` 加入 `DATABASE_URL=mysql://root:rootpass@localhost:3306/mind_scan`
- `ops/.env.example` 加入註解說明 DATABASE_URL 已在 docker-compose 中設定

### 10. 執行 Migration
```bash
cd ops && docker compose up mysql -d
# 等 MySQL healthy 後：
cd ../backend
DATABASE_URL=mysql://root:rootpass@localhost:3306/mind_scan npx prisma migrate dev --name init-ai-api-logs
```

### 11. 更新文件
| 檔案 | 更新內容 |
|------|---------|
| `backend/CLAUDE.md` | 目錄結構加 `prisma/`，環境變數加 `DATABASE_URL` |
| `ops/CLAUDE.md` | 檔案表加 MySQL，環境變數/Port 加 MySQL 3306 |
| `README.md` | 專案結構加 `prisma/`，技術棧加 MySQL/Prisma，Docker 啟動步驟更新 |
| 根 `CLAUDE.md` | 技術棧表加 Prisma + MySQL |

---

## 異動檔案總覽

| 檔案 | 動作 |
|------|------|
| `backend/package.json` | 安裝 prisma, @prisma/client |
| `backend/prisma/schema.prisma` | **新建** |
| `backend/prisma/migrations/` | **新建**（migrate dev 產生） |
| `backend/src/config/prisma.ts` | **新建** |
| `backend/src/config/env.ts` | 修改 |
| `backend/src/services/api-log.service.ts` | **新建** |
| `backend/src/services/analyze.service.ts` | 修改 |
| `ops/docker-compose.yml` | 修改 |
| `ops/Dockerfile.backend` | 修改 |
| `backend/.env.example` | 修改 |
| `ops/.env.example` | 修改 |
| `backend/CLAUDE.md` | 修改 |
| `ops/CLAUDE.md` | 修改 |
| `README.md` | 修改 |
| `CLAUDE.md`（根） | 修改 |

---

## 驗證方式

1. `docker compose up mysql -d` → MySQL 健康啟動
2. `npx prisma migrate dev` → migration 成功、表建立
3. `npm run dev` → 後端正常啟動（無 DB 連線錯誤）
4. 呼叫 `POST /api/v1/analyze/emotion` → 回應正常
5. 查詢 MySQL `SELECT * FROM ai_api_logs` → 有對應紀錄（company_type=gemini, status=200）
6. `npm run build` → TypeScript 編譯無錯誤
7. `docker compose up -d --build` → 全部容器正常啟動，migrate deploy 自動執行
