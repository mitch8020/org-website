import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { search, withHighlight, PAGE_META, type SearchResult } from '#/lib/search'

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.6' numOctaves='2' seed='7'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.65'/></svg>\")"

const SUGGESTIONS = [
  { label: 'DMT vapor meditation', term: 'DMT' },
  { label: 'Octagon temple', term: 'octagon' },
  { label: 'How to join', term: 'How To Join' },
  { label: 'Greg Lake', term: 'Greg Lake' },
  { label: 'Majority vote', term: 'vote' },
  { label: 'Entheo Community', term: 'Entheo Community' },
]

export function SearchOverlay() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const results = useMemo(() => search(query), [query])

  useEffect(() => {
    setSelected(0)
  }, [query])

  // Global hotkey (⌘K / Ctrl+K) + when open: arrows, enter, esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMetaK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
      if (isMetaK) {
        e.preventDefault()
        toggle()
        return
      }
      if (!open) return

      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelected((s) => Math.min(s + 1, Math.max(0, results.length - 1)))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelected((s) => Math.max(s - 1, 0))
      }
      if (e.key === 'Enter' && results[selected]) {
        e.preventDefault()
        activate(selected)
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open, results, selected])

  // Listen for triggers from nav/home (custom event, no provider needed)
  useEffect(() => {
    function handleOpen() {
      setOpen(true)
      setQuery('')
      // focus input after paint
      setTimeout(() => inputRef.current?.focus(), 60)
    }
    window.addEventListener('org:open-search', handleOpen as EventListener)
    return () => window.removeEventListener('org:open-search', handleOpen as EventListener)
  }, [])

  function toggle() {
    const next = !open
    setOpen(next)
    if (next) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 60)
    } else {
      setQuery('')
    }
  }

  function close() {
    setOpen(false)
    setQuery('')
  }

  function activate(idx: number) {
    const r = results[idx]
    if (!r) return
    const q = query.trim()
    close()
    // Preserve the query so target page can highlight + scroll
    navigate({
      to: r.href,
      search: q ? { q } : undefined,
    })
  }

  function onSuggestion(term: string) {
    setQuery(term)
    // results will update, user can arrow or click
    setTimeout(() => inputRef.current?.focus(), 10)
  }

  if (!open) return null

  // Perforation frame for the panel (exact aesthetic match: 6px, d=25px, g=20px, separate v/h)
  const perfFrame = (() => {
    const perfColor = 'rgba(236,226,196,0.88)'
    const d = '25px'
    const g = '20px'
    const t = '6px'
    const vGrad = `repeating-linear-gradient(to bottom, ${perfColor} 0, ${perfColor} ${d}, transparent ${d}, transparent calc(${d} + ${g}))`
    const hGrad = `repeating-linear-gradient(to right, ${perfColor} 0, ${perfColor} ${d}, transparent ${d}, transparent calc(${d} + ${g}))`
    // Frame: left/right verticals + top/bottom horizontals
    const vPositions = ['0%', '100%']
    const hPositions = ['0%', '100%']
    const vBgImages = vPositions.map(() => vGrad).join(',')
    const vBgSizes = vPositions.map(() => `${t} 100%`).join(',')
    const vBgPositions = vPositions.map((p) => `${p} 0%`).join(',')
    const vBgRepeats = vPositions.map(() => 'no-repeat').join(',')
    const hBgImages = hPositions.map(() => hGrad).join(',')
    const hBgSizes = hPositions.map(() => `100% ${t}`).join(',')
    const hBgPositions = hPositions.map((p) => `0% ${p}`).join(',')
    const hBgRepeats = hPositions.map(() => 'no-repeat').join(',')
    return (
      <>
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage: vBgImages,
            backgroundSize: vBgSizes,
            backgroundPosition: vBgPositions,
            backgroundRepeat: vBgRepeats,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            backgroundImage: hBgImages,
            backgroundSize: hBgSizes,
            backgroundPosition: hBgPositions,
            backgroundRepeat: hBgRepeats,
          }}
        />
      </>
    )
  })()

  const showResults = query.trim().length > 0
  const currentResults = showResults ? results : []

  return (
    <div
      className="fixed inset-0 z-[75] flex items-start justify-center bg-[rgba(8,9,13,0.82)] px-4 pt-[9vh] pb-12 backdrop-blur-[2px]"
      onClick={close}
      aria-modal="true"
      role="dialog"
      aria-label="Search the ORG archive"
    >
      {/* subtle inner noise like the rest of the site */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL }}
      />

      <div
        className="relative w-full max-w-[min(92vw,620px)] overflow-hidden rounded-sm bg-[#0b0d12] text-[#ece2c4] shadow-[0_0_0_1px_rgba(236,226,196,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* The blotter perforation frame — makes the panel read as a torn square from the sheet */}
        {perfFrame}

        {/* Header / ritual title */}
        <div className="relative z-30 flex items-center justify-between border-b border-[rgba(236,226,196,0.12)] px-5 pb-3 pt-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.38em] text-[#b8ad8d]">THE ORG ARCHIVE</div>
            <div className="text-[clamp(15px,3.2vw,19px)] font-thin uppercase tracking-[0.14em] text-[#f3ead0]">The Perforated Index</div>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close search"
            className="grid h-8 w-8 place-items-center border border-[rgba(236,226,196,0.28)] text-[#b8ad8d] transition-colors hover:border-[#ece2c4] hover:text-[#ece2c4]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Input — styled like an index card / typewriter field with perf underline */}
        <div className="relative z-30 px-5 pb-2 pt-4">
          <label className="mb-1 block text-[10px] uppercase tracking-[0.34em] text-[#9f9676]">
            What vision do you seek?
          </label>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="DMT ceremony, octagon, vote, how to join, Greg Lake…"
            className="w-full border-0 border-b border-dashed border-[#d4a24a]/60 bg-transparent pb-2 text-[17px] font-light tracking-[0.01em] text-[#f3ead0] placeholder:text-[#9f9676] focus:outline-none focus:border-[#d4a24a]"
            spellCheck={false}
          />
        </div>

        {/* Results or suggestions */}
        <div className="relative z-30 max-h-[58vh] overflow-auto px-2 pb-3 pt-1 text-sm">
          {!showResults && (
            <div className="px-3 py-2">
              <div className="mb-2 text-[10px] uppercase tracking-[0.32em] text-[#9f9676]">SUGGESTED FRAGMENTS</div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onSuggestion(s.term)}
                    className="border border-[rgba(236,226,196,0.22)] px-3 py-1 text-[12px] uppercase tracking-[0.2em] text-[#d8ceb0] transition-colors hover:border-[#d4a24a] hover:text-[#f0e6d0]"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="mt-4 text-[10px] text-[#9f9676]">
                Or type anything — beliefs, events, names, sacraments. Results are extracts from the living archive.
              </div>
            </div>
          )}

          {showResults && currentResults.length === 0 && (
            <div className="px-3 py-6 text-center text-[#b8ad8d]">
              No matches in the records.<br />
              <span className="text-[12px] tracking-[0.1em]">The Universal Creator works in mysterious ways.</span>
            </div>
          )}

          {currentResults.length > 0 && (
            <>
              <div className="px-3 pb-1.5 text-[10px] uppercase tracking-[0.32em] text-[#9f9676]">
                {currentResults.length} FRAGMENT{currentResults.length === 1 ? '' : 'S'} — <span className="normal-case tracking-normal">tap or ↵ to open with highlight</span>
              </div>
              <div role="listbox" aria-activedescendant={currentResults[selected] ? `result-${selected}` : undefined}>
                {currentResults.map((r, i) => {
                  const meta = PAGE_META[r.pageId]
                  const isActive = i === selected
                  return (
                    <button
                      key={`${r.pageId}-${i}`}
                      id={`result-${i}`}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onClick={() => activate(i)}
                      onMouseEnter={() => setSelected(i)}
                      className={`group mb-1 flex w-full flex-col gap-1 border-l-2 px-3 py-2 text-left transition-all ${
                        isActive
                          ? 'border-[#d4a24a] bg-[rgba(212,162,74,0.06)]'
                          : 'border-[rgba(236,226,196,0.12)] hover:border-[#d4a24a] hover:bg-[rgba(236,226,196,0.025)]'
                      }`}
                    >
                      {/* Mini perf accent (left vertical dash strip) + badge */}
                      <div className="flex items-center gap-2.5">
                        {/* tiny left perf */}
                        <div
                          aria-hidden
                          className="h-3 w-[3px] flex-none opacity-70"
                          style={{
                            background: `repeating-linear-gradient(to bottom, ${meta.accent} 0, ${meta.accent} 3px, transparent 3px, transparent 7px)`,
                          }}
                        />
                        <span
                          className="inline-block text-[10px] font-bold uppercase tracking-[0.26em] text-[#f3ead0] group-hover:text-white"
                          style={{ color: isActive ? meta.accent : undefined }}
                        >
                          {meta.short}
                        </span>
                        {r.lineIndex !== undefined && (
                          <span className="text-[10px] text-[#9f9676] tabular-nums">LINE {r.lineIndex + 1}</span>
                        )}
                      </div>

                      {/* Snippet with blotter-ink highlight */}
                      <div className="pl-5 text-[13.5px] leading-snug text-[#d8ceb0] group-hover:text-[#ece2c4]">
                        {withHighlight(r.snippet, query)}
                      </div>

                      {/* Meta line */}
                      <div className="pl-5 text-[10px] uppercase tracking-[0.26em] text-[#9f9676]">
                        {r.title}
                      </div>
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer ritual hints */}
        <div className="relative z-30 border-t border-[rgba(236,226,196,0.12)] px-5 py-2 text-[10px] uppercase tracking-[0.32em] text-[#9f9676]">
          ⌘K / CTRL+K &nbsp;·&nbsp; ↑↓ &nbsp;·&nbsp; ↵ OPEN &nbsp;·&nbsp; ESC CLOSE
        </div>
      </div>
    </div>
  )
}
