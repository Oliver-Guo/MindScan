import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HighlightedSentences from '../HighlightedSentences'

describe('HighlightedSentences', () => {
  it('renders all sentence texts', () => {
    const sentences = [
      { text: '第一句', risk: 'safe' as const, reason: '' },
      { text: '第二句', risk: 'warning' as const, reason: '有疑慮' },
    ]

    render(<HighlightedSentences sentences={sentences} />)

    expect(screen.getByText('第一句')).toBeInTheDocument()
    expect(screen.getByText('第二句')).toBeInTheDocument()
  })

  it('applies danger styling for danger risk sentences', () => {
    const sentences = [
      { text: '危險句子', risk: 'danger' as const, reason: '高風險' },
    ]

    render(<HighlightedSentences sentences={sentences} />)

    const el = screen.getByText('危險句子')
    expect(el.className).toContain('mindscan-danger')
  })

  it('applies warning styling for warning risk sentences', () => {
    const sentences = [
      { text: '警告句子', risk: 'warning' as const, reason: '有疑慮' },
    ]

    render(<HighlightedSentences sentences={sentences} />)

    const el = screen.getByText('警告句子')
    expect(el.className).toContain('mindscan-warning')
  })

  it('applies safe styling for safe sentences', () => {
    const sentences = [
      { text: '安全句子', risk: 'safe' as const, reason: '' },
    ]

    render(<HighlightedSentences sentences={sentences} />)

    const el = screen.getByText('安全句子')
    expect(el.className).toContain('foreground')
  })
})
