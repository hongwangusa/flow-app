import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flow / 流动',
  description: 'Personal concentration & project schedule management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
