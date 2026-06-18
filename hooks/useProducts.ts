'use client'

import { useEffect, useMemo, useState } from 'react'
import { productsApi } from '@/lib/api'
import type { Product, ProductFilter } from '@/types/product'

function applyClientSort(products: Product[], sortBy?: ProductFilter['sortBy']): Product[] {
  const result = [...products]

  switch (sortBy) {
    case 'price-low':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      result.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'newest':
    default:
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
      break
  }

  return result
}

export function useProducts(filter?: ProductFilter) {
  const [products, setProducts] = useState<Product[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debouncedSearch, setDebouncedSearch] = useState(filter?.searchQuery ?? '')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filter?.searchQuery ?? '')
    }, 300)

    return () => clearTimeout(timer)
  }, [filter?.searchQuery])

  const searchParams = useMemo(
    () => ({
      query: debouncedSearch,
      category: filter?.categorySlug,
      priceMin: filter?.priceRange?.min,
      priceMax: filter?.priceRange?.max,
      inStockOnly: filter?.inStockOnly,
    }),
    [
      debouncedSearch,
      filter?.categorySlug,
      filter?.priceRange?.min,
      filter?.priceRange?.max,
      filter?.inStockOnly,
    ]
  )

  useEffect(() => {
    let active = true

    void (async () => {
      try {
        setLoading(true)
        const result = await productsApi.search({
          query: searchParams.query,
          category: searchParams.category,
          priceMin: searchParams.priceMin,
          priceMax: searchParams.priceMax,
          inStockOnly: searchParams.inStockOnly,
          page: 1,
          limit: 100,
        })

        if (active) {
          setProducts(result.data)
          setTotalProducts(result.total)
          setError(null)
        }
      } catch {
        if (active) {
          setError('Failed to load products')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    })()

    return () => {
      active = false
    }
  }, [searchParams])

  const sortedProducts = useMemo(
    () => applyClientSort(products, filter?.sortBy),
    [products, filter?.sortBy]
  )

  return {
    products: sortedProducts,
    totalProducts,
    filteredCount: sortedProducts.length,
    loading,
    error,
  }
}

export function useProductsByGenderAndCategory(gender: 'MEN' | 'WOMEN', categorySlug?: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const params = new URLSearchParams({ gender })
    if (categorySlug) {
      params.set('category', categorySlug)
    }

    void (async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        if (active) {
          setProducts(Array.isArray(data) ? data : data.data ?? [])
        }
      } catch {
        if (active) {
          setProducts([])
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    })()

    return () => {
      active = false
    }
  }, [gender, categorySlug])

  return { products, loading }
}
