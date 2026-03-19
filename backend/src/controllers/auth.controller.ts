import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/auth.service'
import { sendSuccess } from '../utils/response'

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.register(req.body)
    sendSuccess(res, result, '註冊成功', 201)
  } catch (error) {
    next(error)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.login(req.body)
    sendSuccess(res, result, '登入成功')
  } catch (error) {
    next(error)
  }
}

export const me = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.me(req.user!.id)
    sendSuccess(res, user)
  } catch (error) {
    next(error)
  }
}
