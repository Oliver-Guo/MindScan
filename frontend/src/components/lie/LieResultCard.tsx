import type { LieResult } from '@/types/analyze'

interface Props {
  result: LieResult
}

const RISK_COLORS: Record<
  LieResult['risk_level'],
  { stroke: string; bg: string; text: string; border: string }
> = {
  low: {
    stroke: '#4dffb4',
    bg: 'bg-mindscan-safe/20',
    text: 'text-mindscan-safe',
    border: 'border-mindscan-safe/30',
  },
  medium: {
    stroke: '#ffc850',
    bg: 'bg-mindscan-warning/20',
    text: 'text-mindscan-warning',
    border: 'border-mindscan-warning/30',
  },
  high: {
    stroke: '#ff4d6a',
    bg: 'bg-mindscan-danger/20',
    text: 'text-mindscan-danger',
    border: 'border-mindscan-danger/30',
  },
}

export default function LieResultCard({ result }: Props) {
  const colors = RISK_COLORS[result.risk_level]
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const dasharray = `${(result.credibility_score / 100) * circumference} ${circumference}`

  return (
    <div className="animate-fade-in bg-mindscan-surface rounded-xl p-6 space-y-4">
      {/* 圖表 + 風險等級 行 */}
      <div className="flex items-center gap-6">
        {/* 環形圖 */}
        <div className="flex-shrink-0">
          <svg
            viewBox="0 0 120 120"
            width={120}
            height={120}
            className="block"
          >
            {/* 背景軌道 */}
            <circle
              cx={60}
              cy={60}
              r={radius}
              fill="none"
              stroke="#ffffff10"
              strokeWidth={10}
            />
            {/* 進度弧 */}
            <circle
              cx={60}
              cy={60}
              r={radius}
              fill="none"
              stroke={colors.stroke}
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={dasharray}
              strokeDashoffset={0}
              className="-rotate-90 origin-center"
              style={{ transition: 'stroke-dasharray 1s ease' }}
            />
            {/* 中心文字：分數 */}
            <text
              x={60}
              y={54}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={26}
              fontWeight="bold"
              fill={colors.stroke}
            >
              {result.credibility_score}
            </text>
            {/* 中心文字：標籤 */}
            <text
              x={60}
              y={74}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={11}
              fill="#ffffff60"
            >
              可信度
            </text>
          </svg>
        </div>

        {/* 右側資訊 */}
        <div className="flex flex-col gap-3">
          {/* 風險等級 Badge */}
          <div
            className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}
          >
            {result.risk_level_zh}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            可信度分數越高，代表文字呈現欺騙語言特徵越少。
          </p>
        </div>
      </div>

      {/* 分析總結 */}
      <p className="text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-4">
        {result.summary}
      </p>
    </div>
  )
}
