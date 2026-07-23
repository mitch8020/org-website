// @vitest-environment jsdom

import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WebsiteContentForm } from './WebsiteContentForm'
import type {
  ReferencePageContent,
  WebsitePageContent,
} from '#/lib/content-types'

const initial: ReferencePageContent = {
  kind: 'reference',
  id: 'community',
  title: 'Community',
  subtitle: 'Gatherings',
  blocks: [
    {
      id: 'community-block-1',
      kind: 'outline',
      marker: 'A.',
      depth: 1,
      text: 'Original row',
    },
  ],
}

function Harness() {
  const [content, setContent] = useState<WebsitePageContent>(initial)
  return (
    <>
      <WebsiteContentForm content={content} onChange={setContent} />
      <output data-testid="content">{JSON.stringify(content)}</output>
    </>
  )
}

describe('WebsiteContentForm', () => {
  it('edits and changes outline depth without exposing code', () => {
    render(<Harness />)

    fireEvent.change(screen.getByLabelText('Row 001'), {
      target: { value: 'Updated row' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Indent row 1' }))

    const content = JSON.parse(screen.getByTestId('content').textContent || '')
    expect(content.blocks[0]).toMatchObject({
      text: 'Updated row',
      depth: 2,
    })
  })
})
