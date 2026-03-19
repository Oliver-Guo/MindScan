import { create } from 'zustand'
import type { EmotionResult, LieResult } from '@/types/analyze'

interface AppState {
  activeTab: 'emotion' | 'lie'
  setActiveTab: (tab: 'emotion' | 'lie') => void

  // 情緒急救包
  emotionInput: string
  emotionResult: EmotionResult | null
  breathingActive: boolean
  breathingPhase: 'inhale' | 'hold' | 'exhale'
  setEmotionInput: (text: string) => void
  setEmotionResult: (result: EmotionResult | null) => void
  setBreathingActive: (active: boolean) => void
  setBreathingPhase: (phase: 'inhale' | 'hold' | 'exhale') => void

  // 謊言偵測器
  lieInput: string
  lieResult: LieResult | null
  setLieInput: (text: string) => void
  setLieResult: (result: LieResult | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'emotion',
  setActiveTab: (tab) => set({ activeTab: tab }),

  emotionInput: '',
  emotionResult: null,
  breathingActive: false,
  breathingPhase: 'inhale',
  setEmotionInput: (text) => set({ emotionInput: text }),
  setEmotionResult: (result) => set({ emotionResult: result }),
  setBreathingActive: (active) => set({ breathingActive: active }),
  setBreathingPhase: (phase) => set({ breathingPhase: phase }),

  lieInput: '',
  lieResult: null,
  setLieInput: (text) => set({ lieInput: text }),
  setLieResult: (result) => set({ lieResult: result }),
}))
