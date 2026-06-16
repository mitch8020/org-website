import { useEffect, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { GRID_ORDER } from '#/lib/sections'
import aboutImg from '#/assets/about.png'
import beliefsImg from '#/assets/beliefs.png'
import communityImg from '#/assets/community.png'
import donationsImg from '#/assets/gifts_donations.png'
import futureImg from '#/assets/future_ideas.png'
import homeRainbowImg from '#/assets/home_rainbow.jpeg'
import infrastructureImg from '#/assets/infrastructure.png'
import legalImg from '#/assets/legal.png'
import researchImg from '#/assets/research.png'

const LABELS: Record<string, string> = {
  about: 'About',
  community: 'Community',
  beliefs: 'Beliefs',
  infrastructure: 'Infrastructure',
  home: 'ORG',
  research: 'Research',
  legal: 'Legal',
  future: 'Future',
  donations: 'GIFTS AND CONTRIBUTIONS',
}

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

function NavSquare({
  item,
  active,
  compact,
  onNavigate,
}: {
  item: (typeof GRID_ORDER)[number]
  active: boolean
  compact?: boolean
  onNavigate?: () => void
}) {
  const isHome = item.id === 'home'
  const img = isHome ? homeRainbowImg : (IMAGES[item.id] ?? null)

  return (
    <Link
      to={item.href}
      onClick={onNavigate}
      title={item.label}
      aria-label={item.label}
      className={`group no-underline transition-all duration-300 w-full`}
    >
      <div
        className={`relative overflow-hidden w-full aspect-square transition-all duration-300 ${
          active
            ? 'border-solid border-[#ece2c4] bg-[#ece2c4]'
            : 'bg-[rgba(11,13,18,0.74)] hover:border-solid hover:border-[#d4a24a] hover:bg-[rgba(212,162,74,0.12)]'
        }`}
      >
        {img ? (
          <span
            aria-hidden
            className={`absolute inset-0 bg-cover bg-center ${isHome ? 'animate-[v2-rotate_28s_linear_infinite]' : ''} transition-opacity duration-300 ${active ? 'opacity-20' : 'opacity-20 group-hover:opacity-40'}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ) : null}
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
            active ? 'opacity-0' : ''
          }`}
          style={{
            background:
              'linear-gradient(135deg, rgba(212,162,74,0.22), transparent 38%, rgba(120,174,162,0.12))',
          }}
        />
        <span
          className={`absolute bottom-0 left-0 right-0 z-10 text-center leading-none tracking-[0.04em] uppercase pb-1.5 pointer-events-none ${
            compact
              ? 'text-[12px] font-semibold'
              : 'text-[clamp(9px,1vw,13px)] font-bold'
          } ${active ? 'text-[#d4a24a]' : 'text-[#ece2c4] group-hover:text-[#f0e6d0]'}`}
          style={!active ? {
            background: 'linear-gradient(to top, rgba(11,13,18,0.65) 0%, rgba(11,13,18,0.3) 55%, transparent 100%)'
          } : undefined}
        >
          {LABELS[item.id] ?? item.label}
        </span>
      </div>
    </Link>
  )
}

export function SiteNav() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-[rgba(11,13,18,0.78)] backdrop-blur-md">
        <div className="mx-auto hidden max-w-[1180px] px-[clamp(14px,3vw,32px)] py-4 md:block">
          <nav aria-label="Primary" className="relative grid grid-cols-9 gap-0">
            {/* Grid-level larger perforation lines matching the home page blotter sheet: 4px thick, sparse dashes (d=20px, g=16px) at every tab division + outer frame. */}
            {(() => {
              const perfColor = 'rgba(236,226,196,0.72)'
              const d = '20px'
              const g = '16px'
              const t = '4px'
              const vGrad = `repeating-linear-gradient(to bottom, ${perfColor} 0, ${perfColor} ${d}, transparent ${d}, transparent calc(${d} + ${g}))`
              const hGrad = `repeating-linear-gradient(to right, ${perfColor} 0, ${perfColor} ${d}, transparent ${d}, transparent calc(${d} + ${g}))`
              const numTabs = 9
              const step = 100 / numTabs
              const vPositions = Array.from({ length: numTabs + 1 }, (_, k) => `${(k * step).toFixed(3)}%`)
              const bgImages = [
                ...vPositions.map(() => vGrad),
                hGrad,
                hGrad,
              ]
              const bgSizes = [
                ...vPositions.map(() => `${t} 100%`),
                `100% ${t}`,
                `100% ${t}`,
              ]
              const bgPositions = [
                ...vPositions.map((p) => `${p} 0%`),
                `0% 0%`,
                `0% 100%`,
              ]
              const bgRepeats = [
                ...vPositions.map(() => 'no-repeat'),
                'no-repeat',
                'no-repeat',
              ]
              return (
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none z-[5]"
                  style={{
                    backgroundImage: bgImages.join(','),
                    backgroundSize: bgSizes.join(','),
                    backgroundPosition: bgPositions.join(','),
                    backgroundRepeat: bgRepeats.join(','),
                  }}
                />
              )
            })()}
            {GRID_ORDER.map((item) => (
              <NavSquare
                key={item.id}
                item={item}
                active={
                  item.href === '/'
                    ? location.pathname === '/'
                    : location.pathname === item.href
                }
              />
            ))}
          </nav>
        </div>

        <div className="flex h-16 items-center justify-between px-4 md:hidden">
          <Link
            to="/"
            className="inline-flex items-center text-[11px] uppercase tracking-[0.34em] text-[#ece2c4] no-underline"
            aria-label="ORG home"
          >
            ORG
          </Link>
          <button
            type="button"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center border border-[rgba(236,226,196,0.28)] bg-[rgba(11,13,18,0.86)] text-[#ece2c4]"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-40 bg-[rgba(11,13,18,0.94)] px-4 pb-8 pt-24 backdrop-blur-md md:hidden">
          <nav aria-label="Primary mobile" className="relative mx-auto max-w-[420px] grid grid-cols-3 gap-0">
            {/* Matching larger perforation overlay for mobile 3-col menu. */}
            {(() => {
              const perfColor = 'rgba(236,226,196,0.72)'
              const d = '20px'
              const g = '16px'
              const t = '4px'
              const vGrad = `repeating-linear-gradient(to bottom, ${perfColor} 0, ${perfColor} ${d}, transparent ${d}, transparent calc(${d} + ${g}))`
              const hGrad = `repeating-linear-gradient(to right, ${perfColor} 0, ${perfColor} ${d}, transparent ${d}, transparent calc(${d} + ${g}))`
              const numTabs = 3
              const step = 100 / numTabs
              const vPositions = Array.from({ length: numTabs + 1 }, (_, k) => `${(k * step).toFixed(3)}%`)
              const bgImages = [
                ...vPositions.map(() => vGrad),
                hGrad,
                hGrad,
              ]
              const bgSizes = [
                ...vPositions.map(() => `${t} 100%`),
                `100% ${t}`,
                `100% ${t}`,
              ]
              const bgPositions = [
                ...vPositions.map((p) => `${p} 0%`),
                `0% 0%`,
                `0% 100%`,
              ]
              const bgRepeats = [
                ...vPositions.map(() => 'no-repeat'),
                'no-repeat',
                'no-repeat',
              ]
              return (
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none z-[5]"
                  style={{
                    backgroundImage: bgImages.join(','),
                    backgroundSize: bgSizes.join(','),
                    backgroundPosition: bgPositions.join(','),
                    backgroundRepeat: bgRepeats.join(','),
                  }}
                />
              )
            })()}
            {GRID_ORDER.map((item) => (
              <NavSquare
                key={item.id}
                item={item}
                active={
                  item.href === '/'
                    ? location.pathname === '/'
                    : location.pathname === item.href
                }
                compact
                onNavigate={() => setOpen(false)}
              />
            ))}
          </nav>
        </div>
      ) : null}
    </>
  )
}
