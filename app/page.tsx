'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Check, Clipboard, FileDown, Moon, ScanLine, Sun, Upload, X } from 'lucide-react'

type HistoryEntry = { id: string; date: string; messageType: string; recipient: string; purpose: string; tone: string; original: string; japanese: string; backTranslation: string }

type Result = { japanese: string; backTranslation: string; note: string }

const templateOptions = [
  ['Thank you after a meeting', 'Thank you for meeting with us last week. Your feedback was very helpful.'],
  ['Schedule a meeting', 'Would you be available for an online meeting next week to discuss next steps?'],
  ['Follow up', 'I wanted to follow up on my previous message and see if you had a chance to review it.'],
  ['Decline politely', 'Thank you for the thoughtful offer. After careful consideration, we will not be able to move forward at this time.'],
  ['Apologize for a delay', 'I sincerely apologize for the delay. We will share an update shortly.'],
  ['Make a request', 'Could you please share the updated documents at your convenience?'],
]

const demo: Result = {
  japanese: 'この度はお時間を頂戴し、誠にありがとうございます。今後とも何卒よろしくお願い申し上げます。',
  backTranslation: 'Thank you very much for taking the time. We sincerely appreciate it and look forward to your continued support.',
  note: 'Standard business keigo with humble wording that shows respect to the recipient.',
}

export default function Home() {
  const [dark, setDark] = useState(true)
  const [messageType, setMessageType] = useState('Business email')
  const [recipient, setRecipient] = useState('Client or customer')
  const [purpose, setPurpose] = useState('Thank you after a meeting')
  const [tone, setTone] = useState('Standard business keigo')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [sender, setSender] = useState('')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(true)
  const [copied, setCopied] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { const stored = window.localStorage.getItem('yugen-theme'); setDark(stored !== 'light') }, [])
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); window.localStorage.setItem('yugen-theme', dark ? 'dark' : 'light') }, [dark])

  async function translate() {
    if (!message.trim()) { setError('Please add a message before translating.'); return }
    setLoading(true); setError('')
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: message, direction: 'EN_TO_JA', medium: messageType, yourRole: sender || 'Business professional', recipientRole: recipient, keigoType: tone, intent: purpose, glossary: company ? `Recipient company: ${company}` : '' }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Translation is unavailable right now.')
      const raw = data.result || ''
      const extract = (labels: string[]) => raw.match(new RegExp(`(?:\\*\\*)?(?:${labels.join('|')})(?:\\*\\*)?:?\\s*([\\s\\S]*?)(?=\\n\\s*(?:\\*\\*)?(?:Translation|日本語訳|Romaji|Tone Breakdown|Literal Meaning Check|Confidence|Quick Context|Business Context)(?:\\*\\*)?:?|$)`, 'i'))?.[1]?.trim().replace(/^\\*\\*|\\*\\*$/g, '') || ''
      const japanese = data.translation || extract(['Translation', '日本語訳']) || raw
      const backTranslation = extract(['Literal Meaning Check', 'Business Context']) || 'Review the Japanese carefully against your original message before sending.'
      const note = data.nuance || extract(['Tone Breakdown', 'Quick Context']) || `${tone} used for a ${recipient.toLowerCase()}.`
      const next = { japanese, backTranslation, note }; setResult(next)
      if (saved) { const entries: HistoryEntry[] = JSON.parse(window.localStorage.getItem('yugen-history') || '[]'); entries.unshift({ id: crypto.randomUUID(), date: new Date().toISOString(), messageType, recipient, purpose, tone, original: message, japanese, backTranslation }); window.localStorage.setItem('yugen-history', JSON.stringify(entries.slice(0, 50))) }
    } catch (err) { setError(err instanceof Error ? err.message : 'Translation failed. Please try again.') } finally { setLoading(false) }
  }

  async function copyResult() { if (!result) return; await navigator.clipboard.writeText(result.japanese); setCopied(true); window.setTimeout(() => setCopied(false), 1500) }
  function clearAll() { setMessage(''); setResult(null); setError('') }
  function chooseTemplate(value: string, label: string) { setMessage(value); setPurpose(label) }
  async function readFile(event: ChangeEvent<HTMLInputElement>) { const file = event.target.files?.[0]; if (!file) return; setError(''); if (file.type === 'text/plain' || file.type.startsWith('image/')) { if (file.type === 'text/plain') setMessage(await file.text()); else setError('Image selected. OCR is not configured in this preview; please paste the text for review.') } else if (file.type === 'application/pdf') { setError('PDF selected. Text extraction is not configured in this preview; please paste the text for review.') } else { setError('Please choose an image, PDF, or text document.') } }

  return <main className={dark ? 'site dark' : 'site'}>
    <header className="site-header"><Link href="/" className="brand"><span>幽</span><b>Yugen</b></Link><nav aria-label="Main navigation"><Link className="active" href="/">Workspace</Link><Link href="/history">History</Link><Link href="/features">Features</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/security">Security</Link><Link href="/about">About</Link></nav><button className="theme-toggle" onClick={() => setDark(!dark)} aria-label="Toggle dark mode">{dark ? <Sun /> : <Moon />}<span>{dark ? 'Light' : 'Dark'}</span></button></header>
    <div className="page-wrap"><section className="hero"><p className="eyebrow">Business Japanese, checked for tone</p><h1>Say it with the right weight.</h1><p>Write in English. Yugen adapts the keigo to who you are writing to and shows you what it says, so you can check before you send.</p></section>
      <section className="workspace" aria-label="Translation workspace"><div className="option-grid">
        <Option title="Message type" tint="navy"><select value={messageType} onChange={e => setMessageType(e.target.value)}><option>Business email</option><option>Chat message</option><option>Letter</option></select></Option>
        <Option title="Who are you writing to?" tint="gold"><select value={recipient} onChange={e => setRecipient(e.target.value)}><option>Client or customer</option><option>Senior executive</option><option>Peer</option><option>Supplier or partner</option><option>New contact</option></select></Option>
        <Option title="Purpose" tint="green"><input list="purposes" value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="Pick or type your own" /><datalist id="purposes">{templateOptions.map(([label]) => <option key={label} value={label} />)}</datalist></Option>
        <Option title="Tone" tint="purple"><select value={tone} onChange={e => setTone(e.target.value)}><option>Standard business keigo</option><option>Very formal</option><option>Warm and professional</option></select></Option>
      </div>
      <div className="small-fields"><label>Their name<input value={name} onChange={e => setName(e.target.value)} placeholder="Optional" /></label><label>Their company<input value={company} onChange={e => setCompany(e.target.value)} placeholder="Optional" /></label><label>Your name and title<input value={sender} onChange={e => setSender(e.target.value)} placeholder="Optional" /></label></div>
      <label className="message-label">Your message<textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Write the English message you want to send..." /></label>
      <div className="actions"><button className="primary" onClick={translate} disabled={loading}>{loading ? 'Translating…' : 'Translate'}</button><button className="secondary" onClick={() => fileRef.current?.click()}><ScanLine /> Scan document</button><button className="secondary" onClick={() => fileRef.current?.click()}><Upload /> Upload PDF</button><button className="text-button" onClick={clearAll}><X /> Clear</button><input ref={fileRef} className="sr-only" type="file" accept="image/*,.pdf,.txt" capture="environment" onChange={readFile} /></div>
      <p className="privacy-note">Review every message before sending. Read <Link href="/privacy">Privacy</Link> and <Link href="/security">Security</Link> before uploading confidential documents.</p><label className="check-row"><input type="checkbox" checked={saved} onChange={e => setSaved(e.target.checked)} /> Save this translation to my history</label>
      <div className="result-heading"><div><p className="eyebrow">Result</p><h2>Your business Japanese</h2></div><div className="result-actions"><button className="secondary" onClick={copyResult} disabled={!result}>{copied ? <Check /> : <Clipboard />} {copied ? 'Copied' : 'Copy'}</button><button className="secondary" onClick={() => window.print()} disabled={!result}><FileDown /> Export as PDF</button></div></div>
      <div className="result-panel">{result ? <><p className="japanese">{result.japanese}</p><div className="result-detail"><div><b>Back-translation</b><p>{result.backTranslation}</p></div><div><b>Politeness note</b><p>{result.note}</p></div></div></> : <p className="placeholder">Your Japanese draft appears here, with a back-translation and a note on the politeness level used.</p>}</div>{error && <p className="error" role="alert">{error}</p>}
      <div className="templates"><div><p className="eyebrow">Quick starts</p><h2>Common correspondence</h2></div><div className="template-grid">{templateOptions.map(([label, value]) => <button key={label} onClick={() => chooseTemplate(value, label)}><span>{label}</span><small>{value}</small></button>)}</div></div></section></div>
    <footer className="site-footer"><div className="brand"><span>幽</span><b>Yugen</b></div><p>© 2026 Yugen</p><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/security">Security</Link><a href="mailto:yugenwebbyadi@gmail.com">yugenwebbyadi@gmail.com</a></div></footer>
  </main>
}

function Option({ title, tint, children }: { title: string; tint: string; children: React.ReactNode }) { return <label className={`option ${tint}`}><span>{title}</span>{children}</label> }

const _unused = demo
void _unused
