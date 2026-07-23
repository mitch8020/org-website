import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { apiRequest } from './api'
import type { Cart } from './api'
import { useOrgAuth } from './auth'

const GUEST_TOKEN_KEY = 'org-offerings-cart-token'

interface CartContextValue {
  cart: Cart | null
  loading: boolean
  error: string
  open: boolean
  setOpen: (open: boolean) => void
  refresh: () => Promise<void>
  addItem: (input: {
    productSlug: string
    variantId: string
    quantity: number
    note?: string
  }) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

function getGuestToken() {
  return typeof window === 'undefined'
    ? undefined
    : localStorage.getItem(GUEST_TOKEN_KEY) || undefined
}

export function CartProvider({ children }: { children: ReactNode }) {
  const auth = useOrgAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  const ensureGuestToken = useCallback(async () => {
    const current = getGuestToken()
    if (current) return current
    const created = await apiRequest<{ guestToken: string; cart: Cart }>(
      '/carts/guest',
      { method: 'POST' },
    )
    localStorage.setItem(GUEST_TOKEN_KEY, created.guestToken)
    setCart(created.cart)
    return created.guestToken
  }, [])

  const credentials = useCallback(async () => {
    const token = await auth.getToken()
    if (token) return { token }
    return { guestToken: await ensureGuestToken() }
  }, [auth, ensureGuestToken])

  const refresh = useCallback(async () => {
    if (auth.isLoading) return
    setLoading(true)
    setError('')
    try {
      const token = await auth.getToken()
      const guestToken = getGuestToken()
      if (token && guestToken) {
        await apiRequest<Cart>('/cart/merge', {
          method: 'POST',
          token,
          body: JSON.stringify({ guestToken }),
        })
        localStorage.removeItem(GUEST_TOKEN_KEY)
      }
      const currentCredentials = token
        ? { token }
        : { guestToken: await ensureGuestToken() }
      setCart(await apiRequest<Cart>('/cart', currentCredentials))
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'The docket could not load.',
      )
    } finally {
      setLoading(false)
    }
  }, [auth, ensureGuestToken])

  useEffect(() => {
    void refresh()
  }, [refresh, auth.isAuthenticated])

  const addItem = useCallback(
    async (input: {
      productSlug: string
      variantId: string
      quantity: number
      note?: string
    }) => {
      setError('')
      try {
        const next = await apiRequest<Cart>('/cart/items', {
          method: 'PATCH',
          ...(await credentials()),
          body: JSON.stringify(input),
        })
        setCart(next)
        setOpen(true)
      } catch (cause) {
        const message =
          cause instanceof Error ? cause.message : 'That item was not added.'
        setError(message)
        throw cause
      }
    },
    [credentials],
  )

  const removeItem = useCallback(
    async (itemId: string) => {
      setError('')
      setCart(
        await apiRequest<Cart>(`/cart/items/${encodeURIComponent(itemId)}`, {
          method: 'DELETE',
          ...(await credentials()),
        }),
      )
    },
    [credentials],
  )

  const value = useMemo(
    () => ({
      cart,
      loading,
      error,
      open,
      setOpen,
      refresh,
      addItem,
      removeItem,
    }),
    [cart, loading, error, open, refresh, addItem, removeItem],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error('useCart must be used within CartProvider.')
  return value
}
