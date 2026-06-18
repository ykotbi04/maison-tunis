import type { OrderStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function formatOrderStatus(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
  }
  return labels[status]
}

export async function getAdminDashboard() {
  const now = new Date()
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
  const todayStart = startOfDay(now)
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [
    totalRevenueAgg,
    thisMonthRevenueAgg,
    lastMonthRevenueAgg,
    totalOrders,
    ordersToday,
    totalProducts,
    outOfStockProducts,
    totalCustomers,
    newCustomersThisWeek,
    recentOrdersRaw,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { status: { not: 'CANCELLED' } },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        status: { not: 'CANCELLED' },
        createdAt: { gte: startOfThisMonth },
      },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        status: { not: 'CANCELLED' },
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
      _sum: { total: true },
    }),
    prisma.order.count({ where: { status: { not: 'CANCELLED' } } }),
    prisma.order.count({
      where: { createdAt: { gte: todayStart }, status: { not: 'CANCELLED' } },
    }),
    prisma.product.count(),
    prisma.product.count({ where: { inStock: false } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.user.count({
      where: { role: 'CUSTOMER', createdAt: { gte: weekAgo } },
    }),
    prisma.order.findMany({
      where: { status: { not: 'CANCELLED' } },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
  ])

  const totalRevenue = Number(totalRevenueAgg._sum.total ?? 0)
  const thisMonthRevenue = Number(thisMonthRevenueAgg._sum.total ?? 0)
  const lastMonthRevenue = Number(lastMonthRevenueAgg._sum.total ?? 0)

  let revenueChangePercent = 0
  if (lastMonthRevenue > 0) {
    revenueChangePercent = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
  } else if (thisMonthRevenue > 0) {
    revenueChangePercent = 100
  }

  const recentOrders = recentOrdersRaw.map((order) => ({
    id: order.id.slice(-6).toUpperCase(),
    customer: order.user.name,
    amount: Number(order.total),
    status: formatOrderStatus(order.status),
    rawStatus: order.status,
  }))

  const recentActivity = recentOrdersRaw.slice(0, 3).map((order) => ({
    message: 'New order received',
    createdAt: order.createdAt.toISOString(),
  }))

  return {
    totalRevenue,
    revenueChangePercent,
    totalOrders,
    ordersToday,
    totalProducts,
    outOfStockProducts,
    totalCustomers,
    newCustomersThisWeek,
    recentOrders,
    recentActivity,
  }
}
