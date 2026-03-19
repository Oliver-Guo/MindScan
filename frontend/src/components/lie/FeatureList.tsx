import type { LieFeature } from '@/types/analyze'

interface Props {
  features: LieFeature[]
}

const FEATURE_ICONS: Record<string, string> = {
  矛盾陳述: '⚡',
  模糊表達: '🌫️',
  迴避回應: '🔄',
  情緒誇大: '📣',
  資訊缺漏: '🕳️',
}

const DEFAULT_ICON = '⚠️'

export default function FeatureList({ features }: Props) {
  return (
    <div className="animate-fade-in bg-mindscan-surface rounded-xl p-4 space-y-1">
      <h3 className="text-sm font-semibold text-mindscan-detection mb-3">偵測到的語言特徵</h3>

      {features.length === 0 ? (
        <p className="text-sm text-mindscan-safe py-2">未偵測到明顯語言風險特徵</p>
      ) : (
        <ul>
          {features.map((feature, idx) => (
            <li
              key={idx}
              className={`flex items-start gap-3 py-3 ${
                idx > 0 ? 'border-t border-border/30' : ''
              }`}
            >
              {/* Icon */}
              <span className="text-lg leading-none mt-0.5 flex-shrink-0">
                {FEATURE_ICONS[feature.type] ?? DEFAULT_ICON}
              </span>

              {/* 內容 */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="font-medium text-sm text-foreground">{feature.type}</span>
                <span className="text-sm text-muted-foreground break-words">{feature.example}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
