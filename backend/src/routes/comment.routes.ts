import { Router } from 'express'
import { getAllComments, deleteComment } from '../controllers/comment.controller'
import { requireAdmin } from '../middlewares/auth.middleware'

const router = Router()

// 管理員取得所有留言
router.get('/', ...requireAdmin, getAllComments)
// 管理員刪除留言
router.delete('/:id', ...requireAdmin, deleteComment)

export default router
