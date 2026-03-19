import { Request, Response, NextFunction } from 'express'
import { commentService } from '../services/comment.service'
import { sendSuccess, sendPaginated } from '../utils/response'

export const getCommentsByPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comments = await commentService.getCommentsByPostId(
      Number(req.params.postId)
    )
    sendSuccess(res, comments)
  } catch (error) {
    next(error)
  }
}

export const getAllComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20

    const { comments, total } = await commentService.getAllComments({ page, limit })
    sendPaginated(res, comments, { page, limit, total })
  } catch (error) {
    next(error)
  }
}

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comment = await commentService.createComment(
      Number(req.params.postId),
      req.body,
      req.user!.id
    )
    sendSuccess(res, comment, '留言成功', 201)
  } catch (error) {
    next(error)
  }
}

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await commentService.deleteComment(Number(req.params.id))
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
