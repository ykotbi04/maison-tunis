'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Container } from '@/components/layout/container'
import { useMobileMenuOpen, useToggleMobileMenu, useToggleCartDrawer } from '@/lib/stores'
import { useAuthSession } from '@/hooks/useAuthSession'
import { signOut } from 'next-auth/react'


interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: string
  sticky?: boolean
}

const collectionCategories = [
  { slug: 'evening-wear', name: 'Evening Wear' },
  { slug: 'day-wear', name: 'Day Wear' },
  { slug: 'accessories', name: 'Accessories' },
  { slug: 'heritage', name: 'Heritage Collection' },
  { slug: 'limited-edition', name: 'Limited Edition' },
]

const genderMenus = [
  { label: 'Men', basePath: '/men' },
  { label: 'Women', basePath: '/women' },
]

const Navbar = React.forwardRef<HTMLDivElement, NavbarProps>(
  ({ className, logo = 'MAISON TUNIS', sticky = true, ...props }, ref) => {
    const mobileMenuOpen = useMobileMenuOpen()
    const toggleMobileMenu = useToggleMobileMenu()
    const toggleCartDrawer = useToggleCartDrawer()
    const { isAuthenticated, isLoading } = useAuthSession()
    const router = useRouter()

    const navItems = [
      { label: 'Collections', href: '/collections' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ]

    return (
      <>
        <div
          ref={ref}
          className={cn(
            'w-full border-b border-[var(--border)] transition-all duration-200',
            sticky && 'sticky top-0 z-40 bg-[var(--bg)]/95 backdrop-blur-xl',
            'bg-[var(--bg)]',
            className
          )}
          {...props}
        >
          <Container>
            <div className="flex items-center justify-between h-16">
              <div className="flex-shrink-0">
                <Link
                  href="/"
                  className="text-lg font-bold tracking-tight text-[var(--fg)] hover:text-[var(--accent)] transition-colors duration-150"
                >
                  {logo}
                </Link>
              </div>

              <div className="hidden md:flex items-center gap-6">
                {genderMenus.map((menu) => (
                  <div key={menu.basePath} className="relative group">
                    <Link
                      href={menu.basePath}
                      className="text-sm font-medium text-[var(--fg-secondary)] hover:text-[var(--fg)] transition-colors duration-150"
                    >
                      {menu.label}
                    </Link>
                    <div className="absolute left-0 top-full pt-3 hidden group-hover:block min-w-[200px]">
                      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl py-2 shadow-lg">
                        {collectionCategories.map((category) => (
                          <Link
                            key={`${menu.basePath}-${category.slug}`}
                            href={`${menu.basePath}/${category.slug}`}
                            className="block px-4 py-2 text-sm text-[var(--fg-secondary)] hover:text-[var(--fg)] hover:bg-[var(--bg-secondary)] transition-colors duration-150"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-[var(--fg-secondary)] hover:text-[var(--fg)] transition-colors duration-150"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  aria-label="Search"
                  onClick={() => router.push('/collections')}
                  className="text-[var(--fg-secondary)] hover:text-[var(--fg)] transition-colors duration-150 p-2 rounded-lg hover:bg-[var(--bg-muted)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                <button
                  aria-label="Cart"
                  onClick={toggleCartDrawer}
                  className="text-[var(--fg-secondary)] hover:text-[var(--fg)] transition-colors duration-150 p-2 rounded-lg hover:bg-[var(--bg-muted)] relative"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--accent)] rounded-full" />
                </button>

                {isLoading ? (
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-muted)] animate-pulse" />
                ) : isAuthenticated ? (
                  <div className="flex items-center gap-1">
                    <Link
                      href="/account"
                      className="text-[var(--fg-secondary)] hover:text-[var(--fg)] transition-colors duration-150 p-2 rounded-lg hover:bg-[var(--bg-muted)]"
                      aria-label="Account"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="hidden md:inline text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="text-[var(--fg-secondary)] hover:text-[var(--fg)] transition-colors duration-150 p-2 rounded-lg hover:bg-[var(--bg-muted)]"
                    aria-label="Sign in"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                )}

                <button
                  className="md:hidden text-[var(--fg-secondary)] hover:text-[var(--fg)] transition-colors duration-150 p-2 rounded-lg hover:bg-[var(--bg-muted)]"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {mobileMenuOpen && (
              <div className="md:hidden border-t border-[var(--border)] pb-4">
                {genderMenus.map((menu) => (
                  <div key={menu.basePath}>
                    <Link
                      href={menu.basePath}
                      className="block py-3 text-sm font-medium text-[var(--fg)] hover:text-[var(--accent)] transition-colors duration-150"
                    >
                      {menu.label}
                    </Link>
                    {collectionCategories.map((category) => (
                      <Link
                        key={`${menu.basePath}-mobile-${category.slug}`}
                        href={`${menu.basePath}/${category.slug}`}
                        className="block py-2 pl-4 text-sm text-[var(--fg-secondary)] hover:text-[var(--fg)] transition-colors duration-150"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                ))}
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-3 text-sm font-medium text-[var(--fg)] hover:text-[var(--accent)] transition-colors duration-150"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </Container>
        </div>
      </>
    )
  }
)

Navbar.displayName = 'Navbar'

export { Navbar }
