import { useState, useCallback } from 'react'
import type { ShippingFormData, PaymentFormData, FormErrors, FormTouched, CheckoutStep } from '@/types/checkout'
import { validateShippingForm, validatePaymentForm, isFormValid } from '@/lib/validators'

export function useCheckout() {
  const [step, setStep] = useState<CheckoutStep>('shipping')
  const [shippingData, setShippingData] = useState<ShippingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  })
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    method: 'credit-card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<FormTouched>({})

  const handleShippingChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setShippingData((prev) => ({ ...prev, [name]: value }))
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }))
      }
    },
    [errors]
  )

  const handlePaymentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setPaymentData((prev) => ({ ...prev, [name]: value }))
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }))
      }
    },
    [errors]
  )

  const handlePaymentMethodChange = useCallback((method: 'credit-card' | 'bank-transfer') => {
    setPaymentData((prev) => ({ ...prev, method }))
  }, [])

  const handleFieldBlur = useCallback(
    (fieldName: string) => {
      setTouched((prev) => ({ ...prev, [fieldName]: true }))
      if (step === 'shipping') {
        const validationErrors = validateShippingForm(shippingData)
        setErrors((prev) => ({ ...prev, [fieldName]: validationErrors[fieldName] || '' }))
      } else if (step === 'payment') {
        const validationErrors = validatePaymentForm(paymentData)
        setErrors((prev) => ({ ...prev, [fieldName]: validationErrors[fieldName] || '' }))
      }
    },
    [shippingData, paymentData, step]
  )

  const validateCurrentStep = useCallback((): boolean => {
    if (step === 'shipping') {
      const validationErrors = validateShippingForm(shippingData)
      setErrors(validationErrors)
      return isFormValid(validationErrors)
    }
    if (step === 'payment') {
      const validationErrors = validatePaymentForm(paymentData)
      setErrors(validationErrors)
      return isFormValid(validationErrors)
    }
    return true
  }, [step, shippingData, paymentData])

  const nextStep = useCallback(() => {
    if (validateCurrentStep()) {
      setStep((prev) => {
        if (prev === 'shipping') return 'payment'
        if (prev === 'payment') return 'confirmation'
        return prev
      })
      setErrors({})
    }
  }, [validateCurrentStep])

  const prevStep = useCallback(() => {
    setStep((prev) => {
      if (prev === 'payment') return 'shipping'
      if (prev === 'confirmation') return 'payment'
      return prev
    })
    setErrors({})
  }, [])

  const resetCheckout = useCallback(() => {
    setStep('shipping')
    setShippingData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
    })
    setPaymentData({
      method: 'credit-card',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
    })
    setErrors({})
    setTouched({})
  }, [])

  return {
    step,
    shippingData,
    paymentData,
    errors,
    touched,
    handleShippingChange,
    handlePaymentChange,
    handlePaymentMethodChange,
    handleFieldBlur,
    nextStep,
    prevStep,
    resetCheckout,
    isValid: isFormValid(errors),
  }
}
