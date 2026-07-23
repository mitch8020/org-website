import { Eye, Save, Send } from 'lucide-react'
import { WebsiteContentForm } from '#/components/admin/WebsiteContentForm'
import type { AdminWebsitePage, WebsitePageContent } from '#/lib/content-types'

export function WebsiteEditorPanel({
  page,
  working,
  dirty,
  loading,
  saving,
  canPublish,
  onPreview,
  onSave,
  onPublish,
  onWorkingChange,
}: {
  page: AdminWebsitePage | null
  working: WebsitePageContent | null
  dirty: boolean
  loading: boolean
  saving: boolean
  canPublish: boolean
  onPreview: () => void
  onSave: () => void
  onPublish: () => void
  onWorkingChange: (content: WebsitePageContent) => void
}) {
  return (
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
            onClick={onPreview}
            className="inline-flex items-center gap-2 border border-[#ece2c4]/25 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#ece2c4] disabled:opacity-35"
          >
            <Eye size={12} /> Preview
          </button>
          <button
            type="button"
            disabled={!working || !dirty || saving || loading}
            onClick={onSave}
            className="inline-flex items-center gap-2 border border-[#d4a24a] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#d4a24a] hover:bg-[#d4a24a] hover:text-[#0b0d12] disabled:opacity-35"
          >
            <Save size={12} /> {saving ? 'Saving…' : 'Save draft'}
          </button>
          <button
            type="button"
            disabled={!page?.draft || dirty || saving || !canPublish}
            onClick={onPublish}
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
          <WebsiteContentForm content={working} onChange={onWorkingChange} />
        </div>
      ) : null}
    </section>
  )
}
