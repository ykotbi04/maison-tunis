// Centralized Validation Logic

import type { ShippingFormData } from '@/types/checkout'

export interface ValidationResult {
  isValid: boolean
  error: string
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { isValid: false, error: 'Invalid email format' }
  }
  return { isValid: true, error: '' }
}

export const validatePhone = (phone: string): ValidationResult => {
  if (!phone.trim()) {
    return { isValid: false, error: 'Phone number is required' }
  }
  const cleanedPhone = phone.replace(/[\s\-\+]/g, '')
  if (!/^\d{8,}$/.test(cleanedPhone)) {
    return { isValid: false, error: 'Invalid phone number' }
  }
  return { isValid: true, error: '' }
}

export const validateName = (name: string, fieldName: string = 'Name'): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: `${fieldName} is required` }
  }
  if (name.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters` }
  }
  return { isValid: true, error: '' }
}

export const validateAddress = (address: string): ValidationResult => {
  if (!address.trim()) {
    return { isValid: false, error: 'Address is required' }
  }
  if (address.length < 5) {
    return { isValid: false, error: 'Address must be at least 5 characters' }
  }
  return { isValid: true, error: '' }
}

export const validateCity = (city: string): ValidationResult => {
  if (!city.trim()) {
    return { isValid: false, error: 'City is required' }
  }
  return { isValid: true, error: '' }
}

export const validateState = (state: string): ValidationResult => {
  if (!state.trim()) {
    return { isValid: false, error: 'State/Region is required' }
  }
  return { isValid: true, error: '' }
}

export const validatePostalCode = (postalCode: string): ValidationResult => {
  if (!postalCode.trim()) {
    return { isValid: false, error: 'Postal code is required' }
  }
  const cleanedPostalCode = postalCode.replace(/[\s\-]/g, '')
  if (!/^\d{4,}$/.test(cleanedPostalCode)) {
    return { isValid: false, error: 'Invalid postal code' }
  }
  return { isValid: true, error: '' }
}

export const validateCountry = (country: string): ValidationResult => {
  if (!country.trim()) {
    return { isValid: false, error: 'Country is required' }
  }
  return { isValid: true, error: '' }
}

export const validateQuantity = (quantity: number): ValidationResult => {
  if (quantity < 1) {
    return { isValid: false, error: 'Quantity must be at least 1' }
  }
  if (quantity > 20) {
    return { isValid: false, error: 'Maximum quantity is 20 per order' }
  }
  return { isValid: true, error: '' }
}

export const validateShippingForm = (data: ShippingFormData): Record<string, string> => {
  const errors: Record<string, string> = {}

  const firstNameResult = validateName(data.firstName, 'First Name')
  if (!firstNameResult.isValid) errors.firstName = firstNameResult.error

  const lastNameResult = validateName(data.lastName, 'Last Name')
  if (!lastNameResult.isValid) errors.lastName = lastNameResult.error

  const emailResult = validateEmail(data.email)
  if (!emailResult.isValid) errors.email = emailResult.error

  const phoneResult = validatePhone(data.phone)
  if (!phoneResult.isValid) errors.phone = phoneResult.error

  const addressResult = validateAddress(data.address)
  if (!addressResult.isValid) errors.address = addressResult.error

  const cityResult = validateCity(data.city)
  if (!cityResult.isValid) errors.city = cityResult.error

  const stateResult = validateState(data.state)
  if (!stateResult.isValid) errors.state = stateResult.error

  const postalCodeResult = validatePostalCode(data.postalCode)
  if (!postalCodeResult.isValid) errors.postalCode = postalCodeResult.error

  const countryResult = validateCountry(data.country)
  if (!countryResult.isValid) errors.country = countryResult.error

  return errors
}

export const isFormValid = (errors: Record<string, string>): boolean => {
  return Object.keys(errors).length === 0
}
