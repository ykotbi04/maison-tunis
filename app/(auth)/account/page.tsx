'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useAuthSession } from '@/hooks/useAuthSession'
import { accountApi, type CustomerOrder } from '@/lib/api'
import { formatTND, formatDate } from '@/lib/formatters'

const STATUS_LABELS: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  PENDING: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  PROCESSING: { label: 'Processing', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  SHIPPED: { label: 'Shipped', bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  DELIVERED: { label: 'Delivered', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
}

const STATUS_STEPS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED']

function StatusProgress({ status }: { status: string }) {
  const currentIdx = STATUS_STEPS.indexOf(status)
  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[var(--error)]" />
        <span className="text-xs text-[var(--error)] font-medium">Cancelled</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1.5">
      {STATUS_STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-1">
          <div
            className={`w-2 h-2 rounded-full transition-colors ${
              i <= currentIdx ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
            }`}
          />
          {i < STATUS_STEPS.length - 1 && (
            <div className={`w-4 h-0.5 ${i < currentIdx ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} />
          )}
        </div>
      ))}
      <span className="text-xs text-[var(--fg-muted)] ml-1">{STATUS_LABELS[status]?.label || status}</span>
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
        <div className="h-8 w-48 bg-[var(--bg-muted)] rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-xl border border-[var(--border)] animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--fg)] tracking-tight">Welcome back</h1>
        <p className="text-sm text-[var(--fg-muted)] mt-1">{user?.name || 'Customer'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/account/orders" className="bg-white rounded-xl border border-[var(--border)] p-5 hover:border-[var(--accent)]/30 hover:shadow-md transition-all duration-200 group">
          <p className="text-xs font-medium text-[var(--fg-muted)] mb-1">Orders</p>
          <p className="text-2xl font-bold text-[var(--fg)]">{orderCount}</p>
        </Link>
        <Link href="/account/wishlist" className="bg-white rounded-xl border border-[var(--border)] p-5 hover:border-[var(--accent)]/30 hover:shadow-md transition-all duration-200 group">
          <p className="text-xs font-medium text-[var(--fg-muted)] mb-1">Wishlist</p>
          <p className="text-2xl font-bold text-[var(--fg)]">{wishlistCount}</p>
        </Link>
        <Link href="/account/profile" className="bg-white rounded-xl border border-[var(--border)] p-5 hover:border-[var(--accent)]/30 hover:shadow-md transition-all duration-200 group">
          <p className="text-xs font-medium text-[var(--fg-muted)] mb-1">Profile</p>
          <p className="text-sm text-[var(--fg)] truncate">{user?.email}</p>
        </Link>
      </div>

      {recentOrder ? (
        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[var(--fg)]">Most Recent Order</h2>
            <Link href={`/account/orders/${recentOrder.id}`} className="text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
              View Details
            </Link>
          </div>

          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-[var(--fg-muted)]">Order {recentOrder.shortId}</p>
            <p className="text-xs text-[var(--fg-muted)]">{formatDate(recentOrder.createdAt)}</p>
          </div>

          <StatusProgress status={recentOrder.status} />

          <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              {recentOrder.items[0] && (
                <div className="w-10 h-10 rounded-lg bg-[var(--bg-muted)] overflow-hidden flex-shrink-0">
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
                <p className="text-sm text-[var(--fg)]">{recentOrder.items.length} item{recentOrder.items.length !== 1 ? 's' : ''}</p>
                <p className="text-xs text-[var(--fg-muted)]">{recentOrder.items[0]?.name}</p>
              </div>
            </div>
            <p className="text-lg font-bold text-[var(--fg)]">{formatTND(recentOrder.total)}</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--border)] p-8 text-center">
          <div className="w-12 h-12 bg-[var(--bg-muted)] rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-[var(--fg-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-[var(--fg)] mb-1">No Orders Yet</h2>
          <p className="text-sm text-[var(--fg-muted)] mb-4">When you place an order, it will appear here.</p>
           <Link href="/collections">
            <Button variant="primary" size="sm">Browse Collection</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
