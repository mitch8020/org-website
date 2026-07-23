import { FileClock, RotateCcw, X } from 'lucide-react'
import type { AdminWebsitePage, WebsitePageId } from '#/lib/content-types'
import { getWebsitePageHref } from './website-pages'

export function WebsiteRevisionPanel({
  page,
  selectedPageId,
  saving,
  onDiscard,
  onRestore,
}: {
  page: AdminWebsitePage | null
  selectedPageId: WebsitePageId
  saving: boolean
  onDiscard: () => void
  onRestore: (revision: number) => void
}) {
  return (
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
                  href={getWebsitePageHref(selectedPageId)}
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
              onClick={onDiscard}
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
                    onClick={() => onRestore(revision.revision)}
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
  )
}
