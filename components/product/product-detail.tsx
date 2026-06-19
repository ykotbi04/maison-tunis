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

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.isNew && (
              <div className="absolute top-4 left-4 px-4 py-2 text-sm font-sans tracking-widest uppercase" style={{ backgroundColor: 'var(--accent)', color: '#0C0A08' }}>
                New
              </div>
            )}
            {product.isLimited && (
              <div className="absolute top-4 right-4 px-4 py-2 text-sm font-sans tracking-widest uppercase" style={{ backgroundColor: '#C9544D', color: '#FEFBF8' }}>
                Limited #{product.limitedQty}
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, idx) => (
              <div key={idx} className="relative aspect-square cursor-pointer overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <Image
                  src={image}
                  alt={`${product.name} view ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category */}
          <Link
            href={`/categories/${product.categorySlug}`}
            className="text-overline hover:opacity-80 transition-opacity"
            style={{ color: 'var(--accent)' }}
          >
            {product.category}
          </Link>

          {/* Title & Price */}
          <div className="space-y-3">
            <h1 className="text-display-1 leading-tight" style={{ color: 'var(--fg)' }}>{product.name}</h1>

            <div className="flex items-center gap-4">
              <span className="text-price-lg" style={{ color: 'var(--accent)' }}>
                {formatTND(product.price)}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    style={{ color: i < Math.floor(product.rating) ? 'var(--accent)' : 'var(--fg-muted)' }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm" style={{ color: 'var(--fg-muted)' }}>
                ({product.reviews} reviews)
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-body leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>
            {product.longDescription}
          </p>

          {/* Color Selection */}
          {product.colors.length > 1 && (
            <div className="space-y-3">
              <label className="text-overline" style={{ color: 'var(--fg-muted)' }}>Color: {selectedColor}</label>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className="px-4 py-2 transition-colors"
                    style={{
                      border: `1px solid ${selectedColor === color ? 'var(--accent)' : 'var(--border)'}`,
                      backgroundColor: selectedColor === color ? 'var(--accent)' + '10' : 'transparent',
                      color: 'var(--fg)',
                    }}
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
              <label className="text-overline" style={{ color: 'var(--fg-muted)' }}>Size: {selectedSize}</label>
              <div className="flex gap-3 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="px-4 py-2 transition-colors"
                    style={{
                      border: `1px solid ${selectedSize === size ? 'var(--accent)' : 'var(--border)'}`,
                      backgroundColor: selectedSize === size ? 'var(--accent)' + '10' : 'transparent',
                      color: 'var(--fg)',
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-3">
            <label className="text-overline" style={{ color: 'var(--fg-muted)' }}>Quantity</label>
            <div className="flex items-center gap-3 w-fit" style={{ border: '1px solid var(--border)' }}>
              <button
                onClick={decrease}
                disabled={!canDecrease}
                className="px-4 py-2 text-lg hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                style={{ color: 'var(--fg)' }}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantityValue(parseInt(e.target.value) || 1)}
                min="1"
                max="20"
                className="w-12 text-center bg-transparent border-0 focus:outline-none"
                style={{ color: 'var(--fg)' }}
                aria-label="Quantity"
              />
              <button
                onClick={increase}
                disabled={!canIncrease}
                className="px-4 py-2 text-lg hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                style={{ color: 'var(--fg)' }}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>Maximum 20 per order</p>
          </div>

          {/* Stock Status */}
          <div className="p-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            {product.inStock ? (
              <div className="space-y-1">
                <p className="text-sm font-medium" style={{ color: '#6B9E7F' }}>✓ In Stock</p>
                <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>
                  Ships next business day
                </p>
              </div>
            ) : (
              <p className="text-sm font-medium" style={{ color: '#C9544D' }}>Out of Stock</p>
            )}
          </div>

          {/* Trust Signals */}
          {product.inStock && (
            <div className="space-y-3 p-4" style={{ border: '1px solid var(--border)' }}>
              <div className="flex items-start gap-3">
                <span style={{ color: 'var(--accent)' }}>✦</span>
                <div>
                  <p className="text-sm" style={{ color: 'var(--fg)' }}>Complimentary Global Shipping</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span style={{ color: 'var(--accent)' }}>✦</span>
                <div>
                  <p className="text-sm" style={{ color: 'var(--fg)' }}>30-Day Returns</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span style={{ color: 'var(--accent)' }}>✦</span>
                <div>
                  <p className="text-sm" style={{ color: 'var(--fg)' }}>Authenticity Certificate Included</p>
                </div>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            ref={ctaButtonRef}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full py-4 font-serif text-lg"
            style={{ backgroundColor: 'var(--accent)', color: '#0C0A08' }}
          >
            Add to Atelier Bag
          </Button>

          {/* Product Details - Expandable Sections */}
          <div style={{ borderTop: '1px solid var(--border)' }} className="pt-6 space-y-4">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer py-3 text-overline" style={{ color: 'var(--fg)' }}>
                Material &amp; Care
                <span className="transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="pb-4 space-y-2 text-body-sm" style={{ color: 'var(--fg-secondary)' }}>
                <p><strong>Material:</strong> {product.material}</p>
                <p><strong>Care:</strong> {product.care}</p>
              </div>
            </details>

            {product.heritage && (
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer py-3 text-overline" style={{ color: 'var(--fg)' }}>
                  Heritage &amp; Craftsmanship
                  <span className="transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="pb-4 text-body-sm" style={{ color: 'var(--fg-secondary)' }}>
                  <p>{product.heritage}</p>
                </div>
              </details>
            )}

            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer py-3 text-overline" style={{ color: 'var(--fg)' }}>
                SKU: {product.sku}
                <span className="transition-transform group-open:rotate-45">+</span>
              </summary>
            </details>
          </div>
        </div>
      </div>

      {/* Sticky Footer CTA - Mobile Only */}
      {showStickyButton && (
        <div className="fixed bottom-0 left-0 right-0 lg:hidden p-4 z-40" style={{ backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full py-4 font-serif text-lg disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent)', color: '#0C0A08' }}
          >
            {product.inStock ? `Add to Bag • ${formatTND(product.price)}` : 'Out of Stock'}
          </Button>
        </div>
      )}
    </>
  )
}
