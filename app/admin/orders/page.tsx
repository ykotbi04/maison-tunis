'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { adminApi, type AdminOrder } from '@/lib/api'
import { formatTND, formatDate } from '@/lib/formatters'
import type { OrderStatus } from '@prisma/client'

const STATUS_OPTIONS: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

function getStatusStyle(status: OrderStatus) {
  const map: Record<OrderStatus, { bg: string; text: string; dot: string; label: string }> = {
    PENDING: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Pending' },
    PROCESSING: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', label: 'Processing' },
    SHIPPED: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500', label: 'Shipped' },
    DELIVERED: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Delivered' },
    CANCELLED: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', label: 'Cancelled' },
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
        <h1 className="text-2xl font-bold text-[var(--fg)] tracking-tight">Orders</h1>
        <p className="text-sm text-[var(--fg-muted)] mt-1">{total} orders total</p>
      </div>

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
          className="h-11 px-4 bg-white border border-[var(--border)] rounded-xl text-sm text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-[var(--fg-muted)]">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-10 h-10 text-[var(--fg-muted)] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
            <p className="text-sm text-[var(--fg-muted)] mb-2">No orders found</p>
            <p className="text-xs text-[var(--fg-muted)]">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="grid">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {orders.map((order) => {
                  const status = getStatusStyle(order.status as OrderStatus)
                  return (
                    <tr key={order.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-[var(--fg-secondary)]">{order.shortId}</td>
                      <td className="px-4 py-3">
                        <p className="text-[var(--fg)] font-medium">{order.customer.name}</p>
                        <p className="text-xs text-[var(--fg-muted)]">{order.customer.email}</p>
                      </td>
                      <td className="px-4 py-3 text-[var(--fg-muted)] text-xs hidden sm:table-cell">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-3 font-semibold text-[var(--fg)]">{formatTND(order.total)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setDetailOrder(order)}
                          className="text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors px-2 py-1 rounded-lg hover:bg-[var(--accent)]/10"
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
          <div className="px-4 py-3 border-t border-[var(--border)] flex items-center justify-between bg-[var(--bg-secondary)]">
            <p className="text-xs text-[var(--fg-muted)]">
              Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
              <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>

      {detailOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-[var(--border)] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-xl">
              <h3 className="text-base font-semibold text-[var(--fg)]">Order {detailOrder.shortId}</h3>
              <button
                onClick={() => setDetailOrder(null)}
                className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors p-1.5 rounded-lg hover:bg-[var(--bg-muted)]"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider mb-2">Customer</h4>
                  <p className="text-sm text-[var(--fg)] font-medium">{detailOrder.customer.name}</p>
                  <p className="text-sm text-[var(--fg-muted)]">{detailOrder.customer.email}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider mb-2">Shipping Address</h4>
                  <p className="text-sm text-[var(--fg-secondary)]">
                    {detailOrder.shipping.firstName} {detailOrder.shipping.lastName}<br />
                    {detailOrder.shipping.address}<br />
                    {detailOrder.shipping.city} {detailOrder.shipping.postalCode}<br />
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider mb-3">Items</h4>
                <div className="space-y-2">
                  {detailOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-2 border-b border-[var(--border-light)] last:border-0">
                      <span className="text-[var(--fg)]">
                        {item.name} <span className="text-[var(--fg-muted)]">x{item.quantity}</span>
                        {item.size && <span className="text-[var(--fg-muted)]"> ({item.size})</span>}
                      </span>
                      <span className="font-medium text-[var(--fg)]">{formatTND(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-1.5">
                  <div className="flex justify-between text-xs text-[var(--fg-muted)]">
                    <span>Subtotal</span><span>{formatTND(detailOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[var(--fg-muted)]">
                    <span>Shipping</span><span>{formatTND(detailOrder.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[var(--fg-muted)]">
                    <span>Tax</span><span>{formatTND(detailOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-[var(--fg)] pt-2 border-t border-[var(--border)]">
                    <span>Total</span><span>{formatTND(detailOrder.total)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider mb-3">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => {
                    const style = getStatusStyle(s)
                    const isCurrent = detailOrder.status === s
                    return (
                      <button
                        key={s}
                        onClick={() => !isCurrent && handleStatusUpdate(detailOrder.id, s)}
                        disabled={isCurrent || updatingStatus}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                          isCurrent
                            ? `${style.bg} ${style.text} cursor-default`
                            : 'bg-[var(--bg-muted)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-secondary)] border border-[var(--border)]'
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
