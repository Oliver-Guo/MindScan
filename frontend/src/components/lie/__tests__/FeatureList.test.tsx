import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import FeatureList from '../FeatureList'

describe('FeatureList', () => {
  it('renders feature types and examples', () => {
    const features = [
      { type: '矛盾陳述', example: '前後不一致' },
      { type: '模糊表達', example: '用詞含糊' },
    ]

    render(<FeatureList features={features} />)

    expect(screen.getByText('矛盾陳述')).toBeInTheDocument()
    expect(screen.getByText('前後不一致')).toBeInTheDocument()
    expect(screen.getByText('模糊表達')).toBeInTheDocument()
    expect(screen.getByText('用詞含糊')).toBeInTheDocument()
  })

  it('shows correct emoji icons for known feature types', () => {
    const features = [{ type: '矛盾陳述', example: 'test' }]

    render(<FeatureList features={features} />)

    expect(screen.getByText('⚡')).toBeInTheDocument()
  })

  it('shows default icon for unknown feature type', () => {
    const features = [{ type: '未知類型', example: 'test' }]

    render(<FeatureList features={features} />)

    expect(screen.getByText('⚠️')).toBeInTheDocument()
  })

  it('shows empty state message when no features', () => {
    render(<FeatureList features={[]} />)

    expect(screen.getByText('未偵測到明顯語言風險特徵')).toBeInTheDocument()
  })
})
