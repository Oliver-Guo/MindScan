---
name: frontend-form
description: 產生 React Hook Form + Zod + shadcn/ui 的表單元件。當使用者說「寫表單」、「新增表單」、「建立 form」時使用。
argument-hint: "FormName"
---

為 `$ARGUMENTS` 產生表單元件，使用 React Hook Form + Zod 驗證 + shadcn/ui 表單元件。

## 執行步驟

### 1. 確認 shadcn/ui form 元件已安裝
檢查 `src/components/ui/form.tsx` 是否存在，若不存在提示執行：
```bash
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
```

### 2. 定義 Zod Schema
在表單元件檔案內或獨立的 schema 檔案中定義：

```typescript
const formSchema = z.object({
  name: z.string().min(2, '姓名至少 2 個字'),
  email: z.string().email('請輸入有效的 Email'),
})

type FormValues = z.infer<typeof formSchema>
```

### 3. 建立表單元件

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function MyForm({ onSubmit }: { onSubmit: (values: FormValues) => void }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '' },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>姓名</FormLabel>
              <FormControl>
                <Input placeholder="請輸入姓名" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">送出</Button>
      </form>
    </Form>
  )
}
```

## 規範

- 每個表單欄位用 `<FormField>` 包裹，確保錯誤訊息自動顯示
- `defaultValues` 必填，避免 controlled/uncontrolled 切換警告
- 型別從 Zod Schema 推導（`z.infer<typeof schema>`），不手動定義
- 提交後搭配 `useMutation` 呼叫 API，參考 `/frontend-query`
- 編輯表單：`defaultValues` 從 `useQuery` 資料填入，並設 `enabled: !!id`
