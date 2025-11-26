import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Style Analyzer - Find Your Style',
  description: 'AI-powered style analysis and artistic transformation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
