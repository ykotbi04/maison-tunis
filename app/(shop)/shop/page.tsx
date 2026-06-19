'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { ProductCard } from '@/components/product/product-card'
import { ScrollReveal } from '@/lib/animations'
import { categoriesApi } from '@/lib/api'
import { useProducts } from '@/hooks/useProducts'
import { useFilters } from '@/hooks/useFilters'
import type { Category } from '@/types/product'

export default function ShopPage() {
  const { filter, setSortBy, setInStockOnly, setPriceRange, setSearchQuery, resetFilters } = useFilters()
  const { products: filteredProducts, totalProducts, loading, error } = useProducts(filter)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    void categoriesApi.getAll().then(setCategories).catch(() => setCategories([]))
  }, [])

  return (
    <main className="bg-background">
      {/* Page Header */}
      <section className="py-12 md:py-20 border-b border-border">
        <Container>
          <div className="max-w-2xl space-y-4">
            <h1 className="text-display-1">Shop</h1>
            <p className="text-body text-foreground-muted">
              Explore our curated collection of premium Tunisian fashion and accessories
            </p>
          </div>
        </Container>
      </section>

      {/* Categories Navigation */}
      <section className="py-8 border-b border-border bg-background-secondary">
        <Container>
          <div className="flex overflow-x-auto gap-4 pb-4">
            <Link href="/shop" className="px-4 py-2 border-b-2 border-accent text-accent whitespace-nowrap font-serif">
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="px-4 py-2 border-b-2 border-transparent hover:border-accent text-foreground hover:text-accent transition-colors whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Products Section with Filters */}
      <section className="py-12 md:py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-background-secondary rounded-lg p-6 border border-border space-y-6 sticky top-20">
                <h3 className="font-serif text-lg text-foreground">Filters</h3>

                {/* Search */}
                <div className="space-y-3">
                  <label className="text-label" htmlFor="shop-search">
                    Search
                  </label>
                  <input
                    id="shop-search"
                    type="search"
                    value={filter.searchQuery ?? ''}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-3 py-2 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                {/* Sort By */}
                <div className="space-y-3">
                  <label className="text-label">Sort By</label>
                  <select
                    value={filter.sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'newest' | 'price-low' | 'price-high' | 'rating')}
                    className="w-full px-3 py-2 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <label className="text-label">Price Range</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        value={filter.priceRange?.min || 0}
                        onChange={(e) =>
                          setPriceRange({
                            min: parseInt(e.target.value) || 0,
                            max: filter.priceRange?.max || 6000,
                          })
                        }
                        className="w-full px-3 py-2 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        max="6000"
                        value={filter.priceRange?.max || 6000}
                        onChange={(e) =>
                          setPriceRange({
                            min: filter.priceRange?.min || 0,
                            max: parseInt(e.target.value) || 6000,
                          })
                        }
                        className="w-full px-3 py-2 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Max"
                      />
                    </div>
                    <p className="text-xs text-muted">
                      {filter.priceRange?.min || 0} TND - {filter.priceRange?.max || 6000} TND
                    </p>
                  </div>
                </div>

                {/* Stock Filter */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filter.inStockOnly || false}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="w-4 h-4 rounded border-border accent-accent"
                    />
                    <span className="text-sm text-foreground">In Stock Only</span>
                  </label>
                </div>

                {/* Results Count */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted">
                    Showing {filteredProducts.length} of {totalProducts} products
                  </p>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-label text-accent">Our Collection</p>
                    <h2 className="text-display-2">All Products ({filteredProducts.length})</h2>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-20">
                    <p className="text-muted text-lg">Loading products...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-20">
                    <p className="text-error text-lg mb-4">{error}</p>
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {filteredProducts.map((product, idx) => (
                      <ScrollReveal key={product.id} delay={idx * 0.05}>
                        <Link href={`/products/${product.id}`}>
                          <ProductCard product={product} />
                        </Link>
                      </ScrollReveal>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-muted text-lg mb-4">No products found matching your filters</p>
                    <button
                      onClick={resetFilters}
                      className="px-6 py-2 bg-accent hover:bg-accent-dark text-accent-foreground rounded transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Collection CTA */}
      <section className="py-12 md:py-20 border-t border-border bg-background-secondary">
        <Container>
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <h2 className="text-display-2">Discover Our Limited Edition</h2>
            <p className="text-body text-foreground-muted">
              Exclusive numbered pieces for the discerning collector
            </p>
            <Link href="/categories/limited-edition">
              <button className="px-8 py-3 bg-accent hover:bg-accent-dark text-accent-foreground font-serif">
                View Exclusive Collection
              </button>
            </Link>
          </div>
        </Container>
      </section>
    </main>
  )
}
