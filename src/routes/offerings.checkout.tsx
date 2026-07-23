import { useEffect, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, Check, Pencil } from 'lucide-react'
import { apiRequest, money } from '#/lib/api'
import type { MemberProfile, Order } from '#/lib/api'
import { useOrgAuth } from '#/lib/auth'
import { useCart } from '#/lib/cart'
import { MemberGate } from '#/components/shop/MemberGate'
import { ProfileEditor } from '#/components/shop/ProfileEditor'
import { ShopShell } from '#/components/shop/ShopShell'

export const Route = createFileRoute('/offerings/checkout')({
  head: () => ({
    meta: [
      { title: 'Confirm offering request — ORG' },
      {
        name: 'description',
        content: 'Confirm shipping and record an ORG offering request.',
      },
    ],
  }),
  component: CheckoutPage,
})

function CheckoutPage() {
  return (
    <ShopShell>
      <main className="relative z-[1] mx-auto max-w-[980px] px-[clamp(16px,4vw,40px)] pb-24 pt-[clamp(132px,16vh,176px)]">
        <MemberGate returnTo="/offerings/checkout">
          <Checkout />
        </MemberGate>
      </main>
    </ShopShell>
  )
}

function Checkout() {
  const auth = useOrgAuth()
  const cartState = useCart()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<MemberProfile | null>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')
  const [declaredDollars, setDeclaredDollars] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)
  const [idempotencyKey] = useState(() => crypto.randomUUID())

  useEffect(() => {
    auth
      .getToken()
      .then((token) => {
        if (!token) throw new Error('Your sign-in session has expired.')
        return apiRequest<MemberProfile>('/me', { token })
      })
      .then((nextProfile) => {
        setProfile(nextProfile)
        setEditing(
          !nextProfile.preferredName ||
            !nextProfile.email ||
            !nextProfile.contactHandle ||
            !nextProfile.shippingAddress,
        )
      })
      .catch((cause) =>
        setError(
          cause instanceof Error ? cause.message : 'Your profile did not load.',
        ),
      )
      .finally(() => setLoading(false))
  }, [auth])

  useEffect(() => {
    if (cartState.cart && declaredDollars === '') {
      setDeclaredDollars((cartState.cart.suggestedTotalCents / 100).toFixed(2))
    }
  }, [cartState.cart, declaredDollars])

  async function placeOrder() {
    setPlacing(true)
    setError('')
    try {
      const token = await auth.getToken()
      if (!token) throw new Error('Your sign-in session has expired.')
      const amount = declaredDollars.trim()
        ? Math.round(Number(declaredDollars) * 100)
        : undefined
      if (amount !== undefined && (!Number.isFinite(amount) || amount < 0)) {
        throw new Error('Enter a valid donation amount or leave it blank.')
      }
      const order = await apiRequest<Order>('/orders', {
        method: 'POST',
        token,
        headers: { 'Idempotency-Key': idempotencyKey },
        body: JSON.stringify({ declaredDonationCents: amount }),
      })
      await cartState.refresh()
      await navigate({
        to: '/orders/$orderId',
        params: { orderId: order._id },
      })
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'The order was not recorded.',
      )
    } finally {
      setPlacing(false)
    }
  }

  if (loading || cartState.loading) {
    return (
      <div className="grid min-h-72 place-items-center font-mono text-[10px] uppercase tracking-[0.2em] text-[#9f9676]">
        Preparing the confirmation…
      </div>
    )
  }

  if (!cartState.cart?.items.length) {
    return (
      <div className="border border-[#ece2c4]/18 p-8 text-center">
        <h1 className="font-display text-5xl uppercase tracking-[0.03em]">
          Your docket is empty.
        </h1>
        <Link
          to="/offerings"
          className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#9dcf83] no-underline"
        >
          <ArrowLeft size={14} /> Return to offerings
        </Link>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="border border-[#c98b63]/50 p-5 text-[#e7c3a9]">
        {error || 'Your member record is unavailable.'}
      </div>
    )
  }

  return (
    <>
      <Link
        to="/offerings"
        className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#9f9676] no-underline hover:text-[#9dcf83]"
      >
        <ArrowLeft size={13} /> Back to catalog
      </Link>
      <div className="mt-5 flex items-end justify-between border-b border-[#ece2c4]/18 pb-7">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#9dcf83]">
            Confirm request
          </div>
          <h1 className="font-display mt-2 text-[clamp(48px,8vw,82px)] uppercase leading-none tracking-[0.02em] text-[#f6efd9]">
            Review the docket.
          </h1>
        </div>
      </div>

      {error ? (
        <div className="mt-6 border border-[#c98b63]/50 bg-[#c98b63]/10 p-4 text-sm text-[#e7c3a9]">
          {error}
        </div>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          {editing ? (
            <div className="border border-[#ece2c4]/18 p-6">
              <ProfileEditor
                profile={profile}
                submitLabel="Save and review request"
                onSaved={(saved) => {
                  setProfile(saved)
                  setEditing(false)
                }}
              />
            </div>
          ) : (
            <div className="space-y-7">
              <section className="border border-[#ece2c4]/18 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl uppercase tracking-[0.04em]">
                    Member and shipping
                  </h2>
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#9dcf83]"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                </div>
                <div className="mt-4 grid gap-5 text-sm text-[#b8ad8d] sm:grid-cols-2">
                  <div>
                    <div className="text-[#f3ead0]">
                      {profile.preferredName}
                    </div>
                    <div>{profile.email}</div>
                    <div>
                      {profile.contactMethod}: {profile.contactHandle}
                    </div>
                  </div>
                  <address className="not-italic">
                    {profile.shippingAddress?.recipientName}
                    <br />
                    {profile.shippingAddress?.line1}
                    {profile.shippingAddress?.line2 ? (
                      <>
                        <br />
                        {profile.shippingAddress.line2}
                      </>
                    ) : null}
                    <br />
                    {profile.shippingAddress?.city},{' '}
                    {profile.shippingAddress?.state}{' '}
                    {profile.shippingAddress?.postalCode}
                  </address>
                </div>
              </section>

              <section className="border border-[#ece2c4]/18 p-6">
                <h2 className="font-display text-2xl uppercase tracking-[0.04em]">
                  Requested offerings
                </h2>
                <ul className="mt-5 space-y-4">
                  {cartState.cart.items.map((item) => (
                    <li
                      key={item.itemId}
                      className="grid grid-cols-[70px_1fr_auto] gap-4 border-b border-dashed border-[#ece2c4]/16 pb-4"
                    >
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="aspect-square w-[70px] object-cover"
                      />
                      <div>
                        <div className="text-sm text-[#f3ead0]">
                          {item.quantity} × {item.productName}
                        </div>
                        <div className="mt-1 font-mono text-[10px] text-[#9f9676]">
                          {item.variantLabel}
                        </div>
                        {item.note ? (
                          <div className="mt-1 text-xs text-[#b8ad8d]">
                            {item.note}
                          </div>
                        ) : null}
                      </div>
                      <div className="font-mono text-[10px] text-[#9dcf83]">
                        {item.lineSuggestedDonationCents
                          ? money(item.lineSuggestedDonationCents)
                          : 'Optional'}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}
        </div>

        <aside className="h-fit border border-[#9dcf83]/35 bg-[#11141a] p-6 lg:sticky lg:top-36">
          <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#9dcf83]">
            Suggested contribution
          </div>
          <dl className="mt-4 space-y-3 font-mono text-[11px]">
            <div className="flex justify-between text-[#b8ad8d]">
              <dt>Items</dt>
              <dd>{money(cartState.cart.suggestedItemsCents)}</dd>
            </div>
            <div className="flex justify-between text-[#b8ad8d]">
              <dt>U.S. shipping</dt>
              <dd>{money(cartState.cart.suggestedShippingCents)}</dd>
            </div>
            <div className="flex justify-between border-t border-dashed border-[#ece2c4]/22 pt-4 text-base text-[#f3ead0]">
              <dt>Total</dt>
              <dd>{money(cartState.cart.suggestedTotalCents)}</dd>
            </div>
          </dl>
          <label className="mt-6 block">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#9f9676]">
              Intended donation (optional)
            </span>
            <div className="mt-2 flex border border-[#ece2c4]/22">
              <span className="grid w-10 place-items-center text-[#9f9676]">
                $
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={declaredDollars}
                onChange={(event) => setDeclaredDollars(event.target.value)}
                className="w-full bg-transparent px-2 py-2.5 font-mono text-sm"
              />
            </div>
          </label>
          <label className="mt-5 flex items-start gap-3 text-xs leading-5 text-[#aaa082]">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(event) => setAcknowledged(event.target.checked)}
              className="mt-1 accent-[#9dcf83]"
            />
            <span>
              I understand this records a gift request. Any donation happens
              separately through PayPal or Venmo and is verified manually.
            </span>
          </label>
          <button
            type="button"
            disabled={editing || placing || !acknowledged}
            onClick={() => void placeOrder()}
            className="mt-6 flex w-full items-center justify-between bg-[#9dcf83] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#0b0d12] hover:bg-[#b8e7a0] disabled:opacity-35"
          >
            {placing ? 'Recording…' : 'Record request'}
            {placing ? <Check size={15} /> : <ArrowRight size={15} />}
          </button>
        </aside>
      </div>
    </>
  )
}
