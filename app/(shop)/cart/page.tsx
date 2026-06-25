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
      <main className="bg-[var(--bg)]">
        <section className="py-20 text-center">
          <Container>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-[var(--bg-muted)] rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-[var(--fg-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[var(--fg)]">Your bag is empty</h1>
              <p className="text-sm text-[var(--fg-muted)] max-w-md mx-auto">
                Discover our luxury collections and add your favorite pieces
              </p>
               <Link href="/collections">
                <Button variant="primary" size="lg" className="mt-4">
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
    <main className="bg-[var(--bg)]">
      <section style={{ borderBottom: '1px solid var(--border)' }}>
        <Container>
          <div className="py-4">
            <nav className="flex items-center gap-2 text-xs text-[var(--fg-muted)]">
              <Link href="/" className="hover:text-[var(--fg)] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[var(--fg)]">Your Bag</span>
            </nav>
          </div>
        </Container>
      </section>

      <section className="py-8 md:py-12">
        <Container>
          <h1 className="text-2xl font-bold text-[var(--fg)]">Your Bag</h1>
        </Container>
      </section>

      <section className="pb-12 md:pb-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <div className="space-y-0">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 py-5 border-b border-[var(--border)]"
                  >
                    <div className="w-20 h-20 md:w-28 md:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-[var(--bg-muted)]">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={112}
                          height={112}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-[var(--fg-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-3">
                        <div className="space-y-0.5">
                          <h3 className="text-sm font-semibold text-[var(--fg)]">
                            {item.name}
                          </h3>
                          {(item.color || item.size) && (
                            <p className="text-xs text-[var(--fg-muted)]">
                              {[item.color, item.size].filter(Boolean).join(' / ')}
                            </p>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-[var(--fg)]">
                          {formatTND(item.price * item.quantity)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-9 h-9 flex items-center justify-center rounded-l-lg border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--bg-muted)] transition-colors"
                          >
                            -
                          </button>
                          <span className="w-10 h-9 flex items-center justify-center text-sm font-medium border-y border-[var(--border)] text-[var(--fg)]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-9 h-9 flex items-center justify-center rounded-r-lg border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--bg-muted)] transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--error)] transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-[var(--border)] p-6 sticky top-24">
                <h2 className="text-base font-semibold text-[var(--fg)] mb-5">Summary</h2>

                <div className="space-y-3 mb-5 pb-5 border-b border-[var(--border)]">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--fg-muted)]">Subtotal</span>
                    <span className="text-[var(--fg)]">{formatTND(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--fg-muted)]">Shipping</span>
                    <span className="text-[var(--fg-muted)]">Calculated at next step</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline mb-5 pb-5 border-b border-[var(--border)]">
                  <span className="text-sm font-semibold text-[var(--fg)]">Total</span>
                  <span className="text-xl font-bold text-[var(--fg)]">
                    {formatTND(totalPrice)}
                  </span>
                </div>

                <div className="space-y-3">
                  <Link href="/checkout">
                    <Button variant="primary" size="lg" fullWidth>
                      Proceed to Checkout
                    </Button>
                  </Link>
                   <Link href="/collections">
                    <Button variant="secondary" size="lg" fullWidth>
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                <div className="mt-5 pt-5 border-t border-[var(--border)] space-y-3">
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs text-[var(--fg-muted)]">Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-xs text-[var(--fg-muted)]">Complimentary Returns</span>
                  </div>
                </div>

                <button
                  onClick={clearCart}
                  className="w-full mt-4 py-2 text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--error)] transition-colors"
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
