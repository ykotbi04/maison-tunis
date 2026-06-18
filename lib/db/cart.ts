import { prisma } from '@/lib/prisma'
import { mapCartItems, mapGuestCartItem } from '@/lib/mappers/cart'
import type { CartItem } from '@/types/cart'

const cartInclude = {
  product: {
    include: {
      category: true,
    },
  },
} as const

export async function getUserCart(userId: string): Promise<CartItem[]> {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: cartInclude,
    orderBy: { id: 'asc' },
  })

  return mapCartItems(items)
}

export async function addCartItem(userId: string, item: CartItem): Promise<CartItem[]> {
  const size = item.size ?? 'One Size'
  const color = item.color ?? 'Default'

  const product = await prisma.product.findUnique({ where: { id: item.id } })
  if (!product || !product.inStock) {
    throw new Error('Product unavailable')
  }

  await prisma.$transaction(async (tx) => {
    const existing = await tx.cartItem.findUnique({
      where: {
        userId_productId_size_color: {
          userId,
          productId: item.id,
          size,
          color,
        },
      },
    })

    if (existing) {
      await tx.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + item.quantity },
      })
      return
    }

    await tx.cartItem.create({
      data: {
        userId,
        productId: item.id,
        quantity: item.quantity,
        size,
        color,
      },
    })
  })

  return getUserCart(userId)
}

export async function updateCartItemQuantity(
  userId: string,
  itemId: string,
  quantity: number
): Promise<CartItem[]> {
  await prisma.$transaction(async (tx) => {
    const item = await tx.cartItem.findFirst({
      where: { id: itemId, userId },
    })

    if (!item) {
      throw new Error('Cart item not found')
    }

    if (quantity <= 0) {
      await tx.cartItem.deleteMany({ where: { id: itemId, userId } })
      return
    }

    await tx.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    })
  })

  return getUserCart(userId)
}

export async function removeCartItem(userId: string, itemId: string): Promise<CartItem[]> {
  await prisma.$transaction(async (tx) => {
    await tx.cartItem.deleteMany({
      where: { id: itemId, userId },
    })
  })

  return getUserCart(userId)
}

export async function clearUserCart(userId: string): Promise<CartItem[]> {
  await prisma.$transaction(async (tx) => {
    await tx.cartItem.deleteMany({ where: { userId } })
  })

  return []
}

export async function syncGuestCart(
  userId: string,
  guestItems: CartItem[]
): Promise<CartItem[]> {
  await prisma.$transaction(async (tx) => {
    for (const guestItem of guestItems) {
      const mapped = mapGuestCartItem(guestItem)
      const existing = await tx.cartItem.findUnique({
        where: {
          userId_productId_size_color: {
            userId,
            productId: mapped.productId,
            size: mapped.size,
            color: mapped.color,
          },
        },
      })

      if (existing) {
        await tx.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + mapped.quantity },
        })
      } else {
        const product = await tx.product.findUnique({
          where: { id: mapped.productId },
        })

        if (product) {
          await tx.cartItem.create({
            data: {
              userId,
              productId: mapped.productId,
              quantity: mapped.quantity,
              size: mapped.size,
              color: mapped.color,
            },
          })
        }
      }
    }
  })

  return getUserCart(userId)
}
