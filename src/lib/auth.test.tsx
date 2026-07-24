// @vitest-environment jsdom

import { renderToString } from 'react-dom/server'
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { OrgAuthProvider, useOrgAuth } from './auth'

const mocks = vi.hoisted(() => ({
  auth0Logout: vi.fn(),
  auth0Login: vi.fn(),
  auth0GetToken: vi.fn(),
  auth0State: {
    isAuthenticated: false,
    isLoading: false,
    user: undefined as
      | {
          sub?: string
          name?: string
        }
      | undefined,
  },
  historyReplace: vi.fn(),
  providerProps: undefined as
    | {
        authorizationParams?: {
          redirect_uri?: string
        }
        onRedirectCallback?: (appState?: { returnTo?: string }) => void
      }
    | undefined,
}))

vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({
    history: {
      replace: mocks.historyReplace,
    },
  }),
}))

vi.mock('@auth0/auth0-react', () => ({
  Auth0Provider: (
    props: React.PropsWithChildren<{
      authorizationParams?: {
        redirect_uri?: string
      }
      onRedirectCallback?: (appState?: { returnTo?: string }) => void
    }>,
  ) => {
    mocks.providerProps = props
    return props.children
  },
  useAuth0: () => ({
    getAccessTokenSilently: mocks.auth0GetToken,
    isAuthenticated: mocks.auth0State.isAuthenticated,
    isLoading: mocks.auth0State.isLoading,
    loginWithRedirect: mocks.auth0Login,
    logout: mocks.auth0Logout,
    user: mocks.auth0State.user,
  }),
}))

function AuthProbe() {
  const auth = useOrgAuth()
  return (
    <>
      <output data-testid="auth-state">
        {JSON.stringify({
          configured: auth.configured,
          isAuthenticated: auth.isAuthenticated,
          isLoading: auth.isLoading,
          user: auth.user,
        })}
      </output>
      <button onClick={() => void auth.login()}>Sign in</button>
      <button onClick={() => void auth.login('/profile', true)}>Sign up</button>
      <button onClick={() => void auth.logout()}>Sign out</button>
      <button
        onClick={() =>
          void auth.getToken().then((token) => {
            document.body.dataset.token = token || 'none'
          })
        }
      >
        Get token
      </button>
    </>
  )
}

describe('OrgAuthProvider redirect callback', () => {
  beforeEach(() => {
    mocks.auth0Logout.mockReset()
    mocks.auth0Login.mockReset()
    mocks.auth0GetToken.mockReset()
    mocks.auth0State.isAuthenticated = false
    mocks.auth0State.isLoading = false
    mocks.auth0State.user = undefined
    mocks.historyReplace.mockReset()
    mocks.providerProps = undefined
    delete document.body.dataset.token
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllEnvs()
  })

  it('sends Auth0 to the dedicated callback route', () => {
    render(
      <OrgAuthProvider>
        <div>child</div>
      </OrgAuthProvider>,
    )

    expect(mocks.providerProps?.authorizationParams?.redirect_uri).toBe(
      `${window.location.origin}/callback`,
    )
  })

  it('uses client-side router history so the Auth0 memory cache survives', () => {
    render(
      <OrgAuthProvider>
        <div>child</div>
      </OrgAuthProvider>,
    )

    act(() => {
      mocks.providerProps?.onRedirectCallback?.({ returnTo: '/profile' })
    })

    expect(mocks.historyReplace).toHaveBeenCalledWith('/profile')
  })

  it('falls back to the profile route when Auth0 has no return target', () => {
    render(
      <OrgAuthProvider>
        <div>child</div>
      </OrgAuthProvider>,
    )

    act(() => {
      mocks.providerProps?.onRedirectCallback?.()
    })

    expect(mocks.historyReplace).toHaveBeenCalledWith('/profile')
  })

  it('returns from Auth0 logout through the dedicated logout route', () => {
    render(
      <OrgAuthProvider>
        <AuthProbe />
      </OrgAuthProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }))

    expect(mocks.auth0Logout).toHaveBeenCalledWith({
      logoutParams: {
        returnTo: `${window.location.origin}/logout`,
      },
    })
  })

  it('exposes the loading server auth state during SSR', () => {
    const html = renderToString(
      <OrgAuthProvider>
        <AuthProbe />
      </OrgAuthProvider>,
    )

    expect(html).toContain('&quot;configured&quot;:true')
    expect(html).toContain('&quot;isLoading&quot;:true')
  })

  it('uses inert auth actions when Auth0 configuration is missing', async () => {
    vi.stubEnv('VITE_AUTH0_DOMAIN', '')

    render(
      <OrgAuthProvider>
        <AuthProbe />
      </OrgAuthProvider>,
    )

    expect(screen.getByTestId('auth-state').textContent).toContain(
      '"configured":false',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }))
    fireEvent.click(screen.getByRole('button', { name: 'Get token' }))
    await waitFor(() => expect(document.body.dataset.token).toBe('none'))
    expect(mocks.auth0Login).not.toHaveBeenCalled()
    expect(mocks.auth0Logout).not.toHaveBeenCalled()
  })

  it('passes default login and explicit signup options to Auth0', () => {
    render(
      <OrgAuthProvider>
        <AuthProbe />
      </OrgAuthProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }))

    expect(mocks.auth0Login).toHaveBeenNthCalledWith(1, {
      appState: { returnTo: window.location.pathname },
      authorizationParams: undefined,
    })
    expect(mocks.auth0Login).toHaveBeenNthCalledWith(2, {
      appState: { returnTo: '/profile' },
      authorizationParams: { screen_hint: 'signup' },
    })
  })

  it.each([
    [false, undefined, 'none'],
    [true, 'access-token', 'access-token'],
  ])(
    'returns the expected access token when authenticated is %s',
    async (isAuthenticated, token, expected) => {
      mocks.auth0State.isAuthenticated = isAuthenticated
      mocks.auth0State.user = isAuthenticated
        ? { sub: 'auth0|member', name: 'Member' }
        : undefined
      mocks.auth0GetToken.mockResolvedValue(token)

      render(
        <OrgAuthProvider>
          <AuthProbe />
        </OrgAuthProvider>,
      )

      fireEvent.click(screen.getByRole('button', { name: 'Get token' }))
      await waitFor(() => expect(document.body.dataset.token).toBe(expected))
      expect(mocks.auth0GetToken).toHaveBeenCalledTimes(isAuthenticated ? 1 : 0)
    },
  )
})
