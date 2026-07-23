import type { ReactNode } from 'react'
import { SiteNav } from '../SiteNav'

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2' seed='17'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")"

export function ShopShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0b0d12] text-[#ece2c4]">
      <SiteNav />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(70% 58% at 50% 0%, rgba(157,207,131,0.08), transparent 70%), radial-gradient(45% 60% at 100% 40%, rgba(120,174,162,0.06), transparent)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.055] mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL }}
      />
      {children}
    </div>
  )
}
