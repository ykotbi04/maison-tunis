'use client'

import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { FadeInUp } from '@/lib/animations'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useCartStore } from '@/lib/stores/cartStore'
import { useWishlistStore } from '@/lib/stores/wishlistStore'
import NextLink from 'next/link'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/collections'
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    setIsLoading(true)
    setError('')
    try {
      const guestCart = useCartStore.getState().items
      const guestWishlist = useWishlistStore.getState().items.map((item) => item.productId)

      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          guestCart,
          guestWishlist,
        }),
      })

      if (!loginResponse.ok) {
        setError('Invalid email or password')
        return
      }

      const loginData = await loginResponse.json()

      if (loginData.cart) {
        useCartStore.setState({ items: loginData.cart })
      }
      if (loginData.wishlist) {
        useWishlistStore.setState({
          items: loginData.wishlist.map((productId: string) => ({
            productId,
            addedAt: new Date(),
          })),
        })
      }

      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Failed to sign in. Please try again.')
        return
      }

      if (loginData.user?.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push(callbackUrl)
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
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
                Welcome back
              </h1>
              <p className="text-sm text-[var(--fg-muted)] mt-2">
                Sign in to your MAISON TUNIS account
              </p>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <div className="w-full bg-white rounded-xl border border-[var(--border)] p-6 sm:p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />

                <div className="flex items-center text-sm pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                    />
                    <span className="text-[var(--fg-secondary)]">Remember me</span>
                  </label>
                </div>

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
                  Sign in
                </Button>
              </form>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.3}>
            <div className="mt-6 text-center">
              <p className="text-sm text-[var(--fg-muted)]">
                Don&apos;t have an account?{' '}
                <NextLink href="/register" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium">
                  Create account
                </NextLink>
              </p>
            </div>
          </FadeInUp>
        </div>
      </Container>
    </Section>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
