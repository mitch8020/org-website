import { Link, createFileRoute } from '@tanstack/react-router'
import type { SECTIONS } from '#/lib/sections'
import { GRID_ORDER } from '#/lib/sections'

import aboutImg from '#/assets/about.png'
import beliefsImg from '#/assets/beliefs.png'
import communityImg from '#/assets/community.png'
import donationsImg from '#/assets/gifts_donations.png'
import futureImg from '#/assets/future_ideas.png'
import infrastructureImg from '#/assets/infrastructure.png'
import legalImg from '#/assets/legal.png'
import researchImg from '#/assets/research.png'

export const Route = createFileRoute('/')({ component: SacredGeometry })

function octagonPoints(cx: number, cy: number, r: number) {
  const pts: Array<string> = []
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI / 4) * i - Math.PI / 8
    const x = cx + Math.cos(angle) * r
    const y = cy + Math.sin(angle) * r
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`)
  }
  return pts.join(' ')
}

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='2' seed='3'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")"

const VIGNETTE_BG =
  'radial-gradient(60% 50% at 50% 52%, rgba(212,162,74,0.07), transparent 60%), radial-gradient(80% 70% at 50% 50%, rgba(236,226,196,0.04), transparent 65%)'

const IMAGES: Record<string, string> = {
  about: aboutImg,
  community: communityImg,
  beliefs: beliefsImg,
  infrastructure: infrastructureImg,
  research: researchImg,
  legal: legalImg,
  future: futureImg,
  donations: donationsImg,
}

const cellBase =
  'group relative z-[1] flex aspect-square h-full w-full items-center justify-center no-underline text-[#ece2c4] opacity-0 scale-[0.92] outline outline-1 outline-offset-[-1px] transition-[transform,filter] duration-300 ease-out hover:scale-[1.02] hover:brightness-110 [clip-path:polygon(29.3%_0,70.7%_0,100%_29.3%,100%_70.7%,70.7%_100%,29.3%_100%,0_70.7%,0_29.3%)] animate-[v2-pop_900ms_cubic-bezier(0.2,0.8,0.2,1)_forwards]'

function SacredGeometry() {
  const cx = 500
  const cy = 500

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0b0d12] text-[#ece2c4]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: VIGNETTE_BG }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL }}
      />

      <svg
        viewBox="0 0 1000 1000"
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(95vmin,1100px)] w-[min(95vmin,1100px)] -translate-x-1/2 -translate-y-1/2"
      >
        <g>
          {[480, 420, 360, 300, 240, 180, 120, 60].map((r, i) => (
            <polygon
              key={r}
              points={octagonPoints(cx, cy, r)}
              fill="none"
              stroke="rgba(232,224,206,0.18)"
              strokeWidth={i === 0 ? 0.8 : 0.4}
              style={{
                strokeDasharray: 2400,
                strokeDashoffset: 2400,
                animation: `v2-draw 1800ms cubic-bezier(0.6,0,0.3,1) forwards`,
                animationDelay: `${i * 110}ms`,
              }}
            />
          ))}
        </g>
        <g>
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (Math.PI / 8) * i - Math.PI / 16
            const x2 = cx + Math.cos(a) * 480
            const y2 = cy + Math.sin(a) * 480
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={x2}
                y2={y2}
                stroke="rgba(232,224,206,0.08)"
                strokeWidth={0.5}
                style={{
                  strokeDasharray: 600,
                  strokeDashoffset: 600,
                  animation: `v2-draw 1400ms ease-out forwards`,
                  animationDelay: `${1100 + i * 35}ms`,
                }}
              />
            )
          })}
        </g>
      </svg>

      <main className="relative z-[3] flex min-h-screen items-center justify-center px-[clamp(12px,4vw,56px)] py-[clamp(16px,4vw,28px)]">
        <div className="relative grid w-full max-w-[min(1100px,calc(100vh-80px))] grid-cols-3 gap-[clamp(8px,2vw,30px)]">
          <svg
            aria-hidden
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          >
            <line
              x1="33.333%"
              y1="0"
              x2="33.333%"
              y2="100%"
              stroke="rgba(232,224,206,0.22)"
              strokeWidth="1"
              strokeDasharray="2 6"
            />
            <line
              x1="66.666%"
              y1="0"
              x2="66.666%"
              y2="100%"
              stroke="rgba(232,224,206,0.22)"
              strokeWidth="1"
              strokeDasharray="2 6"
            />
            <line
              x1="0"
              y1="33.333%"
              x2="100%"
              y2="33.333%"
              stroke="rgba(232,224,206,0.22)"
              strokeWidth="1"
              strokeDasharray="2 6"
            />
            <line
              x1="0"
              y1="66.666%"
              x2="100%"
              y2="66.666%"
              stroke="rgba(232,224,206,0.22)"
              strokeWidth="1"
              strokeDasharray="2 6"
            />
          </svg>

          {GRID_ORDER.map((entry, i) => {
            const isCenter = entry.id === 'home'
            const order = [0, 1, 2, 5, 8, 7, 6, 3].indexOf(i)
            const delay = isCenter ? 2200 : 1600 + (order >= 0 ? order : 0) * 110

            if (isCenter) {
              return (
                <Link
                  key={entry.id}
                  to="/"
                  className={`${cellBase} outline-[rgba(236,226,196,0.4)] [background:radial-gradient(circle_at_50%_50%,rgba(232,226,196,0.18),rgba(11,13,18,0.95))] hover:[background:radial-gradient(circle_at_50%_50%,rgba(232,226,196,0.4),rgba(11,13,18,0.9))]`}
                  style={{ animationDelay: `${delay}ms` }}
                >
                  <div className="relative flex w-[78%] items-center justify-center">
                    <svg
                      viewBox="-50 -50 100 100"
                      aria-hidden
                      className="h-[70%] w-[70%] animate-[v2-rotate_28s_linear_infinite]"
                    >
                      <defs>
                        <linearGradient id="v2grad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0" stopColor="#f6efd9" />
                          <stop offset="1" stopColor="#9e8e6c" />
                        </linearGradient>
                      </defs>
                      {Array.from({ length: 8 }).map((_, k) => {
                        const a1 = (Math.PI / 4) * k - Math.PI / 8
                        const a2 = (Math.PI / 4) * (k + 1) - Math.PI / 8
                        const x1 = Math.cos(a1) * 44
                        const y1 = Math.sin(a1) * 44
                        const x2 = Math.cos(a2) * 44
                        const y2 = Math.sin(a2) * 44
                        const shade = 0.18 + (k / 8) * 0.7
                        return (
                          <polygon
                            key={k}
                            points={`0,0 ${x1.toFixed(2)},${y1.toFixed(2)} ${x2.toFixed(2)},${y2.toFixed(2)}`}
                            fill={`rgba(232,224,206,${shade})`}
                            stroke="rgba(11,13,18,0.6)"
                            strokeWidth="0.6"
                          />
                        )
                      })}
                      <polygon
                        points={octagonPoints(0, 0, 44)}
                        fill="none"
                        stroke="rgba(232,224,206,0.9)"
                        strokeWidth="0.8"
                      />
                    </svg>
                    <div className="absolute border border-[#b8ad8d] bg-[#0b0d12] px-2 py-1 text-[clamp(14px,2vw,30px)] font-thin tracking-[0.3em] text-[#ece2c4] sm:px-3.5 sm:py-1.5 sm:tracking-[0.42em]">
                      ORG
                    </div>
                  </div>
                  <span className="absolute bottom-[10%] hidden text-[8px] uppercase tracking-[0.4em] text-[#b8ad8d] sm:bottom-[14%] sm:inline sm:text-[9px] sm:tracking-[0.5em]">
                    RETURN TO THE PRINCIPAL
                  </span>
                </Link>
              )
            }

            const s = entry as (typeof SECTIONS)[number]
            const img = IMAGES[s.id]
            return (
              <Link
                key={s.id}
                to={s.href}
                className={`${cellBase} outline-[rgba(232,226,196,0.16)]`}
                style={{
                  backgroundImage: img
                    ? `linear-gradient(rgba(11,13,18,0.55), rgba(11,13,18,0.55)), url(${img})`
                    : 'linear-gradient(140deg, rgba(28,30,38,0.92), rgba(15,17,22,0.92))',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  animationDelay: `${delay}ms`,
                }}
              >
                <div className="flex w-[82%] flex-col items-center gap-1 text-center sm:gap-2 md:gap-2.5">
                  <span className="text-[8px] font-extralight tracking-[0.4em] text-[#ece2c4]/80 sm:text-[10px] sm:tracking-[0.5em] md:text-[11px] md:tracking-[0.6em]">
                    {s.roman}
                  </span>
                  <h2
                    className="m-0 break-words font-light uppercase leading-[1.05] tracking-[0.1em] text-[clamp(10px,1.6vw,20px)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] sm:font-extralight sm:tracking-[0.18em] md:tracking-[0.24em]"
                  >
                    {s.label}
                  </h2>
                  <span className="block h-px w-4 bg-[#ece2c4]/70 sm:my-1 sm:w-6 md:w-7 md:bg-[#b8ad8d]" />
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
