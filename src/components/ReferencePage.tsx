import type { CSSProperties, ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { SiteNav } from '#/components/SiteNav'
import type { ReferencePageContent } from '#/lib/reference-pages'
import { SECTIONS } from '#/lib/sections'

const ACCENTS: Record<string, string> = {
  community: '#78aea2',
  beliefs: '#e2bd65',
  infrastructure: '#c98b63',
  research: '#8da8dc',
  legal: '#d6d0c2',
  future: '#c99bdd',
  donations: '#9dcf83',
}

function markerDepth(marker: string) {
  if (/^[IVXLCDM]+\.$/.test(marker)) return 0
  if (/^[A-Z]\.$/.test(marker)) return 1
  if (/^\d+\.$/.test(marker)) return 2
  if (/^[a-z]\)$/.test(marker)) return 3
  return 4
}

function splitMarker(line: string) {
  const match = line.match(
    /^((?:[IVXLCDM]+\.|[A-Z]\.|\d+\.|[a-z]\)|\(\d+\)|\([a-z]\)))\s+(.*)$/,
  )
  return match ? { marker: match[1], text: match[2] } : null
}

function renderLinkedText(text: string): ReactNode {
  // Support markdown-style links [display text](https://url) for bold/underlined phrases from source docs
  const mdLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = mdLinkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(...splitBareUrls(text.slice(lastIndex, match.index)))
    }
    const display = match[1]
    let href = match[2]
    nodes.push(
      <a
        key={`md-${match.index}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#f1d78a] underline decoration-[rgba(241,215,138,0.35)] underline-offset-4 transition-colors hover:text-white"
      >
        {display}
      </a>
    )
    lastIndex = mdLinkRegex.lastIndex
  }
  if (lastIndex < text.length) {
    nodes.push(...splitBareUrls(text.slice(lastIndex)))
  }
  return nodes.length > 0 ? nodes : text
}

function splitBareUrls(text: string): ReactNode[] {
  const urlRegex = /((?:https?:\/\/|www\.)[^\s)]+)/g
  const parts = text.split(urlRegex)
  return parts.map((part, index) => {
    if (!part) return null
    if (/^(?:https?:\/\/|www\.)/.test(part)) {
      const href = part.startsWith('www.') ? `https://${part}` : part
      return (
        <a
          key={`url-${index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#f1d78a] underline decoration-[rgba(241,215,138,0.35)] underline-offset-4 transition-colors hover:text-white"
        >
          {part}
        </a>
      )
    }
    return part
  }).filter(Boolean) as ReactNode[]
}

function ReferenceLine({ line, index }: { line: string; index: number }) {
  const parsed = splitMarker(line)
  const isLead = index === 0
  const isHeading =
    !parsed &&
    !isLead &&
    (line.endsWith(':') ||
      /^(Members|How To Join|Member-only|Churches\/|Other Resources|Anonymous Beliefs|Southwest Virginia|Colorado|Austin Texas|Miami Florida|Asia|Los Angeles|San Francisco|New York|Miscellaneous|Sketches)/.test(
        line,
      ))

  if (isLead) {
    return (
      <p className="m-0 border-l-2 border-[var(--accent)] bg-[rgba(236,226,196,0.05)] px-5 py-4 text-[18px] font-light leading-8 text-[#f3ead0]">
        {renderLinkedText(line)}
      </p>
    )
  }

  if (parsed) {
    const depth = markerDepth(parsed.marker)
    const major = depth === 0
    return (
      <div
        className={`grid gap-3 border-l py-3 pr-3 ${
          major
            ? 'mt-4 border-[var(--accent)] bg-[rgba(236,226,196,0.045)]'
            : 'border-[rgba(236,226,196,0.09)]'
        }`}
        style={{
          gridTemplateColumns: '3.1rem minmax(0,1fr)',
          paddingLeft: `${depth * 14 + 14}px`,
        }}
      >
        <span
          className={`pt-[0.15em] text-right font-light tabular-nums ${
            major ? 'text-[16px] text-[var(--accent)]' : 'text-[12px] text-[#a99f7c]'
          }`}
        >
          {parsed.marker}
        </span>
        <p
          className={`m-0 min-w-0 break-words ${
            major
              ? 'text-[18px] leading-8 text-[#f3ead0]'
              : 'text-[15px] leading-7 text-[#d8ceb0]'
          }`}
        >
          {renderLinkedText(parsed.text)}
        </p>
      </div>
    )
  }

  return (
    <p
      className={`m-0 break-words ${
        isHeading
          ? 'mt-8 border-t border-[rgba(236,226,196,0.12)] pt-6 text-[15px] uppercase tracking-[0.22em] text-[var(--accent)]'
          : 'text-[15px] leading-7 text-[#cfc4a5]'
      }`}
    >
      {renderLinkedText(line)}
    </p>
  )
}

export function ReferencePage({ page }: { page: ReferencePageContent }) {
  const section = SECTIONS.find((item) => item.id === page.id)
  const accent = ACCENTS[page.id] ?? '#d4a24a'
  const style = { '--accent': accent } as CSSProperties

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#0b0d12] text-[#ece2c4]"
      style={style}
    >
      <SiteNav />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(70% 55% at 50% 0%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 62%), radial-gradient(60% 80% at 100% 30%, rgba(120,174,162,0.08), transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' seed='8'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.8'/></svg>\")",
        }}
      />

      <main className="relative z-[1] mx-auto max-w-[1120px] px-[clamp(16px,4vw,40px)] pb-24 pt-[clamp(160px,18vh,210px)]">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
          <div>
            <h1 className="mt-5 max-w-[820px] break-words font-thin uppercase leading-[0.98] tracking-[0.04em] text-[#f6efd9] text-[clamp(28px,7vw,96px)] sm:tracking-[0.08em]">
              {page.title}
            </h1>
            <p className="mt-6 max-w-[680px] text-[clamp(16px,2vw,20px)] font-light leading-8 text-[#d8ceb0]">
              {page.subtitle}
            </p>
          </div>
        </section>

        <article className="mt-12 border-y border-[rgba(236,226,196,0.12)] py-8">
          <div className="mx-auto flex max-w-[860px] flex-col gap-1">
            {page.lines.map((line, index) => (
              <ReferenceLine key={`${page.id}-${index}`} line={line} index={index} />
            ))}
          </div>
        </article>
      </main>
    </div>
  )
}
