'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import { useCartDrawerOpen, useSetCartDrawerOpen } from '@/lib/stores'
import { Button } from '@/components/ui/button'
import { formatTND } from '@/lib/formatters'

const CartDrawer = () => {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart()
  const cartDrawerOpen = useCartDrawerOpen()
  const setCartDrawerOpen = useSetCartDrawerOpen()

  const handleClose = () => {
    setCartDrawerOpen(false)
  }

  return (
    <>
      {/* Overlay */}
      {cartDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={handleClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-screen w-full max-w-md z-50 transition-transform duration-500 flex flex-col ${cartDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{
          backgroundColor: 'var(--bg)',
          borderLeft: '1px solid var(--border)',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl" style={{ color: 'var(--fg)' }}>Your Bag</h2>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
              {items.length}
            </span>
          </div>
          <button
            onClick={handleClose}
            style={{ color: 'var(--fg)' }}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--bg-secondary)] transition-colors duration-200"
            aria-label="Close cart"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <span className="text-3xl opacity-30" style={{ color: 'var(--accent)' }}>&#10022;</span>
              </div>
              <p className="text-body-sm font-medium mb-1" style={{ color: 'var(--fg)' }}>Your bag is empty</p>
              <p className="text-body-sm" style={{ color: 'var(--fg-muted)' }}>
                Discover our luxury collections
              </p>
            </div>
          ) : (
            <div className="p-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-5"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  {/* Image */}
                  <div
                    className="w-20 h-24 flex-shrink-0 flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl opacity-30" style={{ color: 'var(--accent)' }}>&#10022;</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base mb-1 truncate" style={{ color: 'var(--fg)' }}>
                      {item.name}
                    </h3>
                    <p className="text-xs mb-3" style={{ color: 'var(--fg-muted)' }}>
                      {formatTND(item.price * item.quantity)}
                    </p>

                    {/* Quantity Control */}
                    <div className="flex items-center gap-1 w-fit">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-xs transition-colors duration-200 hover:bg-[var(--bg-secondary)]"
                        style={{ border: '1px solid var(--border)', color: 'var(--fg)' }}
                      >
                        &minus;
                      </button>
                      <span className="w-10 h-8 flex items-center justify-center text-xs" style={{ color: 'var(--fg)' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-xs transition-colors duration-200 hover:bg-[var(--bg-secondary)]"
                        style={{ border: '1px solid var(--border)', color: 'var(--fg)' }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="transition-opacity hover:opacity-70 self-start"
                    style={{ color: 'var(--fg-muted)' }}
                    aria-label="Remove item"
                  >
                    <svg
                      className="w-4 h-4"
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
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 space-y-4" style={{ borderTop: '1px solid var(--border)' }}>
            {/* Total */}
            <div className="flex justify-between items-baseline">
              <span className="text-sm" style={{ color: 'var(--fg)' }}>
                Subtotal
              </span>
              <span className="font-serif text-2xl font-light" style={{ color: 'var(--accent)' }}>
                {formatTND(totalPrice)}
              </span>
            </div>

            {/* Buttons */}
            <Link href="/checkout">
              <Button
                className="w-full py-4 text-xs tracking-[0.2em] uppercase"
              >
                Checkout
              </Button>
            </Link>
            <Link href="/collections">
              <Button
                variant="secondary"
                className="w-full py-4 text-xs tracking-[0.2em] uppercase"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

CartDrawer.displayName = 'CartDrawer'

export { CartDrawer }
