import path from 'path'
import { Express } from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MindScan AI API',
      version: '1.0.0',
      description: 'MindScan AI — 情緒急救包 & 謊言偵測器 API 文件',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'Analyze', description: 'AI 分析端點' },
      { name: 'System', description: '系統端點' },
    ],
    components: {
      schemas: {
        AnalyzeInput: {
          type: 'object',
          required: ['text'],
          properties: {
            text: {
              type: 'string',
              minLength: 1,
              maxLength: 2000,
              description: '待分析文字（1–2000 字元）',
              example: '最近工作壓力很大，睡眠品質很差，感覺很迷茫',
            },
          },
        },
        EmotionTip: {
          type: 'object',
          properties: {
            icon: { type: 'string', example: '🧘' },
            title: { type: 'string', example: '深呼吸練習' },
            detail: { type: 'string', example: '嘗試 4-7-8 呼吸法，有助於放鬆' },
          },
        },
        EmotionResult: {
          type: 'object',
          properties: {
            emotion_type: {
              type: 'string',
              description: '主要情緒類型（2–4 字）',
              example: '焦慮不安',
            },
            intensity: {
              type: 'integer',
              minimum: 0,
              maximum: 100,
              description: '情緒強度（0–100）',
              example: 75,
            },
            intensity_desc: {
              type: 'string',
              description: '情緒強度描述',
              example: '中高度焦慮，需要適當紓壓',
            },
            tips: {
              type: 'array',
              description: '紓壓建議（3 條）',
              items: { $ref: '#/components/schemas/EmotionTip' },
            },
            letter: {
              type: 'string',
              description: '給使用者的鼓勵信（100–150 字）',
              example: '親愛的你，我知道最近的壓力讓你喘不過氣...',
            },
          },
        },
        LieSentence: {
          type: 'object',
          properties: {
            text: { type: 'string', description: '原始句子', example: '我絕對沒有說過那些話' },
            risk: {
              type: 'string',
              enum: ['safe', 'warning', 'danger'],
              description: '風險等級',
              example: 'danger',
            },
            reason: { type: 'string', description: '風險原因', example: '絕對性語氣常見於防衛性陳述' },
          },
        },
        LieFeature: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['矛盾陳述', '模糊表達', '迴避回應', '情緒誇大', '資訊缺漏'],
              example: '矛盾陳述',
            },
            example: { type: 'string', description: '具體例子', example: '前後說法不一致' },
          },
        },
        LieResult: {
          type: 'object',
          properties: {
            credibility_score: {
              type: 'integer',
              minimum: 0,
              maximum: 100,
              description: '可信度分數（0–100，越高越可信）',
              example: 35,
            },
            risk_level: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: '風險等級',
              example: 'high',
            },
            risk_level_zh: {
              type: 'string',
              description: '風險等級（中文）',
              example: '高風險',
            },
            sentences: {
              type: 'array',
              description: '逐句分析結果',
              items: { $ref: '#/components/schemas/LieSentence' },
            },
            features: {
              type: 'array',
              description: '偵測到的語言特徵',
              items: { $ref: '#/components/schemas/LieFeature' },
            },
            summary: {
              type: 'string',
              description: '分析總結（2–3 句）',
              example: '文字中出現多處絕對性語氣與模糊表達，可信度偏低。',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'string',
              description: '錯誤代碼',
              example: 'VALIDATION_ERROR',
            },
            message: {
              type: 'string',
              description: '錯誤訊息',
              example: '請輸入心情描述',
            },
          },
        },
      },
    },
  },
  apis: [
    path.resolve(__dirname, '../routes/*.ts'),
    path.resolve(__dirname, '../controllers/*.ts'),
  ],
}

export const setupSwagger = (app: Express) => {
  const specs = swaggerJsdoc(options)
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs))
  console.log('📚 Swagger docs available at /api/docs')
}
