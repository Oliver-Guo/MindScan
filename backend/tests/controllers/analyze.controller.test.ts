import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Request, Response, NextFunction } from 'express'

// Mock the service module
vi.mock('../../src/services/analyze.service', () => ({
  analyzeEmotion: vi.fn(),
  analyzeLie: vi.fn(),
}))

import { emotion, lie } from '../../src/controllers/analyze.controller'
import * as analyzeService from '../../src/services/analyze.service'

function createMocks() {
  const json = vi.fn()
  const status = vi.fn().mockReturnValue({ json })
  const req = { body: { text: '測試文字' } } as unknown as Request
  const res = { status, json } as unknown as Response
  const next = vi.fn() as NextFunction
  return { req, res, next, status, json }
}

describe('emotion controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls analyzeEmotion and returns success', async () => {
    const mockResult = { emotion_type: '開心', intensity: 30 }
    vi.mocked(analyzeService.analyzeEmotion).mockResolvedValueOnce(mockResult as any)

    const { req, res, next } = createMocks()
    await emotion(req, res, next)

    expect(analyzeService.analyzeEmotion).toHaveBeenCalledWith('測試文字')
    expect(next).not.toHaveBeenCalled()
  })

  it('passes error to next() on failure', async () => {
    const error = new Error('service error')
    vi.mocked(analyzeService.analyzeEmotion).mockRejectedValueOnce(error)

    const { req, res, next } = createMocks()
    await emotion(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })
})

describe('lie controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls analyzeLie and returns success', async () => {
    const mockResult = { credibility_score: 80, risk_level: 'low' }
    vi.mocked(analyzeService.analyzeLie).mockResolvedValueOnce(mockResult as any)

    const { req, res, next } = createMocks()
    await lie(req, res, next)

    expect(analyzeService.analyzeLie).toHaveBeenCalledWith('測試文字')
    expect(next).not.toHaveBeenCalled()
  })

  it('passes error to next() on failure', async () => {
    const error = new Error('service error')
    vi.mocked(analyzeService.analyzeLie).mockRejectedValueOnce(error)

    const { req, res, next } = createMocks()
    await lie(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })
})
