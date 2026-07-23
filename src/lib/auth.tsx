import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import type { AppState, RedirectLoginOptions } from '@auth0/auth0-react'
import { useRouter } from '@tanstack/react-router'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from 'react'
import type { ReactNode } from 'react'

interface OrgAuth {
  configured: boolean
  isAuthenticated: boolean
  isLoading: boolean
  user?: {
    sub?: string
    name?: string
    email?: string
    picture?: string
    [claim: string]: unknown
  }
  login: (returnTo?: string, signup?: boolean) => Promise<void>
  logout: () => Promise<void>
  getToken: () => Promise<string | undefined>
}

const missingAuth: OrgAuth = {
  configured: false,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
  getToken: async () => undefined,
}

const OrgAuthContext = createContext<OrgAuth>(missingAuth)
const serverAuth: OrgAuth = {
  ...missingAuth,
  configured: true,
  isLoading: true,
}

function Auth0Bridge({ children }: { children: ReactNode }) {
  const auth = useAuth0()

  const login = useCallback(
    async (returnTo = window.location.pathname, signup = false) => {
      const options: RedirectLoginOptions<AppState> = {
        appState: { returnTo },
        authorizationParams: signup ? { screen_hint: 'signup' } : undefined,
      }
      await auth.loginWithRedirect(options)
    },
    [auth],
  )

  const logout = useCallback(async () => {
    auth.logout({
      logoutParams: { returnTo: `${window.location.origin}/logout` },
    })
  }, [auth])

  const getToken = useCallback(async () => {
    if (!auth.isAuthenticated) return undefined
    return auth.getAccessTokenSilently()
  }, [auth])

  const value = useMemo<OrgAuth>(
    () => ({
      configured: true,
      isAuthenticated: auth.isAuthenticated,
      isLoading: auth.isLoading,
      user: auth.user,
      login,
      logout,
      getToken,
    }),
    [auth.isAuthenticated, auth.isLoading, auth.user, login, logout, getToken],
  )

  return (
    <OrgAuthContext.Provider value={value}>{children}</OrgAuthContext.Provider>
  )
}

export function OrgAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const domain = import.meta.env.VITE_AUTH0_DOMAIN
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
  const handleRedirect = useCallback(
    (appState?: AppState) => {
      router.history.replace(appState?.returnTo || '/profile')
    },
    [router.history],
  )

  if (!hydrated) {
    return (
      <OrgAuthContext.Provider value={serverAuth}>
        {children}
      </OrgAuthContext.Provider>
    )
  }

  if (!domain || !clientId || !audience) {
    return (
      <OrgAuthContext.Provider value={missingAuth}>
        {children}
      </OrgAuthContext.Provider>
    )
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/callback`,
        audience,
        scope:
          'openid profile email read:orders update:orders read:content update:content publish:content',
      }}
      onRedirectCallback={handleRedirect}
      useRefreshTokens
    >
      <Auth0Bridge>{children}</Auth0Bridge>
    </Auth0Provider>
  )
}

export function useOrgAuth() {
  return useContext(OrgAuthContext)
}
