import { Router } from 'express'
import authRoutes from './auth.routes'
import postRoutes from './post.routes'
import categoryRoutes from './category.routes'
import commentRoutes from './comment.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/posts', postRoutes)
router.use('/categories', categoryRoutes)
router.use('/comments', commentRoutes)

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() })
})

export default router
