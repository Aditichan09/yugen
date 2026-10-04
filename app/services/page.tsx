import Navbar from '../components/Navbar'

const services = [
  ['Keigo translation', 'Turn English drafts into natural, relationship-aware Japanese for clients, senior leaders, peers, and junior colleagues.'],
  ['Document translation', 'Upload business PDFs, letters, and meeting notes for a clear translation brief and review-ready output.'],
  ['Tone and risk review', 'Understand what your message signals, where it may feel too direct, and how to soften it without losing intent.'],
  ['Executive templates', 'Start quickly with polished patterns for scheduling, follow-ups, apologies, proposals, negotiations, and difficult declines.'],
]

export default function ServicesPage() {
  return <main className="min-h-screen bg-[#061226] px-5 py-6 text-slate-100 sm:px-8"><div className="mx-auto max-w-5xl"><Navbar /><section className="py-16"><p className="text-xs uppercase tracking-[.2em] text-cyan-300">The Yugen suite</p><h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight text-white">Business Japanese with judgment built in.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">Yugen helps international teams write with the right level of respect, clarity, warmth, and restraint.</p><div className="mt-12 grid gap-4 md:grid-cols-2">{services.map(([title, copy]) => <article key={title} className="rounded-2xl border border-blue-200/10 bg-white/[.03] p-7"><h2 className="text-xl font-semibold text-white">{title}</h2><p className="mt-3 leading-7 text-slate-400">{copy}</p></article>)}</div><div className="mt-10 rounded-2xl border border-cyan-300/15 bg-cyan-300/[.05] p-7"><h2 className="text-xl font-semibold text-white">Need help with a sensitive message?</h2><p className="mt-2 text-slate-300">Contact our team at <a className="text-cyan-200 underline underline-offset-4" href="mailto:yugenwebbyadi@gmail.com">yugenwebbyadi@gmail.com</a>.</p></div></section></div></main>
}
