import { api } from '@/lib/axios'
import type { ApiResponse } from '@/types/api'
import type { EmotionResult, LieResult } from '@/types/analyze'

export const analyzeApi = {
  emotion: (text: string) =>
    api
      .post<ApiResponse<EmotionResult>>('/analyze/emotion', { text })
      .then(r => r.data.data),

  lie: (text: string) =>
    api
      .post<ApiResponse<LieResult>>('/analyze/lie', { text })
      .then(r => r.data.data),
}
