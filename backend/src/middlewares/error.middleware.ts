import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../utils/AppError'
import { logger } from '../utils/logger'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.code,
      message: err.message,
    })
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: err.errors[0]?.message || '資料驗證失敗',
      details: err.errors,
    })
  }

  logger.error(err)
  return res.status(500).json({
    success: false,
    error: 'INTERNAL_ERROR',
    message: '伺服器發生錯誤',
  })
}
