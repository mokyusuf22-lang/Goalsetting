import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import localFont from "next/font/local"
import { Libre_Baskerville } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"

const customFont = localFont({
  src: "../public/fonts/custom-font.woff2",
  variable: "--font-custom",
  display: "swap",
})

const headlineFont = localFont({
  src: "../public/fonts/headline-font.woff2",
  variable: "--font-headline",
  display: "swap",
})

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Goalsetting App"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${customFont.variable} ${headlineFont.variable} ${libreBaskerville.variable} antialiased`}
    >
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
