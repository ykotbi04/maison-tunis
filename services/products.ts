import type { Product, Category, ProductFilter } from '@/types/product'
import {
  getAllProducts,
  getProductById,
  getProductsByGender,
} from '@/lib/db/products'
import { getAllCategories, getCategoryBySlug } from '@/lib/db/categories'

export class ProductsService {
  static async getAll(): Promise<Product[]> {
    const result = await getAllProducts()
    return Array.isArray(result) ? result : result.data
  }

  static async getById(id: string): Promise<Product | undefined> {
    const product = await getProductById(id)
    return product ?? undefined
  }

  static async getByCategory(categorySlug: string): Promise<Product[]> {
    const result = await getAllProducts({ categorySlug })
    return Array.isArray(result) ? result : result.data
  }

  static async getByGender(gender: 'MEN' | 'WOMEN' | 'UNISEX', categorySlug?: string) {
    return getProductsByGender(gender, categorySlug)
  }

  static async getFeatured(): Promise<Product[]> {
    const products = await this.getAll()
    return products.filter((p) => p.isNew).slice(0, 6)
  }

  static async getLimitedEdition(): Promise<Product[]> {
    const products = await this.getAll()
    return products.filter((p) => p.isLimited)
  }

  static async getAllCategories(): Promise<Category[]> {
    return getAllCategories()
  }

  static async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const category = await getCategoryBySlug(slug)
    return category ?? undefined
  }

  static filterProducts(products: Product[], filter: ProductFilter): Product[] {
    let filtered = [...products]

    if (filter.categorySlug) {
      filtered = filtered.filter((p) => p.categorySlug === filter.categorySlug)
    }

    if (filter.inStockOnly) {
      filtered = filtered.filter((p) => p.inStock)
    }

    if (filter.priceRange) {
      filtered = filtered.filter(
        (p) =>
          p.price >= filter.priceRange!.min && p.price <= filter.priceRange!.max
      )
    }

    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating)
          break
        case 'newest':
        default:
          filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
          break
      }
    }

    return filtered
  }

  static async searchProducts(query: string): Promise<Product[]> {
    const result = await getAllProducts({ search: query, page: 1, limit: 100 })
    return Array.isArray(result) ? result : result.data
  }

  static async getRelatedProducts(product: Product, limit: number = 4): Promise<Product[]> {
    const products = await this.getByCategory(product.categorySlug)
    return products.filter((p) => p.id !== product.id).slice(0, limit)
  }
}
