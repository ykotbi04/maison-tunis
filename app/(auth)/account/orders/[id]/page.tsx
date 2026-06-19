'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { checkoutApi } from '@/lib/api'
import type { Order } from '@/types/checkout'
import { formatTND, formatDate } from '@/lib/formatters'

const STATUS_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pending', bg: 'bg-[var(--color-accent)]/15', text: 'text-[var(--color-accent)]' },
  processing: { label: 'Processing', bg: 'bg-blue-500/15', text: 'text-blue-400' },
  shipped: { label: 'Shipped', bg: 'bg-purple-500/15', text: 'text-purple-400' },
  delivered: { label: 'Delivered', bg: 'bg-[var(--color-success)]/15', text: 'text-[var(--color-success)]' },
  cancelled: { label: 'Cancelled', bg: 'bg-[var(--color-error)]/15', text: 'text-[var(--color-error)]' },
}

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered']

function StatusProgress({ status }: { status: string }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 text-[var(--color-error)]">
        <div className="w-3 h-3 rounded-full bg-[var(--color-error)]" />
        <span className="text-sm font-medium">Order Cancelled</span>
      </div>
    )
  }
  const currentIdx = STATUS_STEPS.indexOf(status)
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {STATUS_STEPS.map((step, i) => (
          <div key={step} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${i <= currentIdx ? 'bg-[var(--color-accent)]' : 'bg-border'}`} />
            {i < STATUS_STEPS.length - 1 && (
              <div className={`w-8 h-0.5 ${i < currentIdx ? 'bg-[var(--color-accent)]' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>
      <p className="text-sm text-muted">{STATUS_LABELS[status]?.label || status}</p>
    </div>
  )
}

export default function AccountOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    ;(async () => {
      try {
        const data = await checkoutApi.getOrder(id)
        if (!cancelled) setOrder(data)
      } catch {
        if (!cancelled) setError('Order not found')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return <div className="p-8 text-center text-sm text-muted">Loading order...</div>
  }

  if (error || !order) {
    return (
      <div className="text-center space-y-4 py-12">
        <p className="text-sm text-[var(--color-error)]">{error || 'Order not found'}</p>
        <Button variant="outline" size="sm" onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  const status = STATUS_LABELS[order.status] || STATUS_LABELS.pending

  return (
    <div className="space-y-8">
      <div>
        <button onClick={() => router.back()} className="text-xs text-muted hover:text-[var(--color-accent)] transition-colors mb-3">
          &larr; Back to orders
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-2xl text-foreground tracking-wider">Order {order.id.slice(-6).toUpperCase()}</h1>
            <p className="text-xs text-muted mt-1">{formatDate(order.createdAt)}</p>
          </div>
          <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded ${status.bg} ${status.text}`}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="bg-background-secondary rounded-lg border border-border p-6">
        <h2 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Order Status</h2>
        <StatusProgress status={order.status} />
      </div>

      {/* Items */}
      <div className="bg-background-secondary rounded-lg border border-border p-6">
        <h2 className="text-xs font-medium text-muted uppercase tracking-wider mb-4">Items</h2>
        <div className="space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-14 h-14 rounded bg-background overflow-hidden flex-shrink-0">
                <Image
                  src={item.image || '/images/placeholder.jpg'}
                  alt={item.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                <p className="text-xs text-muted">
                  {item.size && `${item.size} · `}
                  {item.color && item.color}
                  {item.quantity > 1 && ` · Qty: ${item.quantity}`}
                </p>
              </div>
              <p className="text-sm font-medium text-[var(--color-accent)] flex-shrink-0">
                {formatTND(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border space-y-2">
          <div className="flex justify-between text-xs text-muted">
            <span>Subtotal</span><span>{formatTND(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-xs text-muted">
            <span>Shipping</span><span>{order.shippingCost === 0 ? 'Free' : formatTND(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between text-xs text-muted">
            <span>Tax (19% VAT)</span><span>{formatTND(order.tax)}</span>
          </div>
          <div className="flex justify-between text-sm font-medium text-foreground pt-2 border-t border-border">
            <span>Total</span><span className="text-[var(--color-accent)]">{formatTND(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-background-secondary rounded-lg border border-border p-6">
        <h2 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Shipping Address</h2>
        <p className="text-sm text-foreground">
          {order.shipping.firstName} {order.shipping.lastName}<br />
          {order.shipping.address}<br />
          {order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}<br />
          {order.shipping.country}
        </p>
        <p className="text-xs text-muted mt-2">{order.shipping.email} &middot; {order.shipping.phone}</p>
      </div>
    </div>
  )
}
