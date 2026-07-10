import type { ReactNode } from 'react'
import type { ReferencePageId } from '#/lib/reference-pages'
import { REFERENCE_PAGES } from '#/lib/reference-pages'
import { SECTIONS } from '#/lib/sections'
import type { Article, OutlineNode } from '#/lib/about-content'
import { ARTICLES } from '#/lib/about-content'

export type SearchPageId = ReferencePageId | 'about'

export interface SearchResult {
  pageId: SearchPageId
  title: string
  href: string
  snippet: string
  score: number
  lineIndex?: number // for reference pages, enables deep highlight/scroll
}

const PAGE_TITLES: Record<SearchPageId, string> = {
  community: 'Community',
  beliefs: 'Beliefs',
  infrastructure: 'Infrastructure',
  research: 'Research',
  legal: 'Legal',
  future: 'Future Ideas',
  donations: 'Gifts & Contributions',
  about: 'About Us',
}

const PAGE_HREFS: Record<SearchPageId, string> = {
  community: '/community',
  beliefs: '/beliefs',
  infrastructure: '/infrastructure',
  research: '/research',
  legal: '/legal',
  future: '/future-ideas',
  donations: '/gifts-contributions',
  about: '/about',
}

function escapeReg(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function withHighlight(text: string, term?: string): ReactNode[] {
  if (!term || !term.trim()) return [text]
  const q = term.trim()
  const re = new RegExp(`(${escapeReg(q)})`, 'gi')
  const parts = text.split(re)
  return parts.map((part, i) =>
    re.test(part) ? (
      <mark
        key={`h-${i}`}
        className="rounded-[1px] bg-[#d4a24a] px-0.5 text-[#0b0d12] font-medium"
      >
        {part}
      </mark>
    ) : (
      part
    )
  )
}

function makeSnippet(text: string, term: string, max = 118): string {
  const lower = text.toLowerCase()
  const idx = lower.indexOf(term.toLowerCase())
  if (idx === -1) {
    return text.length > max ? text.slice(0, max - 1) + '…' : text
  }
  const start = Math.max(0, idx - 42)
  const end = Math.min(text.length, idx + term.length + 52)
  let snip = text.slice(start, end)
  if (start > 0) snip = '…' + snip
  if (end < text.length) snip = snip + '…'
  return snip.length > max ? snip.slice(0, max - 1) + '…' : snip
}

function scoreMatch(text: string, q: string, base: number, positionBoost = 0): number {
  if (!text.toLowerCase().includes(q)) return 0
  let s = base
  // slight boost for earlier occurrence or title-like
  const pos = text.toLowerCase().indexOf(q)
  if (pos < 20) s += 12 + positionBoost
  // whole word-ish bonus
  const wordRe = new RegExp(`\\b${escapeReg(q)}\\b`, 'i')
  if (wordRe.test(text)) s += 8
  return s
}

function flattenAboutForSearch(): Array<{ text: string; articleId?: string }> {
  const out: Array<{ text: string; articleId?: string }> = []
  ARTICLES.forEach((a: Article) => {
    out.push({ text: a.lead, articleId: a.id })
    const walk = (nodes: ReadonlyArray<OutlineNode>) => {
      nodes.forEach((n) => {
        out.push({ text: n.t, articleId: a.id })
        if (n.c && n.c.length) walk(n.c)
      })
    }
    if (a.body.length) walk(a.body)
  })
  return out
}

export function search(query: string): SearchResult[] {
  const q = (query || '').trim()
  if (!q || q.length < 1) return []

  const ql = q.toLowerCase()
  const results: SearchResult[] = []

  // Reference pages (primary)
  REFERENCE_PAGES.forEach((page) => {
    let pageScore = 0
    let bestLineIdx: number | undefined
    let bestSnippet = ''

    // Title
    const tScore = scoreMatch(page.title, ql, 110)
    if (tScore) {
      pageScore += tScore
      bestSnippet = page.title
    }

    // Subtitle
    const subScore = scoreMatch(page.subtitle, ql, 45)
    pageScore += subScore
    if (subScore && !bestSnippet) bestSnippet = page.subtitle

    // Lines
    page.lines.forEach((line, idx) => {
      const lineScore = scoreMatch(line, ql, 28, Math.max(0, 12 - Math.floor(idx / 3)))
      if (lineScore > 0) {
        pageScore += lineScore
        if (bestLineIdx === undefined) {
          bestLineIdx = idx
          bestSnippet = makeSnippet(line, q)
        }
      }
    })

    if (pageScore > 0) {
      const title = PAGE_TITLES[page.id]
      results.push({
        pageId: page.id,
        title,
        href: PAGE_HREFS[page.id],
        snippet: bestSnippet || page.subtitle,
        score: pageScore,
        lineIndex: bestLineIdx,
      })
    }
  })

  // About (synthesized)
  let aboutScore = 0
  let aboutSnippet = ''
  const aboutBlocks = flattenAboutForSearch()
  const titleScore = scoreMatch('About Us', ql, 95)
  if (titleScore) {
    aboutScore += titleScore
    aboutSnippet = 'About Us — founding document'
  }
  aboutBlocks.forEach((b) => {
    const s = scoreMatch(b.text, ql, 22)
    if (s > 0) {
      aboutScore += s
      if (!aboutSnippet) aboutSnippet = makeSnippet(b.text, q)
    }
  })
  if (aboutScore > 0) {
    results.push({
      pageId: 'about',
      title: 'About Us',
      href: '/about',
      snippet: aboutSnippet || 'Founding document, mission, and contact.',
      score: aboutScore,
    })
  }

  // Sort: higher score first, stable
  results.sort((a, b) => b.score - a.score)

  // Light cap for UI density (still show strong matches)
  return results.slice(0, 14)
}

export const PAGE_META: Record<
  SearchPageId,
  { short: string; accent: string }
> = {
  community: { short: 'COMMUNITY', accent: '#5800FF' },
  beliefs: { short: 'BELIEFS', accent: '#5800FF' },
  infrastructure: { short: 'INFRASTRUCTURE', accent: '#5800FF' },
  research: { short: 'RESEARCH', accent: '##5800FF' },
  legal: { short: 'LEGAL', accent: '#5800FF' },
  future: { short: 'FUTURE IDEAS', accent: '#5800FF' },
  donations: { short: 'GIFTS & CONTRIBUTIONS', accent: '#5800FF' },
  about: { short: 'ABOUT US', accent: '#5800FF' },
}