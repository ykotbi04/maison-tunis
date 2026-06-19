'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthSession } from '@/hooks/useAuthSession'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/admin', label: 'Overview', icon: '○' },
  { href: '/admin/products', label: 'Products', icon: '◇' },
  { href: '/admin/orders', label: 'Orders', icon: '□' },
  { href: '/admin/categories', label: 'Categories', icon: '△' },
]

function SidebarLink({ href, label, icon, active }: { href: string; label: string; icon: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 text-sm font-medium tracking-wide transition-colors',
        active
          ? 'text-accent bg-accent/10 border-r-2 border-accent'
          : 'text-muted hover:text-foreground hover:bg-background-secondary'
      )}
    >
      <span className="text-xs opacity-60">{icon}</span>
      {label}
    </Link>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user } = useAuthSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 h-screen w-64 bg-background-secondary border-r border-border z-50 flex flex-col transition-transform lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand */}
        <div className="px-6 py-5 border-b border-border">
          <Link href="/admin" className="font-serif text-xl text-foreground tracking-widest">
            MAISON TUNIS
          </Link>
          <p className="text-xs text-muted mt-1 tracking-wide uppercase">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-1">
          {navItems.map((item) => (
            <SidebarLink
              key={item.href}
              {...item}
              active={
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href)
              }
            />
          ))}
        </nav>

        {/* User + Sign Out */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
              <span className="text-sm text-accent font-serif">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm text-foreground font-medium truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-muted truncate">{user?.email}</p>
            </div>
          </div>
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

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-4 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-foreground hover:text-accent transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 9h16.5m-16.5 6.75h16.5" />
            </svg>
          </button>
          <span className="font-serif text-lg text-foreground tracking-widest">ADMIN</span>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
