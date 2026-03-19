import { useState } from 'react'
import type { LieSentence } from '@/types/analyze'

interface Props {
  sentences: LieSentence[]
}

const RISK_STYLES: Record<LieSentence['risk'], string> = {
  safe: 'text-foreground/80',
  warning: 'bg-mindscan-warning/20 text-mindscan-warning rounded px-0.5',
  danger: 'bg-mindscan-danger/20 text-mindscan-danger rounded px-0.5',
}

export default function HighlightedSentences({ sentences }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <div className="leading-relaxed text-sm animate-fade-in">
      {sentences.map((sentence, idx) => (
        <span key={idx} className="relative">
          <span
            className={`cursor-default ${RISK_STYLES[sentence.risk]}`}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {sentence.text}
          </span>

          {/* Tooltip：僅 warning / danger 且有 reason 時才顯示 */}
          {hoveredIdx === idx && sentence.risk !== 'safe' && sentence.reason && (
            <span
              className="absolute bottom-full left-0 z-10 mb-1 w-max max-w-xs rounded-lg border border-border/50 bg-mindscan-surface px-3 py-2 text-xs text-foreground shadow-lg"
              style={{ pointerEvents: 'none' }}
            >
              {sentence.reason}
            </span>
          )}

          {/* 句子間的空格 */}
          {idx < sentences.length - 1 && ' '}
        </span>
      ))}
    </div>
  )
}
