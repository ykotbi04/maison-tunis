'use client'

import React, { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { useCartDrawerOpen, useSetCartDrawerOpen } from '@/lib/stores'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { formatTND } from '@/lib/formatters'

interface CartDrawerProps {
  open?: boolean
  onClose?: () => void
}

const CartDrawer = React.forwardRef<HTMLDivElement, CartDrawerProps>(
  ({ open = false, onClose }, ref) => {
    const { items, removeFromCart, updateQuantity, totalPrice } = useCart()
    const cartDrawerOpen = useCartDrawerOpen()
    const setCartDrawerOpen = useSetCartDrawerOpen()
    const [isOpen, setIsOpen] = useState(open || cartDrawerOpen)

    const handleClose = () => {
      setIsOpen(false)
      setCartDrawerOpen(false)
      onClose?.()
    }

    return (
      <>
        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleClose}
          />
        )}

        {/* Drawer */}
        <div
          ref={ref}
          className={cn(
            'fixed right-0 top-0 h-screen w-full max-w-md bg-background border-l border-border z-50 transition-transform duration-300 flex flex-col',
            isOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-serif text-2xl text-foreground">Cart</h2>
            <button
              onClick={handleClose}
              className="text-foreground hover:text-accent transition-colors"
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
                <p className="text-muted text-sm mb-4">Your cart is empty</p>
                <p className="text-muted text-xs">
                  Add items to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4 p-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-border"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 bg-background-secondary rounded flex-shrink-0 flex items-center justify-center">
                      <span className="text-xl text-accent">◆</span>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="font-serif text-sm text-foreground mb-1">
                        {item.name}
                      </h3>
                      <p className="font-sans text-xs text-muted mb-3">
                        {formatTND(item.price * item.quantity)}
                      </p>

                      {/* Quantity Control */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-6 h-6 flex items-center justify-center border border-border text-foreground hover:border-accent transition-colors text-xs"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-6 h-6 flex items-center justify-center border border-border text-foreground hover:border-accent transition-colors text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-muted hover:text-error transition-colors"
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
            <div className="border-t border-border p-6 space-y-4">
              {/* Total */}
              <div className="flex justify-between items-baseline">
                <span className="text-foreground font-sans text-sm">
                  Subtotal:
                </span>
                <span className="font-serif text-xl text-accent">
                  {formatTND(totalPrice)}
                </span>
              </div>

              {/* Buttons */}
              <Button variant="primary" size="lg" fullWidth className="font-medium">
                Checkout
              </Button>
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                className="font-medium"
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </>
    )
  }
)

CartDrawer.displayName = 'CartDrawer'

export { CartDrawer }
