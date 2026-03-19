# Docs — CLAUDE.md

> 文檔站台開發指南（VitePress）

---

## 技術

- **VitePress** — Vue 驅動的靜態文檔網站生成器
- 文檔使用 Markdown 撰寫
- 部署：GitHub Pages / Nginx

---

## 目錄結構

```
docs/
├── .vitepress/
│   └── config.ts        # VitePress 設定
├── guide/
│   ├── index.md          # 快速開始
│   ├── installation.md   # 安裝指南
│   └── development.md    # 開發指南
├── api/
│   ├── index.md          # API 總覽
│   ├── auth.md           # 認證 API
│   └── users.md          # 用戶 API
├── architecture/
│   ├── overview.md       # 架構總覽
│   ├── backend.md        # 後端架構
│   └── database.md       # 資料庫設計
└── index.md              # 首頁
```

---

## 啟動文檔站台

```bash
cd docs
npm install
npm run dev    # 開發模式（port 5174）
npm run build  # 建構靜態檔案
```

---

## 文檔撰寫規範

- 每個 API 端點必須有：說明、請求格式、回應格式、範例
- 新增功能時同步更新對應文檔
- 使用繁體中文撰寫（面向內部團隊）
