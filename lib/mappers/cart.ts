import type { CartItem as DbCartItem, Product as DbProduct, Category as DbCategory } from '@prisma/client'
import type { CartItem } from '@/types/cart'

type CartItemWithProduct = DbCartItem & {
  product: DbProduct & { category: DbCategory }
}

export function mapCartItem(item: CartItemWithProduct): CartItem {
  return {
    id: item.id,
    name: item.product.name,
    price: Number(item.product.price),
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    image: item.product.image,
  }
}

export function mapCartItems(items: CartItemWithProduct[]): CartItem[] {
  return items.map(mapCartItem)
}

export function mapGuestCartItem(item: CartItem): {
  productId: string
  quantity: number
  size: string
  color: string
} {
  return {
    productId: item.id,
    quantity: item.quantity,
    size: item.size ?? 'One Size',
    color: item.color ?? 'Default',
  }
}
