import { useMemo } from 'react'
import StatCard from './StatCard'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { useOrders, useInventory } from '../../hooks/useAdminData'
import { useAllProducts } from '../../hooks/useProducts'
import { formatCurrency } from '../../utils/formatters'
import { LOW_STOCK_THRESHOLD } from '../../lib/constants'
import { isSupabaseConfigured } from '../../lib/supabase'

export default function Dashboard() {
  const { orders, loading: ordersLoading } = useOrders()
  const { inventory, loading: inventoryLoading } = useInventory()
  const { products } = useAllProducts()

  const stats = useMemo(() => {
    const totalOrders = orders.length
    const totalSales = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
    const pendingOrders = orders.filter((o) => o.status === 'New' || o.status === 'Confirmed').length

    let totalCost = 0
    orders.forEach((order) => {
      order.order_items?.forEach((item) => {
        const product = products.find((p) => p.id === item.product_id)
        const netRate = product?.net_rate || 0
        totalCost += item.quantity * netRate
      })
    })

    const totalProfit = totalSales - totalCost

    const lowStockItems = inventory.filter(
      (inv) => inv.closing_stock <= LOW_STOCK_THRESHOLD && inv.closing_stock >= 0
    )

    return { totalOrders, totalSales, totalCost, totalProfit, pendingOrders, lowStockItems }
  }, [orders, inventory, products])

  const recentOrders = orders.slice(0, 5)

  if (!isSupabaseConfigured) {
    return (
      <div>
        <h2 className="font-display text-2xl font-bold text-maroon mb-6">Dashboard</h2>
        <Card className="p-8 text-center">
          <p className="text-gray-500">
            Configure Supabase to see dashboard data. See README.md for setup instructions.
          </p>
        </Card>
      </div>
    )
  }

  if (ordersLoading || inventoryLoading) {
    return <p className="text-gray-500">Loading dashboard...</p>
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-maroon mb-6">Dashboard</h2>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Orders" value={stats.totalOrders} icon="📋" color="maroon" />
        <StatCard title="Total Sales" value={stats.totalSales} icon="💰" color="forest" isCurrency />
        <StatCard title="Total Cost" value={stats.totalCost} icon="📉" color="gold" isCurrency />
        <StatCard title="Total Profit" value={stats.totalProfit} icon="📈" color="green" isCurrency />
        <StatCard title="Pending Orders" value={stats.pendingOrders} icon="⏳" color="gold" />
        <StatCard title="Low Stock Items" value={stats.lowStockItems.length} icon="⚠️" color="red" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-display text-lg font-bold text-maroon mb-4">Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between text-sm border-b border-gold/10 pb-2">
                  <div>
                    <p className="font-medium text-maroon-dark">{order.customer_name}</p>
                    <p className="text-xs text-gray-500">{order.customer_phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(order.total_amount)}</p>
                    <Badge color={order.status === 'New' ? 'gold' : 'forest'}>{order.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="font-display text-lg font-bold text-maroon mb-4">Low Stock Alerts</h3>
          {stats.lowStockItems.length === 0 ? (
            <p className="text-sm text-gray-500">All items are well stocked.</p>
          ) : (
            <div className="space-y-3">
              {stats.lowStockItems.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between text-sm">
                  <p className="font-medium text-maroon-dark">
                    {inv.products?.name} — {inv.products?.size}
                  </p>
                  <Badge color="red">{inv.closing_stock} left</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
