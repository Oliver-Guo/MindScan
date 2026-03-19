import { z } from 'zod'

export const emotionInputSchema = z.object({
  text: z.string().min(1, '請輸入心情描述').max(2000, '輸入過長，請控制在 2000 字以內'),
})

export const lieInputSchema = z.object({
  text: z.string().min(1, '請輸入待分析文字').max(2000, '輸入過長，請控制在 2000 字以內'),
})

export type EmotionInput = z.infer<typeof emotionInputSchema>
export type LieInput = z.infer<typeof lieInputSchema>
