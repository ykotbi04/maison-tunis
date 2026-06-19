import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { Navbar } from '@/components/navigation/navbar'
import { Footer } from '@/components/layout/footer'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { AuthSessionProvider } from '@/components/providers/session-provider'
import './globals.css'

const cormorant = Cormorant_Garamond({
  variable: '--font-serif',
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
})

const dmSans = DM_Sans({
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'MAISON TUNIS | Luxury Tunisian Fashion',
  description: 'Discover premium Tunisian haute couture and luxury fashion collections. Authentic craftsmanship meets contemporary elegance.',
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
  colorScheme: 'dark',
  themeColor: [{ color: '#0C0A08' }],
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} bg-background`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <AuthSessionProvider>
          <Navbar />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
        </AuthSessionProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
