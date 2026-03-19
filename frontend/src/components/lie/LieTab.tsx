import { useMutation } from '@tanstack/react-query'
import { useAppStore } from '@/stores/appStore'
import { analyzeApi } from '@/api/analyze.api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import LieResultCard from './LieResultCard'
import HighlightedSentences from './HighlightedSentences'
import FeatureList from './FeatureList'

const EXAMPLE_TEXT =
  '我絕對沒有說過那些話，你可能記錯了。我一直都很支持你的，每次都是。再說了，當時的情況很複雜，不是三言兩語說得清楚的。'

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
          {/* 範例文字按鈕 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">快速體驗：</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLieInput(EXAMPLE_TEXT)}
              className="text-mindscan-detection border-mindscan-detection/30 hover:bg-mindscan-detection/10 hover:text-mindscan-detection"
            >
              範例文字
            </Button>
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
