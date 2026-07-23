import { afterEach, describe, expect, it, vi } from 'vitest'
import { getDefaultWebsiteContent } from './content-defaults'
import { loadPublishedPage, saveAdminDraft } from './content-api'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('website content API fallbacks', () => {
  it('uses bundled content when a public content request is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    const page = await loadPublishedPage('community')

    expect(page.revision).toBe(1)
    expect(page.content).toEqual(getDefaultWebsiteContent('community'))
  })

  it('never converts an admin save failure into a successful fallback', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    await expect(
      saveAdminDraft(
        'community',
        'access-token',
        null,
        getDefaultWebsiteContent('community'),
      ),
    ).rejects.toThrow('offline')
  })
})
