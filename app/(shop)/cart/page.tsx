'use client'

import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import { FadeInUp } from '@/lib/animations'
import { formatTND } from '@/lib/formatters'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <Section variant="default" spacing="xl">
        <Container>
          <div className="text-center py-20">
            <div className="text-6xl text-accent mb-6">◆</div>
            <h1 className="font-serif text-4xl text-foreground mb-4 tracking-widest">
              Cart is Empty
            </h1>
            <p className="text-muted text-lg mb-8 max-w-md mx-auto">
              Discover our luxury collections and add your favorite pieces
            </p>
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

  return (
    <>
      {/* Page Header */}
      <Section variant="default" spacing="lg">
        <Container>
          <FadeInUp delay={0.1}>
            <h1 className="font-serif text-5xl md:text-6xl text-foreground tracking-widest">
              Shopping Cart
            </h1>
          </FadeInUp>
        </Container>
      </Section>

      {/* Cart Content */}
      <Section variant="dark" spacing="lg">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {items.map((item, idx) => (
                  <FadeInUp key={item.id} delay={idx * 0.1}>
                    <div className="bg-background rounded-lg p-6 border border-border flex gap-6">
                      {/* Image */}
                      <div className="w-32 h-32 bg-background-secondary rounded flex-shrink-0 flex items-center justify-center">
                        <span className="text-3xl text-accent">◆</span>
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <h3 className="font-serif text-xl text-foreground mb-2">
                          {item.name}
                        </h3>
                        <p className="text-muted text-sm mb-4">
                          {formatTND(item.price)} each
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mb-4">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-border text-foreground hover:border-accent transition-colors"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-border text-foreground hover:border-accent transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <p className="text-price text-foreground">
                          {formatTND(item.price * item.quantity)}
                        </p>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted hover:text-error transition-colors h-fit"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </FadeInUp>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <FadeInUp delay={0.2}>
                <div className="bg-background rounded-lg p-8 border border-border sticky top-24">
                  <h2 className="font-serif text-2xl text-foreground mb-6 tracking-wider">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6 pb-6 border-b border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Subtotal:</span>
                      <span className="text-foreground font-medium">{formatTND(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Shipping:</span>
                      <span className="text-foreground font-medium">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Tax:</span>
                      <span className="text-foreground font-medium">Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline mb-6 pb-6 border-b border-border">
                    <span className="text-foreground font-sans">Total:</span>
                    <span className="font-serif text-2xl text-accent">
                      {formatTND(totalPrice)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <Link href="/checkout">
                      <Button variant="primary" size="lg" fullWidth className="font-medium">
                        Proceed to Checkout
                      </Button>
                    </Link>
                    <Link href="/shop">
                      <Button variant="secondary" size="lg" fullWidth className="font-medium">
                        Continue Shopping
                      </Button>
                    </Link>
                    <button
                      onClick={clearCart}
                      className="w-full px-4 py-3 text-sm text-error hover:text-error/80 transition-colors font-medium"
                    >
                      Clear Cart
                    </button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-xs text-muted text-center">
                      Free shipping on orders over $100. Express shipping available.
                    </p>
                  </div>
                </div>
              </FadeInUp>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
