// Centralized API Layer

import type { ApiResponse, ApiError, PaginatedResponse, SearchParams } from '@/types/api'
import type { AdminDashboardData } from '@/types/admin'
import type { Product, Category } from '@/types/product'
import type { CartItem } from '@/types/cart'
import type { Order } from '@/types/checkout'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const defaultOptions: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, { ...defaultOptions, ...options })
      
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({
          message: 'An error occurred',
        }))
        throw {
          message: errorBody.error || errorBody.message || 'An error occurred',
          details: errorBody.details,
        } satisfies ApiError
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      const apiError: ApiError = error instanceof Error 
        ? { message: error.message }
        : { message: 'An unknown error occurred' }
      throw apiError
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  async put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

const api = new ApiClient()

// Product API
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products')
    return response.data
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`)
    return response.data
  },

  getByCategory: async (categorySlug: string): Promise<Product[]> => {
    const response = await api.get<Product[]>(`/products?category=${categorySlug}`)
    return response.data
  },

  search: async (params: SearchParams): Promise<PaginatedResponse<Product>> => {
    const queryParams: Record<string, string> = {
      query: params.query,
      ...(params.category && { category: params.category }),
      ...(params.priceMin !== undefined && { priceMin: params.priceMin.toString() }),
      ...(params.priceMax !== undefined && { priceMax: params.priceMax.toString() }),
      ...(params.inStockOnly !== undefined && { inStockOnly: params.inStockOnly.toString() }),
      ...(params.page !== undefined && { page: params.page.toString() }),
      ...(params.limit !== undefined && { limit: params.limit.toString() }),
    }
    const queryString = new URLSearchParams(queryParams).toString()
    const response = await api.get<PaginatedResponse<Product>>(`/products/search?${queryString}`)
    return response.data
  },
}

// Category API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories')
    return response.data
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${slug}`)
    return response.data
  },
}

// Cart API
export const cartApi = {
  get: async (): Promise<CartItem[]> => {
    const response = await api.get<CartItem[]>('/cart')
    return response.data
  },

  addItem: async (item: CartItem): Promise<CartItem[]> => {
    const response = await api.post<CartItem[]>('/cart/items', item)
    return response.data
  },

  updateItem: async (id: string, quantity: number): Promise<CartItem[]> => {
    const response = await api.put<CartItem[]>(`/cart/items/${id}`, { quantity })
    return response.data
  },

  removeItem: async (id: string): Promise<CartItem[]> => {
    const response = await api.delete<CartItem[]>(`/cart/items/${id}`)
    return response.data
  },

  clear: async (): Promise<CartItem[]> => {
    const response = await api.delete<CartItem[]>('/cart')
    return response.data
  },
}

// Checkout API
export const checkoutApi = {
  createOrder: async (data: unknown): Promise<Order> => {
    const response = await api.post<Order>('/checkout', data)
    return response.data
  },

  getOrder: async (orderId: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${orderId}`)
    return response.data
  },
}

export const adminApi = {
  getDashboard: async (): Promise<AdminDashboardData> => {
    const response = await api.get<AdminDashboardData>('/admin/dashboard')
    return response.data
  },
}

export default api
