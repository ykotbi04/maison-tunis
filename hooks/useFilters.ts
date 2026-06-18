// Filters Hook - Product filtering state management

import { useState, useCallback } from 'react'
import type { ProductFilter } from '@/types/product'

export function useFilters() {
  const [filter, setFilter] = useState<ProductFilter>({
    sortBy: 'newest',
    inStockOnly: false,
    priceRange: { min: 0, max: 6000 },
  })

  const setSortBy = useCallback((sortBy: ProductFilter['sortBy']) => {
    setFilter((prev) => ({ ...prev, sortBy }))
  }, [])

  const setInStockOnly = useCallback((inStockOnly: boolean) => {
    setFilter((prev) => ({ ...prev, inStockOnly }))
  }, [])

  const setPriceRange = useCallback((priceRange: { min: number; max: number }) => {
    setFilter((prev) => ({ ...prev, priceRange }))
  }, [])

  const setCategory = useCallback((categorySlug: string) => {
    setFilter((prev) => ({ ...prev, categorySlug }))
  }, [])

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilter((prev) => ({ ...prev, searchQuery }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilter({
      sortBy: 'newest',
      inStockOnly: false,
      priceRange: { min: 0, max: 6000 },
      searchQuery: '',
    })
  }, [])

  return {
    filter,
    setSortBy,
    setInStockOnly,
    setPriceRange,
    setCategory,
    setSearchQuery,
    resetFilters,
  }
}
