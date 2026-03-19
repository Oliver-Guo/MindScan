# Frontend — CLAUDE.md

> 前端開發指南。詳細任務請使用對應 skill 指令（見下方）。

---

## 可用 Skills（按需呼叫，節省 context）

| 指令 | 觸發時機 |
|------|---------|
| `/frontend-page <PageName>` | 新增完整頁面（元件 + API + 路由） |
| `/frontend-query <resource>` | TanStack Query 的 useQuery / useMutation |
| `/frontend-form <FormName>` | React Hook Form + Zod + shadcn/ui 表單 |
| `/frontend-shadcn <component>` | 安裝與使用 shadcn/ui 元件 |

---

## 目錄結構

```
frontend/src/
├── api/                 # API 呼叫函式（axios）
│   ├── user.api.ts
│   └── index.ts
├── components/
│   ├── ui/              # shadcn/ui 元件（CLI 生成，勿手動改）
│   └── shared/          # 跨頁面共用業務元件
├── hooks/               # 自訂 React Hooks
├── pages/               # 頁面元件（對應路由）
├── stores/              # Zustand 狀態
├── types/               # TypeScript 型別定義
├── lib/
│   ├── axios.ts         # Axios 實例設定
│   ├── queryClient.ts   # TanStack Query 設定
│   └── utils.ts         # shadcn/ui cn() 工具
└── main.tsx
```

---

## Zustand Store 範例

```typescript
// src/stores/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'auth-storage' }
  )
)
```

---

## 環境變數清單

```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_APP_NAME=MyApp
VITE_APP_VERSION=1.0.0
```
