import { useAppStore } from '@/stores/appStore'
import EmotionTab from '@/components/emotion/EmotionTab'
import LieTab from '@/components/lie/LieTab'

const TABS = [
  { key: 'emotion', label: '🩹 情緒急救包' },
  { key: 'lie', label: '🔍 謊言偵測器' },
] as const

export default function MindScanPage() {
  const activeTab = useAppStore(s => s.activeTab)
  const setActiveTab = useAppStore(s => s.setActiveTab)

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Tab 切換列 */}
      <div className="flex gap-2 mb-8 bg-mindscan-surface rounded-xl p-1.5">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={[
              'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200',
              activeTab === tab.key
                ? tab.key === 'emotion'
                  ? 'bg-mindscan-emotion text-mindscan-bg shadow-md'
                  : 'bg-mindscan-detection text-mindscan-bg shadow-md'
                : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 內容區域 */}
      <div className="animate-fade-in">
        {activeTab === 'emotion' ? <EmotionTab /> : <LieTab />}
      </div>
    </div>
  )
}
