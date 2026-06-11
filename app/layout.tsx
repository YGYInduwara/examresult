import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/layout/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'A/L Past Paper Tracker',
  description: 'Track and analyze your GCE A/L past paper performance over 25 years',
}

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full bg-slate-50`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
