'use client'

import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import { formatTND } from '@/lib/formatters'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <main style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
        <section className="py-20 text-center">
          <Container>
            <div className="space-y-6">
              <div className="text-6xl" style={{ color: 'var(--accent)', opacity: 0.3 }}>◆</div>
              <h1 className="text-display-1" style={{ color: 'var(--fg)' }}>Your Bag is Empty</h1>
              <p className="text-body max-w-md mx-auto" style={{ color: 'var(--fg-muted)' }}>
                Discover our luxury collections and add your favorite pieces
              </p>
              <Link href="/shop">
                <Button
                  className="px-8 py-4 text-overline"
                  style={{ backgroundColor: 'var(--accent)', color: '#0C0A08' }}
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      </main>
    )
  }

  return (
    <main style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      {/* Breadcrumb */}
      <section style={{ borderBottom: '1px solid var(--border)' }}>
        <Container>
          <div className="py-4">
            <nav className="flex items-center gap-2 text-overline" style={{ color: 'var(--fg-muted)' }}>
              <Link href="/" className="hover:opacity-80 transition-opacity">Home</Link>
              <span>/</span>
              <span style={{ color: 'var(--fg)' }}>Your Bag</span>
            </nav>
          </div>
        </Container>
      </section>

      {/* Page Header */}
      <section className="py-12 md:py-16">
        <Container>
          <h1 className="text-display-1" style={{ color: 'var(--fg)' }}>Your Bag</h1>
        </Container>
      </section>

      {/* Cart Content */}
      <section className="pb-16 md:pb-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-0">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-6 py-6"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    {/* Image */}
                    <div
                      className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: 'var(--bg-secondary)' }}
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl" style={{ color: 'var(--accent)', opacity: 0.3 }}>◆</span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h3 className="text-body-lg font-medium" style={{ color: 'var(--fg)' }}>
                            {item.name}
                          </h3>
                          {(item.color || item.size) && (
                            <p className="text-body-sm" style={{ color: 'var(--fg-muted)' }}>
                              {[item.color, item.size].filter(Boolean).join(' / ')}
                            </p>
                          )}
                        </div>
                        <p className="text-body-lg font-medium" style={{ color: 'var(--fg)' }}>
                          {formatTND(item.price * item.quantity)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center transition-colors"
                            style={{ border: '1px solid var(--border)', color: 'var(--fg)' }}
                          >
                            −
                          </button>
                          <span
                            className="w-12 h-10 flex items-center justify-center text-body-sm"
                            style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', color: 'var(--fg)' }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center transition-colors"
                            style={{ border: '1px solid var(--border)', color: 'var(--fg)' }}
                          >
                            +
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-overline transition-colors hover:opacity-70"
                          style={{ color: 'var(--fg-muted)' }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div
                className="p-8 sticky top-24"
                style={{ border: '1px solid var(--border)' }}
              >
                <h2 className="text-heading-2 mb-8" style={{ color: 'var(--fg)' }}>
                  Summary
                </h2>

                <div className="space-y-4 mb-8 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="flex justify-between text-body-sm">
                    <span style={{ color: 'var(--fg-muted)' }}>Subtotal</span>
                    <span style={{ color: 'var(--fg)' }}>{formatTND(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-body-sm">
                    <span style={{ color: 'var(--fg-muted)' }}>Shipping</span>
                    <span style={{ color: 'var(--fg-muted)' }}>Calculated at next step</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline mb-8 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="text-body-lg" style={{ color: 'var(--fg)' }}>Total</span>
                  <span className="text-heading-2" style={{ color: 'var(--accent)' }}>
                    {formatTND(totalPrice)}
                  </span>
                </div>

                <div className="space-y-4">
                  <Link href="/checkout">
                    <Button
                      className="w-full py-4 text-overline"
                      style={{ backgroundColor: 'var(--accent)', color: '#0C0A08' }}
                    >
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link href="/shop">
                    <Button
                      className="w-full py-4 text-overline"
                      style={{ backgroundColor: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                {/* Trust Signals */}
                <div className="mt-8 pt-8 space-y-4" style={{ borderTop: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-3">
                    <span style={{ color: 'var(--accent)' }}>✦</span>
                    <span className="text-body-sm" style={{ color: 'var(--fg-muted)' }}>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ color: 'var(--accent)' }}>✦</span>
                    <span className="text-body-sm" style={{ color: 'var(--fg-muted)' }}>Complimentary Returns</span>
                  </div>
                </div>

                <button
                  onClick={clearCart}
                  className="w-full mt-6 py-3 text-overline transition-colors hover:opacity-70"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  Clear Bag
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}
