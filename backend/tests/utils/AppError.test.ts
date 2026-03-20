import { describe, it, expect } from 'vitest'
import { AppError } from '../../src/utils/AppError'

describe('AppError', () => {
  it('sets code, message, and statusCode correctly', () => {
    const err = new AppError('NOT_FOUND', '找不到資源', 404)
    expect(err.code).toBe('NOT_FOUND')
    expect(err.message).toBe('找不到資源')
    expect(err.statusCode).toBe(404)
  })

  it('defaults statusCode to 500', () => {
    const err = new AppError('INTERNAL', '內部錯誤')
    expect(err.statusCode).toBe(500)
  })

  it('is an instance of Error', () => {
    const err = new AppError('TEST', 'test')
    expect(err).toBeInstanceOf(Error)
  })

  it('has name set to AppError', () => {
    const err = new AppError('TEST', 'test')
    expect(err.name).toBe('AppError')
  })
})
