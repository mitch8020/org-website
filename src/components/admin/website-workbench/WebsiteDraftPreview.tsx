import { X } from 'lucide-react'
import { AboutDocument } from '#/components/about/AboutDocument'
import { ReferencePage } from '#/components/ReferencePage'
import type { WebsitePageContent } from '#/lib/content-types'

export function WebsiteDraftPreview({
  content,
  onClose,
}: {
  content: WebsitePageContent
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-[90] overflow-auto bg-[#0b0d12]">
      <div className="fixed inset-x-0 top-0 z-[110] flex flex-wrap items-center justify-between gap-3 border-b border-[#d4a24a]/45 bg-[#080a0e]/95 px-4 py-3 backdrop-blur">
        <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#d4a24a]">
          Draft preview · not public
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 border border-[#ece2c4]/30 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#ece2c4]"
        >
          <X size={12} /> Return to editor
        </button>
      </div>
      {content.kind === 'about' ? (
        <AboutDocument content={content} />
      ) : (
        <ReferencePage page={content} />
      )}
    </div>
  )
}
