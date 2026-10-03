'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { ArrowRight, Check, FileImage, FileUp, LockKeyhole, ReceiptText, ShieldCheck, Sparkles, UploadCloud } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [utr, setUtr] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [status, setStatus] = useState('')

  const selectFile = (nextFile?: File) => {
    if (nextFile && nextFile.type.startsWith('image/')) {
      setFile(nextFile)
      setStatus('')
    }
  }

  const handleSubmit = () => {
    if (!file) {
      setStatus('Upload a receipt image to continue.')
      return
    }
    if (!/^\d{12}$/.test(utr)) {
      setStatus('Enter the 12-digit UTR from your UPI transaction.')
      return
    }
    setStatus('Payment details received. Your receipt is ready to parse.')
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-14 pt-5 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between py-2">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Yugen home">
            <span className="flex size-9 items-center justify-center rounded-xl bg-foreground text-background shadow-sm">
              <ReceiptText className="size-4" />
            </span>
            <span className="text-base font-semibold tracking-tight">yugen</span>
          </Link>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="hidden items-center gap-1.5 sm:flex"><ShieldCheck className="size-3.5" /> Private by design</span>
            <Badge variant="secondary" className="rounded-full px-3 py-1 font-medium">MVP preview</Badge>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-20">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-foreground" /> Receipt intelligence, simplified
            </div>
            <h1 className="text-balance text-5xl font-semibold tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl">
              Receipts in.<br /><span className="text-muted-foreground">Clarity out.</span>
            </h1>
            <p className="mt-6 max-w-lg text-pretty text-lg leading-8 text-muted-foreground">
              Yugen uses AI to parse receipts, split bills, and surface the details that matter — instantly.
            </p>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
              {['AI-powered parsing', 'Instant bill splits', 'Built for privacy'].map((item) => (
                <span key={item} className="flex items-center gap-2"><Check className="size-4 text-foreground" />{item}</span>
              ))}
            </div>
            <div className="mt-12 flex items-center gap-3 border-t pt-5 text-xs text-muted-foreground">
              <LockKeyhole className="size-4" /> Your receipt is processed securely and never shared.
            </div>
          </div>

          <Card className="mx-auto w-full max-w-xl rounded-2xl border-border/70 bg-card/90 shadow-2xl shadow-foreground/[0.04]">
            <CardHeader className="gap-3 p-6 pb-5 sm:p-8 sm:pb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-xl tracking-tight">Upload a receipt</CardTitle>
                  <CardDescription className="mt-1.5">We&apos;ll extract the items and split the bill for you.</CardDescription>
                </div>
                <div className="rounded-lg border bg-muted/60 p-2.5"><FileImage className="size-4 text-muted-foreground" /></div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 px-6 sm:px-8">
              <button
                type="button"
                className={`group flex min-h-44 w-full flex-col items-center justify-center rounded-xl border border-dashed px-6 text-center transition-colors ${isDragging ? 'border-foreground bg-muted' : 'border-border bg-muted/30 hover:border-foreground/40 hover:bg-muted/60'}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(event) => { event.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => { event.preventDefault(); setIsDragging(false); selectFile(event.dataTransfer.files[0]) }}
              >
                <input ref={inputRef} className="sr-only" type="file" accept="image/*" onChange={(event) => selectFile(event.target.files?.[0])} />
                <span className="mb-3 flex size-11 items-center justify-center rounded-full border bg-background shadow-sm transition-transform group-hover:-translate-y-0.5">
                  {file ? <FileUp className="size-5" /> : <UploadCloud className="size-5" />}
                </span>
                <span className="text-sm font-medium">{file ? file.name : 'Drop your receipt here, or browse'}</span>
                <span className="mt-1.5 text-xs text-muted-foreground">PNG, JPG or HEIC · Max 10 MB</span>
              </button>

              <Separator />

              <Accordion defaultValue={["payment"]} className="w-full">
                <AccordionItem value="payment" className="border-none">
                  <AccordionTrigger className="py-0 text-sm font-semibold hover:no-underline">Unlock your receipt parse</AccordionTrigger>
                  <AccordionContent className="pt-5">
                    <div className="flex flex-col gap-5">
                      <div className="grid gap-4 sm:grid-cols-[148px_1fr] sm:items-center">
                        <div className="flex aspect-square w-full max-w-[148px] items-center justify-center rounded-xl border border-dashed bg-muted/30" aria-label="UPI QR code placeholder">
                          <div className="flex flex-col items-center gap-2 text-center text-muted-foreground"><div className="grid size-12 grid-cols-3 gap-1 opacity-50">{Array.from({ length: 9 }).map((_, index) => <span key={index} className={index % 2 === 0 ? 'rounded-sm bg-foreground' : 'rounded-sm border border-foreground'} />)}</div><span className="text-[10px] font-medium uppercase tracking-wider">UPI QR code</span></div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <div><p className="text-sm font-medium">Pay ₹9 to unlock</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Scan the QR with any UPI app. Then enter your transaction reference below.</p></div>
                          <div className="flex flex-col gap-2"><Label htmlFor="utr" className="text-xs text-muted-foreground">12-digit UTR number</Label><Input id="utr" inputMode="numeric" maxLength={12} placeholder="e.g. 412345678901" value={utr} onChange={(event) => setUtr(event.target.value.replace(/\D/g, '').slice(0, 12))} /></div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-3 p-6 pt-2 sm:p-8 sm:pt-2">
              <Button size="lg" className="h-12 w-full rounded-xl" onClick={handleSubmit}>Verify Payment &amp; Parse Receipt <ArrowRight data-icon="inline-end" /></Button>
              <p className="text-center text-xs text-muted-foreground">Manual verification usually takes less than a minute.</p>
              {status && <p role="status" className="text-center text-xs font-medium text-foreground">{status}</p>}
            </CardFooter>
          </Card>
        </section>

        <footer className="flex flex-col gap-2 border-t pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Yugen. Thoughtful tools for everyday life.</span><span className="flex items-center gap-1.5"><ShieldCheck className="size-3.5" /> Secure upload · No card required</span>
        </footer>
      </div>
    </main>
  )
}
