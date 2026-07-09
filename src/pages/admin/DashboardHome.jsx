import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import StatCard from '../../components/admin/StatCard'
import { formatCurrency } from '../../utils/format'

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalCost: 0,
    totalProfit: 0,
    pendingOrders: 0,
    lowStockItems: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    setLoading(true)
    setError('')

    const [ordersRes, lowStockRes] = await Promise.all([
      supabase
        .from('orders')
        .select('id, status, order_items(quantity, unit_price, products(net_rate))'),
      supabase.from('latest_inventory').select('closing_stock, products(low_stock_threshold)'),
    ])

    if (ordersRes.error) {
      setError(ordersRes.error.message)
      setLoading(false)
      return
    }

    const orders = ordersRes.data || []
    let totalSales = 0
    let totalCost = 0

    orders.forEach((order) => {
      order.order_items?.forEach((item) => {
        const qty = item.quantity || 0
        totalSales += qty * (item.unit_price || 0)
        totalCost += qty * (item.products?.net_rate || 0)
      })
    })

    const pendingOrders = orders.filter((o) => !['Delivered', 'Cancelled'].includes(o.status)).length

    const lowStockItems = (lowStockRes.data || []).filter(
      (row) => row.closing_stock !== null && row.closing_stock <= (row.products?.low_stock_threshold ?? 5)
    ).length

    setStats({
      totalOrders: orders.length,
      totalSales,
      totalCost,
      totalProfit: totalSales - totalCost,
      pendingOrders,
      lowStockItems,
    })
    setLoading(false)
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-maroon mb-5">Dashboard</h1>

      {error && <p className="mb-4 rounded-lg bg-maroon/10 text-maroon text-sm px-4 py-2">{error}</p>}

      {loading ? (
        <p className="text-forest-dark/60">Loading dashboard...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard label="Total Orders" value={stats.totalOrders} accent="maroon" icon="📦" />
          <StatCard label="Pending Orders" value={stats.pendingOrders} accent="gold" icon="⏳" />
          <StatCard label="Low Stock Items" value={stats.lowStockItems} accent="gold" icon="⚠️" />
          <StatCard label="Total Sales Amount" value={formatCurrency(stats.totalSales)} accent="forest" icon="💰" />
          <StatCard label="Total Cost Amount" value={formatCurrency(stats.totalCost)} accent="forest" icon="🧾" />
          <StatCard label="Total Profit" value={formatCurrency(stats.totalProfit)} accent="forest" icon="📈" />
        </div>
      )}
    </div>
  )
}
