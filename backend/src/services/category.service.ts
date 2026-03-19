import { categoryRepository } from '../repositories/category.repository'
import { AppError } from '../utils/AppError'
import { CreateCategoryDto, UpdateCategoryDto } from '../schemas/category.schema'

export const categoryService = {
  getAllCategories: () => categoryRepository.findAll(),

  createCategory: async (dto: CreateCategoryDto) => {
    const existingName = await categoryRepository.findByName(dto.name)
    if (existingName) {
      throw new AppError('CATEGORY_NAME_EXISTS', '此分類名稱已存在', 400)
    }

    const existingSlug = await categoryRepository.findBySlug(dto.slug)
    if (existingSlug) {
      throw new AppError('CATEGORY_SLUG_EXISTS', '此 Slug 已存在', 400)
    }

    return categoryRepository.create(dto)
  },

  updateCategory: async (id: number, dto: UpdateCategoryDto) => {
    const category = await categoryRepository.findById(id)
    if (!category) {
      throw new AppError('CATEGORY_NOT_FOUND', '分類不存在', 404)
    }

    if (dto.name && dto.name !== category.name) {
      const existing = await categoryRepository.findByName(dto.name)
      if (existing) {
        throw new AppError('CATEGORY_NAME_EXISTS', '此分類名稱已存在', 400)
      }
    }

    if (dto.slug && dto.slug !== category.slug) {
      const existing = await categoryRepository.findBySlug(dto.slug)
      if (existing) {
        throw new AppError('CATEGORY_SLUG_EXISTS', '此 Slug 已存在', 400)
      }
    }

    return categoryRepository.update(id, dto)
  },

  deleteCategory: async (id: number) => {
    const category = await categoryRepository.findById(id)
    if (!category) {
      throw new AppError('CATEGORY_NOT_FOUND', '分類不存在', 404)
    }
    await categoryRepository.delete(id)
  },
}
