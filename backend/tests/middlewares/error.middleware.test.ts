import { describe, it, expect, vi } from 'vitest'
import { errorHandler } from '../../src/middlewares/error.middleware'
import { AppError } from '../../src/utils/AppError'
import { ZodError, ZodIssue } from 'zod'
import type { Request, Response, NextFunction } from 'express'

function createMocks() {
  const json = vi.fn()
  const status = vi.fn().mockReturnValue({ json })
  const req = {} as Request
  const res = { status, json } as unknown as Response
  const next = vi.fn() as NextFunction
  return { req, res, next, status, json }
}

describe('errorHandler', () => {
  it('handles AppError with correct status and body', () => {
    const { req, res, next, status, json } = createMocks()
    const err = new AppError('NOT_FOUND', '找不到', 404)

    errorHandler(err, req, res, next)

    expect(status).toHaveBeenCalledWith(404)
    expect(json).toHaveBeenCalledWith({
      success: false,
      error: 'NOT_FOUND',
      message: '找不到',
    })
  })

  it('handles ZodError with status 400', () => {
    const { req, res, next, status, json } = createMocks()
    const issue: ZodIssue = {
      code: 'too_small',
      minimum: 1,
      type: 'string',
      inclusive: true,
      exact: false,
      message: '請輸入心情描述',
      path: ['text'],
    }
    const err = new ZodError([issue])

    errorHandler(err, req, res, next)

    expect(status).toHaveBeenCalledWith(400)
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: 'VALIDATION_ERROR',
        message: '請輸入心情描述',
      })
    )
  })

  it('handles generic Error with status 500', () => {
    const { req, res, next, status, json } = createMocks()
    const err = new Error('unexpected')

    errorHandler(err, req, res, next)

    expect(status).toHaveBeenCalledWith(500)
    expect(json).toHaveBeenCalledWith({
      success: false,
      error: 'INTERNAL_ERROR',
      message: '伺服器發生錯誤',
    })
  })
})
