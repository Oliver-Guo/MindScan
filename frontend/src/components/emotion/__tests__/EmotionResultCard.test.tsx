import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import EmotionResultCard from '../EmotionResultCard'

const mockResult = {
  emotion_type: '焦慮',
  intensity: 75,
  intensity_desc: '中高度焦慮',
  tips: [
    { icon: '🧘', title: '深呼吸', detail: '嘗試 4-7-8 呼吸法' },
    { icon: '🎵', title: '聽音樂', detail: '放鬆心情' },
  ],
  letter: '你辛苦了，記得休息',
}

describe('EmotionResultCard', () => {
  it('renders emotion type', () => {
    render(<EmotionResultCard result={mockResult} />)
    expect(screen.getByText('焦慮')).toBeInTheDocument()
  })

  it('renders intensity number', () => {
    render(<EmotionResultCard result={mockResult} />)
    expect(screen.getByText('75')).toBeInTheDocument()
  })

  it('renders intensity description', () => {
    render(<EmotionResultCard result={mockResult} />)
    expect(screen.getByText('中高度焦慮')).toBeInTheDocument()
  })

  it('renders tip cards', () => {
    render(<EmotionResultCard result={mockResult} />)
    expect(screen.getByText('深呼吸')).toBeInTheDocument()
    expect(screen.getByText('嘗試 4-7-8 呼吸法')).toBeInTheDocument()
    expect(screen.getByText('聽音樂')).toBeInTheDocument()
  })

  it('displays letter text with typing animation', () => {
    vi.useFakeTimers()
    render(<EmotionResultCard result={mockResult} />)

    // Advance past all characters (letter length * 30ms interval)
    act(() => {
      vi.advanceTimersByTime(mockResult.letter.length * 30 + 100)
    })

    expect(screen.getByText(mockResult.letter)).toBeInTheDocument()
    vi.useRealTimers()
  })
})
