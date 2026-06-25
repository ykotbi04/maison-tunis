'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthSession } from '@/hooks/useAuthSession'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

const navItems = [
  {
    href: '/account',
    label: 'Overview',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    exact: true,
  },
  {
    href: '/account/orders',
    label: 'Orders',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
  },
  {
    href: '/account/wishlist',
    label: 'Wishlist',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-1.085-.744-2.024-1.773-2.233m2.636-2.025A2.99 2.99 0 0015.673 1.5H8.327c-1.573 0-2.936.92-3.63 2.25M21 8.25l-4.773 2.992m0 0c-1.037.72-2.201 1.273-3.5 1.5M2.25 8.25l4.773 2.992m0 0c1.037.72 2.201 1.273 3.5 1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    href: '/account/profile',
    label: 'Profile',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
]

function NavLink({ href, label, icon, active, exact }: { href: string; label: string; icon: React.ReactNode; active: boolean; exact?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150',
        active
          ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
          : 'text-[var(--fg-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--fg)]'
      )}
    >
      <span className={cn('flex-shrink-0', active ? 'text-[var(--accent)]' : 'text-[var(--fg-muted)]')}>
        {icon}
      </span>
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
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-2xl flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[var(--fg)]">Sign In Required</h1>
          <p className="text-sm text-[var(--fg-muted)]">Please sign in to access your account.</p>
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
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <header className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 -ml-2 text-[var(--fg)] hover:text-[var(--accent)] transition-colors rounded-lg hover:bg-[var(--bg-muted)]"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 9h16.5m-16.5 6.75h16.5" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-[var(--fg)]">My Account</span>
        <div className="w-9" />
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setDrawerOpen(false)} />
      )}

      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
        <div className="flex gap-6 lg:gap-8">
          <aside
            className={cn(
              'lg:w-56 flex-shrink-0',
              'fixed lg:sticky top-0 left-0 h-screen lg:h-auto lg:top-auto z-50 lg:z-auto bg-white lg:bg-transparent w-64 lg:w-56 p-4 lg:p-0 transition-transform lg:translate-x-0',
              drawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            )}
          >
            <div className="flex items-center justify-between mb-5 lg:mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[var(--accent)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm text-[var(--accent)] font-semibold">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--fg)] truncate">{user.name}</p>
                  <p className="text-xs text-[var(--fg-muted)] truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="lg:hidden p-1.5 text-[var(--fg-muted)] hover:text-[var(--fg)] rounded-lg hover:bg-[var(--bg-muted)]"
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

            <div className="mt-6 pt-5 border-t border-[var(--border)]">
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                className="justify-start text-[var(--fg-muted)] hover:text-[var(--fg)]"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Sign Out
              </Button>
            </div>
          </aside>

          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
