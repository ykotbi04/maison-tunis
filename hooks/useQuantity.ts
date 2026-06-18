// Quantity Hook - Quantity selection logic

import { useState, useCallback } from 'react'
import { validateQuantity } from '@/lib/validators'
import { MAX_QUANTITY_PER_ORDER, MIN_QUANTITY_PER_ORDER } from '@/lib/constants'

export function useQuantity(initialQuantity: number = 1) {
  const [quantity, setQuantity] = useState(initialQuantity)
  const [error, setError] = useState('')

  const increase = useCallback(() => {
    const newQuantity = Math.min(quantity + 1, MAX_QUANTITY_PER_ORDER)
    setQuantity(newQuantity)
    setError('')
  }, [quantity])

  const decrease = useCallback(() => {
    const newQuantity = Math.max(quantity - 1, MIN_QUANTITY_PER_ORDER)
    setQuantity(newQuantity)
    setError('')
  }, [quantity])

  const setQuantityValue = useCallback(
    (value: number) => {
      const validation = validateQuantity(value)
      if (!validation.isValid) {
        setError(validation.error)
        return
      }
      setError('')
      setQuantity(Math.min(Math.max(value, MIN_QUANTITY_PER_ORDER), MAX_QUANTITY_PER_ORDER))
    },
    []
  )

  const reset = useCallback(() => {
    setQuantity(initialQuantity)
    setError('')
  }, [initialQuantity])

  return {
    quantity,
    error,
    increase,
    decrease,
    setQuantity: setQuantityValue,
    reset,
    canIncrease: quantity < MAX_QUANTITY_PER_ORDER,
    canDecrease: quantity > MIN_QUANTITY_PER_ORDER,
  }
}
