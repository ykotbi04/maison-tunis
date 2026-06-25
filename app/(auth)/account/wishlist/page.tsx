'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useWishlist } from '@/hooks/useWishlist'
import { useCart } from '@/hooks/useCart'
import { productsApi } from '@/lib/api'
import type { Product } from '@/types/product'
import { formatTND } from '@/lib/formatters'

export default function AccountWishlistPage() {
  const { items: wishlistItems, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (wishlistItems.length === 0) {
        setProducts([])
        setLoading(false)
        return
      }
      try {
        const allProducts = await productsApi.getAll()
        const wishlistProductIds = wishlistItems.map((item) => item.productId)
        const filtered = allProducts.filter((p) => wishlistProductIds.includes(p.id))
        if (!cancelled) setProducts(filtered)
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [wishlistItems])

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId)
    setProducts((prev) => prev.filter((p) => p.id !== productId))
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: product.sizes[0] || undefined,
      color: product.colors[0] || undefined,
      image: product.image,
    }, 1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--fg)] tracking-tight">Wishlist</h1>
        <p className="text-sm text-[var(--fg-muted)] mt-1">{products.length} item{products.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-white rounded-xl border border-[var(--border)] animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl border border-[var(--border)] p-8 text-center">
          <div className="w-12 h-12 bg-[var(--bg-muted)] rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-[var(--fg-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-1.085-.744-2.024-1.773-2.233m2.636-2.025A2.99 2.99 0 0015.673 1.5H8.327c-1.573 0-2.936.92-3.63 2.25M21 8.25l-4.773 2.992m0 0c-1.037.72-2.201 1.273-3.5 1.5M2.25 8.25l4.773 2.992m0 0c1.037.72 2.201 1.273 3.5 1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-[var(--fg)] mb-1">Your Wishlist is Empty</h2>
          <p className="text-sm text-[var(--fg-muted)] mb-4">Save pieces you love for later.</p>
           <Link href="/collections">
            <Button variant="primary" size="sm">Browse Collection</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="flex">
                <Link href={`/products/${product.id}`} className="w-24 h-24 flex-shrink-0 bg-[var(--bg-muted)] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="flex-1 p-4 min-w-0">
                  <Link href={`/products/${product.id}`}>
                    <p className="text-sm font-semibold text-[var(--fg)] truncate hover:text-[var(--accent)] transition-colors">
                      {product.name}
                    </p>
                  </Link>
                  <p className="text-xs text-[var(--fg-muted)] mt-0.5">{product.category}</p>
                  <p className="text-sm font-bold text-[var(--fg)] mt-1">{formatTND(product.price)}</p>
                </div>
              </div>
              <div className="px-4 pb-4 flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[var(--fg-muted)] hover:text-[var(--error)]"
                  onClick={() => handleRemove(product.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
