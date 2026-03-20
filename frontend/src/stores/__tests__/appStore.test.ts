import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '../appStore'

describe('appStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useAppStore.setState({
      activeTab: 'emotion',
      emotionInput: '',
      emotionResult: null,
      breathingActive: false,
      breathingPhase: 'inhale',
      lieInput: '',
      lieResult: null,
    })
  })

  it('has correct default state', () => {
    const state = useAppStore.getState()
    expect(state.activeTab).toBe('emotion')
    expect(state.emotionInput).toBe('')
    expect(state.emotionResult).toBeNull()
    expect(state.breathingActive).toBe(false)
    expect(state.breathingPhase).toBe('inhale')
    expect(state.lieInput).toBe('')
    expect(state.lieResult).toBeNull()
  })

  it('setActiveTab updates activeTab', () => {
    useAppStore.getState().setActiveTab('lie')
    expect(useAppStore.getState().activeTab).toBe('lie')
  })

  it('setEmotionInput updates emotionInput', () => {
    useAppStore.getState().setEmotionInput('我很開心')
    expect(useAppStore.getState().emotionInput).toBe('我很開心')
  })

  it('setEmotionResult sets and clears result', () => {
    const mockResult = {
      emotion_type: '開心',
      intensity: 50,
      intensity_desc: '中等',
      tips: [],
      letter: '加油',
    }
    useAppStore.getState().setEmotionResult(mockResult)
    expect(useAppStore.getState().emotionResult).toEqual(mockResult)

    useAppStore.getState().setEmotionResult(null)
    expect(useAppStore.getState().emotionResult).toBeNull()
  })

  it('setBreathingActive toggles breathing', () => {
    useAppStore.getState().setBreathingActive(true)
    expect(useAppStore.getState().breathingActive).toBe(true)
  })

  it('setBreathingPhase updates phase', () => {
    useAppStore.getState().setBreathingPhase('hold')
    expect(useAppStore.getState().breathingPhase).toBe('hold')
  })

  it('setLieInput updates lieInput', () => {
    useAppStore.getState().setLieInput('測試文字')
    expect(useAppStore.getState().lieInput).toBe('測試文字')
  })

  it('setLieResult sets and clears result', () => {
    const mockResult = {
      credibility_score: 80,
      risk_level: 'low' as const,
      risk_level_zh: '低風險',
      sentences: [],
      features: [],
      summary: '可信',
    }
    useAppStore.getState().setLieResult(mockResult)
    expect(useAppStore.getState().lieResult).toEqual(mockResult)

    useAppStore.getState().setLieResult(null)
    expect(useAppStore.getState().lieResult).toBeNull()
  })
})
