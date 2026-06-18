'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'
import { FadeInUp, ScrollReveal } from '@/lib/animations'
import { adminApi } from '@/lib/api'
import { formatPercentage, formatRelativeTime, formatTND } from '@/lib/formatters'
import type { AdminDashboardData } from '@/types/admin'
import type { OrderStatus } from '@prisma/client'

interface StatCardProps {
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
}

const StatCard: React.FC<StatCardProps> = ({ label, value, change, trend }) => (
  <div className="bg-background-secondary rounded-lg p-6 border border-border">
    <p className="text-muted text-sm font-medium mb-2">{label}</p>
    <p className="font-serif text-3xl text-accent mb-3">{value}</p>
    <p className={`text-sm font-medium ${trend === 'up' ? 'text-success' : 'text-error'}`}>
      {trend === 'up' ? '↑' : '↓'} {change}
    </p>
  </div>
)

function getStatusClassName(status: OrderStatus): string {
  if (status === 'DELIVERED') {
    return 'bg-success/20 text-success'
  }
  if (status === 'PROCESSING' || status === 'SHIPPED') {
    return 'bg-warning/20 text-warning'
  }
  if (status === 'CANCELLED') {
    return 'bg-error/20 text-error'
  }
  return 'bg-accent/20 text-accent'
}

function buildStats(data: AdminDashboardData): StatCardProps[] {
  return [
    {
      label: 'Total Revenue',
      value: formatTND(data.totalRevenue),
      change: `${formatPercentage(Math.abs(data.revenueChangePercent))} vs last month`,
      trend: data.revenueChangePercent >= 0 ? 'up' : 'down',
    },
    {
      label: 'Orders',
      value: data.totalOrders.toLocaleString('en-US'),
      change: `${data.ordersToday} new today`,
      trend: data.ordersToday > 0 ? 'up' : 'down',
    },
    {
      label: 'Products',
      value: data.totalProducts.toLocaleString('en-US'),
      change: `${data.outOfStockProducts} out of stock`,
      trend: data.outOfStockProducts > 0 ? 'down' : 'up',
    },
    {
      label: 'Customers',
      value: data.totalCustomers.toLocaleString('en-US'),
      change: `${data.newCustomersThisWeek} new this week`,
      trend: data.newCustomersThisWeek > 0 ? 'up' : 'down',
    },
  ]
}

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true)
        const data = await adminApi.getDashboard()
        setDashboard(data)
        setError(null)
      } catch {
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const stats = useMemo(() => (dashboard ? buildStats(dashboard) : []), [dashboard])

  return (
    <>
      {/* Header */}
      <Section variant="default" spacing="lg">
        <Container>
          <FadeInUp delay={0.1}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-5xl text-foreground mb-2 tracking-widest">
                  Dashboard
                </h1>
                <p className="text-muted">Welcome back, Admin</p>
              </div>
              <Link href="/admin/products/new">
                <Button variant="primary" size="lg" className="font-medium">
                  New Product
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </Container>
      </Section>

      {/* Dashboard Content */}
      <Section variant="dark" spacing="lg">
        <Container>
          {loading ? (
            <p className="text-muted text-center py-12">Loading dashboard...</p>
          ) : error ? (
            <p className="text-error text-center py-12">{error}</p>
          ) : dashboard ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, idx) => (
                  <ScrollReveal key={stat.label} delay={idx * 0.1}>
                    <StatCard {...stat} />
                  </ScrollReveal>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2">
                  <FadeInUp delay={0.3}>
                    <div className="bg-background rounded-lg border border-border overflow-hidden">
                      <div className="p-6 border-b border-border">
                        <h2 className="font-serif text-2xl text-foreground tracking-wider">
                          Recent Orders
                        </h2>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="border-b border-border">
                            <tr>
                              <th className="px-6 py-3 text-left text-muted font-semibold">Order ID</th>
                              <th className="px-6 py-3 text-left text-muted font-semibold">Customer</th>
                              <th className="px-6 py-3 text-left text-muted font-semibold">Amount</th>
                              <th className="px-6 py-3 text-left text-muted font-semibold">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dashboard.recentOrders.length > 0 ? (
                              dashboard.recentOrders.map((order) => (
                                <tr
                                  key={order.id}
                                  className="border-b border-border hover:bg-background-secondary transition-colors"
                                >
                                  <td className="px-6 py-3 font-serif text-foreground">{order.id}</td>
                                  <td className="px-6 py-3 text-foreground">{order.customer}</td>
                                  <td className="px-6 py-3 font-medium text-accent">
                                    {formatTND(order.amount)}
                                  </td>
                                  <td className="px-6 py-3">
                                    <span
                                      className={`px-3 py-1 rounded text-xs font-medium ${getStatusClassName(order.rawStatus)}`}
                                    >
                                      {order.status}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-muted">
                                  No orders yet
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="px-6 py-4 border-t border-border">
                        <Link href="/admin/orders">
                          <Button variant="outline" size="sm">
                            View All Orders
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </FadeInUp>
                </div>

                {/* Quick Actions */}
                <div>
                  <FadeInUp delay={0.4}>
                    <div className="bg-background rounded-lg border border-border p-6">
                      <h3 className="font-serif text-xl text-foreground mb-4 tracking-wide">
                        Quick Actions
                      </h3>
                      <div className="space-y-2">
                        <Link href="/admin/products">
                          <Button variant="secondary" size="md" fullWidth className="justify-start font-medium">
                            Manage Products
                          </Button>
                        </Link>
                        <Link href="/admin/analytics">
                          <Button variant="secondary" size="md" fullWidth className="justify-start font-medium">
                            View Analytics
                          </Button>
                        </Link>
                        <Link href="/admin/support">
                          <Button variant="secondary" size="md" fullWidth className="justify-start font-medium">
                            Customer Support
                          </Button>
                        </Link>
                        <Link href="/admin/inventory">
                          <Button variant="secondary" size="md" fullWidth className="justify-start font-medium">
                            Inventory
                          </Button>
                        </Link>
                        <Link href="/admin/settings">
                          <Button variant="secondary" size="md" fullWidth className="justify-start font-medium">
                            Settings
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </FadeInUp>

                  {/* Activity */}
                  <FadeInUp delay={0.5}>
                    <div className="bg-background rounded-lg border border-border p-6 mt-6">
                      <h3 className="font-serif text-xl text-foreground mb-4 tracking-wide">
                        Recent Activity
                      </h3>
                      <div className="space-y-3 text-sm">
                        {dashboard.recentActivity.length > 0 ? (
                          dashboard.recentActivity.map((activity, idx) => (
                            <div
                              key={`${activity.createdAt}-${idx}`}
                              className={
                                idx < dashboard.recentActivity.length - 1
                                  ? 'pb-3 border-b border-border'
                                  : undefined
                              }
                            >
                              <p className="text-foreground font-medium">{activity.message}</p>
                              <p className="text-muted text-xs">
                                {formatRelativeTime(activity.createdAt)}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted">No recent activity</p>
                        )}
                      </div>
                    </div>
                  </FadeInUp>
                </div>
              </div>
            </>
          ) : null}
        </Container>
      </Section>
    </>
  )
}
