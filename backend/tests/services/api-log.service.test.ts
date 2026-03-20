import { describe, it, expect, vi, beforeEach } from 'vitest'
import { prisma } from '../../src/config/prisma'
import { logger } from '../../src/utils/logger'
import { logApiCall } from '../../src/services/api-log.service'

describe('logApiCall', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls prisma.aiApiLog.create with entry data', () => {
    const entry = {
      companyType: 'gemini',
      modelType: 'gemini-2.5-flash',
      status: 200,
      request: { prompt: 'test' },
      response: { result: 'ok' },
    }

    logApiCall(entry)

    expect(prisma.aiApiLog.create).toHaveBeenCalledWith({ data: entry })
  })

  it('logs error via logger when create fails', async () => {
    const error = new Error('DB error')
    vi.mocked(prisma.aiApiLog.create).mockRejectedValueOnce(error)

    logApiCall({
      companyType: 'gemini',
      modelType: 'test',
      status: 500,
      request: {},
      response: null,
    })

    // Wait for the promise chain to resolve
    await vi.waitFor(() => {
      expect(logger.error).toHaveBeenCalled()
    })
  })
})
