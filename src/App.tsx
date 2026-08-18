import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import './App.css'

type Tip = {
  id: number
  author?: string
  title: string
  category: string
  summary: string
  nextStep: string
}

const starterTips: Tip[] = [
  {
    id: 1,
    title: 'Pause before clicking links',
    category: 'Urgent action',
    summary: 'A fake account alert often pushes recipients to click immediately instead of thinking clearly.',
    nextStep: 'Hover over the link and confirm the destination matches the company domain before you login.',
  },
  {
    id: 2,
    title: 'Check the sender address carefully',
    category: 'Spoofed sender',
    summary: 'Attackers copy familiar names and change just one character in the domain.',
    nextStep: 'Compare the sender with official contact details from a trusted source instead of the email thread itself.',
  },
  {
    id: 3,
    title: 'Verify the request through a known channel',
    category: 'Credentials request',
    summary: 'Real companies rarely ask for passwords, MFA codes, or payment details by email.',
    nextStep: 'Open a web browser directly to the company website and contact support if the message seems urgent.',
  },
]

const indicators = [
  {
    name: 'Spoofed sender',
    description: 'The address looks familiar but uses a near-match domain or odd punctuation.',
  },
  {
    name: 'Urgent pressure',
    description: 'The sender demands action in minutes and threatens account closure or lost access.',
  },
  {
    name: 'Credential bait',
    description: 'The email asks you to enter a password, OTP, or security code on a linked page.',
  },
  {
    name: 'Unexpected attachment',
    description: 'A file arrives without context and uses odd extensions or compressed archive formats.',
  },
]

const steps = [
  'Pause and read the message carefully before acting.',
  'Inspect the sender address, links, and any attachments.',
  'Verify the request using a trusted company contact or official app.',
  'Report the message and delete it if it looks suspicious.',
]

const emptyForm = {
  author: '',
  category: 'Urgent action',
  insight: '',
  nextStep: '',
}

function App() {
  const [tips, setTips] = useState<Tip[]>(starterTips)
  const [form, setForm] = useState(emptyForm)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTips = async () => {
      try {
        const response = await fetch('/api/tips')
        if (!response.ok) {
          throw new Error('Unable to fetch tips')
        }

        const data = await response.json()
        if (Array.isArray(data.tips) && data.tips.length > 0) {
          setTips(data.tips)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    void loadTips()
  }, [])

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.author.trim() || !form.insight.trim() || !form.nextStep.trim()) {
      setFeedback('Please complete all fields before sharing your tip.')
      return
    }

    try {
      const response = await fetch('/api/tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'Unable to add tip')
      }

      const newTip = data.tip
      setTips((current) => [newTip, ...current])
      setForm(emptyForm)
      setFeedback('Thanks for sharing a practical phishing warning tip.')
    } catch (error) {
      console.error(error)
      setFeedback('We could not save that tip right now, but your idea is still useful to review.')
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">⚠</span>
          PhishSafe
        </div>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#signals">Warning signs</a>
          <a href="#workflow">Quick check</a>
          <a href="#share">Share a tip</a>
        </nav>
      </header>

      <main className="content">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Recognize phishing before it reaches you</p>
            <h1>Know the warning signs of a scam email.</h1>
            <p className="lead">
              Learn how to spot fake urgency, spoofed senders, and credential-stealing requests before
              they compromise your accounts.
            </p>
            <div className="cta-row">
              <a className="primary-link" href="#signals">
                Check the signs
              </a>
              <a className="secondary-link" href="#share">
                Share a step
              </a>
            </div>
            <ul className="mini-list">
              <li>Pause before you click</li>
              <li>Verify with a trusted source</li>
              <li>Report anything suspicious</li>
            </ul>
          </div>

          <div className="email-card" aria-label="Example suspicious email preview">
            <div className="mail-topline">
              <span>From</span>
              <strong>security@paypa1-login.com</strong>
            </div>
            <h2>Urgent: verify your account now</h2>
            <p>
              Your account will be locked unless you confirm your password within 10 minutes.
            </p>
            <ul>
              <li>Domain is slightly altered from the normal brand.</li>
              <li>Uses strong pressure and a short deadline.</li>
              <li>Requests account credentials via a link.</li>
            </ul>
          </div>
        </section>

        <section id="signals" className="signals section-block">
          <div className="section-heading">
            <p className="eyebrow">Common signals</p>
            <h2>What makes an email suspicious?</h2>
          </div>
          <div className="card-grid">
            {indicators.map((indicator) => (
              <article key={indicator.name} className="info-card">
                <span className="tag">Signal</span>
                <h3>{indicator.name}</h3>
                <p>{indicator.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="workflow section-block">
          <div className="section-heading">
            <p className="eyebrow">Simple workflow</p>
            <h2>Use this quick check before you act.</h2>
          </div>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={step} className="step-card">
                <span className="step-number">0{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="share" className="share section-block">
          <div className="share-copy">
            <p className="eyebrow">Share a practical step</p>
            <h2>Help others recognize phishing faster.</h2>
            <p>
              Use the form below to document a quick clue or a trusted verification routine that makes
              suspicious emails easier to spot.
            </p>
          </div>

          <form className="tip-form" onSubmit={handleSubmit}>
            <label>
              Your name
              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Sam Rivera"
              />
            </label>

            <label>
              Risk pattern
              <select name="category" value={form.category} onChange={handleChange}>
                <option value="Urgent action">Urgent action</option>
                <option value="Spoofed sender">Spoofed sender</option>
                <option value="Credentials request">Credentials request</option>
                <option value="Unexpected attachment">Unexpected attachment</option>
              </select>
            </label>

            <label>
              What makes this suspicious?
              <textarea
                name="insight"
                value={form.insight}
                onChange={handleChange}
                rows={4}
                placeholder="The email looked nearly identical to the real vendor but used a different domain and demanded immediate login."
              />
            </label>

            <label>
              Best next step
              <textarea
                name="nextStep"
                value={form.nextStep}
                onChange={handleChange}
                rows={3}
                placeholder="Open the official website from a bookmark and verify the request there instead of clicking the email link."
              />
            </label>

            <button type="submit" className="submit-button">
              Share warning tip
            </button>

            {feedback ? <p className="feedback">{feedback}</p> : null}
          </form>
        </section>

        <section className="community section-block">
          <div className="section-heading">
            <p className="eyebrow">Shared notes</p>
            <h2>Community reminders</h2>
          </div>

          {loading ? <p className="loading">Loading examples...</p> : null}

          <div className="tip-list">
            {tips.map((tip) => (
              <article key={tip.id} className="tip-item">
                <span className="tag">{tip.category}</span>
                <h3>{tip.title}</h3>
                <p>{tip.summary}</p>
                <strong>Next step</strong>
                <p>{tip.nextStep}</p>
                {tip.author ? <small>Shared by {tip.author}</small> : null}
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
