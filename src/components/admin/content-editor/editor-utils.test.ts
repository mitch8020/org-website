import { describe, expect, it, vi } from 'vitest'
import { moveItem, newEditorId, toRoman } from './editor-utils'

describe('content editor utilities', () => {
  it('creates normalized IDs from the supplied prefix', () => {
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(
      'A0B1C2D3-E4F5-6789-ABCD-EF0123456789',
    )

    expect(newEditorId('Node')).toBe(
      'node-a0b1c2d3-e4f5-6789-abcd-ef0123456789',
    )
  })

  it('moves an item without mutating the source', () => {
    const source = ['a', 'b', 'c']

    expect(moveItem(source, 0, 2)).toEqual(['b', 'c', 'a'])
    expect(source).toEqual(['a', 'b', 'c'])
  })

  it('ignores destinations outside the list', () => {
    const source = ['a', 'b']

    expect(moveItem(source, 0, -1)).toBe(source)
    expect(moveItem(source, 0, source.length)).toBe(source)
  })

  it.each([
    [0, ''],
    [1, 'I'],
    [4, 'IV'],
    [5, 'V'],
    [9, 'IX'],
    [10, 'X'],
    [38, 'XXXVIII'],
  ])('converts %i to Roman numerals', (value, expected) => {
    expect(toRoman(value)).toBe(expected)
  })
})
