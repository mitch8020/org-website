import { useEffect, useMemo, useState } from 'react'
import {
  createFileRoute,
  Link,
  useBlocker,
  useRouter,
} from '@tanstack/react-router'
import {
  ArrowLeft,
  Check,
  Eye,
  FileClock,
  LockKeyhole,
  RefreshCw,
  RotateCcw,
  Save,
  Send,
  X,
} from 'lucide-react'
import { MemberGate } from '#/components/shop/MemberGate'
import { ShopShell } from '#/components/shop/ShopShell'
import { WebsiteContentForm } from '#/components/admin/WebsiteContentForm'
import { ReferencePage } from '#/components/ReferencePage'
import { AboutDocument } from '#/routes/about'
import { apiRequest, ApiError } from '#/lib/api'
import { useOrgAuth } from '#/lib/auth'
import {
  discardAdminDraft,
  loadAdminPage,
  publishAdminDraft,
  restoreAdminRevision,
  saveAdminDraft,
} from '#/lib/content-api'
import { cloneWebsiteContent } from '#/lib/content-defaults'
import type {
  AdminWebsitePage,
  WebsiteCapabilities,
  WebsitePageContent,
  WebsitePageId,
  WebsitePageSummary,
} from '#/lib/content-types'

export const Route = createFileRoute('/admin/website')({
  head: () => ({
    meta: [
      { title: 'Website archive — ORG' },
      {
        name: 'description',
        content: 'Draft and publish ORG website records.',
      },
    ],
  }),
  component: AdminWebsitePage,
})

const PAGE_LEDGER: Array<{
  id: WebsitePageId
  label: string
  href: string
}> = [
  { id: 'about', label: 'About Us', href: '/about' },
  { id: 'community', label: 'Community', href: '/community' },
  { id: 'beliefs', label: 'Beliefs', href: '/beliefs' },
  { id: 'infrastructure', label: 'Infrastructure', href: '/infrastructure' },
  { id: 'research', label: 'Research', href: '/research' },
  { id: 'legal', label: 'Legal', href: '/legal' },
  { id: 'future', label: 'Future Ideas', href: '/future-ideas' },
  {
    id: 'donations',
    label: 'Gifts & Contributions',
    href: '/gifts-contributions',
  },
]

function AdminWebsitePage() {
  return (
    <ShopShell>
      <main className="relative z-[1] mx-auto max-w-[1480px] px-[clamp(16px,3vw,40px)] pb-24 pt-[clamp(132px,16vh,176px)]">
        <MemberGate returnTo="/admin/website">
          <WebsiteWorkbench />
        </MemberGate>
      </main>
    </ShopShell>
  )
}

function WebsiteWorkbench() {
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
    () => !!working && JSON.stringify(working) !== savedSnapshot,
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
    const source = nextPage.draft?.content ?? nextPage.published.content
    const nextWorking = cloneWebsiteContent(source)
    setPage(nextPage)
    setWorking(nextWorking)
    setSavedSnapshot(JSON.stringify(nextWorking))
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
        setError(
          cause instanceof Error
            ? cause.message
            : 'The website archive did not load.',
        )
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
      setError(
        cause instanceof Error ? cause.message : 'That page did not load.',
      )
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
      setError(
        cause instanceof Error ? cause.message : 'The draft was not saved.',
      )
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
      setError(
        cause instanceof Error ? cause.message : 'The page was not published.',
      )
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
      setError(
        cause instanceof Error ? cause.message : 'The draft was not discarded.',
      )
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
      setError(
        cause instanceof Error
          ? cause.message
          : 'That revision was not restored.',
      )
    } finally {
      setSaving(false)
    }
  }

  if (denied) {
    return (
      <section className="mx-auto max-w-2xl border border-[#c98b63]/50 p-8 text-center">
        <LockKeyhole size={28} className="mx-auto text-[#c98b63]" />
        <h1 className="font-display mt-5 text-5xl uppercase tracking-[0.03em]">
          Website admin required.
        </h1>
        <p className="mt-4 text-sm leading-7 text-[#b8ad8d]">
          Ask an Auth0 administrator to assign the ORG Website Admin role, then
          sign in again.
        </p>
        <Link
          to="/profile"
          className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#9dcf83] no-underline"
        >
          <ArrowLeft size={13} /> Return to profile
        </Link>
      </section>
    )
  }

  if (mode === 'preview' && working) {
    return (
      <div className="fixed inset-0 z-[90] overflow-auto bg-[#0b0d12]">
        <div className="fixed inset-x-0 top-0 z-[110] flex flex-wrap items-center justify-between gap-3 border-b border-[#d4a24a]/45 bg-[#080a0e]/95 px-4 py-3 backdrop-blur">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#d4a24a]">
            Draft preview · not public
          </div>
          <button
            type="button"
            onClick={() => setMode('edit')}
            className="inline-flex items-center gap-2 border border-[#ece2c4]/30 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#ece2c4]"
          >
            <X size={12} /> Return to editor
          </button>
        </div>
        {working.kind === 'about' ? (
          <AboutDocument content={working} />
        ) : (
          <ReferencePage page={working} />
        )}
      </div>
    )
  }

  return (
    <>
      <header className="grid gap-6 border-b border-[#ece2c4]/18 pb-7 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4a24a]">
            Host archive · Content control
          </div>
          <h1 className="font-display mt-2 text-[clamp(52px,9vw,96px)] uppercase leading-[0.82] tracking-[0.01em] text-[#f6efd9]">
            Website archive.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b8ad8d]">
            Prepare a shared draft, inspect the visitor view, then publish one
            complete revision.
          </p>
        </div>
        <div
          aria-label={
            page
              ? `Live revision ${page.published.revision}`
              : 'Revision unavailable'
          }
          className="-rotate-2 border-2 border-[#d4a24a]/65 px-6 py-4 text-center text-[#d4a24a]"
        >
          <div className="font-mono text-[8px] uppercase tracking-[0.3em]">
            {page?.draft ? 'Draft active' : 'Live record'}
          </div>
          <div className="font-display mt-1 text-4xl uppercase leading-none">
            REV {page?.published.revision ?? '—'}
          </div>
        </div>
      </header>

      {error ? (
        <div
          role="alert"
          className="mt-5 flex flex-wrap items-center justify-between gap-3 border border-[#c98b63]/50 bg-[#c98b63]/10 p-4 text-sm text-[#e7c3a9]"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => void initialize()}
            className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em]"
          >
            <RefreshCw size={12} /> Reload
          </button>
        </div>
      ) : null}

      {notice ? (
        <div
          role="status"
          className="mt-5 flex items-center gap-2 border border-[#9dcf83]/45 bg-[#9dcf83]/8 p-4 text-sm text-[#b8e7a0]"
        >
          <Check size={14} /> {notice}
        </div>
      ) : null}

      <div className="mt-7 grid gap-7 xl:grid-cols-[238px_minmax(0,1fr)_230px]">
        <aside>
          <div className="sticky top-28">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#9f9676]">
                Page ledger
              </span>
              <span className="font-mono text-[8px] text-[#6f684f]">008</span>
            </div>
            <div className="border border-[#ece2c4]/16">
              {PAGE_LEDGER.map((entry, index) => {
                const summary = summaries.find(
                  (item) => item.pageId === entry.id,
                )
                const selected = entry.id === selectedPageId
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => void selectPage(entry.id)}
                    className={`grid w-full grid-cols-[28px_1fr_auto] items-center gap-2 border-b border-[#ece2c4]/10 px-3 py-3 text-left last:border-b-0 ${
                      selected
                        ? 'bg-[#d4a24a]/10 text-[#f3ead0]'
                        : 'text-[#9f9676] hover:bg-[#ece2c4]/[0.025] hover:text-[#ece2c4]'
                    }`}
                  >
                    <span className="font-mono text-[8px]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="truncate text-xs">{entry.label}</span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        summary?.draftRevision
                          ? 'bg-[#d4a24a]'
                          : 'bg-[#9dcf83]/65'
                      }`}
                      title={summary?.draftRevision ? 'Draft active' : 'Live'}
                    />
                  </button>
                )
              })}
            </div>
            <Link
              to="/profile"
              className="mt-4 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#9f9676] no-underline hover:text-[#ece2c4]"
            >
              <ArrowLeft size={12} /> Profile
            </Link>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="sticky top-3 z-40 flex flex-wrap items-center justify-between gap-3 border border-[#ece2c4]/18 bg-[#0b0d12]/95 p-3 backdrop-blur">
            <div>
              <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#9f9676]">
                {page?.draft
                  ? `Shared draft ${page.draft.revision}`
                  : 'No active draft'}
              </div>
              <div className="mt-1 text-sm text-[#f3ead0]">
                {working?.title ?? 'Loading page…'}
                {dirty ? (
                  <span className="ml-2 text-xs text-[#d4a24a]">
                    Unsaved changes
                  </span>
                ) : null}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!working || loading}
                onClick={() => setMode('preview')}
                className="inline-flex items-center gap-2 border border-[#ece2c4]/25 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#ece2c4] disabled:opacity-35"
              >
                <Eye size={12} /> Preview
              </button>
              <button
                type="button"
                disabled={!working || !dirty || saving || loading}
                onClick={() => void saveDraft()}
                className="inline-flex items-center gap-2 border border-[#d4a24a] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#d4a24a] hover:bg-[#d4a24a] hover:text-[#0b0d12] disabled:opacity-35"
              >
                <Save size={12} /> {saving ? 'Saving…' : 'Save draft'}
              </button>
              <button
                type="button"
                disabled={
                  !page?.draft ||
                  dirty ||
                  saving ||
                  !capabilities?.canPublishWebsite
                }
                onClick={() => void publishDraft()}
                className="inline-flex items-center gap-2 bg-[#9dcf83] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#0b0d12] hover:bg-[#b8e7a0] disabled:opacity-35"
              >
                <Send size={12} /> Publish
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid min-h-[480px] place-items-center font-mono text-[9px] uppercase tracking-[0.2em] text-[#9f9676]">
              Opening the record…
            </div>
          ) : working ? (
            <div className="mt-4 border border-[#ece2c4]/16 p-4 sm:p-6">
              <WebsiteContentForm content={working} onChange={setWorking} />
            </div>
          ) : null}
        </section>

        <aside>
          <div className="space-y-4 xl:sticky xl:top-28">
            <section className="border border-[#ece2c4]/16 p-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#9f9676]">
                Current state
              </div>
              <dl className="mt-4 space-y-3 text-xs">
                <div className="flex justify-between gap-3">
                  <dt className="text-[#9f9676]">Live revision</dt>
                  <dd className="font-mono text-[#ece2c4]">
                    {page?.published.revision ?? '—'}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#9f9676]">Draft revision</dt>
                  <dd className="font-mono text-[#d4a24a]">
                    {page?.draft?.revision ?? 'None'}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#9f9676]">Public page</dt>
                  <dd>
                    <a
                      href={
                        PAGE_LEDGER.find((item) => item.id === selectedPageId)
                          ?.href
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#9dcf83]"
                    >
                      Open ↗
                    </a>
                  </dd>
                </div>
              </dl>
              {page?.draft ? (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void discardDraft()}
                  className="mt-5 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-[#c98b63]"
                >
                  <X size={12} /> Discard draft
                </button>
              ) : null}
            </section>

            <section className="border border-[#ece2c4]/16 p-4">
              <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#9f9676]">
                <FileClock size={12} /> Published history
              </div>
              {!page?.history.length ? (
                <p className="mt-4 text-xs leading-5 text-[#6f684f]">
                  Older revisions will appear after the first publication.
                </p>
              ) : (
                <ol className="mt-3 space-y-2">
                  {page.history.map((revision) => (
                    <li
                      key={revision.revision}
                      className="flex items-center justify-between gap-3 border-t border-[#ece2c4]/10 pt-2"
                    >
                      <div>
                        <div className="font-mono text-[9px] text-[#ece2c4]">
                          Revision {revision.revision}
                        </div>
                        <div className="mt-0.5 text-[10px] text-[#6f684f]">
                          {new Date(revision.publishedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => void restoreRevision(revision.revision)}
                        className="grid h-8 w-8 place-items-center border border-[#ece2c4]/16 text-[#9f9676] hover:border-[#d4a24a] hover:text-[#d4a24a]"
                        aria-label={`Restore revision ${revision.revision} to draft`}
                        title="Restore to draft"
                      >
                        <RotateCcw size={12} />
                      </button>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </div>
        </aside>
      </div>
    </>
  )
}
