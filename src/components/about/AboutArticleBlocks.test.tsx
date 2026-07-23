// @vitest-environment jsdom

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AboutArticleBlock, AboutContactBlock } from './AboutArticleBlocks'

describe('About article blocks', () => {
  it('renders nested outline text and internal cross-reference links', () => {
    render(
      <AboutArticleBlock
        index={0}
        article={{
          id: 'mission',
          roman: 'I',
          eyebrow: 'Our Mission',
          lead: 'See the Research section and honor The Universal Creator.',
          body: [
            {
              id: 'mission-node',
              marker: 'A.',
              text: 'Build shared knowledge.',
              children: [
                {
                  id: 'mission-child',
                  marker: '1.',
                  text: 'Publish the research.',
                  children: [],
                },
              ],
            },
          ],
        }}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Our Mission' })).toBeDefined()
    expect(
      screen.getByRole('link', { name: 'Research' }).getAttribute('href'),
    ).toBe('/research')
    expect(screen.getByText('Publish the research.')).toBeDefined()
  })

  it('renders linked and unlinked contact channels', () => {
    render(
      <AboutContactBlock
        contact={{
          roman: 'IX',
          eyebrow: 'Contact Us',
          intro: 'Reach a member.',
          channels: [
            {
              id: 'signal',
              label: 'Signal',
              handle: '@org',
              href: 'https://example.com',
            },
            {
              id: 'mail',
              label: 'Mail',
              handle: 'PO Box 1',
              href: null,
            },
          ],
        }}
      />,
    )

    expect(
      screen.getByRole('link', { name: /Signal @org/ }).getAttribute('href'),
    ).toBe('https://example.com')
    expect(screen.getByText('PO Box 1')).toBeDefined()
  })
})
