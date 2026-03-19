import { useMutation } from '@tanstack/react-query'
import { useAppStore } from '@/stores/appStore'
import { analyzeApi } from '@/api/analyze.api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import EmotionResultCard from './EmotionResultCard'
import BreathingAnimation from './BreathingAnimation'

const EMOTION_TAGS = ['焦慮', '疲憊', '憤怒', '悲傷', '迷茫', '壓力大', '孤獨', '委屈', '無助', '煩躁']

export default function EmotionTab() {
  const { emotionInput, emotionResult, setEmotionInput, setEmotionResult } = useAppStore()

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => analyzeApi.emotion(emotionInput),
    onSuccess: (data) => setEmotionResult(data),
  })

  const handleTagClick = (tag: string) => {
    setEmotionInput(emotionInput ? `${emotionInput} ${tag}` : tag)
  }

  const handleAnalyze = () => {
    if (emotionInput.trim()) mutate()
  }

  const handleReset = () => {
    setEmotionResult(null)
    setEmotionInput('')
  }

  return (
    <div className="animate-fade-in space-y-6">
      {!emotionResult ? (
        <>
          {/* 情緒快速標籤 */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">快速選擇你的情緒狀態：</p>
            <div className="flex flex-wrap gap-2">
              {EMOTION_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="bg-mindscan-surface border border-mindscan-emotion/30 text-mindscan-emotion text-sm rounded-full px-3 py-1 hover:bg-mindscan-emotion/10 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 自由輸入區 */}
          <div className="space-y-3">
            <Textarea
              value={emotionInput}
              onChange={(e) => setEmotionInput(e.target.value)}
              placeholder="描述你現在的心情或遇到的狀況..."
              rows={5}
              className="bg-mindscan-surface border-border/50 resize-none text-foreground placeholder:text-muted-foreground focus-visible:ring-mindscan-emotion/50"
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
              disabled={isPending || !emotionInput.trim()}
              className="w-full bg-mindscan-emotion text-mindscan-bg hover:bg-mindscan-emotion/90 disabled:opacity-60 font-semibold"
            >
              {isPending ? '分析中...' : '分析我的情緒'}
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* 結果區域 */}
          <EmotionResultCard result={emotionResult} />

          {/* 呼吸練習 */}
          <BreathingAnimation />

          {/* 重新分析按鈕 */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-border/50 hover:border-mindscan-emotion/50 hover:text-mindscan-emotion"
            >
              重新分析
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
