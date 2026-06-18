import type { Order as DbOrder, OrderItem as DbOrderItem, Product as DbProduct, Category as DbCategory } from '@prisma/client'
import type { Order } from '@/types/checkout'
import type { CartItem } from '@/types/cart'

type OrderWithItems = DbOrder & {
  items: (DbOrderItem & {
    product: DbProduct & { category: DbCategory }
  })[]
}

export function mapOrder(order: OrderWithItems): Order {
  const items: CartItem[] = order.items.map((item) => ({
    id: item.productId,
    name: item.product.name,
    price: Number(item.priceSnapshot),
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    image: item.product.image,
  }))

  return {
    id: order.id,
    userId: order.userId,
    items,
    shipping: {
      firstName: order.shippingFirstName,
      lastName: order.shippingLastName,
      email: order.shippingEmail,
      phone: order.shippingPhone,
      address: order.shippingAddress,
      city: order.shippingCity,
      state: order.shippingState,
      postalCode: order.shippingPostalCode,
      country: order.shippingCountry,
    },
    payment: {
      method: (order.paymentMethod as 'credit-card' | 'paypal' | 'bank-transfer') ?? 'credit-card',
    },
    subtotal: Number(order.subtotal),
    shippingCost: Number(order.shippingCost),
    tax: Number(order.tax),
    total: Number(order.total),
    status: order.status.toLowerCase() as Order['status'],
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }
}
