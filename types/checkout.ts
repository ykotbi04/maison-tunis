// Checkout Types

import type { CartItem } from '@/types/cart'
export interface ShippingFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
}

export interface PaymentFormData {
  method: 'credit-card' | 'bank-transfer'
  cardNumber: string
  cardExpiry: string
  cardCvc: string
}

export interface CheckoutFormData extends ShippingFormData, PaymentFormData {}

export interface FormErrors {
  [key: string]: string
}

export interface FormTouched {
  [key: string]: boolean
}

export type CheckoutStep = 'shipping' | 'payment' | 'confirmation'

export interface Order {
  id: string
  userId?: string
  items: CartItem[]
  shipping: ShippingFormData
  payment: PaymentFormData
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

export interface OrderSummary {
  subtotal: number
  shipping: number
  tax: number
  total: number
}
