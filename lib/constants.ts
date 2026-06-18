// Centralized Constants

export const APP_NAME = 'MAISON TUNIS'
export const APP_DESCRIPTION = 'Discover premium Tunisian haute couture and luxury fashion collections'

export const CURRENCY = 'TND'
export const CURRENCY_SYMBOL = 'د.ت'

export const SHIPPING_THRESHOLD = 100 // Free shipping over 100 TND
export const SHIPPING_COST = 15 // Default shipping cost

export const TAX_RATE = 0.19 // 19% VAT

export const MAX_QUANTITY_PER_ORDER = 20
export const MIN_QUANTITY_PER_ORDER = 1

export const PRODUCTS_PER_PAGE = 12
export const PRODUCTS_PER_ROW = {
  mobile: 1,
  tablet: 2,
  desktop: 3,
  largeDesktop: 4,
} as const

export const IMAGE_SIZES = {
  thumbnail: { width: 100, height: 100 },
  card: { width: 400, height: 400 },
  detail: { width: 800, height: 1000 },
  hero: { width: 1200, height: 675 },
} as const

export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
} as const

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export const ROUTES = {
  home: '/',
  shop: '/shop',
  cart: '/cart',
  checkout: '/checkout',
  login: '/login',
  register: '/register',
  admin: '/admin',
} as const

export const API_ENDPOINTS = {
  products: '/api/products',
  categories: '/api/categories',
  cart: '/api/cart',
  checkout: '/api/checkout',
  orders: '/api/orders',
  user: '/api/user',
} as const

export const LOCAL_STORAGE_KEYS = {
  cart: 'maison-tunis-cart',
  wishlist: 'maison-tunis-wishlist',
  user: 'maison-tunis-user',
} as const

export const SESSION_STORAGE_KEYS = {
  checkoutStep: 'maison-tunis-checkout-step',
  checkoutData: 'maison-tunis-checkout-data',
} as const

export const ERROR_MESSAGES = {
  PRODUCT_NOT_FOUND: 'Product not found',
  CATEGORY_NOT_FOUND: 'Category not found',
  CART_EMPTY: 'Your cart is empty',
  CHECKOUT_FAILED: 'Checkout failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
} as const

export const SUCCESS_MESSAGES = {
  ADDED_TO_CART: 'Added to cart',
  REMOVED_FROM_CART: 'Removed from cart',
  ORDER_PLACED: 'Order placed successfully',
} as const
