import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import './config/env' // 驗證環境變數
import { env } from './config/env'
import router from './routes'
import { errorHandler } from './middlewares/error.middleware'
import { setupSwagger } from './config/swagger'

const app = express()

// Middleware
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// Swagger
setupSwagger(app)

// Routes
app.use('/api/v1', router)

// Error handler（必須放在最後）
app.use(errorHandler)

const PORT = env.PORT

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📚 API docs: http://localhost:${PORT}/api/docs`)
  console.log(`🌍 Environment: ${env.NODE_ENV}`)
})

export default app
