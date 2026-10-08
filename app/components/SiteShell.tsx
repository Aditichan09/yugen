'use client'

import Link from 'next/link'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(true)
  useEffect(() => { const saved = localStorage.getItem('yugen-theme'); setDark(saved !== 'light') }, [])
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); localStorage.setItem('yugen-theme', dark ? 'dark' : 'light') }, [dark])
  return <div className="min-h-screen bg-background text-foreground"><header className="border-b border-border"><div className="site-wrap flex min-h-18 items-center justify-between gap-5"><Link href="/" className="flex shrink-0 items-center gap-3"><span className="logo-kanji">幽</span><span className="font-heading text-xl font-bold tracking-tight">Yugen</span></Link><nav className="hidden items-center gap-5 text-sm lg:flex"><Link href="/" className="nav-link">Workspace</Link><Link href="/history" className="nav-link">History</Link><Link href="/features" className="nav-link">Features</Link><Link href="/privacy" className="nav-link">Privacy</Link><Link href="/terms" className="nav-link">Terms</Link><Link href="/security" className="nav-link">Security</Link><Link href="/about" className="nav-link">About</Link></nav><div className="flex items-center gap-3"><a className="hidden text-xs text-muted-foreground hover:text-foreground sm:block" href="mailto:yugenwebbyadi@gmail.com">Support</a><button className="theme-toggle" onClick={() => setDark(value => !value)} aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}>{dark ? <Sun /> : <Moon />}</button></div></div></header>{children}<footer className="border-t border-border"><div className="site-wrap flex flex-col gap-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2"><span className="logo-kanji small">幽</span><span>© 2026 Yugen</span></div><div className="flex flex-wrap gap-4"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/security">Security</Link><a href="mailto:yugenwebbyadi@gmail.com">yugenwebbyadi@gmail.com</a></div></div></footer></div>
}

export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) { return <div className="mb-10"><p className="eyebrow">{eyebrow}</p><h1 className="page-title">{title}</h1>{children && <div className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">{children}</div>}</div> }

export function InfoPage({ eyebrow = 'Last updated October 2026', title, children }: { eyebrow?: string; title: string; children: React.ReactNode }) { return <SiteShell><main className="site-wrap page-pad"><PageIntro eyebrow={eyebrow} title={title} />{children}</main></SiteShell> }
