'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { adminApi } from '@/lib/api'
import type { AdminDashboardData } from '@/types/admin'
import { formatTND, formatPercentage } from '@/lib/formatters'
import type { OrderStatus } from '@prisma/client'

function getStatusStyle(status: OrderStatus): { bg: string; text: string; dot: string; label: string } {
  const map: Record<OrderStatus, { bg: string; text: string; dot: string; label: string }> = {
    PENDING: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Pending' },
    PROCESSING: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', label: 'Processing' },
    SHIPPED: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500', label: 'Shipped' },
    DELIVERED: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Delivered' },
    CANCELLED: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', label: 'Cancelled' },
  }
  return map[status]
}

function StatCard({ label, value, sub, icon, trend }: { label: string; value: string; sub: string; icon: React.ReactNode; trend?: number }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--fg-muted)]">{label}</p>
          <p className="text-2xl font-bold text-[var(--fg)] mt-1 tracking-tight">{value}</p>
          <p className="text-xs text-[var(--fg-muted)] mt-1">{sub}</p>
        </div>
        <div className="w-10 h-10 bg-[var(--accent)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-[var(--accent)]">{icon}</span>
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1">
          <span className={`text-xs font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{formatPercentage(trend)}
          </span>
          <span className="text-xs text-[var(--fg-muted)]">vs last month</span>
        </div>
      )}
    </div>
  )
}

function RevenueChart({ data }: { data: AdminDashboardData }) {
  const revenue = data.totalRevenue
  const change = data.revenueChangePercent

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[var(--fg)]">Revenue</h3>
          <p className="text-xs text-[var(--fg-muted)] mt-0.5">Last 7 days</p>
        </div>
        <span className={`text-xs font-medium ${change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
          {change >= 0 ? '+' : ''}{formatPercentage(change)}
        </span>
      </div>
      <p className="text-3xl font-bold text-[var(--fg)] tracking-tight mb-4">{formatTND(revenue)}</p>
      <div className="flex items-end gap-1 h-16">
        {[0.3, 0.5, 0.7, 0.4, 0.8, 0.6, 1].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-[var(--accent)]/10 rounded-sm transition-all hover:bg-[var(--accent)]/20"
            style={{ height: `${h * 100}%` }}
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-[var(--fg-muted)]">
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
      <div className="p-6 lg:p-8 space-y-6">
        <div className="h-8 w-48 bg-[var(--bg-muted)] rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-xl border border-[var(--border)] animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--fg)] tracking-tight">Dashboard</h1>
          <p className="text-sm text-[var(--fg-muted)] mt-1">Store overview at a glance</p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="primary" size="md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Revenue"
          value={formatTND(data.totalRevenue)}
          sub={`${formatPercentage(Math.abs(data.revenueChangePercent))} vs last month`}
          trend={data.revenueChangePercent}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Orders"
          value={data.totalOrders.toString()}
          sub={`${data.ordersToday} today`}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          }
        />
        <StatCard
          label="Products"
          value={data.totalProducts.toString()}
          sub={`${data.outOfStockProducts} out of stock`}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          }
        />
        <StatCard
          label="Customers"
          value={data.totalCustomers.toString()}
          sub={`${data.newCustomersThisWeek} new this week`}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RevenueChart data={data} />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[var(--fg)]">Recent Orders</h2>
              <Link href="/admin/orders" className="text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
                View all
              </Link>
            </div>
            {data.recentOrders.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg className="w-10 h-10 text-[var(--fg-muted)] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                </svg>
                <p className="text-sm text-[var(--fg-muted)]">No orders yet</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {data.recentOrders.map((order) => {
                  const status = getStatusStyle(order.rawStatus)
                  return (
                    <Link
                      key={order.id}
                      href="/admin/orders"
                      className="flex items-center justify-between px-6 py-3.5 hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--fg)] truncate">{order.customer}</p>
                        <p className="text-xs text-[var(--fg-muted)] mt-0.5">Order {order.id}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-sm font-semibold text-[var(--fg)]">{formatTND(order.amount)}</p>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: '/admin/products', label: 'Manage Products', desc: 'Add, edit, remove products', icon: '📦' },
          { href: '/admin/orders', label: 'Manage Orders', desc: 'View and update order status', icon: '📋' },
          { href: '/admin/categories', label: 'Manage Categories', desc: 'Organize your catalog', icon: '🏷️' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-white rounded-xl border border-[var(--border)] p-5 hover:border-[var(--accent)]/30 hover:shadow-md transition-all duration-200 group"
          >
            <div className="text-2xl mb-3">{link.icon}</div>
            <p className="text-sm font-semibold text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">{link.label}</p>
            <p className="text-xs text-[var(--fg-muted)] mt-1">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
