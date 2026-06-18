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
    { label: 'New Arrivals', href: '/shop' },
    { label: 'Sale', href: '/shop' },
    { label: 'Bestsellers', href: '/shop' },
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
    <footer className="bg-background-secondary border-t border-border mt-16 md:mt-24">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 md:mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-xl text-accent mb-4 tracking-wide">
              Maison Tunis
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Luxury Tunisian fashion house. Timeless elegance meets authentic craftsmanship.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-sans font-semibold text-foreground mb-4 text-sm tracking-wide">
              Shop
            </h4>
            <ul className="space-y-2">
              {shopLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    variant="secondary"
                    size="sm"
                    className="hover:text-accent"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-sans font-semibold text-foreground mb-4 text-sm tracking-wide">
              Support
            </h4>
            <ul className="space-y-2">
              {supportLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    variant="secondary"
                    size="sm"
                    className="hover:text-accent"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-sans font-semibold text-foreground mb-4 text-sm tracking-wide">
              Company
            </h4>
            <ul className="space-y-2">
              {companyLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    variant="secondary"
                    size="sm"
                    className="hover:text-accent"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          {/* Newsletter */}
          <div className="mb-8">
            <h4 className="font-sans font-semibold text-foreground mb-3 text-sm tracking-wide">
              Subscribe to Our Newsletter
            </h4>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-background border border-border text-foreground placeholder:text-muted text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-accent text-accent-foreground font-medium text-sm tracking-wide hover:bg-accent-dark transition-colors duration-200"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-border">
            <p className="text-xs text-muted text-center md:text-left">
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
