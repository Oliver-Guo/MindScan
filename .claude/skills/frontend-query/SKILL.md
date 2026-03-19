---
name: frontend-query
description: 協助撰寫 TanStack Query 的 useQuery / useMutation，包含 Query Key 命名、快取策略、樂觀更新。當使用者說「寫 query」、「加 useMutation」、「資料請求」時使用。
argument-hint: "resource-name"
---

為 `$ARGUMENTS` 相關資源撰寫 TanStack Query 程式碼。

## Query Key 命名規範

```typescript
['users']                        // 列表
['users', userId]                // 單筆
['users', userId, 'orders']      // 關聯資源
['users', { page, limit }]      // 帶篩選參數的列表
```

規則：
- 第一層為資源名稱（小寫複數）
- 第二層為 ID 或篩選物件
- 第三層為關聯子資源

## 標準 useQuery

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['users', id],
  queryFn: () => fetchUser(id),
  enabled: !!id,                 // 條件查詢
  staleTime: 5 * 60 * 1000,     // 5 分鐘快取
})
```

## 標準 useMutation

```typescript
const { mutate, isPending } = useMutation({
  mutationFn: createUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
    toast.success('建立成功')
  },
  onError: (error) => {
    toast.error(error.message)
  },
})
```

## 執行規則

1. 讀取 `src/api/$ARGUMENTS.api.ts` 確認現有 API 函式
2. Query Key 與 API URL path 保持語意一致
3. 列表頁使用 `staleTime` 避免頻繁 refetch
4. 寫入操作（create/update/delete）完成後 `invalidateQueries` 清除相關快取
5. 條件查詢使用 `enabled` 控制，避免無效請求

## Axios 設定參考

Axios 實例位於 `src/lib/axios.ts`，已設定：
- `baseURL` 從 `VITE_API_BASE_URL` 環境變數讀取
- 請求攔截器自動帶 `Authorization: Bearer <token>`
- 回應攔截器自動解包 `.data`，401 時自動登出
