import type { Product as DbProduct, Category as DbCategory } from '@prisma/client'
import type { Product, Category } from '@/types/product'

type ProductWithCategory = DbProduct & { category: DbCategory }

export function mapCategory(category: DbCategory): Category {
  return {
    slug: category.slug,
    name: category.name,
    description: category.description,
    image: category.image,
  }
}

export function mapProduct(product: ProductWithCategory): Product {
  return {
    id: product.id,
    name: product.name,
    category: product.category.name,
    categorySlug: product.category.slug,
    price: Number(product.price),
    description: product.description,
    longDescription: product.longDescription,
    image: product.image,
    images: product.images,
    color: product.color,
    colors: product.colors,
    size: product.size,
    sizes: product.sizes,
    material: product.material,
    care: product.care,
    inStock: product.inStock,
    stock: product.stock ?? undefined,
    isNew: product.isNew,
    isLimited: product.isLimited,
    limitedQty: product.limitedQty ?? undefined,
    rating: product.rating,
    reviews: product.reviews,
    sku: product.sku,
    heritage: product.heritage ?? undefined,
  }
}

export function mapProducts(products: ProductWithCategory[]): Product[] {
  return products.map(mapProduct)
}
