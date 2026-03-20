# Docs — CLAUDE.md

> MindScan AI 專案文檔目錄。包含需求規格、實作計畫與架構設計文件。

---

## 目錄結構

```
docs/
├── CLAUDE.md              # 本文件（文檔目錄說明）
├── MindScan.md            # 完整需求與架構規劃（功能清單、Prompt 規格、UI 設計、Demo 腳本）
├── ImplementationPlan.md  # 代碼實作策略（3 Session 切分，已全部完成）
├── plan-mysql-logging.md  # MySQL + Prisma 日誌實作計畫（已完成）
├── api/                   # （預留）API 端點詳細文檔
├── architecture/          # （預留）架構設計文檔
├── features/              # （預留）功能規格文檔
└── guide/                 # （預留）使用者/開發者指南
```

---

## 文件說明

| 文件 | 用途 | 狀態 |
|------|------|------|
| `MindScan.md` | 專案需求規格書：功能清單、技術架構、Prompt 設計、UI 色彩、Demo 腳本 | ✅ 已完成 v1.2 |
| `ImplementationPlan.md` | Blog → MindScan 代碼改造的 3 Session 實作步驟 | ✅ 全部完成 |
| `plan-mysql-logging.md` | MySQL + Prisma API 呼叫日誌的實作計畫 | ✅ 已實作 |

---

## 文檔撰寫規範

- 使用繁體中文撰寫
- API 文檔以 Swagger UI（`/api/docs`）為主，程式碼內 JSDoc 自動生成
- 新增功能時同步更新 `MindScan.md` 功能清單狀態
