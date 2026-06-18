import { prisma } from '@/lib/prisma'
import { mapCategory } from '@/lib/mappers/product'
import type { Category } from '@/types/product'

export async function getAllCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  return categories.map(mapCategory)
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const category = await prisma.category.findUnique({
    where: { slug },
  })

  return category ? mapCategory(category) : null
}

export async function getCategoryIdBySlug(slug: string): Promise<string | null> {
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { id: true },
  })

  return category?.id ?? null
}
