'use client'

import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link } from '@/components/ui/link'
import { FadeInUp } from '@/lib/animations'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import NextLink from 'next/link'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/login'
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => null)
        throw new Error(err?.error || 'Registration failed')
      }

      router.push(callbackUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Section variant="default" spacing="xl" className="min-h-screen">
      <Container size="sm">
        <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[80vh]">
          <FadeInUp delay={0.1}>
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-[var(--accent)] rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">M</span>
              </div>
              <h1 className="text-2xl font-bold text-[var(--fg)] tracking-tight">
                Create account
              </h1>
              <p className="text-sm text-[var(--fg-muted)] mt-2">
                Begin your MAISON TUNIS journey
              </p>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <div className="w-full bg-white rounded-xl border border-[var(--border)] p-6 sm:p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First name"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Last name"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Input
                  label="Email address"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Confirm password"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />

                <label className="flex items-start gap-3 text-sm cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)] mt-0.5"
                    required
                  />
                  <span className="text-[var(--fg-secondary)]">
                    I agree to the{' '}
                    <Link href="/pages/terms" variant="secondary" size="sm" className="inline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/pages/privacy" variant="secondary" size="sm" className="inline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700 text-center">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  className="mt-2"
                >
                  Create account
                </Button>
              </form>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.3}>
            <div className="mt-6 text-center">
              <p className="text-sm text-[var(--fg-muted)]">
                Already have an account?{' '}
                <NextLink href="/login" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium">
                  Sign in
                </NextLink>
              </p>
            </div>
          </FadeInUp>
        </div>
      </Container>
    </Section>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
