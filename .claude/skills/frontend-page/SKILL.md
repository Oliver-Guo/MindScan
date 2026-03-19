---
name: frontend-page
description: 產生完整的前端頁面，包含元件、API 呼叫、路由設定。當使用者說「新增頁面」、「建立 xxx 頁面」、「幫我寫 xxx Page」時使用。
argument-hint: "PageName"
---

為 `$ARGUMENTS` 產生完整的前端頁面模組。

## 執行步驟

### 1. 推導命名
從 `$ARGUMENTS`（PascalCase，例如 `UserList`）推導：
- 頁面元件：`$ARGUMENTS + Page.tsx`（例如 `UserListPage.tsx`）
- API 檔案：小寫資源名 + `.api.ts`（例如 `user.api.ts`）
- 型別檔案：小寫資源名 + `.ts`（例如 `user.ts`）

### 2. 依序建立檔案

**a) 型別定義** — `src/types/<資源名>.ts`
```typescript
export interface User {
  id: number
  // ... 根據後端 API 回應定義
}
export type CreateUserDto = { ... }
```

**b) API 呼叫層** — `src/api/<資源名>.api.ts`
```typescript
import axios from '@/lib/axios'
import type { User, CreateUserDto } from '@/types/user'

export const fetchUsers = () =>
  axios.get<User[]>('/users').then(r => r.data)

export const fetchUser = (id: number) =>
  axios.get<User>(`/users/${id}`).then(r => r.data)

export const createUser = (dto: CreateUserDto) =>
  axios.post<User>('/users', dto).then(r => r.data)
```

**c) 頁面元件** — `src/pages/<資源名>/`
- 使用 TanStack Query 的 `useQuery` 取得資料
- Props 使用 interface 定義，禁止 `any`
- UI 使用 shadcn/ui 元件 + Tailwind CSS
- Loading / Empty / Error 狀態都要處理

**d) 掛載路由** — 在 `src/main.tsx` 新增 `<Route>`，需要認證的頁面包在 `<ProtectedRoute>` 內

### 3. 元件結構規範

```typescript
// 標準 import 順序
import { useQuery } from '@tanstack/react-query'         // 1. 外部套件
import { Button } from '@/components/ui/button'           // 2. UI 元件
import { fetchUser } from '@/api/user.api'                // 3. API
import type { User } from '@/types/user'                  // 4. 型別

interface Props { ... }                                    // 5. Props 定義

export default function ComponentName({ ... }: Props) {    // 6. 元件
  // hooks → 事件 handler → return JSX
}
```

### 4. 路由設定範例

```tsx
const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore()
  if (!token) return <Navigate to="/login" />
  return children
}
```

### 5. 完成後提示
- 共用元件放至 `src/components/shared/`
- 有表單需求時執行 `/frontend-form`
