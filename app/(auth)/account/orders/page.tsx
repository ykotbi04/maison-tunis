'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { accountApi, type CustomerOrder } from '@/lib/api'
import { formatTND, formatDate } from '@/lib/formatters'

const STATUS_LABELS: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  PENDING: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  PROCESSING: { label: 'Processing', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  SHIPPED: { label: 'Shipped', bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  DELIVERED: { label: 'Delivered', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
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
        <h1 className="text-2xl font-bold text-[var(--fg)] tracking-tight">Orders</h1>
        <p className="text-sm text-[var(--fg-muted)] mt-1">{total} order{total !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-xl border border-[var(--border)] animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-[var(--border)] p-8 text-center">
          <div className="w-12 h-12 bg-[var(--bg-muted)] rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-[var(--fg-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-[var(--fg)] mb-1">No Orders Yet</h2>
          <p className="text-sm text-[var(--fg-muted)] mb-4">Your order history will appear here.</p>
           <Link href="/collections">
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
                className="block bg-white rounded-xl border border-[var(--border)] p-5 hover:border-[var(--accent)]/30 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--fg)]">Order {order.shortId}</p>
                    <p className="text-xs text-[var(--fg-muted)] mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div key={i} className="w-10 h-10 rounded-lg bg-[var(--bg-muted)] overflow-hidden flex-shrink-0">
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
                    <span className="text-xs text-[var(--fg-muted)]">+{order.items.length - 3} more</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-[var(--fg-muted)]">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-lg font-bold text-[var(--fg)]">{formatTND(order.total)}</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-[var(--fg-muted)]">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
            <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  )
}
