// API Types

export interface ApiResponse<T> {
  data: T
  error?: string
  message?: string
}

export interface ApiError {
  message: string
  code?: string
  details?: unknown
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface SearchParams {
  query: string
  category?: string
  priceMin?: number
  priceMax?: number
  inStockOnly?: boolean
  page?: number
  limit?: number
}
