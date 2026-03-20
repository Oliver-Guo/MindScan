import { describe, it, expect, vi } from 'vitest'
import { validate } from '../../src/middlewares/validate.middleware'
import { emotionInputSchema } from '../../src/schemas/analyze.schema'
import { ZodError } from 'zod'
import type { Request, Response, NextFunction } from 'express'

describe('validate middleware', () => {
  const middleware = validate(emotionInputSchema)

  it('calls next() and parses body for valid input', () => {
    const req = { body: { text: '測試' } } as Request
    const res = {} as Response
    const next = vi.fn() as NextFunction

    middleware(req, res, next)

    expect(next).toHaveBeenCalledWith()
    expect(req.body).toEqual({ text: '測試' })
  })

  it('calls next(error) for invalid input', () => {
    const req = { body: { text: '' } } as Request
    const res = {} as Response
    const next = vi.fn() as NextFunction

    middleware(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(ZodError))
  })
})
