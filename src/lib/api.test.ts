import { describe, expect, it } from 'vitest'
import { humanStatus, money } from './api'

describe('shop API formatting', () => {
  it('formats cents as U.S. currency', () => {
    expect(money(1500)).toBe('$15.00')
  })

  it('turns order states into readable labels', () => {
    expect(humanStatus('donation_confirmed')).toBe('donation confirmed')
  })
})
