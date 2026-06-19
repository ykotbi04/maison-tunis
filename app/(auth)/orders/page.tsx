'use client'

import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { useAuthSession } from '@/hooks/useAuthSession'
import Link from 'next/link'

export default function OrdersPage() {
  const { isAuthenticated, isLoading } = useAuthSession()

  if (isLoading) {
    return (
      <Section variant="default" spacing="xl" className="min-h-screen">
        <Container>
          <div className="text-center py-20">
            <p className="text-muted">Loading...</p>
          </div>
        </Container>
      </Section>
    )
  }

  if (!isAuthenticated) {
    return (
      <Section variant="default" spacing="xl" className="min-h-screen">
        <Container size="sm">
          <div className="text-center py-20 space-y-6">
            <h1 className="font-serif text-4xl text-foreground tracking-wider">
              Sign In Required
            </h1>
            <p className="text-muted">Please sign in to view your orders.</p>
            <Link
              href="/login?callbackUrl=/orders"
              className="inline-block px-6 py-2 bg-accent text-accent-foreground font-medium text-sm tracking-wide hover:bg-accent-dark transition-colors"
            >
              Sign In
            </Link>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section variant="default" spacing="xl" className="min-h-screen">
      <Container>
        <div className="max-w-2xl mx-auto text-center py-12 space-y-6">
          <div className="text-6xl text-accent">✦</div>
          <h1 className="font-serif text-4xl text-foreground tracking-wider">Order History</h1>
          <p className="text-muted">Your order history will appear here.</p>
          <Link
            href="/account"
            className="inline-block px-6 py-2 bg-accent text-accent-foreground font-medium text-sm tracking-wide hover:bg-accent-dark transition-colors"
          >
            Back to Account
          </Link>
        </div>
      </Container>
    </Section>
  )
}
