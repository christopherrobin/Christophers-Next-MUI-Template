import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import { Providers } from '@/components/Providers'
import { ThemeToggle } from '@/components/ThemeToggle'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Christophers-Next-MUI-Template',
  description:
    'A Next.js 16 + Material UI 9 starter template with auth, Prisma, and end-to-end type safety.',
  keywords: ['Next.js', 'Material UI', 'NextAuth', 'Prisma', 'starter'],
  authors: [{ name: 'Christopher Robin' }],
  robots: { index: true, follow: true },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' }
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' }
  },
  other: {
    'msapplication-TileColor': '#0e1018',
    'msapplication-TileImage': '/apple-touch-icon.png'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0e1018' }
  ]
}

// Inline pre-hydration script. Reads localStorage + system pref and
// applies `class="dark"` or `class="light"` to <html> BEFORE React
// hydrates. Without this the page would flash dark on a light-mode
// machine on first paint. MUI 9's InitColorSchemeScript would normally
// handle this, but its `cssVariables`/`colorSchemes` API has an SSR bug
// (TypeError: l.startsWith is not a function during prerender), so this
// custom equivalent ships instead. Keep this script lean — it runs
// synchronously before the body parses.
const themeBootScript = `(function(){try{var k='mui-mode';var s=localStorage.getItem(k);var m=s==='light'||s==='dark'||s==='system'?s:'system';var r=m==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):m;document.documentElement.classList.add(r);}catch(_){document.documentElement.classList.add('dark');}})();`

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          // Safe: themeBootScript is a static template literal with no
          // user input. Required to set <html class> before paint.
          dangerouslySetInnerHTML={{ __html: themeBootScript }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ThemeToggle />
          {children}
        </Providers>
      </body>
    </html>
  )
}
