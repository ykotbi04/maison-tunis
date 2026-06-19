'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthSession } from '@/hooks/useAuthSession'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/account', label: 'Overview', icon: '○', exact: true },
  { href: '/account/orders', label: 'Orders', icon: '□' },
  { href: '/account/wishlist', label: 'Wishlist', icon: '♡' },
  { href: '/account/profile', label: 'Profile', icon: '◎' },
]

function NavLink({ href, label, icon, active, exact }: { href: string; label: string; icon: string; active: boolean; exact?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 text-sm font-medium tracking-wide transition-colors rounded-lg',
        active
          ? 'text-[var(--color-accent)] bg-[var(--color-accent)]/10'
          : 'text-muted hover:text-foreground hover:bg-background-secondary'
      )}
    >
      <span className="text-xs opacity-60">{icon}</span>
      {label}
    </Link>
  )
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuthSession()
  const [drawerOpen, setDrawerOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-sm">
          <div className="text-5xl text-[var(--color-accent)]">&#10022;</div>
          <h1 className="font-serif text-3xl text-foreground tracking-wider">Sign In Required</h1>
          <p className="text-sm text-muted">Please sign in to access your account.</p>
          <Button variant="primary" size="lg" onClick={() => router.push('/login?callbackUrl=/account')}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 -ml-2 text-foreground hover:text-[var(--color-accent)] transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 9h16.5m-16.5 6.75h16.5" />
          </svg>
        </button>
        <span className="font-serif text-lg text-foreground tracking-widest">MY ACCOUNT</span>
        <div className="w-9" />
      </header>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setDrawerOpen(false)} />
      )}

      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="flex gap-8 lg:gap-12">
          {/* Sidebar - desktop always visible, mobile as drawer */}
          <aside
            className={cn(
              'lg:w-56 flex-shrink-0',
              'fixed lg:sticky top-0 left-0 h-screen lg:h-auto lg:top-auto z-50 lg:z-auto bg-background lg:bg-transparent w-64 lg:w-56 p-6 lg:p-0 transition-transform lg:translate-x-0',
              drawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            )}
          >
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <div>
                <p className="font-serif text-lg text-foreground">{user.name}</p>
                <p className="text-xs text-muted truncate">{user.email}</p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="lg:hidden p-1 text-muted hover:text-foreground"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <div key={item.href} onClick={() => setDrawerOpen(false)}>
                  <NavLink {...item} active={isActive(item.href, item.exact)} />
                </div>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                className="justify-start text-muted hover:text-foreground"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Sign Out
              </Button>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
