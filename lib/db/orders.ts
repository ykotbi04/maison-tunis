import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { mapOrder } from '@/lib/mappers/order'
import type { Order } from '@/types/checkout'
import type { CartItem } from '@/types/cart'
import { SHIPPING_COST, SHIPPING_THRESHOLD, TAX_RATE } from '@/lib/constants'

function calculateTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const tax = subtotal * TAX_RATE
  const total = subtotal + shippingCost + tax

  return { subtotal, shippingCost, tax, total }
}

async function resolveCartItemsFromDb(
  items: CartItem[],
  tx: Prisma.TransactionClient
): Promise<CartItem[]> {
  const productIds = [...new Set(items.map((item) => item.id))]
  const products = await tx.product.findMany({
    where: { id: { in: productIds } },
  })
  const productMap = new Map(products.map((product) => [product.id, product]))

  return items.map((item) => {
    const product = productMap.get(item.id)
    if (!product || !product.inStock) {
      throw new Error(`Product unavailable: ${item.name || item.id}`)
    }

    return {
      id: item.id,
      name: product.name,
      price: Number(product.price),
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      image: product.image,
    }
  })
}

export async function createOrderFromCheckout(
  userId: string,
  data: {
    shipping: Order['shipping']
    payment: Order['payment']
    items: CartItem[]
  }
): Promise<Order> {
  const order = await prisma.$transaction(async (tx) => {
    const resolvedItems = await resolveCartItemsFromDb(data.items, tx)
    const { subtotal, shippingCost, tax, total } = calculateTotals(resolvedItems)

    const created = await tx.order.create({
      data: {
        userId,
        status: 'PENDING',
        subtotal,
        shippingCost,
        tax,
        total,
        shippingFirstName: data.shipping.firstName,
        shippingLastName: data.shipping.lastName,
        shippingEmail: data.shipping.email,
        shippingPhone: data.shipping.phone,
        shippingAddress: data.shipping.address,
        shippingCity: data.shipping.city,
        shippingState: data.shipping.state,
        shippingPostalCode: data.shipping.postalCode,
        shippingCountry: data.shipping.country,
        paymentMethod: data.payment.method,
        items: {
          create: resolvedItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            priceSnapshot: item.price,
            size: item.size ?? 'One Size',
            color: item.color ?? 'Default',
          })),
        },
      },
      include: {
        items: {
          include: {
            product: { include: { category: true } },
          },
        },
      },
    })

    await tx.cartItem.deleteMany({ where: { userId } })

    return created
  })

  return mapOrder(order)
}

export async function getOrderById(orderId: string, userId?: string): Promise<Order | null> {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      ...(userId ? { userId } : {}),
    },
    include: {
      items: {
        include: {
          product: { include: { category: true } },
        },
      },
    },
  })

  return order ? mapOrder(order) : null
}
