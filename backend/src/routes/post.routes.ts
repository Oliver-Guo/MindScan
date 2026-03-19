import { Router } from 'express'
import {
  getPublishedPosts,
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/post.controller'
import {
  createComment,
  getCommentsByPost,
} from '../controllers/comment.controller'
import { validate } from '../middlewares/validate.middleware'
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware'
import { createPostSchema, updatePostSchema } from '../schemas/post.schema'
import { createCommentSchema } from '../schemas/comment.schema'

const router = Router()

// 公開路由
router.get('/', getPublishedPosts)
router.get('/:slug', getPostBySlug)

// 文章留言（需登入）
router.get('/:postId/comments', getCommentsByPost)
router.post(
  '/:postId/comments',
  ...requireAuth,
  validate(createCommentSchema),
  createComment
)

// 管理員路由
router.get('/admin/all', ...requireAdmin, getAllPosts)
router.post('/', ...requireAdmin, validate(createPostSchema), createPost)
router.patch('/:id', ...requireAdmin, validate(updatePostSchema), updatePost)
router.delete('/:id', ...requireAdmin, deletePost)

export default router
