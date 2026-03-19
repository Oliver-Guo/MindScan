# MindScan AI — 專案需求與架構規劃

> Hackathon 單人專案 | 預估工時：20–24 hr | 技術棧：React 18 + Vite + TypeScript + Express + Gemini API（主）/ Claude API（擴充）

---

## 一、專案概述

**MindScan AI** 是一個雙功能 AI 工具網頁，整合於同一個介面的兩個分頁中：

| 分頁 | 功能名稱 | 核心價值 |
|------|----------|----------|
| Tab 1 | 🩹 情緒急救包 | 輸入心情 → AI 生成個人化紓壓方案 + 互動呼吸引導 |
| Tab 2 | 🔍 謊言偵測器 | 輸入文字 → AI 標記語言風險 + 可信度報告 |

**Demo 敘事主軸**：「人與人溝通的兩個痛點 — 管理自己的情緒，和判斷別人的真實意圖，MindScan 用 AI 同時解決這兩件事。」

---

## 二、使用者流程（User Flow）

### 2-1 情緒急救包

```
使用者進入頁面
  → 點擊「情緒急救包」分頁
  → 選擇情緒標籤（快速選）或手動輸入心情描述
  → 點擊「分析我的情緒」
  → 後端呼叫 Claude API 分析
  → 顯示：
      ① 情緒類型識別（如：焦慮 / 疲憊 / 憤怒）
      ② 情緒強度分數（0–100）
      ③ 3 條個人化紓壓建議
      ④ 互動式呼吸練習動畫（4-7-8 呼吸法）
      ⑤ 一封 AI 生成的鼓勵信
```

### 2-2 謊言偵測器

```
使用者進入頁面
  → 點擊「謊言偵測器」分頁
  → 貼入一段文字（對話 / 聲明 / 訊息）
  → 點擊「開始分析」
  → 後端呼叫 Claude API 分析
  → 顯示：
      ① 整體可信度分數（0–100）+ 風險等級標示
      ② 逐句高亮標記（紅 = 高風險 / 黃 = 可疑 / 綠 = 正常）
      ③ 觸發警示的語言特徵清單（矛盾 / 模糊 / 迴避 / 誇大）
      ④ 總結報告（2–3 句結論）
```

---

## 三、功能需求清單

### 全局功能

- [ ] Tab 切換動畫（兩個分頁平滑切換）
- [ ] Loading 動畫（API 等待期間顯示）
- [ ] 錯誤處理提示（API 失敗 / 空輸入 / 網路問題）
- [ ] 結果可「重新分析」（清空後再次輸入）

### Tab 1：情緒急救包

- [ ] 情緒快速標籤（焦慮、疲憊、憤怒、悲傷、迷茫、壓力大）點擊自動帶入文字框
- [ ] 自由輸入文字框（placeholder 範例引導輸入）
- [ ] 呼吸動畫：圓圈縮放 + 文字提示（吸氣 4s → 憋氣 7s → 吐氣 8s）
- [ ] 開始 / 暫停呼吸練習按鈕
- [ ] 情緒強度儀表（視覺化圓形進度條）
- [ ] 紓壓建議卡片（3 張，每張有圖示 + 說明）
- [ ] 鼓勵信區塊（帶有 AI 打字機動畫效果）
- [ ] 分享按鈕（複製鼓勵信文字）

### Tab 2：謊言偵測器

- [ ] 大型文字輸入框（支援多段落貼入）
- [ ] 範例文字按鈕（一鍵帶入示範分析文本，方便 Demo）
- [ ] 可信度分數環形圖（動畫顯示）
- [ ] 風險等級 Badge（低風險 / 中風險 / 高風險）
- [ ] 逐句高亮段落（紅 / 黃 / 綠 三色標記，hover 顯示原因）
- [ ] 警示特徵清單（條列式，每項有圖示）
- [ ] 分析總結文字區塊

---

## 四、技術架構

### 4-1 整體架構

```
Frontend（React）  →  Backend（Express）  →  Gemini API（主）
     Zustand              Controller              ↕
  TanStack Query           Service         Claude API（擴充）
    shadcn/ui             AppError
```

- **API Key 由後端管理**，儲存於 `GEMINI_API_KEY` 環境變數，前端不接觸金鑰
- 前端透過 `POST /api/v1/analyze/emotion` 和 `POST /api/v1/analyze/lie` 呼叫後端
- 後端作為 AI API Proxy，組裝 Prompt 後呼叫 Gemini，回傳結構化 JSON
- **主要 AI**：Google Gemini（`@google/generative-ai`，預設 `gemini-2.0-flash`）
- **待擴充**：Claude API（`@anthropic-ai/sdk`）可透過 `AI_PROVIDER` 環境變數切換

### 4-2 AI API 呼叫設計（Gemini SDK）

**Gemini SDK 呼叫範本（`src/services/analyze.service.ts`）**

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  systemInstruction: '你是一位溫暖專業的情緒支持顧問...請以 JSON 格式回覆，不要輸出其他文字。',
})

const result = await model.generateContent(userInput)
const raw = result.response.text()
const data = JSON.parse(raw)
```

---

**情緒急救包 Prompt 結構**

```
System:
你是一位溫暖專業的情緒支持顧問，擅長分析使用者的情緒狀態並給出實際可行的紓壓建議。
請以 JSON 格式回覆，不要輸出其他文字。

User:
使用者描述：「{使用者輸入}」

請分析並回傳以下 JSON：
{
  "emotion_type": "主要情緒類型（繁體中文，2–4字）",
  "intensity": 0–100的數字,
  "intensity_desc": "一句話描述情緒強度",
  "tips": [
    { "icon": "emoji", "title": "建議標題", "detail": "詳細說明（30字內）" },
    { "icon": "emoji", "title": "建議標題", "detail": "詳細說明（30字內）" },
    { "icon": "emoji", "title": "建議標題", "detail": "詳細說明（30字內）" }
  ],
  "letter": "給使用者的鼓勵信（100–150字，溫暖語氣，第二人稱）"
}
```

**謊言偵測器 Prompt 結構**

```
System:
你是一位語言行為分析專家，擅長識別文字中的欺騙性語言模式。
分析時保持客觀，基於語言學特徵而非主觀判斷。
請以 JSON 格式回覆，不要輸出其他文字。

User:
請分析以下文字的可信度：
「{使用者輸入}」

請回傳以下 JSON：
{
  "credibility_score": 0–100的數字,
  "risk_level": "low" | "medium" | "high",
  "risk_level_zh": "低風險" | "中風險" | "高風險",
  "sentences": [
    {
      "text": "原始句子文字",
      "risk": "safe" | "warning" | "danger",
      "reason": "風險原因（15字內，若safe則為空字串）"
    }
  ],
  "features": [
    { "type": "矛盾陳述" | "模糊表達" | "迴避回應" | "情緒誇大" | "資訊缺漏", "example": "具體例子" }
  ],
  "summary": "2–3句分析總結"
}
```

### 4-3 前端狀態管理（Zustand）

```typescript
// appStore.ts
interface AppState {
  activeTab: 'emotion' | 'lie'
  setActiveTab: (tab: 'emotion' | 'lie') => void

  // 情緒急救包
  emotionInput: string
  emotionResult: EmotionResult | null
  breathingActive: boolean
  breathingPhase: 'inhale' | 'hold' | 'exhale'
  setEmotionInput: (text: string) => void
  setEmotionResult: (result: EmotionResult | null) => void
  setBreathingActive: (active: boolean) => void
  setBreathingPhase: (phase: 'inhale' | 'hold' | 'exhale') => void

  // 謊言偵測器
  lieInput: string
  lieResult: LieResult | null
  setLieInput: (text: string) => void
  setLieResult: (result: LieResult | null) => void
}
```

API 呼叫使用 **TanStack Query v5** 的 `useMutation`，統一放在 `src/api/analyze.api.ts`。

---

## 五、UI / UX 設計規格

### 設計風格

- **主題**：深色系（Dark UI），科技感 + 溫度兼具
- **字體**：Syne（標題，英文粗體）+ Noto Sans TC（內文）
- **UI 元件**：shadcn/ui + Tailwind CSS
- **色彩系統**：

| 用途 | 色碼 | 說明 |
|------|------|------|
| 背景 | `#0d0d14` | 深夜藍黑 |
| 表面 | `#13131f` | 卡片背景 |
| 情緒主色 | `#ff6b9d` | 溫暖粉紅 |
| 偵測主色 | `#00e5c8` | 科技青綠 |
| 高風險 | `#ff4d6a` | 警示紅 |
| 中風險 | `#ffc850` | 警告黃 |
| 低風險 | `#4dffb4` | 安全綠 |

### 版面配置

```
┌─────────────────────────────────────────┐
│  LOGO: MindScan AI                      │
├─────────────────────────────────────────┤
│  [🩹 情緒急救包 Tab]  [🔍 謊言偵測器 Tab] │
├─────────────────────────────────────────┤
│                                         │
│         ← 當前分頁內容區域 →              │
│                                         │
└─────────────────────────────────────────┘
```

### 響應式需求

- 最小支援寬度：375px（iPhone SE）
- 主要展示寬度：780px（桌面 Demo）
- Tab 在手機版改為上下排列

---

## 六、Demo 腳本（5 分鐘）

| 時間 | 動作 | 台詞重點 |
|------|------|----------|
| 0:00–0:30 | 介紹產品 | 「人與人溝通最難的兩件事：管理情緒、判斷真相」 |
| 0:30–1:00 | 說明技術棧 | 「前端 React + shadcn/ui，後端 Express 作為 Claude API Proxy」 |
| 1:00–2:30 | **Demo Tab 1**：輸入「很焦慮，明天要上台 Demo」 | 展示情緒識別、紓壓建議、跑一次呼吸動畫 |
| 2:30–2:45 | 切換 Tab | 「現在換一個場景...」 |
| 2:45–4:30 | **Demo Tab 2**：貼入準備好的範例聲明 | 展示逐句高亮、風險特徵清單、可信度分數 |
| 4:30–5:00 | 總結 + Q&A 準備 | 「兩個功能共用一套架構，延伸性強」 |

**備用 Demo 資料（預先準備）：**
- 情緒輸入範例：「最近工作壓力很大，睡眠品質很差，感覺很迷茫不知道自己在幹嘛」
- 謊言分析範例：「我絕對沒有說過那些話，你可能記錯了。我一直都很支持你的，每次都是。再說了，當時的情況很複雜，不是三言兩語說得清楚的。」

---

## 七、開發里程碑（48hr 分配）

| 階段 | 時間 | 任務 |
|------|------|------|
| 🏗 Phase 1 | 0–3hr | 後端骨架（Express + env + AppError）+ 前端 React 路由 + Tab 元件 |
| ⚡ Phase 2 | 3–10hr | 謊言偵測器核心（後端 API + 前端高亮渲染） |
| 💗 Phase 3 | 10–18hr | 情緒急救包核心（後端 API + 呼吸動畫元件） |
| 🎨 Phase 4 | 18–26hr | UI 細節打磨（shadcn/ui + Tailwind）+ RWD + 錯誤處理 |
| 🎬 Phase 5 | 26–36hr | Demo 腳本演練 + 準備範例資料 |
| 🛡 Phase 6 | 36–48hr | Bug fix 緩衝 + README + Docker 部署驗證 |

---

## 八、風險與備案

| 風險 | 發生機率 | 備案 |
|------|----------|------|
| 現場網路不穩 | 中 | 預先截圖 + 錄影備用 |
| API 回應格式錯誤 | 低 | 後端加 try-catch + 預設 fallback 資料 |
| 呼吸動畫卡頓 | 低 | 純 CSS animation（Tailwind keyframes），不依賴 JS 計時 |
| Demo 時間超過 5 分鐘 | 中 | 熟練兩個固定範例，各控制在 90 秒內 |
| 評審問「如何防止 prompt injection」 | 中 | 說明 system prompt 隔離 + 輸入長度限制（Zod max 2000）|

---

## 九、加分延伸（若時間允許）

- [ ] 情緒歷史記錄（localStorage 儲存最近 5 次）
- [ ] 謊言分析支援「上傳文字檔」
- [ ] 深色 / 淺色主題切換（shadcn/ui ThemeProvider）
- [ ] 分析結果可匯出為截圖（html2canvas）
- [ ] 多語言支援（中 / 英切換）

---

*文件版本：v1.1 | 最後更新：2026-03-19*
