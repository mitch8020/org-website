import { useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import type { OutlineNode } from '#/lib/about-content'
import { ARTICLES, CONTACT } from '#/lib/about-content'
import { SiteNav } from '#/components/SiteNav'
import { SECTIONS } from '#/lib/sections'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About Us — ORG · The Octagon Religious-Research Group' },
      {
        name: 'description',
        content:
          'The founding document of ORG — the Octagon Religious-Research Group and Spirituality Centers: identity, mission, governance, and contact.',
      },
    ],
  }),
  component: AboutPage,
})

/* ── palette ──────────────────────────────────────────────────────────── */
const GOLD = '#d4a24a'

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='2' seed='3'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")"

const VIGNETTE_BG =
  'radial-gradient(60% 50% at 50% 30%, rgba(212,162,74,0.08), transparent 60%), radial-gradient(90% 80% at 50% 50%, rgba(236,226,196,0.035), transparent 70%)'

function octagonPoints(cx: number, cy: number, r: number) {
  const pts: Array<string> = []
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i - Math.PI / 8
    pts.push(
      `${(cx + Math.cos(a) * r).toFixed(2)},${(cy + Math.sin(a) * r).toFixed(2)}`,
    )
  }
  return pts.join(' ')
}

/* ── inline formatting: cross-references + the Creator ────────────────── */
const HREF_BY_NAME: Record<string, string> = Object.fromEntries(
  SECTIONS.map((s) => [s.id, s.href]),
)

const INLINE_PATTERN =
  '(The Universal Creator|Universal Creator)|((?:See|see|Go to)\\s+(?:the\\s+)?(Legal|Infrastructure|Research|Beliefs|Community|Medical)(?:\\s+section)?)'

function renderInline(text: string, keyBase: string) {
  const out: Array<React.ReactNode> = []
  const re = new RegExp(INLINE_PATTERN, 'g')
  let last = 0
  let i = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1]) {
      out.push(
        <span
          key={`${keyBase}-c${i}`}
          className="font-medium uppercase tracking-[0.08em] text-[#e9c987]"
        >
          {m[1]}
        </span>,
      )
    } else {
      const phrase = m[2]
      const name = m[3]
      const at = phrase.indexOf(name)
      const prefix = phrase.slice(0, at)
      const suffix = phrase.slice(at + name.length)
      const href = HREF_BY_NAME[name.toLowerCase()]
      out.push(prefix)
      if (href) {
        out.push(
          <a
            key={`${keyBase}-r${i}`}
            href={href}
            className="font-medium text-[#e9c987] underline decoration-[rgba(212,162,74,0.4)] decoration-from-font underline-offset-[3px] transition-colors hover:decoration-[#d4a24a]"
          >
            {name}
          </a>,
        )
      } else {
        out.push(
          <span key={`${keyBase}-r${i}`} className="font-medium text-[#cdb98a]">
            {name}
          </span>,
        )
      }
      out.push(suffix)
    }
    last = m.index + m[0].length
    i++
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

/* ── depth-tiered styling for the nested outline ──────────────────────── */
const TIERS = [
  {
    mk: 'text-[#d4a24a] font-medium',
    tx: 'text-[15px] leading-[1.72] text-[#ece2c4]',
  },
  {
    mk: 'text-[#d4a24a]/85 font-medium',
    tx: 'text-[14px] leading-[1.66] text-[#ded3b3]',
  },
  { mk: 'text-[#c2b48c]', tx: 'text-[13.5px] leading-[1.62] text-[#cdc1a1]' },
  { mk: 'text-[#b3a884]', tx: 'text-[13px] leading-[1.6] text-[#bfb392]' },
  { mk: 'text-[#9f956f]', tx: 'text-[12.5px] leading-[1.58] text-[#b1a684]' },
] as const
const tier = (d: number) => TIERS[Math.min(d, TIERS.length - 1)]

function OutlineList({
  nodes,
  depth,
  idBase,
}: {
  nodes: ReadonlyArray<OutlineNode>
  depth: number
  idBase: string
}) {
  const t = tier(depth)
  return (
    <ul
      className={
        depth === 0
          ? 'mt-6 flex list-none flex-col gap-4 p-0'
          : 'mt-3 flex list-none flex-col gap-3 border-l border-[rgba(212,162,74,0.16)] py-0.5 pl-[clamp(12px,1.8vw,22px)]'
      }
    >
      {nodes.map((n, i) => {
        const k = `${idBase}-${i}`
        return (
          <li key={k} className="flex gap-2.5">
            <span
              className={`flex-none whitespace-nowrap pt-[0.05em] text-right tabular-nums ${t.mk} min-w-[2em] text-[0.86em] tracking-wide`}
            >
              {n.m}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`m-0 ${t.tx}`}>{renderInline(n.t, k)}</p>
              {n.c && n.c.length > 0 ? (
                <OutlineList nodes={n.c} depth={depth + 1} idBase={k} />
              ) : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/* ── one Article block ────────────────────────────────────────────────── */
function ArticleBlock({ index }: { index: number }) {
  const a = ARTICLES[index]
  return (
    <section
      id={a.id}
      data-article
      className="ab-rise scroll-mt-[160px]"
      style={{ animationDelay: `${120 + index * 70}ms` }}
    >
      <div className="flex items-baseline gap-4 sm:gap-6">
        <div>
          <h2
            className="m-0 font-thin tracking-[-0.01em] text-[#f3ead0]"
            style={{ fontSize: 'clamp(22px,3vw,34px)' }}
          >
            {a.eyebrow}
          </h2>
        </div>
      </div>

      <div
        className="mt-5 h-px w-full"
        style={{
          background:
            'linear-gradient(90deg, rgba(212,162,74,0.55), rgba(212,162,74,0.05) 75%, transparent)',
        }}
      />

      <p
        className="mb-0 mt-6 font-light text-[#ece2c4]"
        style={{ fontSize: 'clamp(15.5px,1.8vw,18px)', lineHeight: 1.7 }}
      >
        {renderInline(a.lead, a.id)}
      </p>

      {a.body.length > 0 ? (
        <OutlineList nodes={a.body} depth={0} idBase={a.id} />
      ) : null}
    </section>
  )
}

/* ── contact finale (Article IX) ──────────────────────────────────────── */
function ContactBlock() {
  return (
    <section id="contact" data-article className="ab-rise scroll-mt-[160px]">
      <div className="flex items-baseline gap-4 sm:gap-6">
        <div>
          <h2
            className="m-0 font-thin tracking-[-0.01em] text-[#f3ead0]"
            style={{ fontSize: 'clamp(22px,3vw,34px)' }}
          >
            {CONTACT.eyebrow}
          </h2>
        </div>
      </div>

      <div
        className="mt-5 h-px w-full"
        style={{
          background:
            'linear-gradient(90deg, rgba(212,162,74,0.55), rgba(212,162,74,0.05) 75%, transparent)',
        }}
      />

      <p
        className="mb-0 mt-6 font-light text-[#cdc2a4]"
        style={{ fontSize: '15px', lineHeight: 1.7 }}
      >
        Reach a member directly through either channel below.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CONTACT.channels.map((ch) => {
          const inner = (
            <>
              <div className="text-[10px] uppercase tracking-[0.34em] text-[#b8ad8d]">
                {ch.label}
              </div>
              <div className="mt-2 text-[18px] font-light tracking-[0.02em] text-[#f3ead0]">
                {ch.handle}
              </div>
            </>
          )
          const cls =
            'group relative block overflow-hidden border border-[rgba(212,162,74,0.28)] bg-[rgba(212,162,74,0.04)] p-5 no-underline transition-colors duration-300 hover:border-[rgba(212,162,74,0.6)] hover:bg-[rgba(212,162,74,0.08)] [clip-path:polygon(14px_0,100%_0,100%_calc(100%-14px),calc(100%-14px)_100%,0_100%,0_14px)]'
          return ch.href ? (
            <a
              key={ch.label}
              href={ch.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cls}
            >
              {inner}
              <span className="absolute right-4 top-4 text-[#d4a24a] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                ↗
              </span>
            </a>
          ) : (
            <div key={ch.label} className={cls}>
              {inner}
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ── page ─────────────────────────────────────────────────────────────── */
function AboutPage() {
  const toc = [
    ...ARTICLES.map((a) => ({ id: a.id, roman: a.roman, label: a.eyebrow })),
    { id: 'contact', roman: CONTACT.roman, label: CONTACT.eyebrow },
  ]

  const [active, setActive] = useState(toc[0].id)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const doc = document.documentElement
    const onScroll = () => {
      const max = doc.scrollHeight - doc.clientHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-28% 0px -64% 0px', threshold: 0 },
    )
    document.querySelectorAll('[data-article]').forEach((el) => obs.observe(el))

    return () => {
      window.removeEventListener('scroll', onScroll)
      obs.disconnect()
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0b0d12] text-[#ece2c4]">
      <style>{styles}</style>

      {/* atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: VIGNETTE_BG }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.07] mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL }}
      />
      <svg
        aria-hidden
        viewBox="0 0 1000 1000"
        className="pointer-events-none fixed left-1/2 top-[-14%] z-0 h-[min(120vmin,1200px)] w-[min(120vmin,1200px)] -translate-x-1/2 opacity-[0.5] animate-[v2-rotate_120s_linear_infinite]"
      >
        {[470, 380, 290, 200].map((r, i) => (
          <polygon
            key={r}
            points={octagonPoints(500, 500, r)}
            fill="none"
            stroke="rgba(212,162,74,0.10)"
            strokeWidth={i === 0 ? 1 : 0.5}
          />
        ))}
      </svg>

      {/* reading progress */}
      <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-transparent">
        <div
          className="h-full origin-left bg-[#d4a24a]"
          style={{
            transform: `scaleX(${progress})`,
            transition: 'transform 90ms linear',
          }}
        />
      </div>

      <SiteNav />

      {/* hero */}
      <section className="relative z-[3] mx-auto max-w-[1180px] px-[clamp(16px,4vw,40px)] pb-[clamp(36px,6vh,64px)] pt-[clamp(180px,21vh,235px)] text-center">
        <h1
          className="ab-rise m-0 font-thin uppercase leading-[0.95] tracking-[0.12em] text-[#f6efd9]"
          style={{ fontSize: 'clamp(44px,9vw,120px)', animationDelay: '200ms' }}
        >
          About&nbsp;Us
        </h1>

        <div
          className="ab-rise mx-auto mt-8 inline-flex items-center gap-2.5 border border-[rgba(212,162,74,0.22)] bg-[rgba(212,162,74,0.04)] px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-[#b8ad8d]"
          style={{ animationDelay: '440ms' }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d4a24a] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#d4a24a]" />
          </span>
          A living document — revised as our knowledge and beliefs evolve.
        </div>
      </section>

      {/* body + contents rail */}
      <div className="relative z-[3] mx-auto grid max-w-[1180px] grid-cols-1 gap-x-12 px-[clamp(16px,4vw,40px)] pb-24 lg:grid-cols-[210px_minmax(0,780px)] lg:justify-center">
        <aside className="mb-10 lg:mb-0">
          <nav className="sticky top-[160px]">
            <div className="mb-4 text-[10px] uppercase tracking-[0.34em] text-[#9f9676]">
              Contents
            </div>
            <ol className="m-0 flex list-none flex-col gap-0.5 p-0">
              {toc.map((item) => {
                const on = active === item.id
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={() => setActive(item.id)}
                      className={`group flex items-center gap-3 border-l-2 py-1.5 pl-3 text-[12px] no-underline transition-colors ${
                        on
                          ? 'border-[#d4a24a] text-[#f3ead0]'
                          : 'border-transparent text-[#9f9676] hover:border-[rgba(212,162,74,0.4)] hover:text-[#cdc2a4]'
                      }`}
                    >
                      <span className="truncate font-light tracking-wide">
                        {item.label}
                      </span>
                    </a>
                  </li>
                )
              })}
            </ol>
          </nav>
        </aside>

        <main className="flex min-w-0 flex-col gap-[clamp(52px,8vh,88px)]">
          {ARTICLES.map((a, i) => (
            <ArticleBlock key={a.id} index={i} />
          ))}
          <ContactBlock />
        </main>
      </div>

      
    </div>
  )
}

const styles = `
html { scroll-behavior: smooth; }
@keyframes ab-rise {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: none; }
}
.ab-rise { opacity: 0; animation: ab-rise 720ms cubic-bezier(0.2,0.7,0.2,1) forwards; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .ab-rise { animation: none; opacity: 1; transform: none; }
}
`
