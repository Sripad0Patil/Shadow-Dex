import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { AuthProvider } from '@/lib/context/AuthContext'
import AuthModal from '@/components/sections/AuthModal'
import './globals.css'

export const metadata: Metadata = {
  title: 'ShadowDex - Pokémon Guessing Game',
  description: 'Guess Pokémon from their silhouettes. A premium Pokédex-inspired game experience.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/pokeball.png',
        type: 'image/png',
      },
    ],
    apple: '/pokeball.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-slate-950 text-slate-100">
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
