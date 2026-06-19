// Centralized API Layer

import type { ApiResponse, ApiError, PaginatedResponse, SearchParams } from '@/types/api'
import type { AdminDashboardData } from '@/types/admin'
import type { Product, Category } from '@/types/product'
import type { ProductCreateInput } from '@/lib/schemas/api'
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

  async patch<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
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

export interface AdminProduct {
  id: string
  name: string
  category: string
  categorySlug: string
  price: number
  gender: string
  inStock: boolean
  isNew: boolean
  isLimited: boolean
  image: string
  sku: string
}

export interface AdminOrder {
  id: string
  shortId: string
  customer: { id: string; name: string; email: string }
  items: Array<{
    name: string
    image: string
    quantity: number
    price: number
    size: string
    color: string
  }>
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  status: string
  shipping: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  paymentMethod: string | null
  createdAt: string
  updatedAt: string
}

export interface AdminCategory {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
  createdAt: string
}

export const adminApi = {
  getDashboard: async (): Promise<AdminDashboardData> => {
    const response = await api.get<AdminDashboardData>('/admin/dashboard')
    return response.data
  },

  getProducts: async (params?: {
    page?: number
    limit?: number
    search?: string
    category?: string
    gender?: string
    inStock?: string
  }): Promise<{ data: AdminProduct[]; total: number; page: number; limit: number; totalPages: number }> => {
    const query = new URLSearchParams()
    if (params?.page) query.set('page', params.page.toString())
    if (params?.limit) query.set('limit', params.limit.toString())
    if (params?.search) query.set('search', params.search)
    if (params?.category) query.set('category', params.category)
    if (params?.gender) query.set('gender', params.gender)
    if (params?.inStock) query.set('inStock', params.inStock)
    const response = await api.get<{ data: AdminProduct[]; total: number; page: number; limit: number; totalPages: number }>(`/admin/products?${query.toString()}`)
    return response.data
  },

  createProduct: async (data: ProductCreateInput): Promise<Product> => {
    const response = await api.post<Product>('/products', data)
    return response.data
  },

  updateProduct: async (id: string, data: Partial<ProductCreateInput>): Promise<Product> => {
    const response = await api.patch<Product>(`/admin/products/${id}`, data)
    return response.data
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/admin/products/${id}`)
  },

  getOrders: async (params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
  }): Promise<{ data: AdminOrder[]; total: number; page: number; limit: number; totalPages: number }> => {
    const query = new URLSearchParams()
    if (params?.page) query.set('page', params.page.toString())
    if (params?.limit) query.set('limit', params.limit.toString())
    if (params?.status) query.set('status', params.status)
    if (params?.search) query.set('search', params.search)
    const response = await api.get<{ data: AdminOrder[]; total: number; page: number; limit: number; totalPages: number }>(`/admin/orders?${query.toString()}`)
    return response.data
  },

  updateOrderStatus: async (id: string, status: string): Promise<{ id: string; status: string; updatedAt: string }> => {
    const response = await api.patch<{ id: string; status: string; updatedAt: string }>(`/admin/orders/${id}`, { status })
    return response.data
  },

  getCategories: async (): Promise<AdminCategory[]> => {
    const response = await api.get<AdminCategory[]>('/admin/categories')
    return response.data
  },

  createCategory: async (data: { name: string; slug: string; description?: string; image?: string }): Promise<AdminCategory> => {
    const response = await api.post<AdminCategory>('/admin/categories', data)
    return response.data
  },

  updateCategory: async (id: string, data: { name?: string; slug?: string; description?: string; image?: string }): Promise<AdminCategory> => {
    const response = await api.patch<AdminCategory>(`/admin/categories/${id}`, data)
    return response.data
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/admin/categories/${id}`)
  },
}

export interface CustomerOrder {
  id: string
  shortId: string
  items: Array<{
    name: string
    image: string
    quantity: number
    price: number
    size: string
    color: string
  }>
  total: number
  status: string
  createdAt: string
}

export const accountApi = {
  getOrders: async (params?: {
    page?: number
    limit?: number
  }): Promise<{ data: CustomerOrder[]; total: number; page: number; limit: number; totalPages: number }> => {
    const query = new URLSearchParams()
    if (params?.page) query.set('page', params.page.toString())
    if (params?.limit) query.set('limit', params.limit.toString())
    const response = await api.get<{ data: CustomerOrder[]; total: number; page: number; limit: number; totalPages: number }>(`/account/orders?${query.toString()}`)
    return response.data
  },

  updateProfile: async (data: { name?: string; email?: string }): Promise<{ id: string; name: string; email: string; role: string }> => {
    const response = await api.patch<{ id: string; name: string; email: string; role: string }>('/account/profile', data)
    return response.data
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/account/password', data)
    return response.data
  },

  getWishlistProducts: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/wishlist')
    return response.data
  },
}

export default api
