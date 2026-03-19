import { z } from 'zod'

export const createCommentSchema = z.object({
  content: z.string().min(1, '留言不能為空').max(1000, '留言最多 1000 個字元'),
})

export type CreateCommentDto = z.infer<typeof createCommentSchema>
