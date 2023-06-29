import './globals.css'
import { Kanit } from 'next/font/google'

const kanit = Kanit({ weight: '400', subsets: ['latin'] })

export const metadata = {
  title: 'A URL Shortener',
  description: 'Free URL Shortener',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={kanit.className}>{children}</body>
    </html>
  )
}
