import type { Prisma, Gender } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { mapProduct, mapProducts } from '@/lib/mappers/product'
import type { Product } from '@/types/product'
import type { PaginatedResponse } from '@/types/api'

const productInclude = {
  category: true,
} as const

export async function getAllProducts(filters?: {
  categorySlug?: string
  gender?: Gender
  search?: string
  priceMin?: number
  priceMax?: number
  inStockOnly?: boolean
  page?: number
  limit?: number
}): Promise<Product[] | PaginatedResponse<Product>> {
  const where: Prisma.ProductWhereInput = {}

  if (filters?.categorySlug) {
    where.category = { slug: filters.categorySlug }
  }

  if (filters?.gender) {
    where.gender = filters.gender
  }

  if (filters?.inStockOnly) {
    where.inStock = true
  }

  if (filters?.priceMin !== undefined || filters?.priceMax !== undefined) {
    where.price = {}
    if (filters.priceMin !== undefined) {
      where.price.gte = filters.priceMin
    }
    if (filters.priceMax !== undefined) {
      where.price.lte = filters.priceMax
    }
  }

  if (filters?.search) {
    const query = filters.search.toLowerCase()
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { category: { name: { contains: query, mode: 'insensitive' } } },
    ]
  }

  const isPaginated =
    filters?.search !== undefined ||
    filters?.page !== undefined ||
    filters?.limit !== undefined

  if (isPaginated) {
    const page = filters?.page ?? 1
    const limit = filters?.limit ?? 24
    const skip = (page - 1) * limit

    const [total, products] = await prisma.$transaction([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: productInclude,
        orderBy: [{ isNew: 'desc' }, { name: 'asc' }],
        skip,
        take: limit,
      }),
    ])

    return {
      data: mapProducts(products),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    }
  }

  const products = await prisma.product.findMany({
    where,
    include: productInclude,
    orderBy: [{ isNew: 'desc' }, { name: 'asc' }],
  })

  return mapProducts(products)
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  })

  return product ? mapProduct(product) : null
}

export async function createProduct(
  data: Prisma.ProductUncheckedCreateInput
): Promise<Product> {
  const product = await prisma.product.create({
    data,
    include: productInclude,
  })

  return mapProduct(product)
}

export async function getRelatedProducts(
  categorySlug: string,
  excludeId: string,
  limit = 3
): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: {
      category: { slug: categorySlug },
      id: { not: excludeId },
      inStock: true,
    },
    include: productInclude,
    take: limit,
    orderBy: { rating: 'desc' },
  })

  return mapProducts(products)
}

export async function getProductsByGender(
  gender: Gender,
  categorySlug?: string
): Promise<Product[]> {
  const result = await getAllProducts({
    gender,
    categorySlug,
  })

  return Array.isArray(result) ? result : result.data
}
