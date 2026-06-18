'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/product'
import { formatTND } from '@/lib/formatters'
import { HoverScale } from '@/lib/animations'
import { useWishlist } from '@/hooks/useWishlist'

interface ProductCardProps {
  product: Product
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product }, ref) => {
    const { isInWishlist, toggleWishlist } = useWishlist()
    const isWishlisted = isInWishlist(product.id)

    return (
      <HoverScale>
        <div ref={ref} className="group">
          {/* Image Container */}
          <div className="relative aspect-square bg-background-secondary rounded-lg overflow-hidden mb-4">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Badge */}
            {product.isNew && (
              <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 text-xs font-serif tracking-wide">
                New
              </div>
            )}

            {product.isLimited && (
              <div className="absolute top-4 left-4 bg-destructive text-white px-3 py-1 text-xs font-serif tracking-wide">
                Limited
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleWishlist(product.id)
              }}
              className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-background transition-colors duration-200"
              aria-label="Add to wishlist"
            >
              <svg
                className={cn(
                  'w-5 h-5 transition-colors duration-200',
                  isWishlisted ? 'text-destructive fill-current' : 'text-foreground'
                )}
                fill={isWishlisted ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 8.25c0-1.085-.744-2.024-1.773-2.233m2.636-2.025A2.99 2.99 0 0015.673 1.5H8.327c-1.573 0-2.936.92-3.63 2.25M21 8.25l-4.773 2.992m0 0c-1.037.72-2.201 1.273-3.5 1.5M2.25 8.25l4.773 2.992m0 0c1.037.72 2.201 1.273 3.5 1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className="font-serif text-lg text-foreground truncate group-hover:text-accent transition-colors">
              {product.name}
            </h3>

            <div className="flex items-center gap-2">
              <p className="text-price text-accent">
                {formatTND(product.price)}
              </p>
              {!product.inStock && (
                <p className="text-xs text-destructive font-medium">Out of Stock</p>
              )}
            </div>

            {/* Stock Indicator */}
            {product.inStock && (
              <p className="text-xs text-success font-medium">
                Ships next day
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 py-1">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={i < Math.floor(product.rating) ? 'text-accent text-xs' : 'text-muted text-xs'}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-muted">({product.reviews})</span>
            </div>
          </div>
        </div>
      </HoverScale>
    )
  }
)

ProductCard.displayName = 'ProductCard'

export { ProductCard }
