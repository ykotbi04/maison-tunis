'use client'

import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link } from '@/components/ui/link'
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
  const callbackUrl = searchParams.get('callbackUrl') || '/shop'
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

      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
        return
      }

      const syncResponse = await fetch('/api/auth/sync', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestCart, guestWishlist }),
      })

      if (syncResponse.ok) {
        const data = await syncResponse.json()
        if (data.cart) {
          useCartStore.setState({ items: data.cart })
        }
        if (data.wishlist) {
          useWishlistStore.setState({
            items: data.wishlist.map((productId: string) => ({
              productId,
              addedAt: new Date(),
            })),
          })
        }
      }

      router.push(callbackUrl)
      router.refresh()
    } catch {
      setError('An unexpected error occurred. Please try again.')
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
                Welcome Back
              </h1>
              <p className="text-muted">
                Sign in to your MAISON TUNIS account
              </p>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border border-border rounded"
                  />
                  <span className="text-muted">Remember me</span>
                </label>
                <Link href="#" variant="secondary" size="sm">
                  Forgot Password?
                </Link>
              </div>

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
                Sign In
              </Button>
            </form>
          </FadeInUp>

          <FadeInUp delay={0.3}>
            <div className="mt-8 pt-8 border-t border-border text-center">
              <p className="text-muted text-sm mb-4">
                Don&apos;t have an account?
              </p>
              <NextLink href="/register">
                <Button variant="secondary" size="md" fullWidth className="font-medium">
                  Create Account
                </Button>
              </NextLink>
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
