import {
  ArrowDown,
  ArrowRightFromLine,
  ArrowUp,
  Plus,
  Trash2,
} from 'lucide-react'
import type { AboutOutlineNode } from '#/lib/content-types'
import {
  fieldClass,
  iconButton,
  labelClass,
  moveItem,
  newEditorId,
} from './editor-utils'

export function OutlineNodeList({
  articleId,
  nodes,
  onChange,
  depth,
}: {
  articleId: string
  nodes: AboutOutlineNode[]
  onChange: (nodes: AboutOutlineNode[]) => void
  depth: number
}) {
  function addNode() {
    onChange([
      ...nodes,
      {
        id: newEditorId(`${articleId}-node`),
        marker: depth === 0 ? 'A.' : '1.',
        text: 'New outline row',
        children: [],
      },
    ])
  }

  return (
    <div
      className={
        depth === 0
          ? 'mt-2 space-y-2'
          : 'ml-3 mt-2 space-y-2 border-l border-[#d4a24a]/20 pl-3'
      }
    >
      {nodes.map((node, index) => (
        <div key={node.id} className="border border-[#ece2c4]/12 p-3">
          <div className="grid gap-2 sm:grid-cols-[78px_minmax(0,1fr)_auto]">
            <label>
              <span className={labelClass}>Marker</span>
              <input
                value={node.marker}
                onChange={(event) =>
                  onChange(
                    nodes.map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, marker: event.target.value }
                        : item,
                    ),
                  )
                }
                className={`${fieldClass} py-2`}
                maxLength={16}
              />
            </label>
            <label>
              <span className={labelClass}>Outline text</span>
              <textarea
                value={node.text}
                onChange={(event) =>
                  onChange(
                    nodes.map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, text: event.target.value }
                        : item,
                    ),
                  )
                }
                className={`${fieldClass} min-h-20 resize-y`}
                maxLength={12_000}
              />
            </label>
            <div className="flex flex-wrap content-start gap-1 pt-5 sm:w-[72px]">
              <button
                type="button"
                aria-label="Move outline row up"
                disabled={index === 0}
                onClick={() => onChange(moveItem(nodes, index, index - 1))}
                className={iconButton}
              >
                <ArrowUp size={12} />
              </button>
              <button
                type="button"
                aria-label="Move outline row down"
                disabled={index === nodes.length - 1}
                onClick={() => onChange(moveItem(nodes, index, index + 1))}
                className={iconButton}
              >
                <ArrowDown size={12} />
              </button>
              <button
                type="button"
                aria-label="Add nested outline row"
                title="Add child"
                disabled={depth >= 9}
                onClick={() =>
                  onChange(
                    nodes.map((item, itemIndex) =>
                      itemIndex === index
                        ? {
                            ...item,
                            children: [
                              ...item.children,
                              {
                                id: newEditorId(`${articleId}-node`),
                                marker: '1.',
                                text: 'New nested row',
                                children: [],
                              },
                            ],
                          }
                        : item,
                    ),
                  )
                }
                className={iconButton}
              >
                <ArrowRightFromLine size={12} />
              </button>
              <button
                type="button"
                aria-label="Remove outline row"
                onClick={() => {
                  if (
                    node.children.length &&
                    !window.confirm('Remove this row and all nested rows?')
                  ) {
                    return
                  }
                  onChange(nodes.filter((_, itemIndex) => itemIndex !== index))
                }}
                className={`${iconButton} hover:border-[#c98b63] hover:text-[#c98b63]`}
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
          {node.children.length ? (
            <OutlineNodeList
              articleId={articleId}
              nodes={node.children}
              onChange={(children) =>
                onChange(
                  nodes.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, children } : item,
                  ),
                )
              }
              depth={depth + 1}
            />
          ) : null}
        </div>
      ))}
      <button
        type="button"
        onClick={addNode}
        className="inline-flex items-center gap-2 border border-dashed border-[#ece2c4]/24 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#9f9676] hover:border-[#d4a24a] hover:text-[#d4a24a]"
      >
        <Plus size={12} /> Add {depth ? 'nested ' : ''}row
      </button>
    </div>
  )
}
