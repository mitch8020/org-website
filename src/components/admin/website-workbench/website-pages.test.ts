import { describe, expect, it } from 'vitest'
import { getWebsitePageHref, WEBSITE_PAGE_LEDGER } from './website-pages'

describe('website page ledger', () => {
  it('maps every managed page to a unique public URL', () => {
    expect(WEBSITE_PAGE_LEDGER).toHaveLength(8)
    expect(new Set(WEBSITE_PAGE_LEDGER.map((entry) => entry.href)).size).toBe(8)
    for (const entry of WEBSITE_PAGE_LEDGER) {
      expect(getWebsitePageHref(entry.id)).toBe(entry.href)
    }
  })
})
