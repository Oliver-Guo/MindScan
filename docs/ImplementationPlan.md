# MindScan AI — 代碼實作策略

> 本文件規劃將現有 Blog 代碼改造為 MindScan AI 的實作步驟與 Session 切分方式。

---

## 現況摘要

| 層 | 現況 | 目標 |
|----|------|------|
| Backend | Blog（Auth + Post + Category + Comment），~32 個 src 檔 | Express + Gemini API Proxy，~10 個 src 檔 |
| Frontend | Blog UI（~45 個 src 檔）| MindScan 雙 Tab UI（~20 個 src 檔） |
| 可重用基礎設施 | AppError、response、logger、error/validate middleware | 全部直接沿用，不需改動 |

---

## Session 切分策略

### 為何需要切分？

單次 Claude Session 處理 65+ 個檔案（刪 35 + 改 5 + 加 18），Context 接近上限時後段品質下降。
建議切為 **3 個 Session**，依賴關係依序執行。

```
Session 1（後端重建，~30 min）
  清理 Blog 後端 → 修改核心設定 → 實作 analyze 端點

Session 2（前端清理 + 骨架，~30 min）
  清理 Blog 前端 → MindScanPage Tab 骨架 + 資料層

Session 3（前端 UI 完整實作，~60 min）
  EmotionTab + LieTab（可用 Subagent 並行）+ 深色主題 + RWD
```

### Subagent 並行時機

| Session | 是否適合並行 | 原因 |
|---------|------------|------|
| Session 1 + 2 | ❌ 不適合 | 前端 types 需等後端 API schema 確認 |
| Session 3 內部 | ✅ 推薦並行 | EmotionTab 與 LieTab 邏輯完全獨立 |

---

## Session 1：後端重建

### Step 1 — 刪除 Blog 後端代碼

```bash
# Controllers
rm backend/src/controllers/{post,category,comment,auth}.controller.ts

# Services
rm backend/src/services/{post,category,comment,auth}.service.ts

# Repositories（整個目錄）
rm -rf backend/src/repositories/

# Schemas
rm backend/src/schemas/{post,category,comment,auth}.schema.ts

# Routes
rm backend/src/routes/{post,category,comment,auth}.routes.ts

# 其他
rm backend/src/config/database.ts
rm backend/src/middlewares/auth.middleware.ts
rm backend/src/types/express.d.ts
rm -rf backend/prisma/
```

### Step 2 — 更新 npm 依賴

```bash
cd backend
npm uninstall prisma @prisma/client bcryptjs jsonwebtoken slugify \
              @types/bcryptjs @types/jsonwebtoken
npm install @google/generative-ai
```

### Step 3 — 修改 3 個核心檔案

**`backend/src/config/env.ts`**
- 移除：`DATABASE_URL`、`JWT_SECRET`、`JWT_EXPIRES_IN`
- 新增：`GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY 為必填')`

**`backend/src/app.ts`**
- 確認無 Prisma / database import（database.ts 已刪）
- routes 指向新的 analyzeRoutes

**`backend/src/routes/index.ts`**
- 移除：authRoutes、postRoutes、categoryRoutes、commentRoutes
- 新增：`import analyzeRoutes from './analyze.routes'`
- 新增：`router.use('/analyze', analyzeRoutes)`

### Step 4 — 新增 4 個 MindScan 後端檔案

**`backend/src/schemas/analyze.schema.ts`**
```typescript
import { z } from 'zod'
export const emotionInputSchema = z.object({
  text: z.string().min(1, '請輸入心情描述').max(2000, '輸入過長')
})
export const lieInputSchema = z.object({
  text: z.string().min(1, '請輸入待分析文字').max(2000, '輸入過長')
})
export type EmotionInput = z.infer<typeof emotionInputSchema>
export type LieInput = z.infer<typeof lieInputSchema>
```

**`backend/src/services/analyze.service.ts`（核心）**
- 初始化 `new GoogleGenerativeAI(env.GEMINI_API_KEY)`
- `analyzeEmotion(text: string): Promise<EmotionResult>`
  - System Prompt：情緒支持顧問，回傳 JSON（emotion_type, intensity, intensity_desc, tips, letter）
- `analyzeLie(text: string): Promise<LieResult>`
  - System Prompt：語言行為分析專家，回傳 JSON（credibility_score, risk_level, sentences, features, summary）
- JSON.parse 包 try/catch，失敗 `throw new AppError('PARSE_ERROR', 'AI 回傳格式異常', 502)`
- 模型：`gemini-2.0-flash`（Gemini 主要）；待擴充 Claude: `claude-sonnet-4-6`

**`backend/src/controllers/analyze.controller.ts`**
```typescript
export const emotion = async (req, res, next) => {
  try {
    const result = await analyzeService.analyzeEmotion(req.body.text)
    sendSuccess(res, result, '分析完成')
  } catch (error) { next(error) }
}
// 同理 lie
```

**`backend/src/routes/analyze.routes.ts`**
```typescript
router.post('/emotion', validate(emotionInputSchema), emotion)
router.post('/lie', validate(lieInputSchema), lie)
```

### Session 1 驗證

```bash
cd backend && npm run dev
curl -X POST http://localhost:3001/api/v1/analyze/emotion \
  -H "Content-Type: application/json" \
  -d '{"text":"今天很焦慮，明天要上台 Demo"}'
# 預期回傳 { success: true, data: { emotion_type, intensity, ... } }
```

---

## Session 2：前端清理 + 骨架

### Step 1 — 批量刪除 Blog 前端代碼

```bash
# Pages
rm -rf frontend/src/pages/public/HomePage.tsx
rm -rf frontend/src/pages/public/PostDetailPage.tsx
rm -rf frontend/src/pages/public/LoginPage.tsx
rm -rf frontend/src/pages/public/RegisterPage.tsx
rm -rf frontend/src/pages/admin/

# API layer
rm frontend/src/api/post.api.ts
rm frontend/src/api/category.api.ts
rm frontend/src/api/comment.api.ts
rm frontend/src/api/auth.api.ts

# Types
rm frontend/src/types/post.ts
rm frontend/src/types/category.ts
rm frontend/src/types/comment.ts

# Stores & Hooks
rm frontend/src/stores/authStore.ts
rm frontend/src/hooks/useAuth.ts

# Components
rm frontend/src/components/shared/PostCard.tsx
rm frontend/src/components/shared/CommentItem.tsx
rm frontend/src/components/shared/CommentForm.tsx
rm frontend/src/components/shared/AdminRoute.tsx
rm frontend/src/components/shared/ProtectedRoute.tsx
```

### Step 2 — 建立資料層（對應 Session 1 確認的 API schema）

**`frontend/src/types/analyze.ts`**
```typescript
export interface EmotionResult {
  emotion_type: string
  intensity: number
  intensity_desc: string
  tips: Array<{ icon: string; title: string; detail: string }>
  letter: string
}
export interface LieResult {
  credibility_score: number
  risk_level: 'low' | 'medium' | 'high'
  risk_level_zh: string
  sentences: Array<{ text: string; risk: 'safe' | 'warning' | 'danger'; reason: string }>
  features: Array<{ type: string; example: string }>
  summary: string
}
```

**`frontend/src/api/analyze.api.ts`**
```typescript
export const analyzeApi = {
  emotion: (text: string) =>
    api.post<ApiResponse<EmotionResult>>('/analyze/emotion', { text }).then(r => r.data.data),
  lie: (text: string) =>
    api.post<ApiResponse<LieResult>>('/analyze/lie', { text }).then(r => r.data.data),
}
```

**`frontend/src/stores/appStore.ts`**
```typescript
interface AppState {
  activeTab: 'emotion' | 'lie'
  emotionInput: string; emotionResult: EmotionResult | null
  breathingActive: boolean; breathingPhase: 'inhale' | 'hold' | 'exhale'
  lieInput: string; lieResult: LieResult | null
  // setters...
}
```

### Step 3 — 改寫 main.tsx + 骨架頁面

**`frontend/src/main.tsx`**（移除所有 Blog 路由，只剩）
```tsx
<Route path="/" element={<MindScanPage />} />
```

**`frontend/src/pages/MindScanPage.tsx`**（Tab 切換骨架，EmotionTab/LieTab 先 placeholder）

### Session 2 驗證

```bash
cd frontend && npm run dev
# localhost:5173 顯示 Tab 切換，無 console error
```

---

## Session 3：前端 UI 完整實作

### Subagent 並行方案

**主 Claude 負責：**
- `tailwind.config.js`：新增深色主題色彩 token
- `Navbar.tsx`：MindScan AI 品牌 + 深色樣式
- `Footer.tsx`：極簡化
- `MindScanPage.tsx`：完整 Tab 邏輯（整合兩個 Tab 結果）

**Subagent A（EmotionTab）：**
- `EmotionTab.tsx`：情緒標籤按鈕 + Textarea + useMutation
- `EmotionResultCard.tsx`：情緒類型 + 強度圓形進度條 + tips 卡片 + 鼓勵信打字機動畫
- `BreathingAnimation.tsx`：4-7-8 圓圈縮放 CSS Animation（純 CSS keyframes）

**Subagent B（LieTab）：**
- `LieTab.tsx`：Textarea + 範例按鈕 + useMutation
- `LieResultCard.tsx`：可信度環形圖 + 風險 Badge
- `HighlightedSentences.tsx`：逐句高亮 + hover tooltip（紅/黃/綠）
- `FeatureList.tsx`：警示特徵清單（條列 + 圖示）

### 顏色系統

```js
// tailwind.config.js → theme.extend.colors.mindscan
{
  bg: '#0d0d14',       // 深夜藍黑（背景）
  surface: '#13131f',  // 卡片背景
  emotion: '#ff6b9d',  // 情緒主色（溫暖粉紅）
  detection: '#00e5c8',// 偵測主色（科技青綠）
  danger: '#ff4d6a',   // 高風險（警示紅）
  warning: '#ffc850',  // 中風險（警告黃）
  safe: '#4dffb4',     // 低風險（安全綠）
}
```

### Session 3 驗證

```bash
# 後端需同時啟動
cd backend && npm run dev &
cd frontend && npm run dev

# 完整 E2E 測試：
# 1. 情緒急救包：輸入「最近工作壓力很大，睡眠品質很差」→ 點擊分析 → 看到結果卡片 + 呼吸動畫可啟動
# 2. 謊言偵測器：點「範例文字」→ 點擊分析 → 看到逐句高亮 + 可信度分數
# 3. 手機版（375px）：Tab 正常排列
```

---

## 可直接重用（不需修改）

| 路徑 | 說明 |
|------|------|
| `backend/src/utils/AppError.ts` | 直接重用 |
| `backend/src/utils/response.ts` | 直接重用（sendSuccess） |
| `backend/src/utils/logger.ts` | 直接重用 |
| `backend/src/middlewares/error.middleware.ts` | 直接重用 |
| `backend/src/middlewares/validate.middleware.ts` | 直接重用 |
| `frontend/src/lib/axios.ts` | 直接重用 |
| `frontend/src/lib/queryClient.ts` | 直接重用 |
| `frontend/src/lib/utils.ts` | 直接重用 |
| `frontend/src/components/ui/*` | 所有 shadcn/ui 元件直接重用 |
| `frontend/src/hooks/useToast.ts` | 直接重用（錯誤提示） |

---

*文件版本：v1.0 | 建立：2026-03-19*
