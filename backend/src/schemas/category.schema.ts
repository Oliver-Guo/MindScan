import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().min(1, '分類名稱不能為空').max(50, '分類名稱最多 50 個字元'),
  slug: z
    .string()
    .min(1, 'Slug 不能為空')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug 只能包含小寫字母、數字和連字號'),
})

export const updateCategorySchema = createCategorySchema.partial()

export type CreateCategoryDto = z.infer<typeof createCategorySchema>
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>
