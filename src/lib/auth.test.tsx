// @vitest-environment jsdom

import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OrgAuthProvider, useOrgAuth } from './auth'

const mocks = vi.hoisted(() => ({
  auth0Logout: vi.fn(),
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
    getAccessTokenSilently: vi.fn(),
    isAuthenticated: false,
    isLoading: false,
    loginWithRedirect: vi.fn(),
    logout: mocks.auth0Logout,
    user: undefined,
  }),
}))

function LogoutProbe() {
  const auth = useOrgAuth()
  return <button onClick={() => void auth.logout()}>Sign out</button>
}

describe('OrgAuthProvider redirect callback', () => {
  beforeEach(() => {
    mocks.auth0Logout.mockReset()
    mocks.historyReplace.mockReset()
    mocks.providerProps = undefined
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
        <LogoutProbe />
      </OrgAuthProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }))

    expect(mocks.auth0Logout).toHaveBeenCalledWith({
      logoutParams: {
        returnTo: `${window.location.origin}/logout`,
      },
    })
  })
})
