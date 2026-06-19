// Product Types

export interface Product {
  id: string
  name: string
  category: string
  categorySlug: string
  gender: string
  price: number // in TND
  description: string
  longDescription: string
  image: string
  images: string[]
  color: string
  colors: string[]
  size: string
  sizes: string[]
  material: string
  care: string
  inStock: boolean
  stock?: number
  isNew: boolean
  isLimited: boolean
  limitedQty?: number
  rating: number
  reviews: number
  sku: string
  heritage?: string // story/cultural significance
}

export interface Category {
  slug: string
  name: string
  description: string
  image: string
}

export interface ProductFilter {
  categorySlug?: string
  searchQuery?: string
  inStockOnly?: boolean
  priceRange?: {
    min: number
    max: number
  }
  sortBy?: 'newest' | 'price-low' | 'price-high' | 'rating'
}

export interface ProductVariant {
  productId: string
  color: string
  size: string
}
