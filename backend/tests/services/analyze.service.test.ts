import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AppError } from '../../src/utils/AppError'

// vi.hoisted ensures mockGenerateContent is available when vi.mock factory runs
const { mockGenerateContent } = vi.hoisted(() => ({
  mockGenerateContent: vi.fn(),
}))

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: mockGenerateContent,
    }),
  })),
}))

// Mock api-log.service to prevent DB calls
vi.mock('../../src/services/api-log.service', () => ({
  logApiCall: vi.fn(),
}))

// Import after mocks are set up
import {
  cleanJsonResponse,
  isFallbackError,
  analyzeEmotion,
  analyzeLie,
} from '../../src/services/analyze.service'

describe('cleanJsonResponse', () => {
  it('strips ```json wrapper', () => {
    const input = '```json\n{"key": "value"}\n```'
    expect(cleanJsonResponse(input)).toBe('{"key": "value"}')
  })

  it('strips ``` wrapper without json tag', () => {
    const input = '```\n{"key": "value"}\n```'
    expect(cleanJsonResponse(input)).toBe('{"key": "value"}')
  })

  it('returns trimmed string when no code block', () => {
    expect(cleanJsonResponse('  {"key": "value"}  ')).toBe('{"key": "value"}')
  })

  it('handles multiline JSON inside code block', () => {
    const input = '```json\n{\n  "a": 1,\n  "b": 2\n}\n```'
    const result = cleanJsonResponse(input)
    expect(JSON.parse(result)).toEqual({ a: 1, b: 2 })
  })
})

describe('isFallbackError', () => {
  it('returns true for Error with "quota" message', () => {
    expect(isFallbackError(new Error('Resource has been exhausted (quota)'))).toBe(true)
  })

  it('returns true for Error with "rate limit" message', () => {
    expect(isFallbackError(new Error('Rate limit exceeded'))).toBe(true)
  })

  it('returns true for Error with "not found" message', () => {
    expect(isFallbackError(new Error('Model not found'))).toBe(true)
  })

  it('returns true for Error with "is not supported" message', () => {
    expect(isFallbackError(new Error('This model is not supported'))).toBe(true)
  })

  it('returns true for Error with "too many requests" message', () => {
    expect(isFallbackError(new Error('Too many requests'))).toBe(true)
  })

  it('returns true for object with status 429', () => {
    expect(isFallbackError({ status: 429 })).toBe(true)
  })

  it('returns true for object with status 503', () => {
    expect(isFallbackError({ status: 503 })).toBe(true)
  })

  it('returns true for object with status 404', () => {
    expect(isFallbackError({ status: 404 })).toBe(true)
  })

  it('returns false for generic Error', () => {
    expect(isFallbackError(new Error('Something went wrong'))).toBe(false)
  })

  it('returns false for object with status 500', () => {
    expect(isFallbackError({ status: 500 })).toBe(false)
  })
})

describe('analyzeEmotion', () => {
  beforeEach(() => {
    mockGenerateContent.mockReset()
  })

  const mockEmotionResult = {
    emotion_type: '焦慮',
    intensity: 75,
    intensity_desc: '中高度焦慮',
    tips: [{ icon: '🧘', title: '深呼吸', detail: '嘗試 4-7-8 呼吸法' }],
    letter: '你辛苦了',
  }

  it('returns parsed EmotionResult on success', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => JSON.stringify(mockEmotionResult) },
    })

    const result = await analyzeEmotion('我很焦慮')
    expect(result).toEqual(mockEmotionResult)
  })

  it('handles code-block wrapped response', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => '```json\n' + JSON.stringify(mockEmotionResult) + '\n```' },
    })

    const result = await analyzeEmotion('我很焦慮')
    expect(result).toEqual(mockEmotionResult)
  })

  it('throws PARSE_ERROR on invalid JSON', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => 'not valid json' },
    })

    // Single assertion with toMatchObject covers both
    await expect(analyzeEmotion('test')).rejects.toMatchObject({
      code: 'PARSE_ERROR',
    })
  })

  it('re-throws AppError as-is', async () => {
    const appErr = new AppError('QUOTA_EXCEEDED', '額度限制', 429)
    mockGenerateContent.mockRejectedValueOnce(appErr)

    await expect(analyzeEmotion('test')).rejects.toBe(appErr)
  })

  it('throws AI_ERROR for non-fallback errors', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('Unknown error'))

    await expect(analyzeEmotion('test')).rejects.toMatchObject({
      code: 'AI_ERROR',
      statusCode: 502,
    })
  })
})

describe('analyzeLie', () => {
  beforeEach(() => {
    mockGenerateContent.mockReset()
  })

  const mockLieResult = {
    credibility_score: 40,
    risk_level: 'high' as const,
    risk_level_zh: '高風險',
    sentences: [{ text: '我沒有', risk: 'danger' as const, reason: '否認語氣' }],
    features: [{ type: '矛盾陳述', example: '前後不一' }],
    summary: '可信度偏低',
  }

  it('returns parsed LieResult on success', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => JSON.stringify(mockLieResult) },
    })

    const result = await analyzeLie('我沒有說謊')
    expect(result).toEqual(mockLieResult)
  })

  it('throws PARSE_ERROR on invalid JSON', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => '{broken' },
    })

    await expect(analyzeLie('test')).rejects.toMatchObject({
      code: 'PARSE_ERROR',
    })
  })
})
