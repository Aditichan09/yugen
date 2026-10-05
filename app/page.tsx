'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeftRight, Check, Clipboard, FileText, Languages, Loader2, ScanLine, Sparkles, Trash2, Upload } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

const intents = ['Schedule a meeting', 'Follow up', 'Decline politely', 'Apologize for a delay', 'Make a request', 'General business']
const recipients = ['Client / customer', 'Senior executive', 'Peer / coworker', 'Junior staff', 'Supplier / partner', 'New business contact']

type Translation = { translation: string; nuance: string; alternative: string }

export default function Home() {
  const [draft, setDraft] = useState('')
  const [direction, setDirection] = useState<'EN_TO_JA' | 'JA_TO_EN'>('EN_TO_JA')
  const [medium, setMedium] = useState('Business email')
  const [recipient, setRecipient] = useState(recipients[0])
  const [intent, setIntent] = useState(intents[0])
  const [tone, setTone] = useState('Standard business keigo')
  const [context, setContext] = useState('')
  const [result, setResult] = useState<Translation | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [fileName, setFileName] = useState('')
  const [attachment, setAttachment] = useState<{ data: string; mimeType: string } | null>(null)

  const isJapanese = direction === 'JA_TO_EN'
  const placeholder = isJapanese ? '日本語のメールやメッセージを貼り付けてください。' : 'Paste an email or message in English to translate into natural business Japanese.'

  function switchDirection() {
    setDirection(current => current === 'EN_TO_JA' ? 'JA_TO_EN' : 'EN_TO_JA')
    setResult(null)
    setError('')
  }

  async function translate() {
    if (!draft.trim()) { setError('Add the message you want to translate first.'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: draft.trim(), direction, medium, recipientRole: recipient, intent, keigoType: tone, context, attachment }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Translation failed.')
      const translated = data.translation || parseSection(data.result || '', direction === 'JA_TO_EN' ? ['English Translation'] : ['Translation', '日本語訳'])
      setResult({ translation: translated, nuance: data.nuance || parseSection(data.result || '', ['Tone Breakdown', 'Nuance', 'Quick Context']), alternative: data.alternative || parseSection(data.result || '', ['Alternative', 'Business Context']) })
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Translation failed. Please try again.') }
    finally { setLoading(false) }
  }

  async function copyTranslation() { if (!result?.translation) return; await navigator.clipboard.writeText(result.translation); setCopied(true); window.setTimeout(() => setCopied(false), 1600) }
  function clearAll() { setDraft(''); setResult(null); setError(''); setFileName(''); setAttachment(null) }
  async function handleFile(file?: File) { if (!file) return; if (file.size > 10 * 1024 * 1024) { setError('Please choose a file smaller than 10 MB.'); return } const data = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1] || ''); reader.onerror = () => reject(new Error('Could not read that file.')); reader.readAsDataURL(file) }); setFileName(file.name); setAttachment({ data, mimeType: file.type || 'application/octet-stream' }); setError(''); if (file.type.startsWith('text/')) { const text = await file.text(); setDraft(text) } }

  return <main className="min-h-screen bg-[#071426] text-slate-100">
    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_75%_0%,rgba(58,116,180,.18),transparent_35%),linear-gradient(180deg,rgba(9,28,55,.6),transparent_46%)]" />
    <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8">
      <header className="flex items-center justify-between border-b border-white/10 py-5"><Link href="/" className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl border border-cyan-200/25 bg-cyan-200/10 font-japanese text-xl text-cyan-200">幽</span><span className="text-lg font-semibold tracking-tight">yugen<span className="text-cyan-300">.ai</span></span></Link><nav className="hidden items-center gap-6 text-sm text-slate-400 md:flex"><Link className="text-cyan-200" href="/">Workspace</Link><Link className="hover:text-white" href="/about">About</Link><Link className="hover:text-white" href="/services">Services</Link><Link className="hover:text-white" href="/privacy">Privacy</Link><Link className="hover:text-white" href="/terms">Terms</Link><Link className="hover:text-white" href="/security">Security</Link></nav><a href="mailto:yugenwebbyadi@gmail.com" className="text-xs text-slate-400 hover:text-cyan-200">Support</a></header>
      <section className="grid gap-8 pb-10 pt-14 lg:grid-cols-[1fr_1.25fr] lg:items-end lg:pt-20"><div><Badge className="mb-5 border border-cyan-200/20 bg-cyan-200/10 text-cyan-200"><Sparkles data-icon="inline-start" /> Business language desk</Badge><h1 className="max-w-3xl text-5xl font-semibold tracking-[-.07em] text-white sm:text-7xl">Say it with<br /><span className="text-cyan-300">the right weight.</span></h1></div><p className="max-w-xl text-base leading-7 text-slate-400 lg:justify-self-end">Translate real business communication with the relationship, intent, and level of Japanese politeness in mind. No word-for-word shortcuts.</p></section>
      <section className="grid gap-6 pb-20 lg:grid-cols-[1.02fr_.98fr]">
        <Card className="border-white/10 bg-white/[.045] shadow-2xl shadow-blue-950/30 backdrop-blur-xl"><CardHeader className="border-b border-white/10"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[.18em] text-cyan-300">Translation workspace</p><CardTitle className="mt-2 text-white">Prepare your correspondence</CardTitle></div><Badge variant="outline" className="border-emerald-300/20 text-emerald-200">Private by design</Badge></div></CardHeader><CardContent className="flex flex-col gap-5 p-6">
          <div className="flex items-center gap-3"><Button type="button" variant={direction === 'EN_TO_JA' ? 'secondary' : 'outline'} className="flex-1" onClick={() => setDirection('EN_TO_JA')}>English → 日本語</Button><Button type="button" variant="outline" size="icon" aria-label="Switch translation direction" onClick={switchDirection}><ArrowLeftRight /></Button><Button type="button" variant={direction === 'JA_TO_EN' ? 'secondary' : 'outline'} className="flex-1" onClick={() => setDirection('JA_TO_EN')}>日本語 → English</Button></div>
          <div className="grid gap-3 sm:grid-cols-2"><SelectField label="Message type" value={medium} onChange={setMedium} options={['Business email', 'Business message / chat', 'General business text']} /><SelectField label="Recipient" value={recipient} onChange={setRecipient} options={recipients} /></div>
          <div className="grid gap-3 sm:grid-cols-2"><SelectField label="Intent" value={intent} onChange={setIntent} options={intents} /><SelectField label="Tone" value={tone} onChange={setTone} options={['Standard business keigo', 'Very formal / executive', 'Warm and professional', 'Plain but respectful']} /></div>
          <label className="text-xs text-slate-400">Message to translate<span className="mt-2 block"><Textarea value={draft} onChange={e => setDraft(e.target.value)} placeholder={placeholder} className="min-h-44 resize-y border-white/10 bg-[#091b35] text-base leading-7 text-white placeholder:text-slate-600" aria-label="Message to translate" /></span><span className="mt-2 block text-right text-xs text-slate-500">{draft.length.toLocaleString()} characters</span></label>
          <label className="text-xs text-slate-400">Situation context <span className="text-slate-600">(optional)</span><Textarea value={context} onChange={e => setContext(e.target.value)} placeholder="For example: This is a second follow-up after the client has not replied." className="mt-2 min-h-20 border-white/10 bg-[#091b35] text-sm text-white placeholder:text-slate-600" /></label>
          <input id="document-upload" type="file" accept=".pdf,.doc,.docx,.txt,image/*" className="sr-only" onChange={e => handleFile(e.target.files?.[0])} /><input id="scan-document" type="file" accept="image/*" capture="environment" className="sr-only" onChange={e => handleFile(e.target.files?.[0])} /><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-2"><Button type="button" variant="outline" className="border-white/10 text-slate-300" onClick={() => document.getElementById('document-upload')?.click()}><Upload data-icon="inline-start" />Upload PDF</Button><Button type="button" variant="outline" className="border-white/10 text-slate-300" onClick={() => document.getElementById('scan-document')?.click()}><ScanLine data-icon="inline-start" />Scan document</Button></div>{fileName && <span className="text-xs text-amber-200">{fileName}</span>}<div className="ml-auto flex gap-2"><Button type="button" variant="ghost" onClick={clearAll}><Trash2 data-icon="inline-start" />Clear</Button><Button type="button" onClick={translate} disabled={loading || !draft.trim()} className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">{loading ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <Languages data-icon="inline-start" />}{loading ? 'Translating…' : 'Translate'}</Button></div></div>
          {error && <p role="alert" className="rounded-lg border border-red-300/20 bg-red-300/10 p-3 text-sm text-red-200">{error}</p>}
        </CardContent></Card>
        <Card className="border-white/10 bg-[#0a1b35]/85"><CardHeader className="flex flex-row items-center justify-between"><div><p className="text-xs uppercase tracking-[.18em] text-cyan-300">Review</p><CardTitle className="mt-2 text-white">{isJapanese ? 'Natural business English' : 'Business Japanese'}</CardTitle></div><Button onClick={copyTranslation} disabled={!result} variant="outline" size="sm" className="border-white/10 text-slate-300">{copied ? <Check data-icon="inline-start" /> : <Clipboard data-icon="inline-start" />}{copied ? 'Copied' : 'Copy'}</Button></CardHeader><CardContent className="min-h-[430px]">{result ? <div className="flex flex-col gap-6"><p className={isJapanese ? 'text-xl leading-9 text-white' : 'font-japanese text-xl leading-9 text-white'}>{result.translation}</p><div className="border-t border-white/10 pt-5"><p className="mb-2 text-xs uppercase tracking-[.16em] text-cyan-300">Nuance</p><p className="text-sm leading-6 text-slate-300">{result.nuance}</p></div>{result.alternative && <div className="rounded-xl border border-white/10 bg-white/[.03] p-4"><p className="mb-2 text-xs uppercase tracking-[.16em] text-slate-500">Alternative formality</p><p className={isJapanese ? 'text-sm leading-6 text-slate-300' : 'font-japanese text-sm leading-6 text-slate-300'}>{result.alternative}</p></div>}</div> : <div className="flex min-h-[390px] flex-col items-center justify-center text-center"><div className="mb-5 flex size-14 items-center justify-center rounded-2xl border border-cyan-200/15 bg-cyan-200/5"><Languages className="text-cyan-300" /></div><h2 className="text-lg font-medium text-white">Your considered translation will appear here</h2><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Add your message and context, then Yugen will adapt the language without changing your meaning.</p></div>}</CardContent></Card>
      </section>
      <section className="grid gap-5 border-t border-white/10 py-14 md:grid-cols-3"><Feature icon={FileText} title="Business-aware" copy="Preserve intent and nuance across clients, executives, colleagues, and partners." /><Feature icon={ScanLine} title="Bring your documents" copy="Upload a PDF or scan as a starting point, then review before sending sensitive text." /><Feature icon={Languages} title="Two-way clarity" copy="Translate in either direction with a clear explanation of tone and formality." /></section><footer className="flex flex-col gap-3 border-t border-white/10 py-8 text-xs text-slate-500 sm:flex-row sm:justify-between"><span>© 2026 Yugen. Considered communication.</span><a className="text-cyan-200 hover:text-white" href="mailto:yugenwebbyadi@gmail.com">Questions? yugenwebbyadi@gmail.com</a></footer>
    </div></main>
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) { return <label className="text-xs text-slate-400">{label}<select value={value} onChange={e => onChange(e.target.value)} className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#091b35] px-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-300/50">{options.map(option => <option key={option}>{option}</option>)}</select></label> }
function Feature({ icon: Icon, title, copy }: { icon: typeof Languages; title: string; copy: string }) { return <div className="rounded-2xl border border-white/10 bg-white/[.025] p-6"><Icon className="mb-8 text-cyan-300" /><h2 className="font-semibold text-white">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p></div> }

function parseSection(text: string, labels: string[]) { const label = labels.join('|'); return text.match(new RegExp(`(?:\\*\\*)?(?:${label})(?:\\*\\*)?:?\\s*([\\s\\S]*?)(?=\\n\\s*(?:\\*\\*)?(?:Translation|English Translation|日本語訳|Nuance|Alternative|Tone|Confidence|Business Context)(?:\\*\\*)?:?|$)`, 'i'))?.[1]?.trim().replace(/^\\*\\*|\\*\\*$/g, '') || '' }
export { parseSection }
