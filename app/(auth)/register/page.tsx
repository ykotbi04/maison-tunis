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
        <div className="max-w-md mx-auto">
          <FadeInUp delay={0.1}>
            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl text-foreground mb-2 tracking-widest">
                Create Account
              </h1>
              <p className="text-muted">
                Join MAISON TUNIS and discover luxury fashion
              </p>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />

              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  className="w-4 h-4 border border-border rounded mt-1"
                  required
                />
                <span className="text-muted">
                  I agree to the Terms of Service and Privacy Policy
                </span>
              </label>

              {error && (
                <p className="text-sm text-error text-center">{error}</p>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                className="font-medium tracking-wide"
              >
                Create Account
              </Button>
            </form>
          </FadeInUp>

          <FadeInUp delay={0.3}>
            <div className="mt-8 pt-8 border-t border-border text-center">
              <p className="text-muted text-sm mb-4">
                Already have an account?
              </p>
              <NextLink href="/login">
                <Button variant="secondary" size="md" fullWidth className="font-medium">
                  Sign In
                </Button>
              </NextLink>
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
