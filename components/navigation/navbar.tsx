'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Container } from '@/components/layout/container'
import { useMobileMenuOpen, useToggleMobileMenu, useToggleCartDrawer } from '@/lib/stores'

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
    const router = useRouter()

    const navItems = [
      { label: 'Shop', href: '/shop' },
      { label: 'Collections', href: '/collections' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ]

    return (
      <>
        <div
          ref={ref}
          className={cn(
            'w-full border-b border-border transition-all duration-300',
            sticky && 'sticky top-0 z-40 bg-background/95 backdrop-blur-sm',
            'bg-background',
            className
          )}
          {...props}
        >
          <Container>
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link
                  href="/"
                  className="font-serif text-xl tracking-widest text-foreground hover:text-accent transition-colors duration-200"
                >
                  {logo}
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                {genderMenus.map((menu) => (
                  <div key={menu.basePath} className="relative group">
                    <Link
                      href={menu.basePath}
                      className="font-sans text-sm text-foreground hover:text-accent transition-colors duration-200 tracking-wide"
                    >
                      {menu.label}
                    </Link>
                    <div className="absolute left-0 top-full pt-3 hidden group-hover:block min-w-[220px]">
                      <div className="border border-border bg-background py-2">
                        {collectionCategories.map((category) => (
                          <Link
                            key={`${menu.basePath}-${category.slug}`}
                            href={`${menu.basePath}/${category.slug}`}
                            className="block px-4 py-2 font-sans text-sm text-foreground hover:text-accent transition-colors duration-200 tracking-wide"
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
                    className="font-sans text-sm text-foreground hover:text-accent transition-colors duration-200 tracking-wide"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                {/* Search Icon */}
                <button
                  aria-label="Search"
                  onClick={() => router.push('/shop')}
                  className="text-foreground hover:text-accent transition-colors duration-200 p-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>

                {/* Cart Icon */}
                <button
                  aria-label="Cart"
                  onClick={toggleCartDrawer}
                  className="text-foreground hover:text-accent transition-colors duration-200 p-2 relative"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full" />
                </button>

                {/* Account Icon */}
                <button
                  aria-label="Account"
                  onClick={() => router.push('/login')}
                  className="text-foreground hover:text-accent transition-colors duration-200 p-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>

                {/* Mobile Menu Toggle */}
                <button
                  className="md:hidden text-foreground hover:text-accent transition-colors duration-200 p-2"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {mobileMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-border pb-4">
                {genderMenus.map((menu) => (
                  <div key={menu.basePath}>
                    <Link
                      href={menu.basePath}
                      className="block py-3 px-0 font-sans text-sm text-foreground hover:text-accent transition-colors duration-200"
                    >
                      {menu.label}
                    </Link>
                    {collectionCategories.map((category) => (
                      <Link
                        key={`${menu.basePath}-mobile-${category.slug}`}
                        href={`${menu.basePath}/${category.slug}`}
                        className="block py-2 pl-4 font-sans text-sm text-foreground hover:text-accent transition-colors duration-200"
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
                    className="block py-3 px-0 font-sans text-sm text-foreground hover:text-accent transition-colors duration-200"
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
