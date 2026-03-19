import { useState, useEffect } from 'react'
import { Copy, Check } from 'lucide-react'
import type { EmotionResult } from '@/types/analyze'

interface Props {
  result: EmotionResult
}

export default function EmotionResultCard({ result }: Props) {
  const [displayedLetter, setDisplayedLetter] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setDisplayedLetter('')
    let i = 0
    const timer = setInterval(() => {
      setDisplayedLetter(result.letter.slice(0, i + 1))
      i++
      if (i >= result.letter.length) clearInterval(timer)
    }, 30)
    return () => clearInterval(timer)
  }, [result.letter])

  const handleCopy = () => {
    navigator.clipboard.writeText(result.letter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const circumference = 2 * Math.PI * 40 // ≈ 251.3

  return (
    <div className="animate-fade-in space-y-5">
      {/* ① 情緒類型 + 強度儀表 */}
      <div className="bg-mindscan-surface rounded-2xl p-6 border border-border/50 flex flex-col sm:flex-row items-center gap-6">
        {/* 圓形進度條 */}
        <div className="relative flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#ffffff10"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#ff6b9d"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${result.intensity * 2.513} ${circumference}`}
              style={{ transition: 'stroke-dasharray 1s ease' }}
            />
          </svg>
          {/* 中間數值 */}
          <span className="absolute inset-0 flex items-center justify-center rotate-90 text-lg font-bold text-mindscan-emotion">
            {result.intensity}
          </span>
        </div>

        {/* 文字資訊 */}
        <div className="text-center sm:text-left">
          <p className="text-mindscan-emotion text-2xl font-bold">{result.emotion_type}</p>
          <p className="text-muted-foreground text-sm mt-1">{result.intensity_desc}</p>
        </div>
      </div>

      {/* ② 3 張紓壓建議卡片 */}
      {result.tips.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {result.tips.map((tip, idx) => (
            <div
              key={idx}
              className="bg-mindscan-surface rounded-xl p-4 border border-border/50 space-y-2"
            >
              <span className="text-2xl">{tip.icon}</span>
              <p className="font-medium text-foreground">{tip.title}</p>
              <p className="text-sm text-muted-foreground">{tip.detail}</p>
            </div>
          ))}
        </div>
      )}

      {/* ③ 鼓勵信 */}
      <div className="relative bg-mindscan-surface/50 rounded-xl p-5 border border-mindscan-emotion/20">
        {/* 分享按鈕 */}
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-mindscan-emotion hover:bg-mindscan-emotion/10 transition-colors"
          title="複製鼓勵信"
        >
          {copied ? (
            <Check className="w-4 h-4 text-mindscan-emotion" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>

        <p className="text-sm text-muted-foreground mb-3 font-medium">給你的一封信</p>
        <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm pr-8">
          {displayedLetter}
        </p>
      </div>
    </div>
  )
}
