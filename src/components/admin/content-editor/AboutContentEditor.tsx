import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, ChevronRight, Plus, Trash2 } from 'lucide-react'
import type {
  AboutArticle,
  AboutPageContent,
  WebsitePageContent,
} from '#/lib/content-types'
import { AboutContactEditor } from './AboutContactEditor'
import { OutlineNodeList } from './OutlineNodeList'
import {
  fieldClass,
  iconButton,
  labelClass,
  moveItem,
  newEditorId,
  toRoman,
} from './editor-utils'

export function AboutContentEditor({
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
      id: newEditorId('article'),
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
            {content.articles.map((article) => (
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
            <OutlineNodeList
              articleId={activeArticle.id}
              nodes={activeArticle.body}
              onChange={(body) => updateArticle({ body })}
              depth={0}
            />
          </div>
        </div>
      </section>

      <AboutContactEditor
        contact={content.contact}
        onChange={(contact) => onChange({ ...content, contact })}
      />
    </div>
  )
}
