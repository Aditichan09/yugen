import type { Metadata } from 'next'
import './globals.css'
import { Shippori_Mincho, Zen_Kaku_Gothic_New } from 'next/font/google'
const heading=Shippori_Mincho({subsets:['latin'],weight:['600','700'],variable:'--font-heading'})
const body=Zen_Kaku_Gothic_New({subsets:['latin'],weight:['400','500','700'],variable:'--font-sans'})
export const metadata:Metadata={title:'Yugen — Business Japanese, checked for tone',description:'Yugen adapts English business writing into considered Japanese keigo with a plain-English review copy.'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className={`${heading.variable} ${body.variable} dark`}><body>{children}</body></html>}
