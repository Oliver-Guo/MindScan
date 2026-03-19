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
| 前端 | React 18 + Vite + TypeScript + shadcn/ui |
| 狀態管理 | Zustand + TanStack Query v5 |
| 部署 | Docker + Nginx |

---

## 🚀 本地開發啟動

### 前置需求

- Node.js 20+
- Docker（用於容器化部署）
- Google Gemini API Key

### 1. 後端啟動

```bash
cd backend

# 安裝依賴
npm install

# 建立 .env（首次需要）
cp .env.example .env
# 填入你的 GEMINI_API_KEY

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
│   ├── src/
│   │   ├── config/            # 環境變數、Swagger
│   │   ├── controllers/       # HTTP 處理層
│   │   ├── services/          # Gemini API 呼叫層
│   │   ├── routes/            # 路由設定
│   │   ├── middlewares/       # 錯誤處理
│   │   ├── schemas/           # Zod 驗證 Schema
│   │   └── app.ts             # Express 入口
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
│   │   └── main.tsx           # 路由入口
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

# 啟動所有服務（後端 + 前端）
docker-compose up -d

# 查看狀態
docker-compose ps

# 查看後端日誌
docker-compose logs -f backend
```

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
npm run test             # 執行測試

# 前端
npm run dev              # 開發模式
npm run build            # 正式編譯

# Docker
docker-compose up -d                # 啟動所有服務
docker-compose logs -f backend      # 查看後端日誌
docker-compose exec backend sh      # 進入後端容器
```
