// Cart Service - Business logic for cart operations

import type { CartItem } from '@/types/cart'
import { SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/constants'

export class CartService {
  static calculateSubtotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  static calculateShipping(subtotal: number): number {
    return subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  }

  static calculateTax(subtotal: number, taxRate: number = 0.19): number {
    return subtotal * taxRate
  }

  static calculateTotal(items: CartItem[]): number {
    const subtotal = this.calculateSubtotal(items)
    const shipping = this.calculateShipping(subtotal)
    const tax = this.calculateTax(subtotal)
    return subtotal + shipping + tax
  }

  static getOrderSummary(items: CartItem[]) {
    const subtotal = this.calculateSubtotal(items)
    const shipping = this.calculateShipping(subtotal)
    const tax = this.calculateTax(subtotal)
    const total = subtotal + shipping + tax

    return {
      subtotal,
      shipping,
      tax,
      total,
      qualifiesForFreeShipping: subtotal >= SHIPPING_THRESHOLD,
      amountUntilFreeShipping: Math.max(0, SHIPPING_THRESHOLD - subtotal),
    }
  }

  static mergeItems(items: CartItem[]): CartItem[] {
    const merged: CartItem[] = []
    const itemMap = new Map<string, CartItem>()

    items.forEach((item) => {
      const existing = itemMap.get(item.id)
      if (existing) {
        itemMap.set(item.id, {
          ...existing,
          quantity: existing.quantity + item.quantity,
        })
      } else {
        itemMap.set(item.id, { ...item })
      }
    })

    return Array.from(itemMap.values())
  }

  static validateItem(item: CartItem): { valid: boolean; error?: string } {
    if (!item.id) {
      return { valid: false, error: 'Item ID is required' }
    }
    if (!item.name) {
      return { valid: false, error: 'Item name is required' }
    }
    if (item.price <= 0) {
      return { valid: false, error: 'Price must be greater than 0' }
    }
    if (item.quantity < 1) {
      return { valid: false, error: 'Quantity must be at least 1' }
    }
    return { valid: true }
  }
}
