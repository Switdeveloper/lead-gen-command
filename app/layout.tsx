import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lead Gen Command Center',
  description: 'Military-grade lead generation from Google Maps via Apify',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="%2300ff88" stroke-width="4"/><circle cx="50" cy="50" r="25" fill="none" stroke="%2300ff88" stroke-width="2" opacity="0.5"/><circle cx="50" cy="50" r="5" fill="%2300ff88"/><line x1="50" y1="50" x2="85" y2="50" stroke="%2300ff88" stroke-width="2"/></svg>',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="scanlines">
        {children}
      </body>
    </html>
  )
}