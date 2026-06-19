'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { adminApi } from '@/lib/api'
import type { AdminDashboardData } from '@/types/admin'
import { formatTND, formatPercentage, formatRelativeTime } from '@/lib/formatters'
import type { OrderStatus } from '@prisma/client'

function getStatusStyle(status: OrderStatus): { bg: string; text: string; label: string } {
  const map: Record<OrderStatus, { bg: string; text: string; label: string }> = {
    PENDING: { bg: 'bg-[var(--color-accent)]/15', text: 'text-[var(--color-accent)]', label: 'Pending' },
    PROCESSING: { bg: 'bg-blue-500/15', text: 'text-blue-400', label: 'Processing' },
    SHIPPED: { bg: 'bg-purple-500/15', text: 'text-purple-400', label: 'Shipped' },
    DELIVERED: { bg: 'bg-[var(--color-success)]/15', text: 'text-[var(--color-success)]', label: 'Delivered' },
    CANCELLED: { bg: 'bg-[var(--color-error)]/15', text: 'text-[var(--color-error)]', label: 'Cancelled' },
  }
  return map[status]
}

function RevenueChart({ data }: { data: AdminDashboardData }) {
  const revenue = data.totalRevenue
  const change = data.revenueChangePercent

  return (
    <div className="bg-background-secondary rounded-lg border border-border p-6">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="text-sm font-medium text-muted">Total Revenue</h3>
        <span
          className={`text-xs font-medium ${change >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}
        >
          {change >= 0 ? '+' : ''}{formatPercentage(change)}
        </span>
      </div>
      <p className="font-serif text-3xl text-[var(--color-accent)] mb-4">{formatTND(revenue)}</p>
      <div className="flex items-end gap-1 h-12">
        {[0.3, 0.5, 0.7, 0.4, 0.8, 0.6, 1].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-[var(--color-accent)]/20 rounded-t transition-all hover:bg-[var(--color-accent)]/40"
            style={{ height: `${h * 100}%` }}
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-muted">
        <span>7d ago</span>
        <span>Today</span>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const result = await adminApi.getDashboard()
        if (!cancelled) setData(result)
      } catch {
        if (!cancelled) setError('Failed to load dashboard')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-48 bg-background-secondary rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-background-secondary rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-[var(--color-error)]">{error}</p>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl lg:text-4xl text-foreground tracking-wider">
            Dashboard
          </h1>
          <p className="text-sm text-muted mt-1">Store overview at a glance</p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="primary" size="sm">+ New Product</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue', value: formatTND(data.totalRevenue), sub: `${formatPercentage(Math.abs(data.revenueChangePercent))} vs last month`, accent: true },
          { label: 'Orders', value: data.totalOrders.toString(), sub: `${data.ordersToday} today` },
          { label: 'Products', value: data.totalProducts.toString(), sub: `${data.outOfStockProducts} out of stock` },
          { label: 'Customers', value: data.totalCustomers.toString(), sub: `${data.newCustomersThisWeek} new this week` },
        ].map((stat) => (
          <div key={stat.label} className="bg-background-secondary rounded-lg border border-border p-5">
            <p className="text-xs text-muted uppercase tracking-wider mb-2">{stat.label}</p>
            <p className={`font-serif text-2xl ${stat.accent ? 'text-[var(--color-accent)]' : 'text-foreground'}`}>
              {stat.value}
            </p>
            <p className="text-xs text-muted mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-1">
          <RevenueChart data={data} />
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-background-secondary rounded-lg border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-serif text-lg text-foreground tracking-wide">Recent Orders</h2>
              <Link href="/admin/orders" className="text-xs text-[var(--color-accent)] hover:underline">
                View all
              </Link>
            </div>
            {data.recentOrders.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-muted">No orders yet</div>
            ) : (
              <div className="divide-y divide-border">
                {data.recentOrders.map((order) => {
                  const status = getStatusStyle(order.rawStatus)
                  return (
                    <Link
                      key={order.id}
                      href={`/admin/orders`}
                      className="flex items-center justify-between px-6 py-3 hover:bg-background transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-foreground font-medium truncate">{order.customer}</p>
                        <p className="text-xs text-muted">Order {order.id}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-sm font-medium text-foreground">{formatTND(order.amount)}</p>
                        <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: '/admin/products', label: 'Manage Products', desc: 'Add, edit, remove products' },
          { href: '/admin/orders', label: 'Manage Orders', desc: 'View and update order status' },
          { href: '/admin/categories', label: 'Manage Categories', desc: 'Organize your catalog' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-background-secondary rounded-lg border border-border p-5 hover:border-[var(--color-accent)]/30 transition-colors group"
          >
            <p className="text-sm font-medium text-foreground group-hover:text-[var(--color-accent)] transition-colors">{link.label}</p>
            <p className="text-xs text-muted mt-1">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
