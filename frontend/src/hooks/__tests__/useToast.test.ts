import { describe, it, expect } from 'vitest'
import { reducer } from '../useToast'

const createToast = (id: string) => ({
  id,
  open: true,
  title: `Toast ${id}`,
  onOpenChange: () => {},
})

describe('toast reducer', () => {
  it('ADD_TOAST adds toast to front of list', () => {
    const state = { toasts: [createToast('1')] }
    const newToast = createToast('2')

    const result = reducer(state, { type: 'ADD_TOAST', toast: newToast })

    expect(result.toasts).toHaveLength(2)
    expect(result.toasts[0].id).toBe('2')
  })

  it('ADD_TOAST respects TOAST_LIMIT of 3', () => {
    const state = { toasts: [createToast('1'), createToast('2'), createToast('3')] }
    const newToast = createToast('4')

    const result = reducer(state, { type: 'ADD_TOAST', toast: newToast })

    expect(result.toasts).toHaveLength(3)
    expect(result.toasts[0].id).toBe('4')
  })

  it('UPDATE_TOAST updates matching toast', () => {
    const state = { toasts: [createToast('1'), createToast('2')] }

    const result = reducer(state, {
      type: 'UPDATE_TOAST',
      toast: { id: '1', title: 'Updated' },
    })

    expect(result.toasts[0].title).toBe('Updated')
    expect(result.toasts[1].title).toBe('Toast 2')
  })

  it('DISMISS_TOAST with id sets open to false', () => {
    const state = { toasts: [createToast('1'), createToast('2')] }

    const result = reducer(state, { type: 'DISMISS_TOAST', toastId: '1' })

    expect(result.toasts[0].open).toBe(false)
    expect(result.toasts[1].open).toBe(true)
  })

  it('DISMISS_TOAST without id sets all to closed', () => {
    const state = { toasts: [createToast('1'), createToast('2')] }

    const result = reducer(state, { type: 'DISMISS_TOAST' })

    expect(result.toasts.every(t => t.open === false)).toBe(true)
  })

  it('REMOVE_TOAST with id removes specific toast', () => {
    const state = { toasts: [createToast('1'), createToast('2')] }

    const result = reducer(state, { type: 'REMOVE_TOAST', toastId: '1' })

    expect(result.toasts).toHaveLength(1)
    expect(result.toasts[0].id).toBe('2')
  })

  it('REMOVE_TOAST without id clears all toasts', () => {
    const state = { toasts: [createToast('1'), createToast('2')] }

    const result = reducer(state, { type: 'REMOVE_TOAST' })

    expect(result.toasts).toHaveLength(0)
  })
})
