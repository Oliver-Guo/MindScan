import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/axios', () => ({
  api: {
    post: vi.fn(),
  },
}))

import { analyzeApi } from '../analyze.api'
import { api } from '@/lib/axios'

describe('analyzeApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('emotion calls correct endpoint and returns data', async () => {
    const mockData = { emotion_type: '開心', intensity: 50 }
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { success: true, data: mockData },
    })

    const result = await analyzeApi.emotion('我很開心')

    expect(api.post).toHaveBeenCalledWith('/analyze/emotion', { text: '我很開心' })
    expect(result).toEqual(mockData)
  })

  it('lie calls correct endpoint and returns data', async () => {
    const mockData = { credibility_score: 80, risk_level: 'low' }
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { success: true, data: mockData },
    })

    const result = await analyzeApi.lie('測試文字')

    expect(api.post).toHaveBeenCalledWith('/analyze/lie', { text: '測試文字' })
    expect(result).toEqual(mockData)
  })

  it('propagates errors from api.post', async () => {
    vi.mocked(api.post).mockRejectedValueOnce(new Error('Network error'))

    await expect(analyzeApi.emotion('test')).rejects.toThrow('Network error')
  })
})
