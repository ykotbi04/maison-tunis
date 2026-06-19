'use client'

import React from 'react'
import Link from 'next/link'
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
          className="fixed inset-0 bg-black/50 z-40"
          onClick={handleClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-screen w-full max-w-md z-50 transition-transform duration-300 flex flex-col ${cartDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: 'var(--bg)', borderLeft: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-heading-2" style={{ color: 'var(--fg)' }}>Cart</h2>
          <button
            onClick={handleClose}
            style={{ color: 'var(--fg)' }}
            className="hover:opacity-70 transition-opacity"
            aria-label="Close cart"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <p className="text-body-sm mb-2" style={{ color: 'var(--fg-muted)' }}>Your cart is empty</p>
              <p className="text-body-sm" style={{ color: 'var(--fg-muted)' }}>
                Add items to get started
              </p>
            </div>
          ) : (
            <div className="p-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-4"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  {/* Image */}
                  <div
                    className="w-20 h-20 flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <span className="text-xl" style={{ color: 'var(--accent)', opacity: 0.3 }}>◆</span>
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="text-body-sm font-medium mb-1" style={{ color: 'var(--fg)' }}>
                      {item.name}
                    </h3>
                    <p className="text-body-sm mb-3" style={{ color: 'var(--fg-muted)' }}>
                      {formatTND(item.price * item.quantity)}
                    </p>

                    {/* Quantity Control */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-xs transition-opacity hover:opacity-70"
                        style={{ border: '1px solid var(--border)', color: 'var(--fg)' }}
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-body-sm" style={{ color: 'var(--fg)' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-xs transition-opacity hover:opacity-70"
                        style={{ border: '1px solid var(--border)', color: 'var(--fg)' }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="transition-opacity hover:opacity-70"
                    style={{ color: 'var(--fg-muted)' }}
                    aria-label="Remove item"
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
              <span className="text-body-sm" style={{ color: 'var(--fg)' }}>
                Subtotal:
              </span>
              <span className="text-heading-2" style={{ color: 'var(--accent)' }}>
                {formatTND(totalPrice)}
              </span>
            </div>

            {/* Buttons */}
            <Link href="/checkout">
              <Button
                className="w-full py-4 text-overline"
                style={{ backgroundColor: 'var(--accent)', color: '#0C0A08' }}
              >
                Checkout
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
        )}
      </div>
    </>
  )
}

CartDrawer.displayName = 'CartDrawer'

export { CartDrawer }
