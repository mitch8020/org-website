import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Minus, Plus, X } from 'lucide-react'
import { money } from '#/lib/api'
import type { Product } from '#/lib/api'
import { useCart } from '#/lib/cart'

export function ProductDialog({
  product,
  onClose,
}: {
  product: Product | null
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const navigate = useNavigate()
  const cart = useCart()
  const [variantId, setVariantId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (product && dialog && !dialog.open) {
      setVariantId(product.variants[0]?.id ?? '')
      setQuantity(1)
      setNote('')
      dialog.showModal()
    } else if (!product && dialog?.open) {
      dialog.close()
    }
  }, [product])

  if (!product) {
    return <dialog ref={dialogRef} />
  }

  const selectedVariant =
    product.variants.find((variant) => variant.id === variantId) ??
    product.variants[0]

  async function add(orderNow: boolean) {
    setSaving(true)
    try {
      await cart.addItem({
        productSlug: product!.slug,
        variantId: selectedVariant.id,
        quantity,
        note: note.trim() || undefined,
      })
      onClose()
      if (orderNow) {
        cart.setOpen(false)
        await navigate({ to: '/offerings/checkout' })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      className="m-auto max-h-[92vh] w-[min(920px,calc(100%-24px))] overflow-y-auto border border-[#9dcf83]/40 bg-[#0b0d12] p-0 text-[#ece2c4] shadow-2xl backdrop:bg-black/80"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close product details"
        className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center border border-[#ece2c4]/25 bg-[#0b0d12]/90 text-[#ece2c4] hover:border-[#9dcf83] hover:text-[#9dcf83]"
      >
        <X size={18} />
      </button>

      <div className="grid md:grid-cols-[0.92fr_1.08fr]">
        <div className="relative min-h-[320px] overflow-hidden border-b border-[#ece2c4]/15 md:border-b-0 md:border-r">
          <img
            src={product.imageUrl}
            alt={product.imageAlt}
            className="h-full min-h-[320px] w-full object-cover"
          />
          <span className="absolute bottom-3 left-3 bg-[#0b0d12]/88 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[#9dcf83]">
            Illustrative render
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#9dcf83]">
            {product.category.replaceAll('-', ' ')} · {product.availability}
          </div>
          <h2 className="font-display mt-2 pr-10 text-4xl font-semibold uppercase tracking-[0.035em] text-[#f6efd9]">
            {product.name}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#cdc2a4]">
            {product.description}
          </p>

          <ul className="mt-5 grid gap-2 border-y border-dashed border-[#ece2c4]/20 py-4 font-mono text-[11px] text-[#b8ad8d]">
            {product.specifications.map((specification) => (
              <li key={specification}>— {specification}</li>
            ))}
          </ul>

          <label className="mt-5 block">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9f9676]">
              Select an option
            </span>
            <select
              value={variantId}
              onChange={(event) => setVariantId(event.target.value)}
              className="mt-2 w-full border border-[#ece2c4]/25 bg-[#11141a] px-3 py-3 text-sm text-[#ece2c4]"
            >
              {product.variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.label}
                  {variant.suggestedDonationCents !== undefined
                    ? ` · ${money(variant.suggestedDonationCents)} suggested`
                    : ' · optional donation'}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-4 grid gap-4 sm:grid-cols-[140px_1fr]">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9f9676]">
                Quantity
              </span>
              <div className="mt-2 flex h-11 items-center border border-[#ece2c4]/25">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  aria-label="Decrease quantity"
                  className="grid h-full w-11 place-items-center text-[#b8ad8d] hover:text-[#9dcf83]"
                >
                  <Minus size={14} />
                </button>
                <span className="flex-1 text-center font-mono text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((value) => Math.min(10, value + 1))
                  }
                  aria-label="Increase quantity"
                  className="grid h-full w-11 place-items-center text-[#b8ad8d] hover:text-[#9dcf83]"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <label>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9f9676]">
                Custom note
              </span>
              <input
                value={note}
                onChange={(event) => setNote(event.target.value)}
                maxLength={500}
                placeholder="Color, dimensions, device…"
                className="mt-2 h-11 w-full border border-[#ece2c4]/25 bg-transparent px-3 text-sm text-[#ece2c4] placeholder:text-[#6f6646]"
              />
            </label>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => void add(false)}
              className="border border-[#9dcf83] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#9dcf83] hover:bg-[#9dcf83] hover:text-[#0b0d12] disabled:opacity-50"
            >
              {saving ? 'Recording…' : 'Add to order'}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => void add(true)}
              className="bg-[#9dcf83] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#0b0d12] hover:bg-[#b8e7a0] disabled:opacity-50"
            >
              Order now
            </button>
          </div>
          <p className="mt-4 text-[11px] leading-5 text-[#8f876e]">
            These are gifts from ORG. Displayed amounts are suggested donations,
            not item prices. Availability is confirmed after your request.
          </p>
        </div>
      </div>
    </dialog>
  )
}
