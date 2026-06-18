// Checkout Hook - Checkout form and validation logic

import { useState, useCallback } from 'react'
import type { ShippingFormData, FormErrors, FormTouched, CheckoutStep } from '@/types/checkout'
import { validateShippingForm, isFormValid } from '@/lib/validators'

export function useCheckout() {
  const [step, setStep] = useState<CheckoutStep>('shipping')
  const [formData, setFormData] = useState<ShippingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<FormTouched>({})

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
      
      // Clear error for this field if it starts being corrected
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }))
      }
    },
    [errors]
  )

  const handleFieldBlur = useCallback(
    (fieldName: string) => {
      setTouched((prev) => ({ ...prev, [fieldName]: true }))
      // Validate the entire form on blur to catch cross-field dependencies
      const validationErrors = validateShippingForm(formData)
      setErrors((prev) => ({ ...prev, [fieldName]: validationErrors[fieldName] || '' }))
    },
    [formData]
  )

  const validateCurrentStep = useCallback((): boolean => {
    if (step === 'shipping') {
      const validationErrors = validateShippingForm(formData)
      setErrors(validationErrors)
      return isFormValid(validationErrors)
    }
    return true
  }, [step, formData])

  const nextStep = useCallback(() => {
    if (validateCurrentStep()) {
      setStep((prev) => {
        if (prev === 'shipping') return 'payment'
        if (prev === 'payment') return 'confirmation'
        return prev
      })
    }
  }, [validateCurrentStep])

  const prevStep = useCallback(() => {
    setStep((prev) => {
      if (prev === 'payment') return 'shipping'
      if (prev === 'confirmation') return 'payment'
      return prev
    })
  }, [])

  const resetCheckout = useCallback(() => {
    setStep('shipping')
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    })
    setErrors({})
    setTouched({})
  }, [])

  return {
    step,
    formData,
    errors,
    touched,
    handleInputChange,
    handleFieldBlur,
    nextStep,
    prevStep,
    resetCheckout,
    isValid: isFormValid(errors),
  }
}
