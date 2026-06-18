import type { OrderStatus } from '@prisma/client'

export interface AdminDashboardData {
  totalRevenue: number
  revenueChangePercent: number
  totalOrders: number
  ordersToday: number
  totalProducts: number
  outOfStockProducts: number
  totalCustomers: number
  newCustomersThisWeek: number
  recentOrders: Array<{
    id: string
    customer: string
    amount: number
    status: string
    rawStatus: OrderStatus
  }>
  recentActivity: Array<{
    message: string
    createdAt: string
  }>
}
