'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types/product'
import { formatTND } from '@/lib/formatters'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import { useQuantity } from '@/hooks/useQuantity'

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedColor, setSelectedColor] = useState(product.color)
  const [selectedSize, setSelectedSize] = useState(product.size)
  const { quantity, increase, decrease, setQuantity: setQuantityValue, canIncrease, canDecrease } = useQuantity(1)
  const [showStickyButton, setShowStickyButton] = useState(false)
  const ctaButtonRef = useRef<HTMLButtonElement>(null)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        color: selectedColor,
        size: selectedSize,
      },
      quantity
    )
  }

  // Intersection Observer to show/hide sticky button
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyButton(!entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (ctaButtonRef.current) {
      observer.observe(ctaButtonRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  const discountedPrice = product.isLimited
    ? Math.round(product.price * 0.95)
    : product.price

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-background-secondary rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.isNew && (
              <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-4 py-2 text-sm font-serif">
                New
              </div>
            )}
            {product.isLimited && (
              <div className="absolute top-4 right-4 bg-destructive text-white px-4 py-2 text-sm font-serif">
                Limited #{product.limitedQty}
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, idx) => (
              <div key={idx} className="relative aspect-square rounded cursor-pointer">
                <Image
                  src={image}
                  alt={`${product.name} view ${idx + 1}`}
                  fill
                  className="object-cover rounded"
                />
              </div>
            ))}
          </div>
        </div>

      {/* Product Info */}
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Link
          href={`/categories/${product.categorySlug}`}
          className="text-label text-accent hover:text-accent-dark transition-colors"
        >
          {product.category}
        </Link>

        {/* Title & Price */}
        <div className="space-y-3">
          <h1 className="text-display-1 leading-tight">{product.name}</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-price-lg text-accent">
                {formatTND(product.price)}
              </span>
              {product.isLimited && (
                <span className="text-muted line-through">
                  {formatTND(product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={i < Math.floor(product.rating) ? 'text-accent' : 'text-muted'}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-muted">
              ({product.reviews} reviews)
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-body text-foreground-muted leading-relaxed">
          {product.longDescription}
        </p>

        {/* Color Selection */}
        {product.colors.length > 1 && (
          <div className="space-y-3">
            <label className="text-label">Color: {selectedColor}</label>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border-2 transition-colors ${
                    selectedColor === color
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selection */}
        {product.sizes.length > 1 && (
          <div className="space-y-3">
            <label className="text-label">Size: {selectedSize}</label>
            <div className="flex gap-3 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border-2 transition-colors ${
                    selectedSize === size
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="space-y-3">
          <label className="text-label">Quantity</label>
          <div className="flex items-center gap-3 border border-border rounded-lg p-1 w-fit">
            <button
              onClick={decrease}
              disabled={!canDecrease}
              className="px-4 py-2 text-lg hover:text-accent disabled:text-muted disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
              title="Decrease quantity (or use arrow left)"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantityValue(parseInt(e.target.value) || 1)}
              min="1"
              max="20"
              className="w-12 text-center text-foreground bg-transparent border-0 focus:outline-none"
              aria-label="Quantity"
            />
            <button
              onClick={increase}
              disabled={!canIncrease}
              className="px-4 py-2 text-lg hover:text-accent disabled:text-muted disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
              title="Increase quantity (or use arrow right)"
            >
              +
            </button>
          </div>
          <p className="text-xs text-muted">Maximum 20 per order</p>
        </div>

        {/* Stock Status */}
        <div className="p-4 bg-background-secondary rounded">
          {product.inStock ? (
            <div className="space-y-2">
              <p className="text-success text-sm font-medium">✓ In Stock</p>
              <p className="text-label text-foreground-muted text-xs">
                Ships next business day
              </p>
            </div>
          ) : (
            <p className="text-error text-sm font-medium">Out of Stock</p>
          )}
        </div>

        {/* Trust Signals */}
        {product.inStock && (
          <div className="space-y-3 p-4 bg-accent/5 rounded border border-accent/20">
            <div className="flex items-start gap-3">
              <span className="text-accent text-lg">🚚</span>
              <div>
                <p className="text-label text-sm">Free Shipping</p>
                <p className="text-xs text-foreground-muted">On orders over 100 TND</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent text-lg">↩️</span>
              <div>
                <p className="text-label text-sm">Free Returns</p>
                <p className="text-xs text-foreground-muted">30-day money-back guarantee</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent text-lg">✓</span>
              <div>
                <p className="text-label text-sm">Authentic & Certified</p>
                <p className="text-xs text-foreground-muted">100% Tunisian craftsmanship</p>
              </div>
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <Button
          ref={ctaButtonRef}
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full py-4 bg-accent hover:bg-accent-dark text-accent-foreground font-serif text-lg"
        >
          Add to Cart
        </Button>

        {/* Product Details */}
        <div className="border-t border-border pt-6 space-y-3">
          <h3 className="text-heading-3">Product Details</h3>

          <div className="space-y-2 text-sm">
            <div>
              <span className="text-label">Material:</span>
              <p className="text-foreground-muted">{product.material}</p>
            </div>
            <div>
              <span className="text-label">Care Instructions:</span>
              <p className="text-foreground-muted">{product.care}</p>
            </div>
            {product.heritage && (
              <div>
                <span className="text-label">Heritage:</span>
                <p className="text-foreground-muted">{product.heritage}</p>
              </div>
            )}
            <div>
              <span className="text-label">SKU:</span>
              <p className="text-foreground-muted">{product.sku}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Sticky Footer CTA - Mobile Only */}
      {showStickyButton && (
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-background border-t border-border p-4 z-40 shadow-lg">
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full py-4 bg-accent hover:bg-accent-dark text-accent-foreground font-serif text-lg disabled:opacity-50"
          >
            {product.inStock ? `Add to Cart • ${formatTND(product.price)}` : 'Out of Stock'}
          </Button>
        </div>
      )}
    </>
  )
}
