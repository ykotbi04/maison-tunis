'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { accountApi, type CustomerOrder } from '@/lib/api'
import { formatTND, formatDate } from '@/lib/formatters'
import type { OrderStatus } from '@prisma/client'

const STATUS_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  PENDING: { label: 'Pending', bg: 'bg-[var(--color-accent)]/15', text: 'text-[var(--color-accent)]' },
  PROCESSING: { label: 'Processing', bg: 'bg-blue-500/15', text: 'text-blue-400' },
  SHIPPED: { label: 'Shipped', bg: 'bg-purple-500/15', text: 'text-purple-400' },
  DELIVERED: { label: 'Delivered', bg: 'bg-[var(--color-success)]/15', text: 'text-[var(--color-success)]' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-[var(--color-error)]/15', text: 'text-[var(--color-error)]' },
}

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const limit = 10

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const result = await accountApi.getOrders({ page, limit })
      setOrders(result.data)
      setTotal(result.total)
      setTotalPages(result.totalPages)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-foreground tracking-wider">Orders</h1>
        <p className="text-sm text-muted mt-1">{total} order{total !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-background-secondary rounded-lg animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-background-secondary rounded-lg border border-border p-8 text-center">
          <div className="text-4xl text-[var(--color-accent)]/30 mb-3">&#10022;</div>
          <h2 className="font-serif text-xl text-foreground mb-2">No Orders Yet</h2>
          <p className="text-sm text-muted mb-4">Your order history will appear here.</p>
          <Link href="/shop">
            <Button variant="primary" size="sm">Browse Collection</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = STATUS_LABELS[order.status] || STATUS_LABELS.PENDING
            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block bg-background-secondary rounded-lg border border-border p-5 hover:border-[var(--color-accent)]/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Order {order.shortId}</p>
                    <p className="text-xs text-muted">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div key={i} className="w-10 h-10 rounded bg-background overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || '/images/placeholder.jpg'}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-xs text-muted">+{order.items.length - 3} more</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                  <p className="font-serif text-lg text-[var(--color-accent)]">{formatTND(order.total)}</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="xs" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
            <Button variant="outline" size="xs" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  )
}
