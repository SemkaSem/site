import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Comfortaa, Quicksand } from 'next/font/google'
import './globals.css'

const comfortaa = Comfortaa({
  subsets: ['latin', 'cyrillic'],
  weight: ['500', '700'],
  variable: '--font-comfortaa',
})

const quicksand = Quicksand({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-quicksand',
})

export const metadata: Metadata = {
  title: 'Приглашение на посиделки 🍻',
  description: 'Пойдём выпьем и посидим вместе? 🥺',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffd6e8',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ru"
      className={`${comfortaa.variable} ${quicksand.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
