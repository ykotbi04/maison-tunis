'use client'

import React, { useState } from 'react'
import { Container } from '@/components/layout/container'
import { Link } from '@/components/ui/link'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  const shopLinks: { label: string; href: string }[] = [
    { label: 'Collections', href: '/collections' },
    { label: 'New Arrivals', href: '/collections' },
    { label: 'Sale', href: '/collections' },
    { label: 'Bestsellers', href: '/collections' },
  ]

  const supportLinks: { label: string; href: string }[] = [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping', href: '/pages/shipping' },
    { label: 'Returns', href: '/pages/returns' },
    { label: 'FAQ', href: '/pages/faq' },
  ]

  const companyLinks: { label: string; href: string }[] = [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/pages/blog' },
    { label: 'Careers', href: '/pages/careers' },
    { label: 'Press', href: '/pages/press' },
  ]

  const legalLinks: { label: string; href: string }[] = [
    { label: 'Privacy', href: '/pages/privacy' },
    { label: 'Terms', href: '/pages/terms' },
    { label: 'Cookies', href: '/pages/cookies' },
  ]

  return (
    <footer className="bg-white border-t border-[var(--border)] mt-16 md:mt-24">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 md:mb-12">
          <div>
            <h3 className="text-lg font-bold text-[var(--fg)] mb-3 tracking-tight">
              Maison Tunis
            </h3>
            <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
              Luxury Tunisian fashion house. Timeless elegance meets authentic craftsmanship.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--fg)] mb-4 text-sm">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {shopLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    variant="secondary"
                    size="sm"
                    className="hover:text-[var(--accent)] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--fg)] mb-4 text-sm">
              Support
            </h4>
            <ul className="space-y-2.5">
              {supportLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    variant="secondary"
                    size="sm"
                    className="hover:text-[var(--accent)] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--fg)] mb-4 text-sm">
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    variant="secondary"
                    size="sm"
                    className="hover:text-[var(--accent)] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-8">
          <div className="mb-8">
            <h4 className="font-semibold text-[var(--fg)] mb-3 text-sm">
              Subscribe to Our Newsletter
            </h4>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 bg-white border border-[var(--border)] text-[var(--fg)] placeholder:text-[var(--fg-muted)] text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-[var(--accent)] text-white font-semibold text-sm rounded-xl hover:bg-[var(--accent-hover)] transition-colors duration-150"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--fg-muted)] text-center md:text-left">
              &copy; {currentYear} MAISON TUNIS. All rights reserved.
            </p>
            <div className="flex gap-6">
              {legalLinks.map(({ label, href }) => (
                <Link key={label} href={href} variant="secondary" size="xs">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export { Footer }
