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
        <h1 className="font-serif text-3xl text-foreground tracking-wider">Wishlist</h1>
        <p className="text-sm text-muted mt-1">{products.length} item{products.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-background-secondary rounded-lg animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-background-secondary rounded-lg border border-border p-8 text-center">
          <div className="text-4xl text-[var(--color-accent)]/30 mb-3">&#9825;</div>
          <h2 className="font-serif text-xl text-foreground mb-2">Your Wishlist is Empty</h2>
          <p className="text-sm text-muted mb-4">Save pieces you love for later.</p>
          <Link href="/shop">
            <Button variant="primary" size="sm">Browse Collection</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-background-secondary rounded-lg border border-border overflow-hidden">
              <div className="flex">
                <Link href={`/products/${product.id}`} className="w-24 h-24 flex-shrink-0 bg-background overflow-hidden">
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
                    <p className="text-sm font-medium text-foreground truncate hover:text-[var(--color-accent)] transition-colors">
                      {product.name}
                    </p>
                  </Link>
                  <p className="text-xs text-muted mt-0.5">{product.category}</p>
                  <p className="text-sm font-medium text-[var(--color-accent)] mt-1">{formatTND(product.price)}</p>
                </div>
              </div>
              <div className="px-4 pb-4 flex gap-2">
                <Button
                  variant="primary"
                  size="xs"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-muted hover:text-[var(--color-error)]"
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
