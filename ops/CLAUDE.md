# Ops — CLAUDE.md

> 環境與部署指南。設定檔內容請直接查看對應檔案。

---

## 檔案說明

| 檔案 | 說明 |
|------|------|
| `Dockerfile.backend` | 後端 Docker 映像（multi-stage build，Node 20 Alpine） |
| `Dockerfile.frontend` | 前端 Docker 映像（Vite build → Nginx Alpine） |
| `docker-compose.yml` | 容器化部署（MySQL + Backend + Frontend） |
| `nginx.conf` | Nginx 設定（SPA fallback + API Proxy + Gzip） |
| `.env.example` | 環境變數範本（部署前複製為 `.env` 並填入 API Key） |

---

## 常用指令

```bash
# 啟動服務（需先在 ops/ 目錄建立 .env 或設定 GEMINI_API_KEY）
docker-compose up -d                              # 啟動全部
docker-compose up -d --build backend             # 重建後端（程式碼有變更時）
docker-compose up -d backend                     # 重啟後端（僅更新 .env 時，不需 --build）
docker-compose down                               # 停止全部
docker-compose logs -f backend                   # 查看後端日誌
```

> **注意**：修改 `ops/.env`（如更換 `GEMINI_API_KEY`）後需重啟容器才會生效。
> 改環境變數用 `docker-compose up -d backend`；改程式碼才需要 `--build`。

---

## 環境變數注入

`docker-compose.yml` 透過 `${GEMINI_API_KEY}` 從 shell 環境讀取，其餘變數已在 compose 中設定預設值。

部署前需設定 API Key：

```bash
export GEMINI_API_KEY=AIza-xxxxx
docker-compose up -d
```

或在 `ops/` 目錄建立 `.env` 檔案（參考 `.env.example`）：

```env
GEMINI_API_KEY=AIza-xxxxx

# 可選覆蓋（已有預設值）
# NODE_ENV=production
# PORT=3001
# CORS_ORIGIN=http://localhost
# LOG_LEVEL=info
```

---

## 環境說明

| 服務 | 開發 Port | 說明 |
|------|-----------|------|
| MySQL | 3306 | MySQL 8.0（ai_api_logs 日誌儲存） |
| Backend | 3001 | Express API（Gemini Proxy） |
| Frontend | 5173 (dev) / 80 (docker) | React 應用 |
