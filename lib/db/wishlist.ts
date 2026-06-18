import { prisma } from '@/lib/prisma'

export async function getUserWishlistProductIds(userId: string): Promise<string[]> {
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    select: { productId: true },
    orderBy: { createdAt: 'desc' },
  })

  return items.map((item) => item.productId)
}

export async function syncGuestWishlist(
  userId: string,
  productIds: string[]
): Promise<string[]> {
  await prisma.$transaction(async (tx) => {
    const uniqueIds = [...new Set(productIds)]

    for (const productId of uniqueIds) {
      const product = await tx.product.findUnique({ where: { id: productId } })
      if (!product) continue

      await tx.wishlistItem.upsert({
        where: {
          userId_productId: { userId, productId },
        },
        create: { userId, productId },
        update: {},
      })
    }
  })

  return getUserWishlistProductIds(userId)
}

export async function addWishlistItem(userId: string, productId: string): Promise<string[]> {
  await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId } })
    if (!product) {
      throw new Error('Product not found')
    }

    await tx.wishlistItem.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId },
      update: {},
    })
  })

  return getUserWishlistProductIds(userId)
}

export async function removeWishlistItem(
  userId: string,
  productId: string
): Promise<string[]> {
  await prisma.$transaction(async (tx) => {
    await tx.wishlistItem.deleteMany({
      where: { userId, productId },
    })
  })

  return getUserWishlistProductIds(userId)
}
