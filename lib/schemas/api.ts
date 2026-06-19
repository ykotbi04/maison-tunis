import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const cartItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().min(1).max(20),
  size: z.string().optional(),
  color: z.string().optional(),
  image: z.string().optional(),
})

export const cartItemUpdateSchema = z.object({
  quantity: z.number().int().min(1).max(20),
})

export const cartSyncSchema = z.object({
  items: z.array(cartItemSchema),
})

export const wishlistSyncSchema = z.object({
  productIds: z.array(z.string().min(1)),
})

export const wishlistItemSchema = z.object({
  productId: z.string().min(1),
})

export const productSearchQuerySchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  gender: z.enum(['MEN', 'WOMEN', 'UNISEX']).optional(),
  priceMin: z.coerce.number().nonnegative().optional(),
  priceMax: z.coerce.number().nonnegative().optional(),
  inStockOnly: z
    .enum(['true', 'false'])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === 'true')),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(24),
})

export const productCreateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  categorySlug: z.string().min(1),
  gender: z.enum(['MEN', 'WOMEN', 'UNISEX']),
  price: z.number().positive(),
  description: z.string().min(1),
  longDescription: z.string().min(1),
  image: z.string().min(1),
  images: z.array(z.string()).min(1),
  color: z.string().min(1),
  colors: z.array(z.string()).min(1),
  size: z.string().min(1),
  sizes: z.array(z.string()).min(1),
  material: z.string().min(1),
  care: z.string().min(1),
  inStock: z.boolean().default(true),
  stock: z.number().int().optional(),
  isNew: z.boolean().default(false),
  isLimited: z.boolean().default(false),
  limitedQty: z.number().int().optional(),
  rating: z.number().min(0).max(5).default(0),
  reviews: z.number().int().min(0).default(0),
  sku: z.string().min(1),
  heritage: z.string().optional(),
})

export const checkoutSchema = z.object({
  shipping: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
  }),
  payment: z.object({
    method: z.enum(['credit-card', 'paypal', 'bank-transfer']),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvc: z.string().optional(),
  }),
  items: z.array(cartItemSchema).min(1).optional(),
})

export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CartItemInput = z.infer<typeof cartItemSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type ProductCreateInput = z.infer<typeof productCreateSchema>
