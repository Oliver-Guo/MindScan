import { Router } from 'express'
import analyzeRoutes from './analyze.routes'

const router = Router()

router.use('/analyze', analyzeRoutes)

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [System]
 *     summary: 健康檢查
 *     description: 確認 API 服務正常運作
 *     responses:
 *       200:
 *         description: 服務正常
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: MindScan API is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: '2026-03-20T08:00:00.000Z'
 */
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'MindScan API is running', timestamp: new Date().toISOString() })
})

export default router
