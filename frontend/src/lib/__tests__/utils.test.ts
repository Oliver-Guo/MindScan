import { describe, it, expect } from 'vitest'
import { cn, formatDate } from '../utils'

describe('cn', () => {
  it('merges Tailwind classes correctly', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden')).toBe('base')
  })

  it('handles multiple classes', () => {
    const result = cn('text-sm font-bold', 'text-lg')
    expect(result).toBe('font-bold text-lg')
  })
})

describe('formatDate', () => {
  it('formats ISO date string to zh-TW locale', () => {
    const result = formatDate('2024-03-15')
    expect(result).toContain('2024')
    expect(result).toContain('3')
    expect(result).toContain('15')
  })
})
