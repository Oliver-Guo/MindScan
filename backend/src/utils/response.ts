import { Response } from 'express'

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = '操作成功',
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  })
}

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  pagination: {
    page: number
    limit: number
    total: number
  }
) => {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      ...pagination,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  })
}
