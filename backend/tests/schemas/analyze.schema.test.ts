import { describe, it, expect } from 'vitest'
import { emotionInputSchema, lieInputSchema } from '../../src/schemas/analyze.schema'

describe('emotionInputSchema', () => {
  it('accepts valid input', () => {
    const result = emotionInputSchema.parse({ text: '我今天很開心' })
    expect(result.text).toBe('我今天很開心')
  })

  it('rejects empty string', () => {
    expect(() => emotionInputSchema.parse({ text: '' })).toThrow('請輸入心情描述')
  })

  it('rejects string exceeding 2000 chars', () => {
    const longText = 'a'.repeat(2001)
    expect(() => emotionInputSchema.parse({ text: longText })).toThrow('2000')
  })

  it('rejects missing text field', () => {
    expect(() => emotionInputSchema.parse({})).toThrow()
  })

  it('rejects non-string input', () => {
    expect(() => emotionInputSchema.parse({ text: 123 })).toThrow()
  })
})

describe('lieInputSchema', () => {
  it('accepts valid input', () => {
    const result = lieInputSchema.parse({ text: '我沒有說謊' })
    expect(result.text).toBe('我沒有說謊')
  })

  it('rejects empty string', () => {
    expect(() => lieInputSchema.parse({ text: '' })).toThrow('請輸入待分析文字')
  })

  it('rejects string exceeding 2000 chars', () => {
    const longText = 'a'.repeat(2001)
    expect(() => lieInputSchema.parse({ text: longText })).toThrow('2000')
  })

  it('accepts exactly 2000 chars', () => {
    const text = 'a'.repeat(2000)
    const result = lieInputSchema.parse({ text })
    expect(result.text).toBe(text)
  })
})
