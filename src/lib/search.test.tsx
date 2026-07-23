import { describe, expect, it } from 'vitest'
import { getDefaultWebsiteContent } from './content-defaults'
import { search } from './search'

describe('published content search', () => {
  it('indexes content supplied by the publishing API', () => {
    const community = getDefaultWebsiteContent('community')
    if (community.kind !== 'reference') throw new Error('Expected reference')
    community.blocks.push({
      id: 'community-block-published',
      kind: 'paragraph',
      text: 'A newly published heliotrope gathering.',
    })

    const results = search('heliotrope', [community])

    expect(results[0]).toMatchObject({
      pageId: 'community',
      href: '/community',
    })
    expect(results[0].snippet).toContain('heliotrope')
  })

  it('does not find text that is absent from the supplied live pages', () => {
    const community = getDefaultWebsiteContent('community')

    expect(search('unpublished-only-phrase', [community])).toEqual([])
  })
})
