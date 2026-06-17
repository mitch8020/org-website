import { useEffect, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { SiteNav } from '#/components/SiteNav'
import {
  type MembershipType,
  getCurrentUser,
  login,
  logout,
  createMember,
  submitBelief,
  getMyBeliefs,
} from '#/lib/membership'

export const Route = createFileRoute('/join')({
  head: () => ({
    meta: [
      { title: 'Join the ORG — Membership' },
      {
        name: 'description',
        content: 'Apply for membership or sign in to the ORG member portal. A living covenant between seekers and The Universal Creator.',
      },
    ],
  }),
  component: JoinPage,
})

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2' seed='11'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")"

function JoinPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getCurrentUser())
  const [tab, setTab] = useState<'apply' | 'signin'>('apply')

  // Apply form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [type, setType] = useState<MembershipType>('public')
  const [contactMethod, setContactMethod] = useState<'email' | 'signal' | 'telegram'>('email')
  const [contactHandle, setContactHandle] = useState('')
  const [beliefs, setBeliefs] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Sign in state
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPass, setSignInPass] = useState('')
  const [signInError, setSignInError] = useState('')

  // Portal state
  const [newBelief, setNewBelief] = useState('')
  const [myBeliefs, setMyBeliefs] = useState(getMyBeliefs())

  // Refresh user on mount / changes
  useEffect(() => {
    const current = getCurrentUser()
    setUser(current)
    if (current) setMyBeliefs(getMyBeliefs())
  }, [])

  function refreshUser() {
    const current = getCurrentUser()
    setUser(current)
    if (current) setMyBeliefs(getMyBeliefs())
  }

  function handleApply(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !contactHandle || !beliefs) return

    const member = createMember({
      name,
      email,
      type,
      contactMethod,
      contactHandle,
      beliefsSummary: beliefs,
    })

    setUser(member)
    setSubmitted(true)

    // Clear form
    setName('')
    setEmail('')
    setContactHandle('')
    setBeliefs('')
  }

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setSignInError('')
    const member = login(signInEmail, signInPass)
    if (member) {
      setUser(member)
      setSignInEmail('')
      setSignInPass('')
      refreshUser()
    } else {
      setSignInError('No record found. Try applying first or use a different email.')
    }
  }

  function handleSignOut() {
    logout()
    setUser(null)
    setNewBelief('')
    setMyBeliefs([])
    setTab('apply')
  }

  function handleSubmitBelief(e: React.FormEvent) {
    e.preventDefault()
    if (!newBelief.trim() || !user) return
    const success = submitBelief(newBelief)
    if (success) {
      setNewBelief('')
      refreshUser()
    }
  }

  const isLoggedIn = !!user

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0b0d12] text-[#ece2c4]">
      <SiteNav />

      {/* atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(65% 50% at 50% 8%, rgba(212,162,74,0.09), transparent 70%), radial-gradient(70% 75% at 92% 25%, rgba(120,174,162,0.06), transparent)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL }}
      />

      <main className="relative z-[1] mx-auto max-w-[1080px] px-[clamp(16px,4vw,40px)] pb-20 pt-[clamp(150px,17vh,190px)]">
        <div className="text-center">
          <div className="inline-block border border-[rgba(212,162,74,0.3)] bg-[rgba(212,162,74,0.04)] px-4 py-1 text-[10px] uppercase tracking-[0.36em] text-[#b8ad8d]">
            LIVING COVENANT
          </div>
          <h1 className="mt-3 font-thin uppercase tracking-[0.08em] text-[#f6efd9] text-[clamp(34px,6.5vw,68px)]">
            Join the ORG
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] text-[#d8ceb0]">
            A place for those called to explore the limitless through entheogens, community, and mutual responsibility.
          </p>
        </div>

        {/* Two-column layout: Apply + Portal/Signin */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* APPLICATION SIDE */}
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-[rgba(236,226,196,0.15)]" />
              <span className="text-[10px] uppercase tracking-[0.34em] text-[#b8ad8d]">New Applicants</span>
              <div className="h-px flex-1 bg-[rgba(236,226,196,0.15)]" />
            </div>

            {!submitted && !isLoggedIn && (
              <form onSubmit={handleApply} className="rounded-sm border border-[rgba(236,226,196,0.18)] bg-[#0b0d12] p-6">
                <div className="mb-5">
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9f9676]">Preferred Name</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5 w-full border-b border-dashed border-[#d4a24a]/50 bg-transparent pb-2 text-[15px] text-[#ece2c4] placeholder:text-[#6f6646] focus:outline-none"
                    placeholder="The name you wish to be known by"
                  />
                </div>

                <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9f9676]">Email</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5 w-full border-b border-dashed border-[#d4a24a]/50 bg-transparent pb-2 text-[15px] text-[#ece2c4] placeholder:text-[#6f6646] focus:outline-none"
                      placeholder="you@example.org"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9f9676]">Membership Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as MembershipType)}
                      className="mt-1.5 w-full border-b border-dashed border-[#d4a24a]/50 bg-[#0b0d12] pb-2 text-[15px] text-[#ece2c4] focus:outline-none"
                    >
                      <option value="public">Public Member</option>
                      <option value="private">Private Member</option>
                      <option value="anonymous">Anonymous Posts Only</option>
                    </select>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9f9676]">Best way to reach you</label>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm">
                    {(['email', 'signal', 'telegram'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setContactMethod(m)}
                        className={`border px-3 py-1 uppercase tracking-[0.16em] transition ${contactMethod === m ? 'border-[#d4a24a] text-[#d4a24a]' : 'border-[rgba(236,226,196,0.25)] text-[#b8ad8d] hover:border-[#d4a24a]/60'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  <input
                    required
                    value={contactHandle}
                    onChange={(e) => setContactHandle(e.target.value)}
                    className="mt-2 w-full border-b border-dashed border-[#d4a24a]/50 bg-transparent pb-2 text-[15px] text-[#ece2c4] placeholder:text-[#6f6646] focus:outline-none"
                    placeholder={contactMethod === 'email' ? 'handle or address' : '@yourhandle'}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9f9676]">
                    Tell us a little about your beliefs or why you feel called
                  </label>
                  <textarea
                    required
                    value={beliefs}
                    onChange={(e) => setBeliefs(e.target.value)}
                    rows={5}
                    className="mt-1.5 w-full border border-[rgba(236,226,196,0.2)] bg-[rgba(11,13,18,0.6)] p-3 text-[14px] leading-relaxed text-[#d8ceb0] placeholder:text-[#6f6646] focus:outline-none focus:border-[#d4a24a]/60"
                    placeholder="A short reflection is enough. We read everything."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full border border-[#d4a24a] py-3 text-[11px] uppercase tracking-[0.28em] text-[#d4a24a] transition hover:bg-[#d4a24a] hover:text-[#0b0d12]"
                >
                  Submit Application
                </button>

                <p className="mt-3 text-center text-[10px] text-[#9f9676]">
                  Your information is held privately. We will reach out via your chosen method.
                </p>
              </form>
            )}

            {submitted && (
              <div className="rounded-sm border border-[#d4a24a] bg-[rgba(212,162,74,0.06)] p-8 text-center">
                <div className="text-[#d4a24a] text-[11px] tracking-[0.4em] uppercase">Application Received</div>
                <div className="mt-2 text-2xl font-light text-[#f3ead0]">Thank you, seeker.</div>
                <p className="mt-4 text-[14px] text-[#d8ceb0]">
                  An account has been created locally for you. You may now sign in below using the email you provided.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setTab('signin')
                  }}
                  className="mt-6 border border-[#d4a24a] px-6 py-2 text-xs uppercase tracking-[0.3em] text-[#d4a24a] hover:bg-[#d4a24a] hover:text-[#0b0d12]"
                >
                  Go to Sign In
                </button>
              </div>
            )}

            {isLoggedIn && (
              <div className="text-sm text-[#b8ad8d]">
                You are currently signed in as <span className="text-[#f3ead0]">{user.name}</span>. Scroll down to access the member portal.
              </div>
            )}
          </div>

          {/* SIGN IN / PORTAL SIDE */}
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-[rgba(236,226,196,0.15)]" />
              <span className="text-[10px] uppercase tracking-[0.34em] text-[#b8ad8d]">Existing Members</span>
              <div className="h-px flex-1 bg-[rgba(236,226,196,0.15)]" />
            </div>

            {!isLoggedIn && (
              <form onSubmit={handleSignIn} className="rounded-sm border border-[rgba(236,226,196,0.18)] bg-[#0b0d12] p-6">
                <div className="mb-4">
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9f9676]">Email</label>
                  <input
                    required
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="mt-1.5 w-full border-b border-dashed border-[#d4a24a]/50 bg-transparent pb-2 text-[15px] text-[#ece2c4] placeholder:text-[#6f6646] focus:outline-none"
                    placeholder="member@org"
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#9f9676]">Passphrase (demo: anything works)</label>
                  <input
                    type="password"
                    value={signInPass}
                    onChange={(e) => setSignInPass(e.target.value)}
                    className="mt-1.5 w-full border-b border-dashed border-[#d4a24a]/50 bg-transparent pb-2 text-[15px] text-[#ece2c4] focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>

                {signInError && <div className="mb-4 text-xs text-[#c98b63]">{signInError}</div>}

                <button
                  type="submit"
                  className="w-full border border-[#d4a24a] py-3 text-[11px] uppercase tracking-[0.28em] text-[#d4a24a] transition hover:bg-[#d4a24a] hover:text-[#0b0d12]"
                >
                  Sign In to Portal
                </button>

                <p className="mt-4 text-center text-[10px] text-[#9f9676]">
                  First time? Apply on the left — your account will be created automatically.
                </p>
              </form>
            )}

            {/* MEMBER PORTAL */}
            {isLoggedIn && user && (
              <div className="space-y-6">
                <div className="flex items-baseline justify-between border-b border-[rgba(236,226,196,0.15)] pb-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.36em] text-[#9f9676]">Welcome back</div>
                    <div className="text-xl font-light text-[#f3ead0]">{user.name}</div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-[10px] uppercase tracking-[0.3em] text-[#c98b63] hover:text-[#d4a24a]"
                  >
                    Sign Out
                  </button>
                </div>

                <div className="rounded-sm border border-[rgba(236,226,196,0.2)] bg-[#0b0d12] p-5">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#b8ad8d] mb-1">Membership</div>
                  <div className="text-lg">{user.type.toUpperCase()} MEMBER</div>
                  <div className="mt-1 text-xs text-[#9f9676]">Joined {new Date(user.joinedAt).toLocaleDateString()}</div>
                  <div className="mt-3 text-sm text-[#d8ceb0]">{user.beliefsSummary}</div>
                </div>

                {/* Submit belief */}
                <div className="rounded-sm border border-[rgba(236,226,196,0.2)] bg-[#0b0d12] p-5">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#b8ad8d] mb-2">Submit a Belief</div>
                  <form onSubmit={handleSubmitBelief} className="flex gap-2">
                    <input
                      value={newBelief}
                      onChange={(e) => setNewBelief(e.target.value)}
                      placeholder="I believe that..."
                      className="flex-1 border-b border-dashed border-[#d4a24a]/40 bg-transparent pb-1 text-sm text-[#ece2c4] placeholder:text-[#6f6646] focus:outline-none"
                    />
                    <button type="submit" className="border border-[#d4a24a] px-4 text-xs uppercase tracking-widest text-[#d4a24a] hover:bg-[#d4a24a] hover:text-[#0b0d12]">
                      Add
                    </button>
                  </form>
                </div>

                {/* My beliefs */}
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#b8ad8d] mb-2">Your Recorded Beliefs</div>
                  {myBeliefs.length === 0 && <div className="text-sm text-[#9f9676]">None yet. The first step is always the hardest.</div>}
                  <ul className="space-y-2 text-sm text-[#d8ceb0]">
                    {myBeliefs.map((b) => (
                      <li key={b.id} className="border-l-2 border-[#d4a24a]/40 pl-3">{b.text}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-[10px] text-[#9f9676] pt-2 border-t border-[rgba(236,226,196,0.1)]">
                  This portal is currently a living prototype. Votes, private threads, and entheogen coordination are planned.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-16 text-center text-[11px] text-[#9f9676]">
          You may also reach us directly via{' '}
          <a href="https://t.me/Tripp_ORG" target="_blank" className="underline">Telegram</a> or{' '}
          <a href="https://signal.group/#CjQKIGm_Gsu9Lp9V6c_CN2AUuxSZWDRoIXqCTqdxzOmkoLPGEhDbF-_FCaSutuy3paRe9sUX" target="_blank" className="underline">Signal</a>.
          We honor sincere seekers.
        </div>
      </main>
    </div>
  )
}
