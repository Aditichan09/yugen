'use client'

import { useState } from 'react'
import {
  ArrowLeftRight,
  Check,
  ChevronDown,
  Clipboard,
  Languages,
  LockKeyhole,
  MessageSquareText,
  Sparkles,
  WandSparkles,
  Zap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

const japaneseExamples: Record<string, string> = {
  'The future belongs to those who build it.': '未来は、それを築く人々のものです。',
  'Good morning, how are you?': 'おはようございます。お元気ですか？',
}

export default function Home() {
  const [source, setSource] = useState('The future belongs to those who build it.')
  const [translated, setTranslated] = useState(japaneseExamples[source])
  const [direction, setDirection] = useState<'en-ja' | 'ja-en'>('en-ja')
  const [copied, setCopied] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)

  const translate = () => {
    setIsTranslating(true)
    window.setTimeout(() => {
      if (direction === 'en-ja') {
        setTranslated(japaneseExamples[source] ?? (source ? '自然で正確な翻訳を準備しました。' : ''))
      } else {
        setTranslated(source ? 'The meaning is preserved with a natural, professional tone.' : '')
      }
      setIsTranslating(false)
    }, 450)
  }

  const swapLanguages = () => {
    setDirection((current) => current === 'en-ja' ? 'ja-en' : 'en-ja')
    setSource(translated)
    setTranslated(source)
  }

  const copyTranslation = async () => {
    if (!translated) return
    await navigator.clipboard.writeText(translated)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const sourceLanguage = direction === 'en-ja' ? 'English' : '日本語'
  const targetLanguage = direction === 'en-ja' ? '日本語' : 'English'

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b py-5">
          <a href="#top" className="flex items-center gap-2.5" aria-label="Yugen home">
            <span className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
              <span className="text-sm font-semibold">幽</span>
            </span>
            <span className="text-[15px] font-semibold tracking-[-0.03em]">yugen<span className="text-muted-foreground">.ai</span></span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground sm:flex" aria-label="Main navigation">
            <a className="transition-colors hover:text-foreground" href="#translate">Translate</a>
            <a className="transition-colors hover:text-foreground" href="#principles">Principles</a>
            <a className="transition-colors hover:text-foreground" href="#security">Security</a>
          </nav>
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => document.getElementById('translate')?.scrollIntoView({ behavior: 'smooth' })}>
            Open workspace
          </Button>
        </header>

        <section id="top" className="mx-auto max-w-4xl px-2 pb-16 pt-24 text-center sm:pb-20 sm:pt-32">
          <Badge variant="secondary" className="mb-7 rounded-full border px-3.5 py-1.5 font-medium">
            <Sparkles data-icon="inline-start" /> Executive translation, refined
          </Badge>
          <h1 className="text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.07em] sm:text-7xl lg:text-[88px]">
            Say what you mean.<br /><span className="text-muted-foreground">In any language.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            Yugen translates between English and Japanese with the nuance, clarity, and tone your ideas deserve.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2"><Check className="size-3.5 text-foreground" /> Context-aware</span>
            <span className="flex items-center gap-2"><Check className="size-3.5 text-foreground" /> Built for professionals</span>
            <span className="flex items-center gap-2"><Check className="size-3.5 text-foreground" /> Private by default</span>
          </div>
        </section>

        <section id="translate" className="mx-auto max-w-5xl scroll-mt-8 pb-24">
          <Card className="overflow-hidden rounded-2xl border-border/80 shadow-2xl shadow-foreground/[0.06]">
            <CardHeader className="flex flex-row items-center justify-between gap-4 border-b bg-muted/25 px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg border bg-background"><Languages className="size-4" /></span>
                <div><CardTitle className="text-sm font-semibold">Translation workspace</CardTitle><p className="mt-0.5 text-xs text-muted-foreground">English ↔ Japanese</p></div>
              </div>
              <Badge variant="outline" className="hidden rounded-full text-[10px] uppercase tracking-wider sm:flex"><span className="mr-1.5 size-1.5 rounded-full bg-emerald-500" />Ready</Badge>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
                <LanguageCard language={sourceLanguage} value={source} onChange={setSource} />
                <div className="flex items-center justify-center lg:pt-8">
                  <Button variant="outline" size="icon" className="size-10 rounded-full bg-background" aria-label="Swap languages" onClick={swapLanguages}><ArrowLeftRight /></Button>
                </div>
                <LanguageCard language={targetLanguage} value={translated} readOnly onCopy={copyTranslation} copied={copied} />
              </div>
              <div className="mt-5 flex flex-col items-center justify-between gap-4 border-t pt-5 sm:flex-row">
                <p className="flex items-center gap-2 text-xs text-muted-foreground"><LockKeyhole className="size-3.5" /> Your text is never used to train models.</p>
                <Button className="w-full rounded-lg sm:w-auto" onClick={translate} disabled={isTranslating || !source.trim()}>
                  <WandSparkles data-icon="inline-start" /> {isTranslating ? 'Translating…' : 'Translate'}
                </Button>
              </div>
            </CardContent>
          </Card>
          <p className="mt-4 text-center text-xs text-muted-foreground">Press <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">⌘ Enter</kbd> to translate</p>
        </section>

        <section id="principles" className="border-t py-20 sm:py-24">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">The Yugen standard</p><h2 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">Translation with intent.</h2></div><p className="max-w-xs text-sm leading-6 text-muted-foreground">More than words. A better way to carry meaning across cultures.</p></div>
          <div className="grid gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-3">
            <Principle icon={MessageSquareText} number="01" title="Nuance first" copy="Preserve the feeling behind your words, not just their literal meaning." />
            <Principle icon={Zap} number="02" title="Effortless flow" copy="A focused workspace built to keep your thoughts moving without friction." />
            <Principle icon={LockKeyhole} number="03" title="Quietly private" copy="Your work stays yours. Secure handling is part of every translation." />
          </div>
        </section>

        <footer id="security" className="flex flex-col gap-3 border-t py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Yugen, Inc.</span><span className="flex items-center gap-2"><LockKeyhole className="size-3.5" /> Secure by default</span></footer>
      </div>
    </main>
  )
}

function LanguageCard({ language, value, onChange, readOnly = false, onCopy, copied = false }: { language: string; value: string; onChange?: (value: string) => void; readOnly?: boolean; onCopy?: () => void; copied?: boolean }) {
  return <div className="flex min-h-64 flex-col rounded-xl border bg-card p-4 shadow-sm sm:p-5">
    <div className="mb-4 flex items-center justify-between"><button type="button" className="flex items-center gap-1.5 text-sm font-medium hover:text-muted-foreground" aria-label={`Select ${language} language`}>{language}<ChevronDown className="size-3.5 text-muted-foreground" /></button>{readOnly && <Button variant="ghost" size="icon" className="size-8 rounded-md" aria-label="Copy translation" onClick={onCopy} title="Copy translation">{copied ? <Check className="text-emerald-600" /> : <Clipboard />}</Button>}</div>
    {readOnly ? <p className="font-japanese flex-1 whitespace-pre-wrap text-lg leading-8 tracking-[-0.02em]">{value || <span className="text-muted-foreground">Your translation will appear here.</span>}</p> : <Textarea value={value} onChange={(event) => onChange?.(event.target.value)} className="min-h-44 flex-1 resize-none border-0 bg-transparent p-0 text-lg leading-8 shadow-none focus-visible:ring-0" placeholder="Type or paste your text here…" aria-label="Text to translate" />}
    <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground"><span>{readOnly ? 'Yugen translation' : 'Enter text'}</span><span>{value.length} characters</span></div>
  </div>
}

function Principle({ icon: Icon, number, title, copy }: { icon: typeof Zap; number: string; title: string; copy: string }) {
  return <div className="bg-card p-6 sm:p-7"><div className="mb-10 flex items-center justify-between"><span className="flex size-9 items-center justify-center rounded-lg border bg-muted/40"><Icon className="size-4" /></span><span className="font-mono text-xs text-muted-foreground">{number}</span></div><h3 className="mb-2 font-medium">{title}</h3><p className="text-sm leading-6 text-muted-foreground">{copy}</p></div>
}
