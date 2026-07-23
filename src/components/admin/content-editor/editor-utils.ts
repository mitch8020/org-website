export const fieldClass =
  'mt-1.5 w-full border border-[#ece2c4]/20 bg-[#080a0e] px-3 py-2.5 text-sm leading-6 text-[#ece2c4] outline-none focus:border-[#d4a24a]'

export const labelClass =
  'font-mono text-[9px] uppercase tracking-[0.2em] text-[#9f9676]'

export const iconButton =
  'grid h-8 w-8 place-items-center border border-[#ece2c4]/16 text-[#9f9676] hover:border-[#d4a24a] hover:text-[#d4a24a] disabled:cursor-not-allowed disabled:opacity-25'

export function newEditorId(prefix: string) {
  const value = globalThis.crypto.randomUUID()
  return `${prefix}-${value}`.toLowerCase()
}

export function moveItem<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) return items
  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export function toRoman(value: number) {
  const values: Array<[number, string]> = [
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ]
  let remaining = value
  let roman = ''
  for (const [number, glyph] of values) {
    while (remaining >= number) {
      roman += glyph
      remaining -= number
    }
  }
  return roman
}
