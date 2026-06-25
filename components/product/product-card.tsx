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
        <div ref={ref} className="group cursor-pointer">
          <div className="relative aspect-[3/4] bg-[var(--bg-muted)] overflow-hidden mb-3 rounded-xl">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <span className="text-white text-xs font-semibold tracking-wider uppercase">
                Quick View
              </span>
            </div>

            {product.isNew && (
              <div className="absolute top-3 left-3 bg-[var(--accent)] text-white px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-full">
                New
              </div>
            )}

            {product.isLimited && (
              <div className="absolute top-3 left-3 bg-[var(--error)] text-white px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-full">
                Limited
              </div>
            )}

            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleWishlist(product.id)
              }}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 shadow-sm"
              aria-label="Add to wishlist"
            >
              <svg
                className={cn(
                  'w-4 h-4 transition-colors duration-150',
                  isWishlisted ? 'text-[var(--error)] fill-current' : 'text-[var(--fg)]'
                )}
                fill={isWishlisted ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-1.085-.744-2.024-1.773-2.233m2.636-2.025A2.99 2.99 0 0015.673 1.5H8.327c-1.573 0-2.936.92-3.63 2.25M21 8.25l-4.773 2.992m0 0c-1.037.72-2.201 1.273-3.5 1.5M2.25 8.25l4.773 2.992m0 0c1.037.72 2.201 1.273 3.5 1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-[var(--fg)] truncate group-hover:text-[var(--accent)] transition-colors duration-150">
              {product.name}
            </h3>

            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-[var(--fg)]">
                {formatTND(product.price)}
              </p>
              {!product.inStock && (
                <p className="text-[10px] text-[var(--error)] font-semibold tracking-wider uppercase">Sold Out</p>
              )}
            </div>

            {product.inStock && (
              <p className="text-xs text-[var(--fg-muted)]">
                Ships within 24h
              </p>
            )}

            <div className="flex items-center gap-1.5 pt-0.5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'text-xs',
                      i < Math.floor(product.rating) ? 'text-amber-400' : 'text-[var(--border)]'
                    )}
                  >
                    &#9733;
                  </span>
                ))}
              </div>
              <span className="text-xs text-[var(--fg-muted)]">({product.reviews})</span>
            </div>
          </div>
        </div>
      </HoverScale>
    )
  }
)

ProductCard.displayName = 'ProductCard'

export { ProductCard }
