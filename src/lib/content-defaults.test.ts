import { describe, expect, it } from 'vitest'
import {
  DEFAULT_WEBSITE_PAGES,
  getDefaultWebsiteContent,
} from './content-defaults'

describe('default website content', () => {
  it('contains all eight managed pages with stable row IDs', () => {
    expect(Object.keys(DEFAULT_WEBSITE_PAGES)).toHaveLength(8)
    const community = DEFAULT_WEBSITE_PAGES.community
    expect(community.kind).toBe('reference')
    if (community.kind !== 'reference') throw new Error('Expected reference')
    expect(community.blocks[0]).toMatchObject({
      id: 'community-block-0001',
      kind: 'lead',
    })
    expect(new Set(community.blocks.map((block) => block.id)).size).toBe(
      community.blocks.length,
    )
  })

  it('returns a clone so editor changes cannot mutate the public fallback', () => {
    const copy = getDefaultWebsiteContent('about')
    copy.title = 'Changed locally'

    expect(DEFAULT_WEBSITE_PAGES.about.title).toBe('About Us')
  })
})
