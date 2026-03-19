import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { AppError } from '../utils/AppError'

interface JwtPayload {
  id: number
  email: string
  role: 'ADMIN' | 'USER'
}

// 解析 JWT，若有效則注入 req.user（不強制要求）
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return next()
    }

    const token = authHeader.split(' ')[1]
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload
    req.user = { id: payload.id, email: payload.email, role: payload.role }
    next()
  } catch {
    next()
  }
}

// 必須已登入（USER 或 ADMIN）
export const requireAuth = [
  authenticate,
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('UNAUTHORIZED', '請先登入', 401))
    }
    next()
  },
]

// 必須是 ADMIN
export const requireAdmin = [
  authenticate,
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('UNAUTHORIZED', '請先登入', 401))
    }
    if (req.user.role !== 'ADMIN') {
      return next(new AppError('FORBIDDEN', '無權限執行此操作', 403))
    }
    next()
  },
]
