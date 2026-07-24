import { useEffect, useRef } from 'react'
import { apiRequest } from '#/lib/api'
import type { MemberProfile } from '#/lib/api'
import { useOrgAuth } from '#/lib/auth'

export function MemberProfileSync() {
  const auth = useOrgAuth()
  const syncedSub = useRef<string | undefined>(undefined)

  useEffect(() => {
    const auth0Sub = auth.user?.sub
    if (!auth.isAuthenticated) {
      syncedSub.current = undefined
      return
    }
    if (auth.isLoading) return
    if (!auth0Sub) return
    if (syncedSub.current === auth0Sub) return

    syncedSub.current = auth0Sub

    async function sync() {
      try {
        const token = await auth.getToken()
        if (!token) {
          syncedSub.current = undefined
          return
        }
        await apiRequest<MemberProfile>('/me', { token })
      } catch {
        syncedSub.current = undefined
      }
    }

    void sync()
  }, [auth.getToken, auth.isAuthenticated, auth.isLoading, auth.user?.sub])

  return null
}
