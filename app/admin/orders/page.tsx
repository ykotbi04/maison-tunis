'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { adminApi, type AdminOrder } from '@/lib/api'
import { formatTND, formatDate } from '@/lib/formatters'
import type { OrderStatus } from '@prisma/client'

const STATUS_OPTIONS: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

function getStatusStyle(status: OrderStatus) {
  const map: Record<OrderStatus, { bg: string; text: string; label: string }> = {
    PENDING: { bg: 'bg-[var(--color-accent)]/15', text: 'text-[var(--color-accent)]', label: 'Pending' },
    PROCESSING: { bg: 'bg-blue-500/15', text: 'text-blue-400', label: 'Processing' },
    SHIPPED: { bg: 'bg-purple-500/15', text: 'text-purple-400', label: 'Shipped' },
    DELIVERED: { bg: 'bg-[var(--color-success)]/15', text: 'text-[var(--color-success)]', label: 'Delivered' },
    CANCELLED: { bg: 'bg-[var(--color-error)]/15', text: 'text-[var(--color-error)]', label: 'Cancelled' },
  }
  return map[status]
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [detailOrder, setDetailOrder] = useState<AdminOrder | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const limit = 10

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const result = await adminApi.getOrders({
        page,
        limit,
        search: search || undefined,
        status: statusFilter || undefined,
      })
      setOrders(result.data)
      setTotal(result.total)
      setTotalPages(result.totalPages)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(true)
    try {
      await adminApi.updateOrderStatus(orderId, newStatus)
      setDetailOrder(null)
      fetchOrders()
    } catch {
      // silent
    } finally {
      setUpdatingStatus(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl text-foreground tracking-wider">Orders</h1>
        <p className="text-sm text-muted mt-1">{total} orders total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by customer name, email, or order ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            aria-label="Search orders"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="h-10 px-4 bg-background-secondary border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-background-secondary rounded-lg border border-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-muted">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="grid">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => {
                  const status = getStatusStyle(order.status as OrderStatus)
                  return (
                    <tr key={order.id} className="hover:bg-background/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-foreground">{order.shortId}</td>
                      <td className="px-4 py-3">
                        <p className="text-foreground font-medium">{order.customer.name}</p>
                        <p className="text-xs text-muted">{order.customer.email}</p>
                      </td>
                      <td className="px-4 py-3 text-muted text-xs">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-3 font-medium text-[var(--color-accent)]">{formatTND(order.total)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setDetailOrder(order)}
                          className="text-xs text-muted hover:text-[var(--color-accent)] transition-colors px-2 py-1"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted">
              Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="xs" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
              <Button variant="outline" size="xs" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {detailOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-background-secondary rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-background-secondary z-10">
              <h3 className="font-serif text-lg text-foreground">Order {detailOrder.shortId}</h3>
              <button
                onClick={() => setDetailOrder(null)}
                className="text-muted hover:text-foreground transition-colors p-1"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer */}
              <div>
                <h4 className="text-xs font-medium text-muted uppercase tracking-wider mb-2">Customer</h4>
                <p className="text-sm text-foreground">{detailOrder.customer.name}</p>
                <p className="text-sm text-muted">{detailOrder.customer.email}</p>
              </div>

              {/* Shipping */}
              <div>
                <h4 className="text-xs font-medium text-muted uppercase tracking-wider mb-2">Shipping Address</h4>
                <p className="text-sm text-foreground">
                  {detailOrder.shipping.firstName} {detailOrder.shipping.lastName}<br />
                  {detailOrder.shipping.address}<br />
                  {detailOrder.shipping.city}, {detailOrder.shipping.state} {detailOrder.shipping.postalCode}<br />
                  {detailOrder.shipping.country}
                </p>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-xs font-medium text-muted uppercase tracking-wider mb-2">Items</h4>
                <div className="space-y-2">
                  {detailOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-foreground">
                        {item.name} <span className="text-muted">x{item.quantity}</span>
                        {item.size && <span className="text-muted"> ({item.size})</span>}
                      </span>
                      <span className="text-[var(--color-accent)]">{formatTND(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border space-y-1">
                  <div className="flex justify-between text-xs text-muted">
                    <span>Subtotal</span><span>{formatTND(detailOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted">
                    <span>Shipping</span><span>{formatTND(detailOrder.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted">
                    <span>Tax</span><span>{formatTND(detailOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-foreground pt-1">
                    <span>Total</span><span className="text-[var(--color-accent)]">{formatTND(detailOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h4 className="text-xs font-medium text-muted uppercase tracking-wider mb-2">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => {
                    const style = getStatusStyle(s)
                    const isCurrent = detailOrder.status === s
                    return (
                      <button
                        key={s}
                        onClick={() => !isCurrent && handleStatusUpdate(detailOrder.id, s)}
                        disabled={isCurrent || updatingStatus}
                        className={`text-xs font-medium px-3 py-1.5 rounded transition-colors ${
                          isCurrent
                            ? `${style.bg} ${style.text} cursor-default`
                            : 'bg-background border border-border text-muted hover:text-foreground hover:border-[var(--color-accent)]/30'
                        }`}
                      >
                        {style.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
