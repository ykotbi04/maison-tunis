'use client'

import { useState } from 'react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/hooks/useCart'
import { useCheckout } from '@/hooks/useCheckout'
import { useAuthSession } from '@/hooks/useAuthSession'
import { FadeInUp } from '@/lib/animations'
import { formatTND } from '@/lib/formatters'
import { checkoutApi } from '@/lib/api'
import type { Order } from '@/types/checkout'
import Link from 'next/link'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { step, formData, errors, touched, handleInputChange, handleFieldBlur, nextStep, prevStep, isValid } = useCheckout()
  const { isAuthenticated, isLoading } = useAuthSession()
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isLoading) {
    return (
      <Section variant="default" spacing="xl">
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
      <Section variant="default" spacing="xl">
        <Container size="sm">
          <div className="text-center py-20 space-y-6">
            <div className="text-6xl text-accent">✦</div>
            <h1 className="font-serif text-4xl text-foreground tracking-wider">
              Sign In to Checkout
            </h1>
            <p className="text-muted max-w-md mx-auto">
              Please sign in or create an account to complete your purchase.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login?callbackUrl=/checkout">
                <Button variant="primary" size="lg">
                  Sign In
                </Button>
              </Link>
              <Link href="/register?callbackUrl=/checkout">
                <Button variant="secondary" size="lg">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    )
  }

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <Section variant="default" spacing="xl">
        <Container>
          <div className="text-center py-20">
            <p className="text-muted mb-6">Your cart is empty</p>
            <Link href="/shop">
              <Button variant="primary" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 'payment') {
      setIsSubmitting(true)
      try {
        const order = await checkoutApi.createOrder({
          shipping: formData,
          payment: { method: 'credit-card' },
          items,
        })
        setConfirmedOrder(order)
        await clearCart()
        nextStep()
      } catch {
        alert('Checkout failed. Please sign in and try again.')
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    nextStep()
  }

  const summaryItems = confirmedOrder?.items ?? items
  const summaryTotal = confirmedOrder?.total ?? totalPrice

  return (
    <>
      {/* Page Header */}
      <Section variant="default" spacing="lg">
        <Container>
          <FadeInUp delay={0.1}>
            <h1 className="font-serif text-5xl md:text-6xl text-foreground tracking-widest">
              Checkout
            </h1>
          </FadeInUp>
        </Container>
      </Section>

      {/* Checkout Content */}
      <Section variant="dark" spacing="lg">
        <Container>
          {step === 'confirmation' ? (
            <div className="max-w-2xl mx-auto">
              <FadeInUp delay={0.1}>
                <div className="text-center py-12">
                  <div className="text-6xl text-accent mb-6">✓</div>
                  <h2 className="font-serif text-4xl text-foreground mb-4 tracking-wider">
                    Order Confirmed
                  </h2>
                  <p className="text-muted text-lg mb-8">
                    Thank you for your purchase.
                    {confirmedOrder && (
                      <> Your order number is <span className="text-foreground font-medium">{confirmedOrder.id}</span>.</>
                    )}
                  </p>

                  <div className="bg-background rounded-lg p-8 border border-border mb-8">
                    <h3 className="font-serif text-xl text-foreground mb-4 tracking-wide">
                      Order Summary
                    </h3>
                    <div className="space-y-3 mb-6 pb-6 border-b border-border">
                      {summaryItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted">{item.name} x {item.quantity}</span>
                          <span className="text-foreground font-medium">{formatTND(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-foreground font-sans">Total:</span>
                      <span className="text-price-lg text-accent">{formatTND(summaryTotal)}</span>
                    </div>
                  </div>

                  <Link href="/shop">
                    <Button variant="primary" size="lg">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </FadeInUp>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <FadeInUp delay={0.1}>
                  <div className="bg-background rounded-lg p-8 border border-border">
                    {/* Steps */}
                    <div className="flex gap-4 mb-8 pb-8 border-b border-border">
                      {['shipping', 'payment', 'confirmation'].map((s) => (
                        <div
                          key={s}
                          className={`flex items-center gap-3 text-sm font-medium ${
                            step === s
                              ? 'text-accent'
                              : 'text-muted'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                              step === s
                                ? 'border-accent bg-accent text-accent-foreground'
                                : 'border-border text-muted'
                            }`}
                          >
                            {s === 'shipping' && '1'}
                            {s === 'payment' && '2'}
                            {s === 'confirmation' && '3'}
                          </div>
                          <span className="capitalize hidden sm:inline">{s}</span>
                        </div>
                      ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {step === 'shipping' && (
                        <>
                          <h3 className="font-serif text-xl text-foreground mb-6 tracking-wide">
                            Shipping Address
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="First Name"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              onBlur={() => handleFieldBlur('firstName')}
                              error={touched.firstName ? errors.firstName : undefined}
                              required
                            />
                            <Input
                              label="Last Name"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              onBlur={() => handleFieldBlur('lastName')}
                              error={touched.lastName ? errors.lastName : undefined}
                              required
                            />
                          </div>
                          <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={() => handleFieldBlur('email')}
                            error={touched.email ? errors.email : undefined}
                            required
                          />
                          <Input
                            label="Phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            onBlur={() => handleFieldBlur('phone')}
                            error={touched.phone ? errors.phone : undefined}
                            placeholder="e.g., +216 98 123 456"
                            required
                          />
                          <Input
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            onBlur={() => handleFieldBlur('address')}
                            error={touched.address ? errors.address : undefined}
                            required
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="City"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              onBlur={() => handleFieldBlur('city')}
                              error={touched.city ? errors.city : undefined}
                              required
                            />
                            <Input
                              label="State/Region"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              onBlur={() => handleFieldBlur('state')}
                              error={touched.state ? errors.state : undefined}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="Postal Code"
                              name="postalCode"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              onBlur={() => handleFieldBlur('postalCode')}
                              error={touched.postalCode ? errors.postalCode : undefined}
                              placeholder="e.g., 1080"
                              required
                            />
                            <Input
                              label="Country"
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              onBlur={() => handleFieldBlur('country')}
                              error={touched.country ? errors.country : undefined}
                              required
                            />
                          </div>
                        </>
                      )}

                      {step === 'payment' && (
                        <>
                          <h3 className="font-serif text-xl text-foreground mb-6 tracking-wide">
                            Payment Method
                          </h3>
                          <div className="space-y-3 mb-6">
                            <label className="flex items-center gap-3 p-4 border border-border rounded cursor-pointer hover:border-accent transition-colors">
                              <input type="radio" name="payment" defaultChecked className="w-4 h-4" />
                              <span className="text-foreground">Credit Card</span>
                            </label>
                            <label className="flex items-center gap-3 p-4 border border-border rounded cursor-pointer hover:border-accent transition-colors">
                              <input type="radio" name="payment" className="w-4 h-4" />
                              <span className="text-foreground">PayPal</span>
                            </label>
                            <label className="flex items-center gap-3 p-4 border border-border rounded cursor-pointer hover:border-accent transition-colors">
                              <input type="radio" name="payment" className="w-4 h-4" />
                              <span className="text-foreground">Bank Transfer</span>
                            </label>
                          </div>
                          <p className="text-sm text-muted">Payment processing is secure and encrypted. Your information is protected.</p>
                        </>
                      )}

                      <div className="flex gap-4 pt-6 border-t border-border">
                        {step !== 'shipping' && (
                          <Button
                            type="button"
                            variant="secondary"
                            size="lg"
                            onClick={prevStep}
                          >
                            Back
                          </Button>
                        )}
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          className="flex-1 font-medium"
                          disabled={!isValid || isSubmitting}
                          isLoading={isSubmitting}
                        >
                          {step === 'shipping' ? 'Continue to Payment' : 'Complete Order'}
                        </Button>
                      </div>
                    </form>
                  </div>
                </FadeInUp>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <FadeInUp delay={0.2}>
                  <div className="bg-background rounded-lg p-8 border border-border sticky top-24">
                    <h2 className="font-serif text-xl text-foreground mb-6 tracking-wide">
                      Order Summary
                    </h2>

                    <div className="space-y-3 mb-6 pb-6 border-b border-border">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted">{item.name} x {item.quantity}</span>
                          <span className="text-foreground font-medium">
                            {formatTND(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-baseline">
                      <span className="text-foreground font-sans">Total:</span>
                      <span className="text-price text-accent">
                        {formatTND(totalPrice)}
                      </span>
                    </div>
                  </div>
                </FadeInUp>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
