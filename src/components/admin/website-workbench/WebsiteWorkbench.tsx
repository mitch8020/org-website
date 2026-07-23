import { Check, RefreshCw } from 'lucide-react'
import { useWebsiteWorkbench } from './useWebsiteWorkbench'
import { WebsiteAccessDenied } from './WebsiteAccessDenied'
import { WebsiteDraftPreview } from './WebsiteDraftPreview'
import { WebsiteEditorPanel } from './WebsiteEditorPanel'
import { WebsitePageLedger } from './WebsitePageLedger'
import { WebsiteRevisionPanel } from './WebsiteRevisionPanel'

export function WebsiteWorkbench() {
  const {
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
  } = useWebsiteWorkbench()

  if (denied) {
    return <WebsiteAccessDenied />
  }

  if (mode === 'preview' && working) {
    return (
      <WebsiteDraftPreview content={working} onClose={() => setMode('edit')} />
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
        <WebsitePageLedger
          selectedPageId={selectedPageId}
          summaries={summaries}
          onSelect={(pageId) => void selectPage(pageId)}
        />
        <WebsiteEditorPanel
          page={page}
          working={working}
          dirty={dirty}
          loading={loading}
          saving={saving}
          canPublish={Boolean(capabilities?.canPublishWebsite)}
          onPreview={() => setMode('preview')}
          onSave={() => void saveDraft()}
          onPublish={() => void publishDraft()}
          onWorkingChange={setWorking}
        />
        <WebsiteRevisionPanel
          page={page}
          selectedPageId={selectedPageId}
          saving={saving}
          onDiscard={() => void discardDraft()}
          onRestore={(revision) => void restoreRevision(revision)}
        />
      </div>
    </>
  )
}
