export interface EmotionTip {
  icon: string
  title: string
  detail: string
}

export interface EmotionResult {
  emotion_type: string
  intensity: number
  intensity_desc: string
  tips: EmotionTip[]
  letter: string
}

export interface LieSentence {
  text: string
  risk: 'safe' | 'warning' | 'danger'
  reason: string
}

export interface LieFeature {
  type: string
  example: string
}

export interface LieResult {
  credibility_score: number
  risk_level: 'low' | 'medium' | 'high'
  risk_level_zh: string
  sentences: LieSentence[]
  features: LieFeature[]
  summary: string
}
