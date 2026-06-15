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
  infrastructure: 'Infra',
  home: 'ORG',
  research: 'Research',
  legal: 'Legal',
  future: 'Future',
  donations: 'Gifts',
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
      className={`group relative grid aspect-square place-items-center overflow-hidden border no-underline transition-all duration-300 ${
        active
          ? 'border-[#ece2c4] bg-[#ece2c4] text-[#0b0d12]'
          : 'border-[rgba(236,226,196,0.22)] bg-[rgba(11,13,18,0.74)] text-[#ece2c4] hover:border-[#d4a24a] hover:bg-[rgba(212,162,74,0.12)]'
      } ${compact ? 'min-h-0' : ''}`}
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
      <span className="relative flex items-center justify-center px-1 text-center">
        <span
          className={`max-w-full truncate uppercase leading-none tracking-[0.08em] ${
            compact ? 'text-[10px]' : 'text-[9px]'
          }`}
        >
          {LABELS[item.id] ?? item.label}
        </span>
      </span>
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
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[rgba(236,226,196,0.1)] bg-[rgba(11,13,18,0.78)] backdrop-blur-md">
        <div className="mx-auto hidden max-w-[1180px] px-[clamp(14px,3vw,32px)] py-3 md:block">
          <nav
            aria-label="Primary"
            className="grid grid-cols-9 gap-1.5"
            style={{
              height: 'clamp(56px,7vw,78px)',
            }}
          >
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
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.34em] text-[#ece2c4] no-underline"
            aria-label="ORG home"
          >
            <span className="grid h-8 w-8 place-items-center border border-[#d4a24a] text-[10px] tracking-[0.12em] text-[#d4a24a]">
              IX
            </span>
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
          <nav aria-label="Primary mobile" className="mx-auto grid max-w-[420px] grid-cols-3 gap-2">
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
