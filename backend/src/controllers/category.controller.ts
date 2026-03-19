import { Request, Response, NextFunction } from 'express'
import { categoryService } from '../services/category.service'
import { sendSuccess } from '../utils/response'

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await categoryService.getAllCategories()
    sendSuccess(res, categories)
  } catch (error) {
    next(error)
  }
}

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await categoryService.createCategory(req.body)
    sendSuccess(res, category, '分類建立成功', 201)
  } catch (error) {
    next(error)
  }
}

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await categoryService.updateCategory(
      Number(req.params.id),
      req.body
    )
    sendSuccess(res, category, '分類更新成功')
  } catch (error) {
    next(error)
  }
}

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await categoryService.deleteCategory(Number(req.params.id))
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
