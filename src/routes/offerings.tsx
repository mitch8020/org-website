import { useEffect, useMemo, useState } from 'react'
import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
} from '@tanstack/react-router'
import { ArrowUpRight, PackageOpen } from 'lucide-react'
import { apiRequest, money } from '#/lib/api'
import type { DonationConfig, Product } from '#/lib/api'
import { ShopShell } from '#/components/shop/ShopShell'
import { ProductDialog } from '#/components/shop/ProductDialog'
import { CartDocket } from '#/components/shop/CartDocket'
import { AuthNotice } from '#/components/shop/AuthNotice'

export const Route = createFileRoute('/offerings')({
  head: () => ({
    meta: [
      { title: 'Offerings — ORG' },
      {
        name: 'description',
        content:
          'Request practical gifts from ORG and contribute through PayPal or Venmo.',
      },
    ],
  }),
  component: OfferingsPage,
})

const CATEGORIES = [
  ['all', 'All offerings'],
  ['vaporizer-accessories', 'Vaporizer accessories'],
  ['3d-printed-parts', '3D-printed parts'],
  ['laboratory-tools', 'Laboratory tools'],
] as const

function OfferingsPage() {
  const isCheckout = useRouterState({
    select: (state) => state.location.pathname === '/offerings/checkout',
  })
  return isCheckout ? <Outlet /> : <OfferingsCatalog />
}

function OfferingsCatalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [donations, setDonations] = useState<DonationConfig | null>(null)
  const [category, setCategory] =
    useState<(typeof CATEGORIES)[number][0]>('all')
  const [selected, setSelected] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cadence, setCadence] = useState<'once' | 'monthly' | 'yearly'>('once')

  useEffect(() => {
    Promise.all([
      apiRequest<Product[]>('/products'),
      apiRequest<DonationConfig>('/donation-config'),
    ])
      .then(([nextProducts, nextDonations]) => {
        setProducts(nextProducts)
        setDonations(nextDonations)
      })
      .catch((cause) =>
        setError(
          cause instanceof Error
            ? cause.message
            : 'Offerings could not be loaded.',
        ),
      )
      .finally(() => setLoading(false))
  }, [])

  const visible = useMemo(
    () =>
      category === 'all'
        ? products
        : products.filter((product) => product.category === category),
    [category, products],
  )

  return (
    <ShopShell>
      <main className="relative z-[1] mx-auto max-w-[1240px] px-[clamp(16px,4vw,44px)] pb-24 pt-[clamp(132px,16vh,180px)]">
        <AuthNotice />
        <section className="mt-5 grid items-end gap-8 border-b border-[#ece2c4]/18 pb-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#9dcf83]">
              Material gifts · Request docket 008
            </div>
            <h1 className="font-display mt-3 max-w-4xl text-[clamp(62px,11vw,132px)] font-semibold uppercase leading-[0.78] tracking-[-0.015em] text-[#f6efd9]">
              Tools for the work.
            </h1>
          </div>
          <div className="border-l border-[#9dcf83]/35 pl-5">
            <p className="text-sm leading-7 text-[#cdc2a4]">
              ORG offers useful objects to members whether or not they can meet
              a suggested donation. Choose what supports your practice, then
              record the request on one clear docket.
            </p>
            <Link
              to="/gifts-contributions"
              className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#9dcf83] no-underline hover:text-[#b8e7a0]"
            >
              Read the offering policy <ArrowUpRight size={13} />
            </Link>
          </div>
        </section>

        <section className="py-10">
          <div className="flex flex-col justify-between gap-5 border-b border-dashed border-[#ece2c4]/18 pb-5 sm:flex-row sm:items-end">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#9f9676]">
                Current catalog
              </div>
              <h2 className="font-display mt-1 text-4xl uppercase tracking-[0.04em]">
                Select an offering
              </h2>
            </div>
            <div className="flex flex-wrap gap-2" aria-label="Filter offerings">
              {CATEGORIES.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCategory(value)}
                  aria-pressed={category === value}
                  className={`border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] ${
                    category === value
                      ? 'border-[#9dcf83] bg-[#9dcf83] text-[#0b0d12]'
                      : 'border-[#ece2c4]/20 text-[#b8ad8d] hover:border-[#9dcf83]/70'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <div className="mt-8 border border-[#c98b63]/50 bg-[#c98b63]/10 p-5 text-[#e7c3a9]">
              {error} Confirm that org-backend is running and its CORS origin
              matches this site.
            </div>
          ) : null}

          {loading ? (
            <div className="grid min-h-64 place-items-center font-mono text-[10px] uppercase tracking-[0.2em] text-[#9f9676]">
              Reading the catalog…
            </div>
          ) : null}

          <div className="mt-8 grid gap-px bg-[#ece2c4]/14 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product, index) => {
              const donationValues = product.variants
                .map((variant) => variant.suggestedDonationCents)
                .filter((value): value is number => value !== undefined)
                .sort((a, b) => a - b)
              const startingDonation =
                donationValues.length > 0 ? donationValues[0] : null
              return (
                <button
                  key={product.slug}
                  type="button"
                  onClick={() => setSelected(product)}
                  className="group bg-[#0b0d12] p-0 text-left"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.imageAlt}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025] group-hover:opacity-85"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[#0b0d12] via-[#0b0d12]/72 to-transparent px-4 pb-4 pt-16">
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#9dcf83]">
                        ORG-{String(index + 1).padStart(3, '0')}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#b8ad8d]">
                        Illustrative render
                      </span>
                    </div>
                  </div>
                  <div className="min-h-44 p-5">
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#9f9676]">
                      {product.category.replaceAll('-', ' ')}
                    </div>
                    <h3 className="font-display mt-2 text-2xl uppercase tracking-[0.04em] text-[#f3ead0] group-hover:text-[#9dcf83]">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#aaa082]">
                      {product.summary}
                    </p>
                    <div className="mt-4 font-mono text-[10px] text-[#9dcf83]">
                      {startingDonation !== null
                        ? `From ${money(startingDonation)} suggested`
                        : 'Optional donation'}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <section className="mt-8 grid overflow-hidden border border-[#ece2c4]/18 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="grid min-h-64 place-items-center bg-[#9dcf83] p-8 text-[#0b0d12]">
            <div>
              <PackageOpen size={34} strokeWidth={1.2} />
              <div className="font-display mt-6 text-5xl uppercase leading-[0.88] tracking-[0.02em]">
                Contribute without requesting an item.
              </div>
            </div>
          </div>
          <div className="p-7 sm:p-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#9dcf83]">
              Direct contribution
            </div>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#cdc2a4]">
              Choose a cadence, then finish the donation directly in PayPal or
              Venmo. ORG does not see your account credentials or automate a
              recurring transfer.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {(['once', 'monthly', 'yearly'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCadence(value)}
                  className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] ${
                    cadence === value
                      ? 'border-[#9dcf83] text-[#9dcf83]'
                      : 'border-[#ece2c4]/22 text-[#9f9676]'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs text-[#9f9676]">
              {cadence === 'once'
                ? 'Complete a single donation with the provider you prefer.'
                : `Open your provider and use its scheduling tools to arrange a ${cadence} contribution when supported.`}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href={donations?.paypalUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between border border-[#ece2c4]/25 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#ece2c4] no-underline hover:border-[#9dcf83]"
              >
                PayPal {donations?.paypalHandle}
                <ArrowUpRight size={15} />
              </a>
              <a
                href={donations?.venmoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between border border-[#ece2c4]/25 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#ece2c4] no-underline hover:border-[#9dcf83]"
              >
                Venmo {donations?.venmoHandle}
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <ProductDialog product={selected} onClose={() => setSelected(null)} />
      <CartDocket />
    </ShopShell>
  )
}
