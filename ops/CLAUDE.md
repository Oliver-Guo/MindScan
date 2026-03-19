# Ops — CLAUDE.md

> 環境與部署指南。設定檔內容請直接查看對應檔案。

---

## 檔案說明

| 檔案 | 說明 |
|------|------|
| `Dockerfile.backend` | 後端 Docker 映像（multi-stage build，Node 20 Alpine） |
| `Dockerfile.frontend` | 前端 Docker 映像（Vite build → Nginx Alpine） |
| `docker-compose.yml` | 容器化部署（Backend + Frontend） |
| `nginx.conf` | Nginx 設定（SPA fallback + API Proxy + Gzip） |

---

## 常用指令

```bash
# 啟動服務（需先在 ops/ 目錄建立 .env 或設定 GEMINI_API_KEY）
docker-compose up -d                              # 啟動全部
docker-compose up -d --build backend             # 重建後端
docker-compose down                               # 停止全部
docker-compose logs -f backend                   # 查看後端日誌
```

---

## 環境變數注入

`docker-compose.yml` 透過 `${GEMINI_API_KEY}` 從 shell 環境讀取，部署前需設定：

```bash
export GEMINI_API_KEY=AIza-xxxxx
docker-compose up -d
```

或在 `ops/` 目錄建立 `.env` 檔案：

```env
GEMINI_API_KEY=AIza-xxxxx
```

---

## 環境說明

| 服務 | 開發 Port | 說明 |
|------|-----------|------|
| Backend | 3001 | Express API（Gemini Proxy） |
| Frontend | 5173 (dev) / 80 (docker) | React 應用 |
