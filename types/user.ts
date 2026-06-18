// User Types

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
}

export interface UserAddress {
  id: string
  userId: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  isDefault: boolean
}

export interface UserProfile extends User {
  addresses: UserAddress[]
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface WishlistItem {
  productId: string
  addedAt: Date
}
