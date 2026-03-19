import { Router } from 'express'
import analyzeRoutes from './analyze.routes'

const router = Router()

router.use('/analyze', analyzeRoutes)

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'MindScan API is running', timestamp: new Date().toISOString() })
})

export default router
