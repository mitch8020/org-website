// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Cart } from './api'
import { CartProvider, getGuestToken, useCart } from './cart'

const mocks = vi.hoisted(() => ({
  apiRequest: vi.fn(),
  auth: {
    isAuthenticated: false,
    isLoading: false,
    getToken: vi.fn<() => Promise<string | undefined>>(),
  },
}))

vi.mock('./api', () => ({
  apiRequest: mocks.apiRequest,
}))

vi.mock('./auth', () => ({
  useOrgAuth: () => mocks.auth,
}))

const emptyCart: Cart = {
  id: 'cart-1',
  items: [],
  suggestedItemsCents: 0,
  suggestedShippingCents: 0,
  suggestedTotalCents: 0,
}

const filledCart: Cart = {
  ...emptyCart,
  items: [
    {
      itemId: 'line-1',
      productSlug: 'mesh-tool',
      productName: 'Mesh Tool',
      imageUrl: '/mesh.webp',
      imageAlt: 'Mesh tool',
      variantId: 'standard',
      variantLabel: 'Standard',
      quantity: 2,
      unitSuggestedDonationCents: 1200,
      lineSuggestedDonationCents: 2400,
    },
  ],
  suggestedItemsCents: 2400,
  suggestedShippingCents: 1500,
  suggestedTotalCents: 3900,
}

function Probe() {
  const cart = useCart()
  return (
    <>
      <output data-testid="state">
        {JSON.stringify({
          cart: cart.cart,
          loading: cart.loading,
          error: cart.error,
          open: cart.open,
        })}
      </output>
      <button onClick={() => void cart.refresh()}>Refresh</button>
      <button
        onClick={() =>
          void cart
            .addItem({
              productSlug: 'mesh-tool',
              variantId: 'standard',
              quantity: 2,
            })
            .catch(() => undefined)
        }
      >
        Add
      </button>
      <button onClick={() => void cart.removeItem('line-1')}>Remove</button>
      <button onClick={() => cart.setOpen(false)}>Close</button>
    </>
  )
}

function state() {
  return JSON.parse(screen.getByTestId('state').textContent || '{}') as {
    cart: Cart | null
    loading: boolean
    error: string
    open: boolean
  }
}

beforeEach(() => {
  localStorage.clear()
  mocks.apiRequest.mockReset()
  mocks.auth.isAuthenticated = false
  mocks.auth.isLoading = false
  mocks.auth.getToken.mockReset()
  mocks.auth.getToken.mockResolvedValue(undefined)
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('guest token storage', () => {
  it('returns no token on the server', () => {
    vi.stubGlobal('window', undefined)

    expect(getGuestToken()).toBeUndefined()
  })

  it('returns a stored browser token and normalizes a missing one', () => {
    expect(getGuestToken()).toBeUndefined()
    localStorage.setItem('org-offerings-cart-token', 'guest-token')
    expect(getGuestToken()).toBe('guest-token')
  })
})

describe('CartProvider', () => {
  it('creates an anonymous cart, then adds and removes a selection', async () => {
    mocks.apiRequest.mockImplementation((path: string): Promise<unknown> => {
      if (path === '/carts/guest') {
        return Promise.resolve({
          guestToken: 'guest-token',
          cart: emptyCart,
        })
      }
      if (path === '/cart') return Promise.resolve(emptyCart)
      if (path === '/cart/items') return Promise.resolve(filledCart)
      if (path === '/cart/items/line-1') return Promise.resolve(emptyCart)
      throw new Error(`Unexpected API path: ${path}`)
    })

    render(
      <CartProvider>
        <Probe />
      </CartProvider>,
    )

    await waitFor(() => expect(state().loading).toBe(false))
    expect(localStorage.getItem('org-offerings-cart-token')).toBe('guest-token')
    expect(state().cart).toEqual(emptyCart)

    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    await waitFor(() => expect(state().cart).toEqual(filledCart))
    expect(state().open).toBe(true)
    expect(mocks.apiRequest).toHaveBeenCalledWith(
      '/cart/items',
      expect.objectContaining({
        method: 'PATCH',
        guestToken: 'guest-token',
      }),
    )

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(state().open).toBe(false)
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))
    await waitFor(() => expect(state().cart).toEqual(emptyCart))
    expect(mocks.apiRequest).toHaveBeenCalledWith(
      '/cart/items/line-1',
      expect.objectContaining({
        method: 'DELETE',
        guestToken: 'guest-token',
      }),
    )
  })

  it('merges a guest cart after authentication', async () => {
    localStorage.setItem('org-offerings-cart-token', 'guest-token')
    mocks.auth.isAuthenticated = true
    mocks.auth.getToken.mockResolvedValue('access-token')
    mocks.apiRequest.mockResolvedValue(emptyCart)

    render(
      <CartProvider>
        <Probe />
      </CartProvider>,
    )

    await waitFor(() => expect(state().loading).toBe(false))
    expect(mocks.apiRequest).toHaveBeenNthCalledWith(1, '/cart/merge', {
      method: 'POST',
      token: 'access-token',
      body: JSON.stringify({ guestToken: 'guest-token' }),
    })
    expect(mocks.apiRequest).toHaveBeenNthCalledWith(2, '/cart', {
      token: 'access-token',
    })
    expect(localStorage.getItem('org-offerings-cart-token')).toBeNull()
  })

  it('loads an authenticated cart when there is no guest cart', async () => {
    mocks.auth.isAuthenticated = true
    mocks.auth.getToken.mockResolvedValue('access-token')
    mocks.apiRequest
      .mockResolvedValueOnce(emptyCart)
      .mockResolvedValueOnce(filledCart)

    render(
      <CartProvider>
        <Probe />
      </CartProvider>,
    )

    await waitFor(() => expect(state().loading).toBe(false))
    expect(mocks.apiRequest).toHaveBeenCalledTimes(1)
    expect(mocks.apiRequest).toHaveBeenCalledWith('/cart', {
      token: 'access-token',
    })

    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    await waitFor(() => expect(state().cart).toEqual(filledCart))
    expect(mocks.apiRequest).toHaveBeenLastCalledWith(
      '/cart/items',
      expect.objectContaining({ token: 'access-token' }),
    )
  })

  it('waits while authentication is loading', async () => {
    mocks.auth.isLoading = true

    render(
      <CartProvider>
        <Probe />
      </CartProvider>,
    )

    await waitFor(() => expect(mocks.auth.getToken).not.toHaveBeenCalled())
    expect(state().loading).toBe(true)
  })

  it.each([
    [new Error('Cart offline'), 'Cart offline'],
    ['offline', 'The docket could not load.'],
  ])('reports a refresh failure from %p', async (failure, message) => {
    mocks.apiRequest.mockRejectedValue(failure)

    render(
      <CartProvider>
        <Probe />
      </CartProvider>,
    )

    await waitFor(() => expect(state().loading).toBe(false))
    expect(state().error).toBe(message)
  })

  it.each([
    [new Error('Item unavailable'), 'Item unavailable'],
    ['unavailable', 'That item was not added.'],
  ])('reports an add failure from %p', async (failure, message) => {
    mocks.apiRequest.mockImplementation((path: string) => {
      if (path === '/carts/guest') {
        return Promise.resolve({
          guestToken: 'guest-token',
          cart: emptyCart,
        })
      }
      if (path === '/cart') return Promise.resolve(emptyCart)
      return Promise.reject(failure)
    })

    render(
      <CartProvider>
        <Probe />
      </CartProvider>,
    )
    await waitFor(() => expect(state().loading).toBe(false))

    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    await waitFor(() => expect(state().error).toBe(message))
  })

  it('throws when the cart hook is used without its provider', () => {
    function InvalidProbe() {
      useCart()
      return null
    }

    expect(() => render(<InvalidProbe />)).toThrow(
      'useCart must be used within CartProvider.',
    )
  })
})
