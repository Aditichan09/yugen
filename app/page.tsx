'use client'

import { useRef, useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  Download,
  FileImage,
  FileText,
  LockKeyhole,
  Receipt,
  Sparkles,
  UploadCloud,
  Zap,
} from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const lineItems = [
  ['Miso ramen', '$14.00'],
  ['Edamame', '$6.00'],
  ['Matcha cheesecake', '$8.00'],
]

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [message, setMessage] = useState('')

  const selectFile = (file?: File) => {
    if (!file) return
    if (file.type.startsWith('image/')) {
      setFileName(file.name)
      setMessage('Receipt ready. The preview below shows the extracted data.')
    } else {
      setMessage('Please choose a PNG, JPG, or HEIC image.')
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[520px] bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklab,var(--muted)_75%,transparent),transparent_62%)]" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b py-5">
          <a href="#top" className="flex items-center gap-2.5" aria-label="Yugen home">
            <span className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
              <Receipt className="size-4" />
            </span>
            <span className="text-[15px] font-semibold tracking-[-0.02em]">yugen<span className="text-muted-foreground">.ai</span></span>
          </a>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground sm:flex" aria-label="Main navigation">
            <a className="transition-colors hover:text-foreground" href="#how-it-works">How it works</a>
            <a className="transition-colors hover:text-foreground" href="#features">Features</a>
            <a className="transition-colors hover:text-foreground" href="#upload">Try it free</a>
          </nav>
          <a href="#upload" className="inline-flex h-9 items-center justify-center gap-2 rounded-full border bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-muted">Start parsing <ArrowRight className="size-4" /></a>
        </header>

        <section id="top" className="mx-auto flex max-w-3xl flex-col items-center px-2 pb-20 pt-24 text-center sm:pt-32">
          <Badge variant="secondary" className="mb-7 rounded-full border px-3.5 py-1.5 font-medium">
            <Sparkles data-icon="inline-start" /> Intelligent receipt parsing
          </Badge>
          <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.065em] sm:text-7xl lg:text-[84px]">
            Extract data from any receipt <span className="text-muted-foreground">in seconds.</span>
          </h1>
          <p className="mt-7 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            Turn messy receipts into structured, export-ready data with AI that understands every line item, tax, and total.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2"><Check className="size-3.5 text-foreground" /> 99.8% field accuracy</span>
            <span className="flex items-center gap-2"><Check className="size-3.5 text-foreground" /> Private by design</span>
            <span className="flex items-center gap-2"><Check className="size-3.5 text-foreground" /> Export anywhere</span>
          </div>
        </section>

        <section id="upload" className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[0.86fr_1.14fr]">
          <Card className="rounded-2xl border-border/80 bg-card/80 shadow-xl shadow-foreground/[0.04]">
            <CardHeader className="gap-2 p-6 sm:p-7">
              <div className="mb-2 flex size-10 items-center justify-center rounded-xl border bg-muted/50"><UploadCloud className="size-5" /></div>
              <CardTitle className="text-xl tracking-tight">Upload a receipt</CardTitle>
              <CardDescription>Drop an image and watch Yugen structure it instantly.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-1 sm:p-7 sm:pt-1">
              <button
                type="button"
                className={`group flex min-h-56 w-full flex-col items-center justify-center rounded-xl border border-dashed px-6 text-center transition-all ${isDragging ? 'border-foreground bg-muted' : 'border-border bg-muted/30 hover:border-foreground/50 hover:bg-muted/60'}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(event) => { event.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => { event.preventDefault(); setIsDragging(false); selectFile(event.dataTransfer.files[0]) }}
              >
                <input ref={inputRef} className="sr-only" type="file" accept="image/*" onChange={(event) => selectFile(event.target.files?.[0])} />
                <span className="mb-4 flex size-12 items-center justify-center rounded-full border bg-background shadow-sm transition-transform group-hover:-translate-y-1">
                  {fileName ? <FileImage className="size-5" /> : <UploadCloud className="size-5" />}
                </span>
                <span className="text-sm font-medium">{fileName || 'Drop your receipt here'}</span>
                <span className="mt-2 text-xs text-muted-foreground">or click to browse files</span>
                <span className="mt-5 rounded-full border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground">PNG, JPG, HEIC · up to 10 MB</span>
              </button>
              <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><LockKeyhole className="size-3.5" /> Images are encrypted and never used to train models.</div>
              {message && <p className="mt-4 text-xs font-medium text-foreground" role="status">{message}</p>}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 bg-card/80 shadow-xl shadow-foreground/[0.04]">
            <CardHeader className="flex-row items-start justify-between gap-4 p-6 sm:p-7">
              <div>
                <div className="mb-2 flex items-center gap-2"><Badge variant="outline" className="rounded-full text-[10px] uppercase tracking-wider">AI result</Badge><span className="text-xs text-muted-foreground">Just now</span></div>
                <CardTitle className="text-xl tracking-tight">Extracted receipt</CardTitle>
                <CardDescription>Structured and ready to use.</CardDescription>
              </div>
              <Button variant="outline" size="icon" className="size-9 rounded-lg" aria-label="Export receipt"><Download /></Button>
            </CardHeader>
            <CardContent className="p-6 pt-0 sm:p-7 sm:pt-0">
              <div className="grid gap-6 sm:grid-cols-[156px_1fr]">
                <div className="relative mx-auto flex aspect-[3/4] w-full max-w-[156px] rotate-[-2deg] flex-col gap-3 overflow-hidden rounded-sm border bg-muted/30 p-4 shadow-md">
                  <div className="flex items-center justify-between"><span className="h-2 w-12 rounded-full bg-foreground/70" /><span className="h-2 w-4 rounded-full bg-muted-foreground/30" /></div>
                  <div className="space-y-1.5"><span className="block h-1.5 w-full rounded-full bg-muted-foreground/25" /><span className="block h-1.5 w-4/5 rounded-full bg-muted-foreground/20" /><span className="block h-1.5 w-11/12 rounded-full bg-muted-foreground/20" /></div>
                  <Separator />
                  <div className="space-y-2"><span className="block h-1.5 w-full rounded-full bg-muted-foreground/25" /><span className="block h-1.5 w-10/12 rounded-full bg-muted-foreground/20" /><span className="block h-1.5 w-8/12 rounded-full bg-muted-foreground/20" /></div>
                  <div className="mt-auto border-t pt-3"><div className="flex justify-between"><span className="h-2 w-10 rounded-full bg-muted-foreground/30" /><span className="h-2 w-12 rounded-full bg-foreground/60" /></div></div>
                  <span className="absolute bottom-10 left-7 rounded bg-foreground px-1.5 py-1 text-[8px] font-medium text-background">SCANNED</span>
                </div>
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <DataPoint label="Vendor" value="Kumo Kitchen" />
                    <DataPoint label="Date" value="Oct 04, 2026" />
                    <DataPoint label="Tax" value="$2.24" />
                    <DataPoint label="Total" value="$30.24" strong />
                  </div>
                  <Separator />
                  <div>
                    <div className="mb-3 flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Line items</span><Badge variant="secondary" className="rounded-full text-[10px]">3 items</Badge></div>
                    <div className="flex flex-col gap-2.5">{lineItems.map(([name, price]) => <div key={name} className="flex items-center justify-between text-sm"><span>{name}</span><span className="font-medium tabular-nums">{price}</span></div>)}</div>
                  </div>
                  <Button className="w-full rounded-lg" onClick={() => setMessage('Export prepared. Your structured receipt is ready.')}>Export structured data <ArrowRight data-icon="inline-end" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="how-it-works" className="mx-auto max-w-5xl py-28">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Built for flow</p><h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">From paper to possibility.</h2></div><p className="max-w-xs text-sm leading-6 text-muted-foreground">No manual entry. No spreadsheet cleanup. Just the data you need, exactly when you need it.</p></div>
          <div id="features" className="grid gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-3">
            <Feature icon={Zap} number="01" title="Lightning-fast AI" copy="Get structured results in seconds, not minutes. Yugen reads the full receipt at once." />
            <Feature icon={BadgeCheck} number="02" title="Perfectly organized" copy="Vendor, tax, totals, and every line item are identified and formatted for you." />
            <Feature icon={FileText} number="03" title="Easy to export" copy="Take clean, structured data wherever it belongs — your workflow, your way." />
          </div>
          <Accordion className="mt-8 border-t">
            <AccordionItem value="privacy"><AccordionTrigger className="text-sm">How does Yugen handle my data?</AccordionTrigger><AccordionContent className="max-w-2xl text-sm leading-6 text-muted-foreground">Your receipt is encrypted in transit and at rest. We only process it to return the extraction you requested and never use your documents to train models.</AccordionContent></AccordionItem>
            <AccordionItem value="formats"><AccordionTrigger className="text-sm">What formats can I upload?</AccordionTrigger><AccordionContent className="text-sm leading-6 text-muted-foreground">Yugen accepts clear PNG, JPG, and HEIC images up to 10 MB.</AccordionContent></AccordionItem>
          </Accordion>
        </section>

        <footer className="flex flex-col gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Yugen, Inc.</span><span className="flex items-center gap-2"><LockKeyhole className="size-3.5" /> Secure by default <ChevronRight className="size-3" /></span></footer>
      </div>
    </main>
  )
}

function DataPoint({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return <div><p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><p className={strong ? 'text-lg font-semibold tracking-tight' : 'text-sm font-medium'}>{value}</p></div>
}

function Feature({ icon: Icon, number, title, copy }: { icon: typeof Zap; number: string; title: string; copy: string }) {
  return <div className="bg-card p-6 sm:p-7"><div className="mb-10 flex items-center justify-between"><span className="flex size-9 items-center justify-center rounded-lg border bg-muted/40"><Icon className="size-4" /></span><span className="font-mono text-xs text-muted-foreground">{number}</span></div><h3 className="mb-2 font-medium">{title}</h3><p className="text-sm leading-6 text-muted-foreground">{copy}</p></div>
}
