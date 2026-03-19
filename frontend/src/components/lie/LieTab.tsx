import { useMutation } from '@tanstack/react-query'
import { useAppStore } from '@/stores/appStore'
import { analyzeApi } from '@/api/analyze.api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import LieResultCard from './LieResultCard'
import HighlightedSentences from './HighlightedSentences'
import FeatureList from './FeatureList'

const EXAMPLE_TEXTS = [
  {
    label: '否認與責任轉移',
    text: '我絕對沒有說過那些話，你可能記錯了。我一直都很支持你的，每次都是。再說了，當時的情況很複雜，不是三言兩語說得清楚的。',
  },
  {
    label: '職場推託與模糊承諾',
    text: '這個專案的延遲不是我的問題，我早就提醒過了。我們團隊都有在努力，只是資源不夠而已。下次一定會改善的，你放心。',
  },
  {
    label: '感情中的迴避與敷衍',
    text: '我那天真的只是跟朋友吃個飯，沒什麼好說的。你不要每次都這樣疑神疑鬼的，我已經解釋很多次了。你就不能信任我一次嗎？',
  },
  {
    label: '銷售話術與誇大宣傳',
    text: '這個產品效果非常好，很多客戶用了都說讚。現在買的話還有限時優惠，錯過就沒有了。我跟你說，這是市面上最好的選擇，絕對不會後悔。',
  },
  {
    label: '道歉中的自我辯護',
    text: '我知道你很生氣，但我真的不是故意的。換作是任何人在那種情況下都會這樣做的。而且你之前也有做過類似的事情，我都沒有說什麼。',
  },
]

export default function LieTab() {
  const { lieInput, lieResult, setLieInput, setLieResult } = useAppStore()

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => analyzeApi.lie(lieInput),
    onSuccess: (data) => setLieResult(data),
  })

  const handleAnalyze = () => {
    if (lieInput.trim()) mutate()
  }

  const handleReset = () => {
    setLieResult(null)
    setLieInput('')
  }

  return (
    <div className="animate-fade-in space-y-6">
      {!lieResult ? (
        <>
          {/* 範例文字下拉選單 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground shrink-0">快速體驗：</span>
            <Select
              onValueChange={(value) => {
                const example = EXAMPLE_TEXTS[Number(value)]
                if (example) setLieInput(example.text)
              }}
            >
              <SelectTrigger className="w-full border-mindscan-detection/30 text-mindscan-detection hover:bg-mindscan-detection/10">
                <SelectValue placeholder="選擇範例文字" />
              </SelectTrigger>
              <SelectContent>
                {EXAMPLE_TEXTS.map((example, index) => (
                  <SelectItem key={index} value={String(index)}>
                    {example.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 輸入區域 */}
          <div className="space-y-3">
            <Textarea
              value={lieInput}
              onChange={(e) => setLieInput(e.target.value)}
              placeholder="貼入需要分析的文字（對話、聲明、訊息）..."
              rows={8}
              className="bg-mindscan-surface border-border/50 resize-none text-foreground placeholder:text-muted-foreground focus-visible:ring-mindscan-detection/50"
            />

            {/* 錯誤提示 */}
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
                分析失敗，請稍後再試。
              </div>
            )}

            {/* 分析按鈕 */}
            <Button
              onClick={handleAnalyze}
              disabled={isPending || !lieInput.trim()}
              className="w-full bg-mindscan-detection text-mindscan-bg hover:bg-mindscan-detection/90 disabled:opacity-60 font-semibold"
            >
              {isPending ? '分析中...' : '開始分析'}
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* 可信度結果卡片 */}
          <LieResultCard result={lieResult} />

          {/* 逐句高亮 */}
          <div className="bg-mindscan-surface rounded-xl p-4 space-y-2">
            <h3 className="text-sm font-semibold text-mindscan-detection">逐句分析</h3>
            <HighlightedSentences sentences={lieResult.sentences} />
          </div>

          {/* 語言特徵清單 */}
          <FeatureList features={lieResult.features} />

          {/* 重新分析按鈕 */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-border/50 hover:border-mindscan-detection/50 hover:text-mindscan-detection"
            >
              重新分析
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
