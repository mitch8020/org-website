import { describe, expect, it } from 'vitest'
import {
  createWorkingPageState,
  getWorkbenchError,
  hasUnsavedWebsiteChanges,
} from './workbench-state'
import type { AdminWebsitePage } from '#/lib/content-types'

function pageFixture(): AdminWebsitePage {
  const publishedContent = {
    kind: 'reference' as const,
    id: 'community' as const,
    title: 'Community',
    subtitle: 'Published subtitle',
    blocks: [],
  }
  return {
    pageId: 'community',
    published: {
      revision: 2,
      content: publishedContent,
      publishedAt: '2026-07-20T00:00:00.000Z',
      publishedBy: 'auth0|publisher',
    },
    draft: {
      revision: 1,
      basedOnPublishedRevision: 2,
      content: { ...publishedContent, subtitle: 'Draft subtitle' },
      updatedAt: '2026-07-21T00:00:00.000Z',
      updatedBy: 'auth0|editor',
    },
    history: [],
  }
}

describe('website workbench state', () => {
  it('starts from a cloned draft and records its clean snapshot', () => {
    const page = pageFixture()
    const state = createWorkingPageState(page)

    expect(state.working).toEqual(page.draft?.content)
    expect(state.working).not.toBe(page.draft?.content)
    expect(hasUnsavedWebsiteChanges(state.working, state.savedSnapshot)).toBe(
      false,
    )
  })

  it('detects local edits without mutating the loaded page', () => {
    const page = pageFixture()
    const state = createWorkingPageState(page)
    const edited = { ...state.working, title: 'Edited community' }

    expect(hasUnsavedWebsiteChanges(edited, state.savedSnapshot)).toBe(true)
    expect(page.draft?.content.title).toBe('Community')
  })

  it('uses useful error messages with a safe fallback', () => {
    expect(getWorkbenchError(new Error('Session expired'), 'Fallback')).toBe(
      'Session expired',
    )
    expect(getWorkbenchError('unknown', 'Fallback')).toBe('Fallback')
  })
})
