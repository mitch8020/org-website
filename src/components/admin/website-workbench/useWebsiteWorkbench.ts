import { useEffect, useMemo, useState } from 'react'
import { useBlocker, useRouter } from '@tanstack/react-router'
import { apiRequest, ApiError } from '#/lib/api'
import { useOrgAuth } from '#/lib/auth'
import {
  discardAdminDraft,
  loadAdminPage,
  publishAdminDraft,
  restoreAdminRevision,
  saveAdminDraft,
} from '#/lib/content-api'
import type {
  AdminWebsitePage,
  WebsiteCapabilities,
  WebsitePageContent,
  WebsitePageId,
  WebsitePageSummary,
} from '#/lib/content-types'
import {
  createWorkingPageState,
  getWorkbenchError,
  hasUnsavedWebsiteChanges,
} from './workbench-state'

export function useWebsiteWorkbench() {
  const auth = useOrgAuth()
  const router = useRouter()
  const [selectedPageId, setSelectedPageId] = useState<WebsitePageId>('about')
  const [summaries, setSummaries] = useState<WebsitePageSummary[]>([])
  const [page, setPage] = useState<AdminWebsitePage | null>(null)
  const [working, setWorking] = useState<WebsitePageContent | null>(null)
  const [savedSnapshot, setSavedSnapshot] = useState('')
  const [capabilities, setCapabilities] = useState<WebsiteCapabilities | null>(
    null,
  )
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [denied, setDenied] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const dirty = useMemo(
    () => hasUnsavedWebsiteChanges(working, savedSnapshot),
    [savedSnapshot, working],
  )

  useBlocker({
    shouldBlockFn: () =>
      dirty &&
      !window.confirm('Leave the editor and lose your unsaved changes?'),
    enableBeforeUnload: dirty,
    disabled: !dirty,
  })

  function applyPage(nextPage: AdminWebsitePage) {
    const nextState = createWorkingPageState(nextPage)
    setPage(nextPage)
    setWorking(nextState.working)
    setSavedSnapshot(nextState.savedSnapshot)
  }

  async function getToken() {
    const token = await auth.getToken()
    if (!token) throw new Error('Your sign-in session has expired.')
    return token
  }

  async function refreshSummaries(token: string) {
    const next = await apiRequest<WebsitePageSummary[]>(
      '/admin/content/pages',
      { token },
    )
    setSummaries(next)
  }

  async function initialize() {
    setLoading(true)
    setDenied(false)
    setError('')
    try {
      const token = await getToken()
      const [nextSummaries, nextCapabilities, nextPage] = await Promise.all([
        apiRequest<WebsitePageSummary[]>('/admin/content/pages', { token }),
        apiRequest<WebsiteCapabilities>('/me/capabilities', { token }),
        loadAdminPage(selectedPageId, token),
      ])
      setSummaries(nextSummaries)
      setCapabilities(nextCapabilities)
      applyPage(nextPage)
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 403) {
        setDenied(true)
      } else {
        setError(getWorkbenchError(cause, 'The website archive did not load.'))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void initialize()
  }, [])

  async function selectPage(pageId: WebsitePageId) {
    if (pageId === selectedPageId) return
    if (
      dirty &&
      !window.confirm('Open another page and lose your unsaved changes?')
    ) {
      return
    }
    setLoading(true)
    setError('')
    setNotice('')
    try {
      const token = await getToken()
      const nextPage = await loadAdminPage(pageId, token)
      setSelectedPageId(pageId)
      applyPage(nextPage)
    } catch (cause) {
      setError(getWorkbenchError(cause, 'That page did not load.'))
    } finally {
      setLoading(false)
    }
  }

  async function saveDraft() {
    if (!working || !page) return
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const token = await getToken()
      const updated = await saveAdminDraft(
        page.pageId,
        token,
        page.draft?.revision ?? null,
        working,
      )
      applyPage(updated)
      await refreshSummaries(token)
      setNotice('Draft saved.')
    } catch (cause) {
      setError(getWorkbenchError(cause, 'The draft was not saved.'))
    } finally {
      setSaving(false)
    }
  }

  async function publishDraft() {
    if (!page?.draft || dirty) return
    if (
      !window.confirm(
        `Publish revision ${page.published.revision + 1} of ${page.published.content.title}?`,
      )
    ) {
      return
    }
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const token = await getToken()
      const updated = await publishAdminDraft(
        page.pageId,
        token,
        page.draft.revision,
      )
      applyPage(updated)
      await Promise.all([refreshSummaries(token), router.invalidate()])
      window.dispatchEvent(new CustomEvent('org:content-published'))
      setNotice('Published.')
    } catch (cause) {
      setError(getWorkbenchError(cause, 'The page was not published.'))
    } finally {
      setSaving(false)
    }
  }

  async function discardDraft() {
    if (!page?.draft) return
    if (
      !window.confirm(
        'Discard the shared draft and return this page to its live content?',
      )
    ) {
      return
    }
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const token = await getToken()
      const updated = await discardAdminDraft(
        page.pageId,
        token,
        page.draft.revision,
      )
      applyPage(updated)
      await refreshSummaries(token)
      setNotice('Draft discarded.')
    } catch (cause) {
      setError(getWorkbenchError(cause, 'The draft was not discarded.'))
    } finally {
      setSaving(false)
    }
  }

  async function restoreRevision(revision: number) {
    if (!page) return
    const unsavedWarning = dirty
      ? ' This will also replace your unsaved local changes.'
      : ''
    if (
      !window.confirm(
        `Restore published revision ${revision} into the shared draft? Nothing will go live yet.${unsavedWarning}`,
      )
    ) {
      return
    }
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const token = await getToken()
      const updated = await restoreAdminRevision(
        page.pageId,
        revision,
        token,
        page.draft?.revision ?? null,
      )
      applyPage(updated)
      await refreshSummaries(token)
      setNotice(`Revision ${revision} restored to draft.`)
    } catch (cause) {
      setError(getWorkbenchError(cause, 'That revision was not restored.'))
    } finally {
      setSaving(false)
    }
  }

  return {
    capabilities,
    denied,
    dirty,
    discardDraft,
    error,
    initialize,
    loading,
    mode,
    notice,
    page,
    publishDraft,
    restoreRevision,
    saveDraft,
    saving,
    selectedPageId,
    selectPage,
    setMode,
    setWorking,
    summaries,
    working,
  }
}
