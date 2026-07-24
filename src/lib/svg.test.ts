import { describe, expect, it } from 'vitest'
import { svgCoord } from './svg'

describe('svgCoord', () => {
  it('normalizes geometry to two decimal places', () => {
    expect(svgCoord(1 / 3)).toBe('0.33')
    expect(svgCoord(2)).toBe('2.00')
  })
})
