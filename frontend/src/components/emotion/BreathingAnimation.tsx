import { useEffect, useRef } from 'react'
import { useAppStore } from '@/stores/appStore'
import { Button } from '@/components/ui/button'
import { Play, Pause } from 'lucide-react'

const PHASES = [
  { phase: 'inhale' as const, label: '吸氣', duration: 4000, color: '#ff6b9d' },
  { phase: 'hold' as const, label: '憋氣', duration: 7000, color: '#ffc850' },
  { phase: 'exhale' as const, label: '吐氣', duration: 8000, color: '#00e5c8' },
]

export default function BreathingAnimation() {
  const { breathingActive, breathingPhase, setBreathingActive, setBreathingPhase } = useAppStore()
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (!breathingActive) return
    const currentPhase = PHASES.find((p) => p.phase === breathingPhase) ?? PHASES[0]
    timerRef.current = setTimeout(() => {
      const nextIndex = (PHASES.indexOf(currentPhase) + 1) % PHASES.length
      setBreathingPhase(PHASES[nextIndex].phase)
    }, currentPhase.duration)
    return () => clearTimeout(timerRef.current)
  }, [breathingActive, breathingPhase, setBreathingPhase])

  const toggle = () => {
    if (!breathingActive) setBreathingPhase('inhale')
    setBreathingActive(!breathingActive)
  }

  const currentPhaseInfo = PHASES.find((p) => p.phase === breathingPhase) ?? PHASES[0]

  const circleAnimationClass = breathingActive
    ? breathingPhase === 'inhale'
      ? 'animate-breathe'
      : breathingPhase === 'exhale'
        ? 'animate-breathe-slow'
        : ''
    : ''

  return (
    <div className="animate-fade-in bg-mindscan-surface rounded-2xl p-6 border border-border/50 space-y-5">
      {/* 標題與說明 */}
      <div className="text-center space-y-1">
        <h3 className="font-semibold text-foreground">4-7-8 呼吸練習</h3>
        <p className="text-xs text-muted-foreground">吸氣 4 秒 · 憋氣 7 秒 · 吐氣 8 秒</p>
      </div>

      {/* 呼吸圓圈 */}
      <div className="flex justify-center">
        <div className="relative">
          <div
            className={`w-40 h-40 rounded-full flex items-center justify-center ${circleAnimationClass}`}
            style={{
              background: `radial-gradient(circle, ${currentPhaseInfo.color}30 0%, ${currentPhaseInfo.color}10 70%)`,
              border: `2px solid ${currentPhaseInfo.color}60`,
              boxShadow: breathingActive ? `0 0 32px ${currentPhaseInfo.color}40` : 'none',
              transition: 'border-color 0.8s ease, box-shadow 0.8s ease',
            }}
          >
            <span
              className="text-xl font-semibold"
              style={{ color: currentPhaseInfo.color, transition: 'color 0.8s ease' }}
            >
              {breathingActive ? currentPhaseInfo.label : '準備好了嗎'}
            </span>
          </div>
        </div>
      </div>

      {/* Phase 指示列 */}
      <div className="flex justify-center gap-6">
        {PHASES.map(({ phase, label, color }) => (
          <div key={phase} className="flex flex-col items-center gap-1">
            <div
              className="w-2 h-2 rounded-full transition-all duration-500"
              style={{
                backgroundColor:
                  breathingActive && breathingPhase === phase ? color : '#ffffff20',
                boxShadow:
                  breathingActive && breathingPhase === phase ? `0 0 8px ${color}` : 'none',
              }}
            />
            <span
              className="text-xs transition-colors duration-500"
              style={{
                color:
                  breathingActive && breathingPhase === phase ? color : 'hsl(var(--muted-foreground))',
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* 開始 / 暫停按鈕 */}
      <div className="flex justify-center">
        <Button
          onClick={toggle}
          variant="outline"
          className="gap-2 border-border/50 hover:border-mindscan-emotion/50 hover:text-mindscan-emotion"
        >
          {breathingActive ? (
            <>
              <Pause className="w-4 h-4" />
              暫停練習
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              開始練習
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
