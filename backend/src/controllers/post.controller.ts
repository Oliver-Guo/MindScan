import { Request, Response, NextFunction } from 'express'
import { postService } from '../services/post.service'
import { sendSuccess, sendPaginated } from '../utils/response'

export const getPublishedPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined

    const { posts, total } = await postService.getPublishedPosts({ page, limit, categoryId })
    sendPaginated(res, posts, { page, limit, total })
  } catch (error) {
    next(error)
  }
}

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    const { posts, total } = await postService.getAllPosts({ page, limit })
    sendPaginated(res, posts, { page, limit, total })
  } catch (error) {
    next(error)
  }
}

export const getPostBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await postService.getPostBySlug(req.params.slug)
    sendSuccess(res, post)
  } catch (error) {
    next(error)
  }
}

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await postService.createPost(req.body, req.user!.id)
    sendSuccess(res, post, '文章建立成功', 201)
  } catch (error) {
    next(error)
  }
}

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await postService.updatePost(Number(req.params.id), req.body)
    sendSuccess(res, post, '文章更新成功')
  } catch (error) {
    next(error)
  }
}

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await postService.deletePost(Number(req.params.id))
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
