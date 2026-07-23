// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type {
  AdminWebsitePage,
  ReferencePageContent,
} from '#/lib/content-types'
import { WebsiteEditorPanel } from './WebsiteEditorPanel'

const content: ReferencePageContent = {
  kind: 'reference',
  id: 'community',
  title: 'Community',
  subtitle: 'A shared record.',
  blocks: [{ id: 'body', kind: 'paragraph', text: 'Community body.' }],
}

const page: AdminWebsitePage = {
  pageId: 'community',
  published: {
    revision: 3,
    content,
    publishedAt: '2026-07-23T12:00:00.000Z',
    publishedBy: 'publisher',
  },
  draft: {
    revision: 4,
    basedOnPublishedRevision: 3,
    content,
    updatedAt: '2026-07-23T13:00:00.000Z',
    updatedBy: 'editor',
  },
  history: [],
}

describe('WebsiteEditorPanel', () => {
  it('enables only the actions valid for the current draft state', () => {
    const onPreview = vi.fn()
    const onSave = vi.fn()
    const onPublish = vi.fn()
    const onWorkingChange = vi.fn()

    const view = render(
      <WebsiteEditorPanel
        page={page}
        working={content}
        dirty
        loading={false}
        saving={false}
        canPublish
        onPreview={onPreview}
        onSave={onSave}
        onPublish={onPublish}
        onWorkingChange={onWorkingChange}
      />,
    )

    const preview = screen.getByRole<HTMLButtonElement>('button', {
      name: /preview/i,
    })
    const save = screen.getByRole<HTMLButtonElement>('button', {
      name: /save draft/i,
    })
    const publish = screen.getByRole<HTMLButtonElement>('button', {
      name: /publish/i,
    })

    expect(preview.disabled).toBe(false)
    expect(save.disabled).toBe(false)
    expect(publish.disabled).toBe(true)

    fireEvent.click(preview)
    fireEvent.click(save)
    expect(onPreview).toHaveBeenCalledOnce()
    expect(onSave).toHaveBeenCalledOnce()
    expect(onPublish).not.toHaveBeenCalled()

    view.rerender(
      <WebsiteEditorPanel
        page={page}
        working={content}
        dirty={false}
        loading={false}
        saving={false}
        canPublish
        onPreview={onPreview}
        onSave={onSave}
        onPublish={onPublish}
        onWorkingChange={onWorkingChange}
      />,
    )

    expect(
      screen.getByRole<HTMLButtonElement>('button', {
        name: /save draft/i,
      }).disabled,
    ).toBe(true)
    expect(
      screen.getByRole<HTMLButtonElement>('button', { name: /publish/i })
        .disabled,
    ).toBe(false)

    fireEvent.click(screen.getByRole('button', { name: /publish/i }))
    expect(onPublish).toHaveBeenCalledOnce()
  })
})
