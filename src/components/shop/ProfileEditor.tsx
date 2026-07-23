import { useEffect, useState } from 'react'
import { apiRequest } from '#/lib/api'
import type { MemberProfile } from '#/lib/api'
import { useOrgAuth } from '#/lib/auth'

const fieldClass =
  'mt-1.5 w-full border border-[#ece2c4]/22 bg-[#0b0d12] px-3 py-2.5 text-sm text-[#ece2c4] placeholder:text-[#6f6646]'
const labelClass =
  'font-mono text-[9px] uppercase tracking-[0.2em] text-[#9f9676]'

export function ProfileEditor({
  profile,
  submitLabel = 'Save member details',
  onSaved,
}: {
  profile: MemberProfile
  submitLabel?: string
  onSaved: (profile: MemberProfile) => void
}) {
  const auth = useOrgAuth()
  const [form, setForm] = useState({
    preferredName: '',
    email: '',
    membershipType: 'private' as MemberProfile['membershipType'],
    contactMethod: 'email' as MemberProfile['contactMethod'],
    contactHandle: '',
    beliefsSummary: '',
    recipientName: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm({
      preferredName:
        profile.preferredName || auth.user?.name || auth.user?.email || '',
      email: profile.email || auth.user?.email || '',
      membershipType: profile.membershipType,
      contactMethod: profile.contactMethod,
      contactHandle:
        profile.contactHandle || profile.email || auth.user?.email || '',
      beliefsSummary: profile.beliefsSummary || '',
      recipientName:
        profile.shippingAddress?.recipientName ||
        profile.preferredName ||
        auth.user?.name ||
        '',
      line1: profile.shippingAddress?.line1 || '',
      line2: profile.shippingAddress?.line2 || '',
      city: profile.shippingAddress?.city || '',
      state: profile.shippingAddress?.state || '',
      postalCode: profile.shippingAddress?.postalCode || '',
      phone: profile.shippingAddress?.phone || '',
    })
  }, [profile, auth.user])

  function update(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function save(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const token = await auth.getToken()
      if (!token) throw new Error('Your sign-in session has expired.')
      await apiRequest<MemberProfile>('/me', {
        method: 'PATCH',
        token,
        body: JSON.stringify({
          preferredName: form.preferredName,
          email: form.email,
          membershipType: form.membershipType,
          contactMethod: form.contactMethod,
          contactHandle: form.contactHandle,
          beliefsSummary: form.beliefsSummary,
        }),
      })
      const saved = await apiRequest<MemberProfile>('/me/shipping', {
        method: 'PATCH',
        token,
        body: JSON.stringify({
          recipientName: form.recipientName,
          line1: form.line1,
          line2: form.line2 || undefined,
          city: form.city,
          state: form.state.toUpperCase(),
          postalCode: form.postalCode,
          country: 'US',
          phone: form.phone || undefined,
        }),
      })
      onSaved(saved)
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Your details were not saved.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={save} className="space-y-8">
      {error ? (
        <div className="border border-[#c98b63]/50 bg-[#c98b63]/10 p-3 text-sm text-[#e7c3a9]">
          {error}
        </div>
      ) : null}

      <fieldset>
        <legend className="font-display text-2xl uppercase tracking-[0.04em] text-[#f3ead0]">
          Contact record
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label>
            <span className={labelClass}>Preferred name</span>
            <input
              required
              value={form.preferredName}
              onChange={(event) => update('preferredName', event.target.value)}
              className={fieldClass}
              autoComplete="name"
            />
          </label>
          <label>
            <span className={labelClass}>Email</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => update('email', event.target.value)}
              className={fieldClass}
              autoComplete="email"
            />
          </label>
          <label>
            <span className={labelClass}>Membership visibility</span>
            <select
              value={form.membershipType}
              onChange={(event) => update('membershipType', event.target.value)}
              className={fieldClass}
            >
              <option value="public">Public member</option>
              <option value="private">Private member</option>
              <option value="anonymous">Anonymous posts only</option>
            </select>
          </label>
          <label>
            <span className={labelClass}>Preferred contact</span>
            <select
              value={form.contactMethod}
              onChange={(event) => update('contactMethod', event.target.value)}
              className={fieldClass}
            >
              <option value="email">Email</option>
              <option value="signal">Signal</option>
              <option value="telegram">Telegram</option>
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className={labelClass}>Contact address or handle</span>
            <input
              required
              value={form.contactHandle}
              onChange={(event) => update('contactHandle', event.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="sm:col-span-2">
            <span className={labelClass}>Beliefs or reason for joining</span>
            <textarea
              value={form.beliefsSummary}
              onChange={(event) => update('beliefsSummary', event.target.value)}
              rows={4}
              maxLength={2000}
              className={fieldClass}
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="border-t border-dashed border-[#ece2c4]/20 pt-7">
        <legend className="font-display text-2xl uppercase tracking-[0.04em] text-[#f3ead0]">
          U.S. shipping record
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className={labelClass}>Recipient name</span>
            <input
              required
              value={form.recipientName}
              onChange={(event) => update('recipientName', event.target.value)}
              className={fieldClass}
              autoComplete="shipping name"
            />
          </label>
          <label className="sm:col-span-2">
            <span className={labelClass}>Address line 1</span>
            <input
              required
              value={form.line1}
              onChange={(event) => update('line1', event.target.value)}
              className={fieldClass}
              autoComplete="shipping address-line1"
            />
          </label>
          <label className="sm:col-span-2">
            <span className={labelClass}>Address line 2</span>
            <input
              value={form.line2}
              onChange={(event) => update('line2', event.target.value)}
              className={fieldClass}
              autoComplete="shipping address-line2"
            />
          </label>
          <label>
            <span className={labelClass}>City</span>
            <input
              required
              value={form.city}
              onChange={(event) => update('city', event.target.value)}
              className={fieldClass}
              autoComplete="shipping address-level2"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className={labelClass}>State</span>
              <input
                required
                maxLength={2}
                value={form.state}
                onChange={(event) => update('state', event.target.value)}
                className={fieldClass}
                autoComplete="shipping address-level1"
              />
            </label>
            <label>
              <span className={labelClass}>ZIP</span>
              <input
                required
                value={form.postalCode}
                onChange={(event) => update('postalCode', event.target.value)}
                className={fieldClass}
                autoComplete="shipping postal-code"
              />
            </label>
          </div>
          <label className="sm:col-span-2">
            <span className={labelClass}>Phone (optional)</span>
            <input
              value={form.phone}
              onChange={(event) => update('phone', event.target.value)}
              className={fieldClass}
              autoComplete="shipping tel"
            />
          </label>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-[#9dcf83] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#0b0d12] hover:bg-[#b8e7a0] disabled:opacity-50"
      >
        {saving ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
