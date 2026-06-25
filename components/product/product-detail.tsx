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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div
            className="relative overflow-hidden"
            style={{
              aspectRatio: '4 / 5',
              backgroundColor: 'var(--bg-secondary)',
            }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out hover:scale-105"
              priority
            />
            {product.isNew && (
              <div
                className="absolute top-5 left-5"
              >
                <div
                  className="text-overline px-3 py-1.5"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: '#0C0A08',
                    letterSpacing: '0.15em',
                  }}
                >
                  New Arrival
                </div>
              </div>
            )}
            {product.isLimited && (
              <div
                className="absolute top-5 right-5"
              >
                <div
                  className="text-overline px-3 py-1.5"
                  style={{
                    backgroundColor: '#C25450',
                    color: '#FEFBF8',
                    letterSpacing: '0.15em',
                  }}
                >
                  Limited · {product.limitedQty} Remaining
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, idx) => (
              <div
                key={idx}
                className="relative cursor-pointer overflow-hidden transition-all duration-300"
                style={{
                  aspectRatio: '1 / 1',
                  border: '1px solid var(--border)',
                }}
              >
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
            className="inline-block text-overline transition-colors duration-300 hover:opacity-70"
            style={{ color: 'var(--accent)', letterSpacing: '0.2em' }}
          >
            {product.category}
          </Link>

          {/* Title & Price */}
          <div className="space-y-4">
            <h1
              className="text-display-1 leading-tight"
              style={{
                color: 'var(--fg)',
                letterSpacing: '-0.02em',
              }}
            >
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3">
              <span
                className="text-price-lg"
                style={{ color: 'var(--accent)' }}
              >
                {formatTND(product.price)}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="text-sm"
                    style={{
                      color: i < Math.floor(product.rating)
                        ? 'var(--accent)'
                        : 'var(--border)',
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span
                className="text-body-sm"
                style={{ color: 'var(--fg-muted)' }}
              >
                {product.rating.toFixed(1)} · {product.reviews} reviews
              </span>
            </div>
          </div>

          {/* Description */}
          <p
            className="text-body leading-relaxed"
            style={{ color: 'var(--fg-secondary)' }}
          >
            {product.longDescription}
          </p>

          {/* Divider */}
          <div className="divider-luxury" />

          {/* Color Selection */}
          {product.colors.length > 1 && (
            <div className="space-y-3">
              <label
                className="text-overline block"
                style={{ color: 'var(--fg-muted)', letterSpacing: '0.15em' }}
              >
                Color — {selectedColor}
              </label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className="relative px-5 py-2.5 text-body-sm transition-all duration-300"
                    style={{
                      border: `1px solid ${selectedColor === color ? 'var(--accent)' : 'var(--border)'}`,
                      backgroundColor: selectedColor === color ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'transparent',
                      color: selectedColor === color ? 'var(--fg)' : 'var(--fg-secondary)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {color}
                    {selectedColor === color && (
                      <span
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px"
                        style={{ backgroundColor: 'var(--accent)' }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes.length > 1 && (
            <div className="space-y-3">
              <label
                className="text-overline block"
                style={{ color: 'var(--fg-muted)', letterSpacing: '0.15em' }}
              >
                Size — {selectedSize}
              </label>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="relative px-5 py-2.5 text-body-sm transition-all duration-300"
                    style={{
                      border: `1px solid ${selectedSize === size ? 'var(--accent)' : 'var(--border)'}`,
                      backgroundColor: selectedSize === size ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'transparent',
                      color: selectedSize === size ? 'var(--fg)' : 'var(--fg-secondary)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {size}
                    {selectedSize === size && (
                      <span
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px"
                        style={{ backgroundColor: 'var(--accent)' }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-3">
            <label
              className="text-overline block"
              style={{ color: 'var(--fg-muted)', letterSpacing: '0.15em' }}
            >
              Quantity
            </label>
            <div
              className="inline-flex items-center"
              style={{
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
              }}
            >
              <button
                onClick={decrease}
                disabled={!canDecrease}
                className="w-12 h-12 flex items-center justify-center text-lg transition-all duration-300 hover:bg-[color-mix(in_srgb,var(--bg-secondary)_60%,transparent)] disabled:opacity-25 disabled:cursor-not-allowed"
                style={{ color: 'var(--fg)', borderRight: '1px solid var(--border)' }}
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
                className="w-14 h-12 text-center bg-transparent border-0 focus:outline-none text-body-sm"
                style={{ color: 'var(--fg)', letterSpacing: '0.05em' }}
                aria-label="Quantity"
              />
              <button
                onClick={increase}
                disabled={!canIncrease}
                className="w-12 h-12 flex items-center justify-center text-lg transition-all duration-300 hover:bg-[color-mix(in_srgb,var(--bg-secondary)_60%,transparent)] disabled:opacity-25 disabled:cursor-not-allowed"
                style={{ color: 'var(--fg)', borderLeft: '1px solid var(--border)' }}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <p
              className="text-body-sm"
              style={{ color: 'var(--fg-muted)', fontSize: '12px' }}
            >
              Maximum 20 per order
            </p>
          </div>

          {/* Stock Status */}
          <div
            className="px-5 py-4"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--bg-secondary) 50%, transparent)',
              border: '1px solid var(--border-light)',
            }}
          >
            {product.inStock ? (
              <div className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: '#6B9E7F' }}
                />
                <div>
                  <p
                    className="text-body-sm font-medium"
                    style={{ color: '#6B9E7F', letterSpacing: '0.02em' }}
                  >
                    In Stock — Ready to Ship
                  </p>
                  <p
                    className="mt-0.5"
                    style={{ color: 'var(--fg-muted)', fontSize: '12px' }}
                  >
                    Ships next business day
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: '#C25450' }}
                />
                <p
                  className="text-body-sm font-medium"
                  style={{ color: '#C25450', letterSpacing: '0.02em' }}
                >
                  Currently Out of Stock
                </p>
              </div>
            )}
          </div>

          {/* Trust Signals */}
          {product.inStock && (
            <div
              className="p-5 space-y-4"
              style={{
                border: '1px solid var(--border)',
                backgroundColor: 'var(--card)',
              }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: 'var(--accent)', fontSize: '14px' }}
                >
                  ✦
                </span>
                <div>
                  <p
                    className="text-body-sm"
                    style={{ color: 'var(--fg)', letterSpacing: '0.01em' }}
                  >
                    Complimentary Global Shipping
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: 'var(--accent)', fontSize: '14px' }}
                >
                  ✦
                </span>
                <div>
                  <p
                    className="text-body-sm"
                    style={{ color: 'var(--fg)', letterSpacing: '0.01em' }}
                  >
                    30-Day Returns &amp; Exchanges
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: 'var(--accent)', fontSize: '14px' }}
                >
                  ✦
                </span>
                <div>
                  <p
                    className="text-body-sm"
                    style={{ color: 'var(--fg)', letterSpacing: '0.01em' }}
                  >
                    Authenticity Certificate Included
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            ref={ctaButtonRef}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full py-5 font-serif text-lg transition-all duration-500"
            style={{
              backgroundColor: product.inStock ? 'var(--accent)' : 'var(--border)',
              color: product.inStock ? '#0C0A08' : 'var(--fg-muted)',
              letterSpacing: '0.04em',
            }}
          >
            Add to Atelier Bag
          </Button>

          {/* Product Details - Expandable Sections */}
          <div style={{ borderTop: '1px solid var(--border)' }} className="pt-6 space-y-0">
            <details className="group">
              <summary
                className="flex items-center justify-between cursor-pointer py-4 text-overline transition-colors duration-300 hover:opacity-70"
                style={{
                  color: 'var(--fg)',
                  letterSpacing: '0.15em',
                  listStyle: 'none',
                }}
              >
                Material &amp; Care
                <span
                  className="transition-transform duration-300 group-open:rotate-45 text-lg"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  +
                </span>
              </summary>
              <div
                className="pb-5 space-y-3 text-body-sm"
                style={{ color: 'var(--fg-secondary)' }}
              >
                <p>
                  <strong style={{ color: 'var(--fg)' }}>Material:</strong> {product.material}
                </p>
                <p>
                  <strong style={{ color: 'var(--fg)' }}>Care:</strong> {product.care}
                </p>
              </div>
            </details>

            {product.heritage && (
              <details className="group">
                <summary
                  className="flex items-center justify-between cursor-pointer py-4 text-overline transition-colors duration-300 hover:opacity-70"
                  style={{
                    color: 'var(--fg)',
                    letterSpacing: '0.15em',
                    listStyle: 'none',
                  }}
                >
                  Heritage &amp; Craftsmanship
                  <span
                    className="transition-transform duration-300 group-open:rotate-45 text-lg"
                    style={{ color: 'var(--fg-muted)' }}
                  >
                    +
                  </span>
                </summary>
                <div
                  className="pb-5 text-body-sm"
                  style={{ color: 'var(--fg-secondary)' }}
                >
                  <p>{product.heritage}</p>
                </div>
              </details>
            )}

            <details className="group">
              <summary
                className="flex items-center justify-between cursor-pointer py-4 text-overline transition-colors duration-300 hover:opacity-70"
                style={{
                  color: 'var(--fg)',
                  letterSpacing: '0.15em',
                  listStyle: 'none',
                }}
              >
                SKU: {product.sku}
                <span
                  className="transition-transform duration-300 group-open:rotate-45 text-lg"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  +
                </span>
              </summary>
            </details>
          </div>
        </div>
      </div>

      {/* Sticky Footer CTA - Mobile Only */}
      {showStickyButton && (
        <div
          className="fixed bottom-0 left-0 right-0 lg:hidden p-4 z-40 transition-all duration-500"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--bg) 85%, transparent)',
            backdropFilter: 'blur(20px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
            borderTop: '1px solid var(--border)',
            boxShadow: '0 -4px 24px -4px rgba(0,0,0,0.08)',
          }}
        >
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full py-5 font-serif text-lg disabled:opacity-50 transition-all duration-500"
            style={{
              backgroundColor: product.inStock ? 'var(--accent)' : 'var(--border)',
              color: product.inStock ? '#0C0A08' : 'var(--fg-muted)',
              letterSpacing: '0.04em',
            }}
          >
            {product.inStock ? `Add to Bag · ${formatTND(product.price)}` : 'Out of Stock'}
          </Button>
        </div>
      )}
    </>
  )
}
