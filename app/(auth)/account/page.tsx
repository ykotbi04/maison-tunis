'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useAuthSession } from '@/hooks/useAuthSession'
import { accountApi, type CustomerOrder } from '@/lib/api'
import { formatTND, formatDate } from '@/lib/formatters'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'text-[var(--color-accent)]' },
  PROCESSING: { label: 'Processing', color: 'text-blue-400' },
  SHIPPED: { label: 'Shipped', color: 'text-purple-400' },
  DELIVERED: { label: 'Delivered', color: 'text-[var(--color-success)]' },
  CANCELLED: { label: 'Cancelled', color: 'text-[var(--color-error)]' },
}

const STATUS_STEPS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED']

function StatusProgress({ status }: { status: string }) {
  const currentIdx = STATUS_STEPS.indexOf(status)
  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[var(--color-error)]" />
        <span className="text-xs text-[var(--color-error)]">Cancelled</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1.5">
      {STATUS_STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-1">
          <div
            className={`w-2 h-2 rounded-full transition-colors ${
              i <= currentIdx ? 'bg-[var(--color-accent)]' : 'bg-border'
            }`}
          />
          {i < STATUS_STEPS.length - 1 && (
            <div className={`w-4 h-0.5 ${i < currentIdx ? 'bg-[var(--color-accent)]' : 'bg-border'}`} />
          )}
        </div>
      ))}
      <span className="text-xs text-muted ml-1">{STATUS_LABELS[status]?.label || status}</span>
    </div>
  )
}

export default function AccountOverviewPage() {
  const { user } = useAuthSession()
  const [recentOrder, setRecentOrder] = useState<CustomerOrder | null>(null)
  const [orderCount, setOrderCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [ordersResult, wishlistRes] = await Promise.all([
          accountApi.getOrders({ limit: 1 }),
          fetch('/api/wishlist', { credentials: 'include' }).then((r) => r.ok ? r.json() : []),
        ])
        if (!cancelled) {
          setOrderCount(ordersResult.total)
          setRecentOrder(ordersResult.data[0] || null)
          setWishlistCount(Array.isArray(wishlistRes) ? wishlistRes.length : 0)
        }
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-background-secondary rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-background-secondary rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-foreground tracking-wider">Welcome back</h1>
        <p className="text-sm text-muted mt-1">{user?.name || 'Customer'}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/account/orders" className="bg-background-secondary rounded-lg border border-border p-5 hover:border-[var(--color-accent)]/30 transition-colors group">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Orders</p>
          <p className="font-serif text-2xl text-foreground">{orderCount}</p>
        </Link>
        <Link href="/account/wishlist" className="bg-background-secondary rounded-lg border border-border p-5 hover:border-[var(--color-accent)]/30 transition-colors group">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Wishlist</p>
          <p className="font-serif text-2xl text-foreground">{wishlistCount}</p>
        </Link>
        <Link href="/account/profile" className="bg-background-secondary rounded-lg border border-border p-5 hover:border-[var(--color-accent)]/30 transition-colors group">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Profile</p>
          <p className="text-sm text-foreground truncate">{user?.email}</p>
        </Link>
      </div>

      {/* Recent Order */}
      {recentOrder ? (
        <div className="bg-background-secondary rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg text-foreground tracking-wide">Most Recent Order</h2>
            <Link href={`/account/orders/${recentOrder.id}`} className="text-xs text-[var(--color-accent)] hover:underline">
              View Details
            </Link>
          </div>

          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted">Order {recentOrder.shortId}</p>
            <p className="text-xs text-muted">{formatDate(recentOrder.createdAt)}</p>
          </div>

          <StatusProgress status={recentOrder.status} />

          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              {recentOrder.items[0] && (
                <div className="w-10 h-10 rounded bg-background overflow-hidden flex-shrink-0">
                  <Image
                    src={recentOrder.items[0].image}
                    alt={recentOrder.items[0].name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-sm text-foreground">{recentOrder.items.length} item{recentOrder.items.length !== 1 ? 's' : ''}</p>
                <p className="text-xs text-muted">{recentOrder.items[0]?.name}</p>
              </div>
            </div>
            <p className="font-serif text-lg text-[var(--color-accent)]">{formatTND(recentOrder.total)}</p>
          </div>
        </div>
      ) : (
        <div className="bg-background-secondary rounded-lg border border-border p-8 text-center">
          <div className="text-4xl text-[var(--color-accent)]/30 mb-3">&#10022;</div>
          <h2 className="font-serif text-xl text-foreground mb-2">No Orders Yet</h2>
          <p className="text-sm text-muted mb-4">When you place an order, it will appear here.</p>
          <Link href="/shop">
            <Button variant="primary" size="sm">Browse Collection</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
