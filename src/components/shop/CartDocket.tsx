import { Link } from '@tanstack/react-router'
import { ArrowRight, ShoppingBag, Trash2, X } from 'lucide-react'
import { money } from '#/lib/api'
import { useCart } from '#/lib/cart'

export function CartDocket() {
  const cartState = useCart()
  const count =
    cartState.cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0

  return (
    <>
      <button
        type="button"
        onClick={() => cartState.setOpen(true)}
        className="fixed bottom-5 right-5 z-30 flex items-center gap-3 border border-[#9dcf83]/70 bg-[#0b0d12]/95 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#ece2c4] shadow-xl backdrop-blur hover:border-[#9dcf83]"
        aria-label={`Open offering docket with ${count} items`}
      >
        <ShoppingBag size={17} className="text-[#9dcf83]" />
        Docket
        <span className="grid h-6 min-w-6 place-items-center bg-[#9dcf83] px-1 text-[#0b0d12]">
          {count}
        </span>
      </button>

      {cartState.open ? (
        <div className="fixed inset-0 z-[70] bg-black/70" role="presentation">
          <button
            type="button"
            aria-label="Close offering docket"
            className="absolute inset-0 h-full w-full cursor-default"
            onClick={() => cartState.setOpen(false)}
          />
          <aside
            aria-label="Offering docket"
            className="absolute right-0 top-0 flex h-full w-[min(460px,100%)] flex-col border-l border-[#9dcf83]/35 bg-[#0b0d12] shadow-2xl"
          >
            <div className="relative border-b border-dashed border-[#ece2c4]/35 px-6 pb-5 pt-6">
              <div
                aria-hidden
                className="absolute -bottom-2 left-0 right-0 h-4"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, transparent 6px, #0b0d12 6.5px)',
                  backgroundPosition: '-8px 0',
                  backgroundSize: '20px 16px',
                }}
              />
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#9dcf83]">
                ORG · REQUEST RECORD
              </div>
              <div className="mt-1 flex items-center justify-between">
                <h2 className="font-display text-4xl uppercase tracking-[0.04em] text-[#f6efd9]">
                  Offering docket
                </h2>
                <button
                  type="button"
                  onClick={() => cartState.setOpen(false)}
                  aria-label="Close docket"
                  className="grid h-10 w-10 place-items-center border border-[#ece2c4]/20 hover:border-[#9dcf83] hover:text-[#9dcf83]"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {cartState.error ? (
                <p className="border border-[#c98b63]/50 bg-[#c98b63]/10 p-3 text-sm text-[#e7c3a9]">
                  {cartState.error}
                </p>
              ) : null}
              {!cartState.loading && !cartState.cart?.items.length ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <ShoppingBag
                      size={30}
                      className="mx-auto text-[#9dcf83]/60"
                    />
                    <p className="mt-4 text-sm text-[#b8ad8d]">
                      Your docket is empty.
                    </p>
                    <button
                      type="button"
                      onClick={() => cartState.setOpen(false)}
                      className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#9dcf83]"
                    >
                      Browse offerings
                    </button>
                  </div>
                </div>
              ) : null}

              <ul className="space-y-4">
                {cartState.cart?.items.map((item) => (
                  <li
                    key={item.itemId}
                    className="grid grid-cols-[70px_1fr_auto] gap-3 border-b border-dashed border-[#ece2c4]/18 pb-4"
                  >
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="aspect-square w-[70px] object-cover"
                    />
                    <div>
                      <div className="font-display text-lg uppercase tracking-[0.04em] text-[#ece2c4]">
                        {item.productName}
                      </div>
                      <div className="mt-1 font-mono text-[10px] text-[#9f9676]">
                        {item.quantity} × {item.variantLabel}
                      </div>
                      <div className="mt-2 text-xs text-[#9dcf83]">
                        {item.lineSuggestedDonationCents
                          ? `${money(item.lineSuggestedDonationCents)} suggested`
                          : 'Optional donation'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => void cartState.removeItem(item.itemId)}
                      aria-label={`Remove ${item.productName}`}
                      className="grid h-9 w-9 place-items-center text-[#9f9676] hover:text-[#c98b63]"
                    >
                      <Trash2 size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {cartState.cart?.items.length ? (
              <div className="border-t border-[#ece2c4]/20 bg-[#11141a] px-6 py-5">
                <dl className="space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between text-[#b8ad8d]">
                    <dt>Suggested item donation</dt>
                    <dd>{money(cartState.cart.suggestedItemsCents)}</dd>
                  </div>
                  <div className="flex justify-between text-[#b8ad8d]">
                    <dt>Suggested shipping</dt>
                    <dd>{money(cartState.cart.suggestedShippingCents)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-[#ece2c4]/25 pt-3 text-sm text-[#f6efd9]">
                    <dt>Suggested total</dt>
                    <dd>{money(cartState.cart.suggestedTotalCents)}</dd>
                  </div>
                </dl>
                <Link
                  to="/offerings/checkout"
                  onClick={() => cartState.setOpen(false)}
                  className="mt-5 flex w-full items-center justify-between bg-[#9dcf83] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#0b0d12] no-underline hover:bg-[#b8e7a0]"
                >
                  Continue request
                  <ArrowRight size={16} />
                </Link>
              </div>
            ) : null}
          </aside>
        </div>
      ) : null}
    </>
  )
}
