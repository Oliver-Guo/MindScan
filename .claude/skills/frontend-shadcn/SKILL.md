---
name: frontend-shadcn
description: 協助安裝和使用 shadcn/ui 元件。當使用者說「裝元件」、「加 shadcn」、「需要 dialog / table / toast」時使用。
argument-hint: "component-name"
---

協助安裝並使用 shadcn/ui 元件 `$ARGUMENTS`。

## 執行步驟

### 1. 安裝元件
```bash
npx shadcn-ui@latest add $ARGUMENTS
```

### 2. 確認安裝結果
檢查 `src/components/ui/$ARGUMENTS.tsx` 是否已生成。

### 3. 提供使用範例
根據安裝的元件，提供符合專案規範的使用範例（TypeScript + Tailwind CSS）。

## 常用元件清單

| 元件 | 指令 | 用途 |
|------|------|------|
| button | `npx shadcn-ui@latest add button` | 按鈕 |
| input | `npx shadcn-ui@latest add input` | 輸入框 |
| card | `npx shadcn-ui@latest add card` | 卡片容器 |
| table | `npx shadcn-ui@latest add table` | 表格 |
| dialog | `npx shadcn-ui@latest add dialog` | 對話框 |
| form | `npx shadcn-ui@latest add form` | 表單（搭配 React Hook Form） |
| toast | `npx shadcn-ui@latest add toast` | 提示訊息 |
| badge | `npx shadcn-ui@latest add badge` | 標籤 |
| dropdown-menu | `npx shadcn-ui@latest add dropdown-menu` | 下拉選單 |
| select | `npx shadcn-ui@latest add select` | 選擇器 |

## 規範
- shadcn/ui 元件放在 `src/components/ui/`，由 CLI 生成，不手動修改
- 業務元件放在 `src/components/shared/`，組合 ui 元件使用
- import 路徑使用 `@/components/ui/xxx`
