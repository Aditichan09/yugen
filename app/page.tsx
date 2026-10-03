'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeftRight,
  Check,
  Clipboard,
  Copy,
  Info,
  Languages,
  Link2,
  LockKeyhole,
  Play,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Volume2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const templates = [
  ['Schedule a meeting', 'Would you be available for a 30-minute call next week to discuss the proposal?'],
  ['Follow up', 'I wanted to follow up on my previous note and see if you had a chance to review it.'],
  ['Decline politely', 'Thank you for the thoughtful offer. After careful consideration, we will not be able to move forward at this time.'],
  ['Apologize for a delay', 'I sincerely apologize for the delay. We are reviewing the final details and will share an update shortly.'],
]

const options = {
  intent: ['General Update', 'Request', 'Follow-up', 'Apology', 'Declining an Offer', 'Negotiation Opening', 'Scheduling a Meeting', 'Delivering Bad News'],
  medium: ['Email', 'Slack / Chat', 'Formal Memo', 'Contract Clause'],
  keigo: ['Keigo (Standard Business)', 'Sonkeigo (Respectful / Upward)', 'Kenjougo (Humble)'],
  role: ['Executive', 'Mid-Level / Peer', 'Junior Staff', 'Client / Stakeholder', 'C-Suite Executive', 'Internal Team Member', 'Government Official', 'Vendor / Supplier'],
}

const demo = {
  translation: 'この度はご提案をいただき、誠にありがとうございます。社内で慎重に検討いたしました結果、今回は見送らせていただくこととなりました。',
  romaji: 'Kono tabi wa go-teian o itadaki, makoto ni arigatou gozaimasu. Shanaide shinchou ni kentou itashimashita kekka, konkai wa miokurasete itadaku koto to narimashita.',
  literal: 'Thank you very much for taking the time to make this proposal. After careful consideration internally, we have decided to pass on this opportunity at this time.',
  context: 'The phrasing acknowledges the effort behind the offer before declining indirectly. “見送らせていただく” is a standard, respectful business expression that preserves the relationship.',
}

export default function Home() {
  const [direction, setDirection] = useState<'EN_TO_JA' | 'JA_TO_EN'>('EN_TO_JA')
  const [draft, setDraft] = useState('Thank you for the thoughtful offer. After careful consideration, we will not be able to move forward at this time.')
  const [intent, setIntent] = useState('Declining an Offer')
  const [medium, setMedium] = useState('Email')
  const [keigo, setKeigo] = useState('Keigo (Standard Business)')
  const [yourRole, setYourRole] = useState('Executive')
  const [recipientRole, setRecipientRole] = useState('Client / Stakeholder')
  const [glossary, setGlossary] = useState('')
  const [result, setResult] = useState(demo)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState('')
  const [error, setError] = useState('')

  const sourceLabel = direction === 'EN_TO_JA' ? 'English draft' : 'Japanese draft'
  const targetLabel = direction === 'EN_TO_JA' ? 'Business Japanese' : 'Executive English'

  const parsedResult = useMemo(() => result, [result])

  async function translate() {
    if (!draft.trim()) return
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: draft, direction, medium, yourRole, recipientRole, keigoType: keigo, glossary, intent }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Translation unavailable')
      const text = data.result || ''
      const section = (labels: string[]) => text.match(new RegExp(`\\*\\*[^\\n]*(${labels.join('|')})[^\\n]*\\*\\*:?\\s*([\\s\\S]*?)(?=\\n\\s*\\*\\*|$)`, 'i'))?.[2]?.trim() || ''
      setResult({
        translation: section(['Translation']) || text,
        romaji: section(['Romaji', 'Pronunciation']),
        literal: section(['Literal Meaning', 'Literal']),
        context: section(['Context', 'Nuance', 'Tone Breakdown', 'Quick Context']),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to translate right now.')
    } finally { setLoading(false) }
  }

  function swap() {
    setDirection((current) => current === 'EN_TO_JA' ? 'JA_TO_EN' : 'EN_TO_JA')
    setDraft(result.translation)
  }

  async function copy(text: string, id: string) {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    window.setTimeout(() => setCopied(''), 1600)
  }

  function listen() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(parsedResult.translation)
      utterance.lang = direction === 'EN_TO_JA' ? 'ja-JP' : 'en-US'
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050b18] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(56,189,248,0.16),transparent_42%)]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-sky-300/10 py-5">
          <Link href="/" className="flex items-center gap-3" aria-label="Yugen home"><span className="flex size-9 items-center justify-center rounded-xl border border-sky-300/30 bg-sky-300/10 text-sky-300 shadow-[0_0_24px_rgba(56,189,248,0.15)]">幽</span><span className="text-base font-semibold tracking-tight">yugen<span className="text-sky-300">.ai</span></span></Link>
          <nav className="hidden items-center gap-7 text-sm text-slate-400 md:flex" aria-label="Main navigation"><Link className="text-sky-300" href="/">Translate</Link><Link className="hover:text-white" href="/about">About</Link><Link className="hover:text-white" href="/privacy">Privacy</Link><Link className="hover:text-white" href="/terms">Terms</Link><Link className="hover:text-white" href="/security">Security</Link></nav>
          <Badge variant="outline" className="border-sky-300/20 bg-sky-300/5 text-sky-200"><ShieldCheck data-icon="inline-start" /> Private workspace</Badge>
        </header>

        <section className="mx-auto max-w-4xl pb-14 pt-20 text-center sm:pt-28"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/5 px-3 py-1.5 text-xs font-medium text-sky-200"><Sparkles data-icon="inline-start" /> Executive language intelligence</div><h1 className="text-balance text-5xl font-semibold tracking-[-0.07em] text-white sm:text-7xl">Meaning, with<br /><span className="text-sky-300">the right weight.</span></h1><p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-slate-400 sm:text-lg">Yugen is a verifiable English ↔ Japanese business translator built for the moments where hierarchy, intent, and nuance matter.</p></section>

        <section id="translate" className="scroll-mt-6 pb-24"><Card className="overflow-hidden border-sky-300/15 bg-white/[0.045] shadow-2xl shadow-sky-950/30 backdrop-blur-xl"><CardHeader className="border-b border-sky-300/10 px-5 py-5 sm:px-7"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><CardTitle className="flex items-center gap-2 text-base text-white"><Languages className="text-sky-300" /> Translation workspace</CardTitle><p className="mt-1 text-sm text-slate-400">Shape the context. Verify the meaning. Send with confidence.</p></div><div className="flex rounded-lg border border-sky-300/15 bg-black/20 p-1"><button onClick={() => setDirection('EN_TO_JA')} className={`rounded-md px-3 py-2 text-xs font-medium transition ${direction === 'EN_TO_JA' ? 'bg-sky-300 text-slate-950' : 'text-slate-400 hover:text-white'}`}>English → Japanese Business</button><button onClick={() => setDirection('JA_TO_EN')} className={`rounded-md px-3 py-2 text-xs font-medium transition ${direction === 'JA_TO_EN' ? 'bg-sky-300 text-slate-950' : 'text-slate-400 hover:text-white'}`}>Japanese → Executive English</button></div></div></CardHeader><CardContent className="p-5 sm:p-7">
          <div className="grid gap-7 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col gap-5"><div className="flex items-center justify-between"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-sky-300">01 / Draft</p><h2 className="mt-2 text-lg font-semibold text-white">Your message</h2></div><Button onClick={() => setDraft('')} variant="ghost" size="sm" className="text-slate-400 hover:text-white"><RotateCcw data-icon="inline-start" /> Clear</Button></div><Textarea value={draft} onChange={(event) => setDraft(event.target.value)} className="min-h-52 resize-none border-sky-300/15 bg-black/20 text-base leading-7 text-slate-100 placeholder:text-slate-600 focus-visible:ring-sky-300/40" placeholder={`Write your ${sourceLabel.toLowerCase()} here...`} /><div className="flex items-center justify-between text-xs text-slate-500"><span>{sourceLabel}</span><span>{draft.length} characters</span></div><div><Label className="text-xs text-slate-400">Quick starts</Label><div className="mt-2 flex flex-wrap gap-2">{templates.map(([label, text]) => <button key={label} type="button" onClick={() => { setDraft(text); if (label === 'Schedule a meeting') setIntent('Scheduling a Meeting'); if (label === 'Follow up') setIntent('Follow-up'); if (label === 'Decline politely') setIntent('Declining an Offer'); if (label === 'Apologize for a delay') setIntent('Apology') }} className="rounded-md border border-sky-300/15 bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-400 transition hover:border-sky-300/40 hover:text-sky-200">{label}</button>)}</div></div></div>
            <div className="flex flex-col gap-5"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-sky-300">02 / Context</p><h2 className="mt-2 text-lg font-semibold text-white">Shape the communication</h2></div><div className="grid gap-4 sm:grid-cols-2">{([['Communication intent', intent, setIntent, options.intent], ['Medium', medium, setMedium, options.medium], ['Your role', yourRole, setYourRole, options.role], ['Recipient role', recipientRole, setRecipientRole, options.role], ['Keigo style', keigo, setKeigo, options.keigo]] as const).map(([label, value, setter, items]) => <label key={label} className="flex flex-col gap-2 text-xs text-slate-400"><span>{label}</span><select value={value} onChange={(event) => setter(event.target.value)} className="h-10 rounded-lg border border-sky-300/15 bg-[#0a1426] px-3 text-sm text-slate-200 outline-none focus:border-sky-300/50">{items.map((item) => <option key={item}>{item}</option>)}</select></label>)}</div><label className="flex flex-col gap-2 text-xs text-slate-400"><span>Optional brand / term glossary</span><Input value={glossary} onChange={(event) => setGlossary(event.target.value)} placeholder="e.g. Product names, preferred terminology" className="border-sky-300/15 bg-black/20 text-slate-200 placeholder:text-slate-600" /></label><Button onClick={translate} disabled={loading || !draft.trim()} className="mt-auto h-12 bg-sky-300 font-semibold text-slate-950 hover:bg-sky-200">{loading ? <><span className="animate-pulse">Processing context...</span></> : <><Send data-icon="inline-start" /> Translate with intent</>}</Button>{error && <p className="text-sm text-rose-300">{error}</p>}<p className="flex items-center gap-2 text-xs text-slate-500"><LockKeyhole className="size-3.5" /> Drafts are processed securely and never used to train models.</p></div>
          </div>

          <div className="my-8 h-px bg-sky-300/10" />
          <div className="flex items-center justify-between"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-sky-300">03 / Verify</p><h2 className="mt-2 text-lg font-semibold text-white">{targetLabel}</h2></div><Button onClick={swap} variant="outline" size="sm" className="border-sky-300/20 bg-transparent text-slate-300"><ArrowLeftRight data-icon="inline-start" /> Swap direction</Button></div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2"><ResultCard title="Translation" text={parsedResult.translation} onCopy={() => copy(parsedResult.translation, 'translation')} copied={copied === 'translation'} action={<Button onClick={listen} variant="ghost" size="sm" className="text-sky-300"><Volume2 data-icon="inline-start" /> Listen</Button>} large /><ResultCard title="Romaji / pronunciation" text={parsedResult.romaji} onCopy={() => copy(parsedResult.romaji, 'romaji')} copied={copied === 'romaji'} /><ResultCard title="Literal meaning check" text={parsedResult.literal} onCopy={() => copy(parsedResult.literal, 'literal')} copied={copied === 'literal'} /><ResultCard title="Nuance & context" text={parsedResult.context} onCopy={() => copy(parsedResult.context, 'context')} copied={copied === 'context'} /></div>
          <div className="mt-4 flex flex-col justify-between gap-4 rounded-xl border border-sky-300/15 bg-sky-300/[0.06] p-4 sm:flex-row sm:items-center"><div><p className="text-xs uppercase tracking-[0.16em] text-slate-400">Confidence rating</p><p className="mt-1 text-sm font-semibold text-white">9/10 <span className="font-normal text-slate-400">— Standard reliability</span></p></div><Button onClick={() => copy(parsedResult.translation, 'email')} variant="outline" size="sm" className="border-sky-300/20 bg-transparent text-sky-200"><Copy data-icon="inline-start" /> {copied === 'email' ? 'Copied' : 'Copy for email'}</Button></div>
        </CardContent></Card></section>

        <section className="grid gap-10 border-t border-sky-300/10 py-20 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-300">Why Yugen</p><h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">A translator that understands the room.</h2></div><div className="grid gap-4 sm:grid-cols-3"><Why icon={Link2} title="Hierarchy-aware" copy="Honor the relationship between sender and recipient, not just the words." /><Why icon={Info} title="Verifiable" copy="Read the literal meaning and context before anything leaves your desk." /><Why icon={Play} title="Intent-shaped" copy="A request, apology, and negotiation should never sound the same." /></div></section>

        <section className="border-t border-sky-300/10 py-20"><div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-300">See it in action</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">A polite decline, without the friction.</h2></div><Badge variant="outline" className="hidden border-sky-300/20 text-sky-200 sm:flex">Declining an offer</Badge></div><div className="grid gap-px overflow-hidden rounded-xl border border-sky-300/15 bg-sky-300/10 md:grid-cols-2"><div className="bg-white/[0.035] p-6"><p className="mb-3 text-xs uppercase tracking-wider text-slate-500">English draft</p><p className="text-sm leading-7 text-slate-300">“Thank you for the thoughtful offer. After careful consideration, we will not be able to move forward at this time.”</p></div><div className="bg-white/[0.06] p-6"><p className="mb-3 text-xs uppercase tracking-wider text-sky-300">Yugen translation</p><p className="font-japanese text-lg leading-8 text-white">{demo.translation}</p></div></div></section>

        <footer className="flex flex-col gap-3 border-t border-sky-300/10 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Yugen, Inc.</span><span className="flex items-center gap-2"><ShieldCheck className="size-3.5 text-sky-300" /> Built for considered communication</span></footer>
      </div>
    </main>
  )
}

function ResultCard({ title, text, onCopy, copied, action, large = false }: { title: string; text: string; onCopy: () => void; copied: boolean; action?: React.ReactNode; large?: boolean }) {
  return <Card className={`border-sky-300/15 bg-white/[0.035] ${large ? 'lg:col-span-2' : ''}`}><CardHeader className="flex flex-row items-center justify-between gap-3 px-5 py-4"><CardTitle className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{title}</CardTitle><div className="flex items-center gap-1">{action}{<Button onClick={onCopy} variant="ghost" size="sm" className="text-slate-400 hover:text-white">{copied ? <Check data-icon="inline-start" /> : <Clipboard data-icon="inline-start" />} {copied ? 'Copied' : 'Copy'}</Button>}</div></CardHeader><CardContent className={`px-5 pb-5 ${large ? 'min-h-32' : 'min-h-24'}`}><p className={`${large ? 'font-japanese text-xl leading-9' : 'text-sm leading-7'} whitespace-pre-wrap text-slate-200`}>{text || <span className="text-slate-600">No detail returned.</span>}</p></CardContent></Card>
}

function Why({ icon: Icon, title, copy }: { icon: typeof Link2; title: string; copy: string }) {
  return <div className="rounded-xl border border-sky-300/10 bg-white/[0.025] p-5"><Icon className="mb-8 size-5 text-sky-300" /><h3 className="font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p></div>
}
