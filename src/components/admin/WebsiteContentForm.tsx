import { useEffect, useState } from 'react'
import {
  ArrowDown,
  ArrowLeftFromLine,
  ArrowRightFromLine,
  ArrowUp,
  ChevronRight,
  Plus,
  Trash2,
} from 'lucide-react'
import type {
  AboutArticle,
  AboutOutlineNode,
  AboutPageContent,
  ReferenceBlock,
  ReferenceBlockKind,
  ReferencePageContent,
  WebsitePageContent,
} from '#/lib/content-types'

const fieldClass =
  'mt-1.5 w-full border border-[#ece2c4]/20 bg-[#080a0e] px-3 py-2.5 text-sm leading-6 text-[#ece2c4] outline-none focus:border-[#d4a24a]'
const labelClass =
  'font-mono text-[9px] uppercase tracking-[0.2em] text-[#9f9676]'
const iconButton =
  'grid h-8 w-8 place-items-center border border-[#ece2c4]/16 text-[#9f9676] hover:border-[#d4a24a] hover:text-[#d4a24a] disabled:cursor-not-allowed disabled:opacity-25'

function newId(prefix: string) {
  const value = globalThis.crypto.randomUUID()
  return `${prefix}-${value}`.toLowerCase()
}

function moveItem<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) return items
  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export function WebsiteContentForm({
  content,
  onChange,
}: {
  content: WebsitePageContent
  onChange: (content: WebsitePageContent) => void
}) {
  return content.kind === 'reference' ? (
    <ReferenceEditor content={content} onChange={onChange} />
  ) : (
    <AboutEditor content={content} onChange={onChange} />
  )
}

function ReferenceEditor({
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
      id: newId(`${content.id}-block`),
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

function AboutEditor({
  content,
  onChange,
}: {
  content: AboutPageContent
  onChange: (content: WebsitePageContent) => void
}) {
  const [activeArticleId, setActiveArticleId] = useState(
    content.articles[0]?.id,
  )
  const activeIndex = Math.max(
    0,
    content.articles.findIndex((article) => article.id === activeArticleId),
  )
  const activeArticle = content.articles[activeIndex]

  useEffect(() => {
    if (!content.articles.some((article) => article.id === activeArticleId)) {
      setActiveArticleId(content.articles[0]?.id)
    }
  }, [activeArticleId, content.articles])

  function setArticles(articles: AboutArticle[]) {
    onChange({ ...content, articles })
  }

  function updateArticle(patch: Partial<AboutArticle>) {
    setArticles(
      content.articles.map((article, index) =>
        index === activeIndex ? { ...article, ...patch } : article,
      ),
    )
  }

  function addArticle() {
    const nextNumber = content.articles.length + 1
    const article: AboutArticle = {
      id: newId('article'),
      roman: toRoman(nextNumber),
      eyebrow: 'New article',
      lead: 'Introduce this part of the founding document.',
      body: [],
    }
    setArticles([...content.articles, article])
    setActiveArticleId(article.id)
  }

  function removeArticle() {
    if (content.articles.length === 1) return
    if (!window.confirm(`Remove “${activeArticle.eyebrow}” and its outline?`)) {
      return
    }
    setArticles(
      content.articles.filter((article) => article.id !== activeArticle.id),
    )
  }

  function updateContact(patch: Partial<AboutPageContent['contact']>) {
    onChange({ ...content, contact: { ...content.contact, ...patch } })
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
          <span className={labelClass}>Living-document note</span>
          <textarea
            value={content.statusNote}
            onChange={(event) =>
              onChange({ ...content, statusNote: event.target.value })
            }
            className={`${fieldClass} min-h-20 resize-y`}
            maxLength={500}
          />
        </label>
      </section>

      <section className="grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)]">
        <aside>
          <div className="flex items-center justify-between">
            <span className={labelClass}>Articles</span>
            <button
              type="button"
              onClick={addArticle}
              className={iconButton}
              aria-label="Add article"
            >
              <Plus size={13} />
            </button>
          </div>
          <div className="mt-2 border border-[#ece2c4]/14">
            {content.articles.map((article, index) => (
              <button
                key={article.id}
                type="button"
                onClick={() => setActiveArticleId(article.id)}
                className={`flex w-full items-center justify-between border-b border-[#ece2c4]/10 px-3 py-3 text-left text-xs last:border-b-0 ${
                  article.id === activeArticle.id
                    ? 'bg-[#d4a24a]/10 text-[#f3ead0]'
                    : 'text-[#9f9676] hover:text-[#ece2c4]'
                }`}
              >
                <span className="truncate">
                  {article.roman}. {article.eyebrow}
                </span>
                <ChevronRight size={12} />
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-5 border border-[#ece2c4]/14 p-4">
          <div className="flex flex-wrap justify-between gap-3">
            <div className="grid flex-1 gap-3 sm:grid-cols-[90px_1fr]">
              <label>
                <span className={labelClass}>Numeral</span>
                <input
                  value={activeArticle.roman}
                  onChange={(event) =>
                    updateArticle({ roman: event.target.value.toUpperCase() })
                  }
                  className={fieldClass}
                  maxLength={16}
                />
              </label>
              <label>
                <span className={labelClass}>Article title</span>
                <input
                  value={activeArticle.eyebrow}
                  onChange={(event) =>
                    updateArticle({ eyebrow: event.target.value })
                  }
                  className={fieldClass}
                  maxLength={120}
                />
              </label>
            </div>
            <div className="flex gap-1 pt-5">
              <button
                type="button"
                aria-label="Move article up"
                disabled={activeIndex === 0}
                onClick={() =>
                  setArticles(
                    moveItem(content.articles, activeIndex, activeIndex - 1),
                  )
                }
                className={iconButton}
              >
                <ArrowUp size={13} />
              </button>
              <button
                type="button"
                aria-label="Move article down"
                disabled={activeIndex === content.articles.length - 1}
                onClick={() =>
                  setArticles(
                    moveItem(content.articles, activeIndex, activeIndex + 1),
                  )
                }
                className={iconButton}
              >
                <ArrowDown size={13} />
              </button>
              <button
                type="button"
                aria-label="Remove article"
                disabled={content.articles.length === 1}
                onClick={removeArticle}
                className={`${iconButton} hover:border-[#c98b63] hover:text-[#c98b63]`}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          <label>
            <span className={labelClass}>Lead</span>
            <textarea
              value={activeArticle.lead}
              onChange={(event) => updateArticle({ lead: event.target.value })}
              className={`${fieldClass} min-h-24 resize-y`}
              maxLength={12_000}
            />
          </label>

          <div>
            <div className={labelClass}>Outline</div>
            <NodeList
              articleId={activeArticle.id}
              nodes={activeArticle.body}
              onChange={(body) => updateArticle({ body })}
              depth={0}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-[#ece2c4]/14 pt-7">
        <div className={labelClass}>Contact section</div>
        <div className="mt-3 grid gap-4 sm:grid-cols-[90px_1fr]">
          <label>
            <span className={labelClass}>Numeral</span>
            <input
              value={content.contact.roman}
              onChange={(event) =>
                updateContact({ roman: event.target.value.toUpperCase() })
              }
              className={fieldClass}
              maxLength={16}
            />
          </label>
          <label>
            <span className={labelClass}>Title</span>
            <input
              value={content.contact.eyebrow}
              onChange={(event) =>
                updateContact({ eyebrow: event.target.value })
              }
              className={fieldClass}
              maxLength={120}
            />
          </label>
        </div>
        <label className="mt-4 block">
          <span className={labelClass}>Introduction</span>
          <textarea
            value={content.contact.intro}
            onChange={(event) => updateContact({ intro: event.target.value })}
            className={`${fieldClass} min-h-20 resize-y`}
            maxLength={1_000}
          />
        </label>
        <div className="mt-4 space-y-2">
          {content.contact.channels.map((channel, index) => (
            <div
              key={channel.id}
              className="grid gap-3 border border-[#ece2c4]/14 p-3 sm:grid-cols-3"
            >
              <label>
                <span className={labelClass}>Channel</span>
                <input
                  value={channel.label}
                  onChange={(event) =>
                    updateContact({
                      channels: content.contact.channels.map(
                        (item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, label: event.target.value }
                            : item,
                      ),
                    })
                  }
                  className={fieldClass}
                />
              </label>
              <label>
                <span className={labelClass}>Handle</span>
                <input
                  value={channel.handle}
                  onChange={(event) =>
                    updateContact({
                      channels: content.contact.channels.map(
                        (item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, handle: event.target.value }
                            : item,
                      ),
                    })
                  }
                  className={fieldClass}
                />
              </label>
              <label className="relative">
                <span className={labelClass}>HTTP(S) link, optional</span>
                <input
                  value={channel.href ?? ''}
                  onChange={(event) =>
                    updateContact({
                      channels: content.contact.channels.map(
                        (item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, href: event.target.value || null }
                            : item,
                      ),
                    })
                  }
                  className={`${fieldClass} pr-10`}
                />
                <button
                  type="button"
                  aria-label={`Remove ${channel.label}`}
                  disabled={content.contact.channels.length === 1}
                  onClick={() =>
                    updateContact({
                      channels: content.contact.channels.filter(
                        (_, itemIndex) => itemIndex !== index,
                      ),
                    })
                  }
                  className="absolute bottom-2.5 right-1.5 grid h-7 w-7 place-items-center text-[#c98b63] disabled:opacity-25"
                >
                  <Trash2 size={12} />
                </button>
              </label>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            updateContact({
              channels: [
                ...content.contact.channels,
                {
                  id: newId('contact-channel'),
                  label: 'New channel',
                  handle: '@handle',
                  href: null,
                },
              ],
            })
          }
          className="mt-3 inline-flex items-center gap-2 border border-[#d4a24a]/50 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#d4a24a]"
        >
          <Plus size={12} /> Add contact channel
        </button>
      </section>
    </div>
  )
}

function NodeList({
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
        id: newId(`${articleId}-node`),
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
                                id: newId(`${articleId}-node`),
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
            <NodeList
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

function toRoman(value: number) {
  const values: Array<[number, string]> = [
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ]
  let remaining = value
  let roman = ''
  for (const [number, glyph] of values) {
    while (remaining >= number) {
      roman += glyph
      remaining -= number
    }
  }
  return roman
}
