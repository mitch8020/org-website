import { Plus, Trash2 } from 'lucide-react'
import type { AboutPageContent } from '#/lib/content-types'
import { fieldClass, labelClass, newEditorId } from './editor-utils'

type AboutContact = AboutPageContent['contact']

export function AboutContactEditor({
  contact,
  onChange,
}: {
  contact: AboutContact
  onChange: (contact: AboutContact) => void
}) {
  function updateContact(patch: Partial<AboutContact>) {
    onChange({ ...contact, ...patch })
  }

  return (
    <section className="border-t border-[#ece2c4]/14 pt-7">
      <div className={labelClass}>Contact section</div>
      <div className="mt-3 grid gap-4 sm:grid-cols-[90px_1fr]">
        <label>
          <span className={labelClass}>Numeral</span>
          <input
            value={contact.roman}
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
            value={contact.eyebrow}
            onChange={(event) => updateContact({ eyebrow: event.target.value })}
            className={fieldClass}
            maxLength={120}
          />
        </label>
      </div>
      <label className="mt-4 block">
        <span className={labelClass}>Introduction</span>
        <textarea
          value={contact.intro}
          onChange={(event) => updateContact({ intro: event.target.value })}
          className={`${fieldClass} min-h-20 resize-y`}
          maxLength={1_000}
        />
      </label>
      <div className="mt-4 space-y-2">
        {contact.channels.map((channel, index) => (
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
                    channels: contact.channels.map((item, itemIndex) =>
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
                    channels: contact.channels.map((item, itemIndex) =>
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
                    channels: contact.channels.map((item, itemIndex) =>
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
                disabled={contact.channels.length === 1}
                onClick={() =>
                  updateContact({
                    channels: contact.channels.filter(
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
              ...contact.channels,
              {
                id: newEditorId('contact-channel'),
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
  )
}
