import { Router } from 'express'
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller'
import { validate } from '../middlewares/validate.middleware'
import { requireAdmin } from '../middlewares/auth.middleware'
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema'

const router = Router()

router.get('/', getAllCategories)
router.post('/', ...requireAdmin, validate(createCategorySchema), createCategory)
router.patch('/:id', ...requireAdmin, validate(updateCategorySchema), updateCategory)
router.delete('/:id', ...requireAdmin, deleteCategory)

export default router
