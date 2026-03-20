# MindScan AI

雙功能 AI 工具網頁，整合於同一個介面的兩個分頁中。

| 分頁 | 功能 | 說明 |
|------|------|------|
| Tab 1 | 🩹 情緒急救包 | 輸入心情 → AI 生成個人化紓壓方案 + 互動呼吸引導 |
| Tab 2 | 🔍 謊言偵測器 | 輸入文字 → AI 標記語言風險 + 可信度報告 |

## 技術棧

| 層級 | 技術 |
|------|------|
| 後端 | Node.js 20 + Express + TypeScript |
| AI | Gemini API（@google/generative-ai，主）/ Claude API（待擴充）|
| 資料庫 | MySQL 8.0 + Prisma ORM（API 呼叫日誌）|
| 前端 | React 18 + Vite + TypeScript + shadcn/ui |
| 狀態管理 | Zustand + TanStack Query v5 |
| 測試 | Vitest + Testing Library（前端）/ Supertest（後端）|
| 部署 | Docker + Nginx |

---

## 🚀 本地開發啟動

### 前置需求

- Node.js 20+
- Docker（用於容器化部署 + MySQL）
- Google Gemini API Key

### 1. 後端啟動

```bash
cd backend

# 安裝依賴
npm install

# 建立 .env（首次需要）
cp .env.example .env
# 填入你的 GEMINI_API_KEY 和 DATABASE_URL

# 啟動 MySQL（透過 Docker）
cd ../ops && docker compose up mysql -d && cd ../backend

# 執行資料庫 migration
npx prisma migrate deploy

# 啟動開發伺服器（port 3001）
npm run dev
```

### 2. 前端啟動

```bash
cd frontend

# 安裝依賴
npm install

# 啟動開發伺服器（port 5173）
npm run dev
```

### 3. 開啟瀏覽器

| 服務 | 網址 |
|------|------|
| 前台 | http://localhost:5173 |
| API 文件 (Swagger) | http://localhost:3001/api/docs |

---

## 📡 API 端點

| 方法 | 路徑 | 說明 |
|------|------|------|
| POST | `/api/v1/analyze/emotion` | 情緒急救包分析 |
| POST | `/api/v1/analyze/lie` | 謊言偵測器分析 |
| GET | `/api/v1/health` | 健康檢查（確認 API Key 狀態）|

**情緒急救包 Request**
```json
{ "text": "最近工作壓力很大，睡眠品質很差..." }
```

**謊言偵測器 Request**
```json
{ "text": "我絕對沒有說過那些話，你可能記錯了..." }
```

---

## 📁 專案結構

```
project/
├── backend/
│   ├── prisma/                # Prisma schema + migrations
│   ├── src/
│   │   ├── config/            # 環境變數、Swagger、Prisma Client
│   │   ├── controllers/       # HTTP 處理層
│   │   ├── services/          # Gemini API 呼叫層 + API 日誌
│   │   ├── routes/            # 路由設定
│   │   ├── middlewares/       # 錯誤處理
│   │   ├── schemas/           # Zod 驗證 Schema
│   │   └── app.ts             # Express 入口
│   ├── tests/                 # 單元測試（Vitest）
│   │   ├── setup.ts           # 全域 mock（env/prisma/logger）
│   │   ├── schemas/           # Schema 驗證測試
│   │   ├── utils/             # AppError、response 測試
│   │   ├── middlewares/       # error/validate middleware 測試
│   │   ├── services/          # analyze.service、api-log 測試
│   │   └── controllers/       # controller 測試
│   ├── vitest.config.ts       # Vitest 設定
│   ├── prisma.config.ts       # Prisma 7 設定
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/               # API 呼叫層
│   │   ├── components/        # UI 元件（shadcn + shared）
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # 頁面元件
│   │   ├── stores/            # Zustand 狀態
│   │   ├── types/             # TypeScript 型別
│   │   ├── test/              # 測試 setup
│   │   └── main.tsx           # 路由入口
│   ├── vitest.config.ts       # Vitest 設定
│   └── package.json
├── docs/
│   └── MindScan.md            # 完整需求與架構規劃
└── ops/
    ├── docker-compose.yml
    ├── Dockerfile.backend
    ├── Dockerfile.frontend
    ├── nginx.conf
    └── .env.example
```

---

## 🐳 Docker 一鍵啟動（正式環境）

```bash
cd ops

# 建立環境變數檔（首次需要）
cp .env.example .env
# 填入你的 GEMINI_API_KEY

# 啟動所有服務（MySQL + 後端 + 前端）
# 後端容器啟動時會自動執行 prisma migrate deploy
docker-compose up -d

# 查看狀態
docker-compose ps

# 查看後端日誌
docker-compose logs -f backend

# 重建後端（程式碼變更時）
docker-compose up -d --build backend

# 重啟後端（僅更新 ops/.env 環境變數時，不需 --build）
docker-compose up -d backend
```

> **注意**：`ops/.env` 用於 Docker 部署，`backend/.env` 用於本機 `npm run dev`。
> 修改 `ops/.env` 後需執行 `docker-compose up -d backend` 重啟容器才會生效。

| 服務 | 網址 |
|------|------|
| 前台 | http://localhost |

### 停止服務

```bash
cd ops && docker-compose down
```

---

## ⚙️ 環境變數

### Backend `.env`

```bash
cp backend/.env.example backend/.env
```

| 變數 | 說明 | 必填 |
|------|------|------|
| `NODE_ENV` | 執行環境（development / production）| ✓ |
| `PORT` | 後端埠號（預設 3001）| ✓ |
| `GEMINI_API_KEY` | Google Gemini API Key（主要 AI）| ✓ |
| `CORS_ORIGIN` | 允許的前端來源 | ✓ |
| `LOG_LEVEL` | 日誌等級（info / debug / error）| - |
| `DATABASE_URL` | MySQL 連線字串 | ✓ |

### Frontend `.env`

```bash
cp frontend/.env.example frontend/.env
```

---

## 🔧 常用指令

```bash
# 後端
npm run dev              # 開發模式（hot reload）
npm run build            # 編譯 TypeScript
npm test                 # 執行測試（Vitest, 50 tests）
npm run test:watch       # 測試監聽模式
npm run test:coverage    # 測試覆蓋率報告

# 前端
npm run dev              # 開發模式
npm run build            # 正式編譯
npm test                 # 執行測試（Vitest + Testing Library, 35 tests）
npm run test:watch       # 測試監聽模式

# Docker
docker-compose up -d                # 啟動所有服務
docker-compose logs -f backend      # 查看後端日誌
docker-compose exec backend sh      # 進入後端容器
```
