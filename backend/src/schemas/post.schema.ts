import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(1, '標題不能為空').max(200, '標題最多 200 個字元'),
  content: z.string().min(1, '內容不能為空'),
  excerpt: z.string().max(500, '摘要最多 500 個字元').optional(),
  categoryId: z.number().int().positive().optional().nullable(),
  published: z.boolean().default(false),
})

export const updatePostSchema = createPostSchema.partial()

export const postQuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('10').transform(Number),
  categoryId: z.string().optional().transform(v => v ? Number(v) : undefined),
})

export type CreatePostDto = z.infer<typeof createPostSchema>
export type UpdatePostDto = z.infer<typeof updatePostSchema>
