// Cart Types

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image?: string
}

export interface CartState {
  items: CartItem[]
}

export interface CartActions {
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export interface CartSelectors {
  getTotalPrice: () => number
  getTotalItems: () => number
  getItemById: (id: string) => CartItem | undefined
  hasItem: (id: string) => boolean
}
