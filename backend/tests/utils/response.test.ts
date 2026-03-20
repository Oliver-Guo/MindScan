import { describe, it, expect, vi } from 'vitest'
import { sendSuccess, sendPaginated } from '../../src/utils/response'

function createMockRes() {
  const json = vi.fn()
  const status = vi.fn().mockReturnValue({ json })
  return { status, json } as unknown as { status: ReturnType<typeof vi.fn>; json: ReturnType<typeof vi.fn> }
}

describe('sendSuccess', () => {
  it('sends success response with default message and status 200', () => {
    const res = createMockRes()
    sendSuccess(res as any, { id: 1 })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { id: 1 },
      message: '操作成功',
    })
  })

  it('uses custom message and statusCode', () => {
    const res = createMockRes()
    sendSuccess(res as any, null, '建立成功', 201)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: null,
      message: '建立成功',
    })
  })
})

describe('sendPaginated', () => {
  it('sends paginated response with correct totalPages', () => {
    const res = createMockRes()
    sendPaginated(res as any, [1, 2, 3], { page: 1, limit: 10, total: 25 })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [1, 2, 3],
      pagination: { page: 1, limit: 10, total: 25, totalPages: 3 },
    })
  })

  it('handles total of 0', () => {
    const res = createMockRes()
    sendPaginated(res as any, [], { page: 1, limit: 10, total: 0 })
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    })
  })

  it('calculates totalPages correctly for exact division', () => {
    const res = createMockRes()
    sendPaginated(res as any, [], { page: 1, limit: 5, total: 15 })
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        pagination: expect.objectContaining({ totalPages: 3 }),
      })
    )
  })
})
