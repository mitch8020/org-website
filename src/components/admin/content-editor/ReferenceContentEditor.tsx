import {
  ArrowDown,
  ArrowLeftFromLine,
  ArrowRightFromLine,
  ArrowUp,
  Plus,
  Trash2,
} from 'lucide-react'
import type {
  ReferenceBlock,
  ReferenceBlockKind,
  ReferencePageContent,
  WebsitePageContent,
} from '#/lib/content-types'
import {
  fieldClass,
  iconButton,
  labelClass,
  moveItem,
  newEditorId,
} from './editor-utils'

export function ReferenceContentEditor({
  content,
  onChange,
}: {
  content: ReferencePageContent
  onChange: (content: WebsitePageContent) => void
}) {
  function updateBlock(index: number, patch: Partial<ReferenceBlock>) {
    const blocks = content.blocks.map((block, blockIndex) =>
      blockIndex === index ? { ...block, ...patch } : block,
    )
    onChange({ ...content, blocks })
  }

  function setKind(index: number, kind: ReferenceBlockKind) {
    const block = content.blocks[index]
    updateBlock(
      index,
      kind === 'outline'
        ? {
            kind,
            marker: block.marker ?? 'A.',
            depth: block.depth ?? 1,
          }
        : { kind, marker: undefined, depth: undefined },
    )
  }

  function addBlock(afterIndex = content.blocks.length - 1) {
    const blocks = [...content.blocks]
    blocks.splice(afterIndex + 1, 0, {
      id: newEditorId(`${content.id}-block`),
      kind: 'paragraph',
      text: 'New paragraph',
    })
    onChange({ ...content, blocks })
  }

  function removeBlock(index: number) {
    if (content.blocks.length === 1) return
    if (!window.confirm('Remove this content row?')) return
    onChange({
      ...content,
      blocks: content.blocks.filter((_, blockIndex) => blockIndex !== index),
    })
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 border-b border-[#ece2c4]/14 pb-7">
        <label>
          <span className={labelClass}>Page title</span>
          <input
            value={content.title}
            onChange={(event) =>
              onChange({ ...content, title: event.target.value })
            }
            className={fieldClass}
            maxLength={120}
          />
        </label>
        <label>
          <span className={labelClass}>Page subtitle</span>
          <textarea
            value={content.subtitle}
            onChange={(event) =>
              onChange({ ...content, subtitle: event.target.value })
            }
            className={`${fieldClass} min-h-24 resize-y`}
            maxLength={500}
          />
        </label>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <div className={labelClass}>Document rows</div>
            <p className="mt-1 text-xs text-[#9f9676]">
              Reorder the record without changing its visual design.
            </p>
          </div>
          <button
            type="button"
            onClick={() => addBlock()}
            className="inline-flex items-center gap-2 border border-[#d4a24a]/55 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#d4a24a] hover:bg-[#d4a24a] hover:text-[#0b0d12]"
          >
            <Plus size={12} /> Add row
          </button>
        </div>

        <div className="space-y-2">
          {content.blocks.map((block, index) => (
            <article
              key={block.id}
              className="grid gap-3 border border-[#ece2c4]/14 bg-[#0b0d12] p-3 lg:grid-cols-[104px_minmax(0,1fr)_auto]"
            >
              <div className="space-y-2">
                <label>
                  <span className={labelClass}>Style</span>
                  <select
                    value={block.kind}
                    onChange={(event) =>
                      setKind(index, event.target.value as ReferenceBlockKind)
                    }
                    className={`${fieldClass} py-2 text-xs`}
                  >
                    <option value="lead">Lead</option>
                    <option value="heading">Heading</option>
                    <option value="paragraph">Paragraph</option>
                    <option value="outline">Outline</option>
                  </select>
                </label>
                {block.kind === 'outline' ? (
                  <label>
                    <span className={labelClass}>Marker</span>
                    <input
                      value={block.marker ?? ''}
                      onChange={(event) =>
                        updateBlock(index, { marker: event.target.value })
                      }
                      className={`${fieldClass} py-2 text-xs`}
                      maxLength={16}
                    />
                  </label>
                ) : null}
              </div>

              <label>
                <span className={labelClass}>
                  Row {String(index + 1).padStart(3, '0')}
                </span>
                <textarea
                  value={block.text}
                  onChange={(event) =>
                    updateBlock(index, { text: event.target.value })
                  }
                  className={`${fieldClass} min-h-24 resize-y`}
                  maxLength={12_000}
                />
              </label>

              <div className="flex flex-wrap content-start gap-1 pt-5 lg:w-[72px]">
                <button
                  type="button"
                  aria-label={`Move row ${index + 1} up`}
                  title="Move up"
                  disabled={index === 0}
                  onClick={() =>
                    onChange({
                      ...content,
                      blocks: moveItem(content.blocks, index, index - 1),
                    })
                  }
                  className={iconButton}
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  type="button"
                  aria-label={`Move row ${index + 1} down`}
                  title="Move down"
                  disabled={index === content.blocks.length - 1}
                  onClick={() =>
                    onChange({
                      ...content,
                      blocks: moveItem(content.blocks, index, index + 1),
                    })
                  }
                  className={iconButton}
                >
                  <ArrowDown size={13} />
                </button>
                <button
                  type="button"
                  aria-label={`Outdent row ${index + 1}`}
                  title="Outdent"
                  disabled={
                    block.kind !== 'outline' || (block.depth ?? 0) === 0
                  }
                  onClick={() =>
                    updateBlock(index, {
                      depth: Math.max(0, (block.depth ?? 0) - 1),
                    })
                  }
                  className={iconButton}
                >
                  <ArrowLeftFromLine size={13} />
                </button>
                <button
                  type="button"
                  aria-label={`Indent row ${index + 1}`}
                  title="Indent"
                  disabled={
                    block.kind !== 'outline' || (block.depth ?? 0) === 4
                  }
                  onClick={() =>
                    updateBlock(index, {
                      depth: Math.min(4, (block.depth ?? 0) + 1),
                    })
                  }
                  className={iconButton}
                >
                  <ArrowRightFromLine size={13} />
                </button>
                <button
                  type="button"
                  aria-label={`Add a row after row ${index + 1}`}
                  title="Add after"
                  onClick={() => addBlock(index)}
                  className={iconButton}
                >
                  <Plus size={13} />
                </button>
                <button
                  type="button"
                  aria-label={`Remove row ${index + 1}`}
                  title="Remove"
                  disabled={content.blocks.length === 1}
                  onClick={() => removeBlock(index)}
                  className={`${iconButton} hover:border-[#c98b63] hover:text-[#c98b63]`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
