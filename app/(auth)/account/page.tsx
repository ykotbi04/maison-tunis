'use client'

import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'
import { useAuthSession } from '@/hooks/useAuthSession'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

export default function AccountPage() {
  const { user, isLoading } = useAuthSession()

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

  if (!user) {
    return (
      <Section variant="default" spacing="xl" className="min-h-screen">
        <Container size="sm">
          <div className="text-center py-20 space-y-6">
            <div className="text-6xl text-accent">✦</div>
            <h1 className="font-serif text-4xl text-foreground tracking-wider">
              Sign In Required
            </h1>
            <p className="text-muted">Please sign in to view your account.</p>
            <Link href="/login?callbackUrl=/account">
              <Button variant="primary" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section variant="default" spacing="xl" className="min-h-screen">
      <Container size="sm">
        <div className="max-w-lg mx-auto space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-accent font-serif">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <h1 className="font-serif text-4xl text-foreground tracking-wider mb-2">
              {user.name || 'Account'}
            </h1>
            <p className="text-muted">{user.email}</p>
          </div>

          <div className="bg-background-secondary rounded-lg border border-border p-6 space-y-4">
            <h2 className="font-serif text-xl text-foreground tracking-wide">
              Account Details
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Name</span>
                <span className="text-foreground">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Email</span>
                <span className="text-foreground">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Role</span>
                <span className="text-foreground capitalize">{user.role?.toLowerCase()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/orders">
              <Button variant="secondary" size="lg" fullWidth className="justify-start font-medium">
                Order History
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              className="justify-start font-medium text-error hover:text-error"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
