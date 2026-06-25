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

const steps = ['shipping', 'payment', 'confirmation'] as const
const stepLabels = { shipping: 'Shipping', payment: 'Payment', confirmation: 'Confirmation' }
const stepNumbers = { shipping: '1', payment: '2', confirmation: '3' }

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const {
    step,
    shippingData,
    paymentData,
    errors,
    touched,
    handleShippingChange,
    handlePaymentChange,
    handlePaymentMethodChange,
    handleFieldBlur,
    nextStep,
    prevStep,
    isValid,
  } = useCheckout()
  const { isAuthenticated, isLoading } = useAuthSession()
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isLoading) {
    return (
      <Section variant="default" spacing="xl">
        <Container>
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-[var(--fg-muted)]">Loading...</p>
          </div>
        </Container>
      </Section>
    )
  }

  if (!isAuthenticated) {
    return (
      <Section variant="default" spacing="xl">
        <Container size="sm">
          <div className="text-center py-20 space-y-4">
            <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-2xl flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--fg)]">
              Sign in to checkout
            </h1>
            <p className="text-sm text-[var(--fg-muted)] max-w-sm mx-auto">
              Please sign in or create an account to complete your purchase.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
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
            <p className="text-sm text-[var(--fg-muted)] mb-4">Your cart is empty</p>
            <Link href="/collections">
              <Button variant="primary" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    )
  }

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length > 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2)
    }
    return digits
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 'payment') {
      setIsSubmitting(true)
      try {
        const order = await checkoutApi.createOrder({
          shipping: shippingData,
          payment: paymentData,
          items,
        })
        setConfirmedOrder(order)
        await clearCart()
        nextStep()
      } catch (err) {
        const message = err instanceof Error ? err.message : (err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Unknown error')
        alert(`Checkout failed: ${message}`)
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    nextStep()
  }

  const summaryItems = confirmedOrder?.items ?? items
  const summaryTotal = confirmedOrder?.total ?? totalPrice

  const currentIndex = steps.indexOf(step)

  return (
    <>
      <Section variant="default" spacing="lg">
        <Container>
          <FadeInUp delay={0.1}>
            <h1 className="text-2xl font-bold text-[var(--fg)] text-center">
              Checkout
            </h1>
          </FadeInUp>
        </Container>
      </Section>

      <Section variant="dark" spacing="lg">
        <Container>
          {step === 'confirmation' ? (
            <div className="max-w-2xl mx-auto">
              <FadeInUp delay={0.1}>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-[var(--success)] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-bold text-[var(--fg)] mb-2">
                    Order Confirmed
                  </h2>
                  <p className="text-sm text-[var(--fg-muted)] mb-6">
                    Thank you for your purchase.
                    {confirmedOrder && (
                      <> Your order number is <span className="font-semibold text-[var(--fg)]">{confirmedOrder.id}</span>.</>
                    )}
                  </p>

                  <div className="bg-white rounded-xl border border-[var(--border)] p-6 text-left mb-6">
                    <h3 className="text-base font-semibold text-[var(--fg)] mb-4">Order Summary</h3>
                    <div className="space-y-2 pb-4 mb-4 border-b border-[var(--border)]">
                      {summaryItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-[var(--fg-secondary)]">{item.name} x {item.quantity}</span>
                          <span className="font-medium text-[var(--fg)]">{formatTND(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm pb-2">
                      <span className="text-[var(--fg-secondary)]">Payment</span>
                      <span className="font-medium text-[var(--fg)]">
                        {confirmedOrder?.payment?.method === 'credit-card' ? 'Credit Card' : 'Bank Transfer'}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2 border-t border-[var(--border)]">
                      <span className="text-sm font-semibold text-[var(--fg)]">Total</span>
                      <span className="text-lg font-bold text-[var(--fg)]">
                        {formatTND(summaryTotal)}
                      </span>
                    </div>
                  </div>

                   <Link href="/collections">
                    <Button variant="primary" size="lg">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </FadeInUp>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <FadeInUp delay={0.1}>
                  <div className="bg-white rounded-xl border border-[var(--border)] p-6">
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-[var(--border)]">
                      {steps.map((s, i) => {
                        const isCompleted = currentIndex > i
                        const isCurrent = step === s
                        return (
                          <div key={s} className="flex items-center flex-1 last:flex-none">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold transition-all duration-200 ${
                                  isCompleted
                                    ? 'bg-[var(--accent)] text-white'
                                    : isCurrent
                                      ? 'bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/25'
                                      : 'bg-[var(--bg-muted)] text-[var(--fg-muted)] border border-[var(--border)]'
                                }`}
                              >
                                {isCompleted ? (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  stepNumbers[s]
                                )}
                              </div>
                              <span
                                className={`hidden sm:inline text-sm ${
                                  isCurrent ? 'font-semibold text-[var(--fg)]' : isCompleted ? 'text-[var(--accent)]' : 'text-[var(--fg-muted)]'
                                }`}
                              >
                                {stepLabels[s]}
                              </span>
                            </div>
                            {i < steps.length - 1 && (
                              <div
                                className={`flex-1 mx-4 h-px ${
                                  currentIndex > i ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
                                }`}
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {step === 'shipping' && (
                        <>
                          <h3 className="text-base font-semibold text-[var(--fg)] mb-4">Shipping Address</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="First name"
                              name="firstName"
                              value={shippingData.firstName}
                              onChange={handleShippingChange}
                              onBlur={() => handleFieldBlur('firstName')}
                              error={touched.firstName ? errors.firstName : undefined}
                              required
                            />
                            <Input
                              label="Last name"
                              name="lastName"
                              value={shippingData.lastName}
                              onChange={handleShippingChange}
                              onBlur={() => handleFieldBlur('lastName')}
                              error={touched.lastName ? errors.lastName : undefined}
                              required
                            />
                          </div>
                          <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={shippingData.email}
                            onChange={handleShippingChange}
                            onBlur={() => handleFieldBlur('email')}
                            error={touched.email ? errors.email : undefined}
                            required
                          />
                          <Input
                            label="Phone"
                            type="tel"
                            name="phone"
                            value={shippingData.phone}
                            onChange={handleShippingChange}
                            onBlur={() => handleFieldBlur('phone')}
                            error={touched.phone ? errors.phone : undefined}
                            placeholder="e.g., +216 98 123 456"
                            required
                          />
                          <Input
                            label="Address"
                            name="address"
                            value={shippingData.address}
                            onChange={handleShippingChange}
                            onBlur={() => handleFieldBlur('address')}
                            error={touched.address ? errors.address : undefined}
                            required
                          />
                           <Input
                            label="City"
                            name="city"
                            value={shippingData.city}
                            onChange={handleShippingChange}
                            onBlur={() => handleFieldBlur('city')}
                            error={touched.city ? errors.city : undefined}
                            required
                          />
                          <Input
                            label="Postal Code"
                            name="postalCode"
                            value={shippingData.postalCode}
                            onChange={handleShippingChange}
                            onBlur={() => handleFieldBlur('postalCode')}
                            error={touched.postalCode ? errors.postalCode : undefined}
                            placeholder="e.g., 1080"
                            required
                          />
                        </>
                      )}

                      {step === 'payment' && (
                        <>
                          <h3 className="text-base font-semibold text-[var(--fg)] mb-4">Payment Method</h3>
                          <div className="space-y-3 mb-6">
                            {[
                              { id: 'credit-card' as const, label: 'Credit Card', icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                </svg>
                              )},
                              { id: 'bank-transfer' as const, label: 'Bank Transfer', icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                                </svg>
                              )},
                            ].map((method) => (
                              <label
                                key={method.id}
                                className={`flex items-center gap-4 cursor-pointer p-4 rounded-xl border transition-all duration-150 ${
                                  paymentData.method === method.id
                                    ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                                    : 'border-[var(--border)] hover:border-[var(--accent)]/30'
                                }`}
                                onClick={() => handlePaymentMethodChange(method.id)}
                              >
                                <div
                                  className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all ${
                                    paymentData.method === method.id ? 'border-[var(--accent)]' : 'border-[var(--border)]'
                                  }`}
                                >
                                  {paymentData.method === method.id && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
                                  )}
                                </div>
                                <input type="radio" name="paymentMethod" checked={paymentData.method === method.id} readOnly className="sr-only" />
                                <span className="text-[var(--fg-muted)]">{method.icon}</span>
                                <span className="text-sm font-medium text-[var(--fg)]">{method.label}</span>
                              </label>
                            ))}
                          </div>

                          {paymentData.method === 'credit-card' && (
                            <div className="space-y-4">
                              <Input
                                label="Card Number"
                                name="cardNumber"
                                value={paymentData.cardNumber}
                                onChange={(e) => {
                                  handlePaymentChange({
                                    ...e,
                                    target: { ...e.target, name: 'cardNumber', value: formatCardNumber(e.target.value) },
                                  })
                                }}
                                onBlur={() => handleFieldBlur('cardNumber')}
                                error={touched.cardNumber ? errors.cardNumber : undefined}
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                                inputMode="numeric"
                                required
                              />
                              <div className="grid grid-cols-2 gap-4">
                                <Input
                                  label="Expiry Date"
                                  name="cardExpiry"
                                  value={paymentData.cardExpiry}
                                  onChange={(e) => {
                                    handlePaymentChange({
                                      ...e,
                                      target: { ...e.target, name: 'cardExpiry', value: formatExpiry(e.target.value) },
                                    })
                                  }}
                                  onBlur={() => handleFieldBlur('cardExpiry')}
                                  error={touched.cardExpiry ? errors.cardExpiry : undefined}
                                  placeholder="MM/YY"
                                  maxLength={5}
                                  inputMode="numeric"
                                  required
                                />
                                <Input
                                  label="CVC"
                                  name="cardCvc"
                                  value={paymentData.cardCvc}
                                  onChange={(e) => {
                                    const digits = e.target.value.replace(/\D/g, '').slice(0, 4)
                                    handlePaymentChange({
                                      ...e,
                                      target: { ...e.target, name: 'cardCvc', value: digits },
                                    })
                                  }}
                                  onBlur={() => handleFieldBlur('cardCvc')}
                                  error={touched.cardCvc ? errors.cardCvc : undefined}
                                  placeholder="123"
                                  maxLength={4}
                                  inputMode="numeric"
                                  required
                                />
                              </div>
                            </div>
                          )}

                          {paymentData.method === 'bank-transfer' && (
                            <div className="p-4 bg-[var(--accent)]/5 border border-[var(--accent)]/10 rounded-xl">
                              <p className="text-sm text-[var(--fg-secondary)]">
                                You will receive bank transfer details after placing your order. Please complete the transfer within 48 hours.
                              </p>
                            </div>
                          )}

                          <div className="flex items-center gap-2.5 p-3 bg-[var(--accent)]/5 border border-[var(--accent)]/10 rounded-xl">
                            <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <p className="text-xs text-[var(--fg-secondary)]">
                              Payment processing is secure and encrypted. Your information is protected.
                            </p>
                          </div>
                        </>
                      )}

                      <div className="flex gap-3 pt-5 border-t border-[var(--border)]">
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
                          className="flex-1"
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

              <div className="lg:col-span-1">
                <FadeInUp delay={0.2}>
                  <div className="bg-white rounded-xl border border-[var(--border)] p-6 sticky top-24">
                    <h2 className="text-base font-semibold text-[var(--fg)] mb-4">Order Summary</h2>

                    <div className="space-y-2 pb-4 mb-4 border-b border-[var(--border)]">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-[var(--fg-secondary)] flex-1 pr-3">
                            {item.name} <span className="text-[var(--fg-muted)]">x{item.quantity}</span>
                          </span>
                          <span className="font-medium text-[var(--fg)] whitespace-nowrap">
                            {formatTND(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-semibold text-[var(--fg)]">Total</span>
                      <span className="text-lg font-bold text-[var(--fg)]">
                        {formatTND(totalPrice)}
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-5 pt-4 border-t border-[var(--border)]">
                      <svg className="w-3.5 h-3.5 text-[var(--fg-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider font-medium">
                        Secure Checkout
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
