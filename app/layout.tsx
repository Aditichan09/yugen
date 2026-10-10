import type { Metadata } from "next";
import "./globals.css";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-japanese" });

export const metadata: Metadata = {
  title: "Yugen — Executive English-Japanese Translation",
  description: "Yugen is a verifiable English to Japanese business translator for executive communication, hierarchy, intent, and nuance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable, notoSansJP.variable)}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

