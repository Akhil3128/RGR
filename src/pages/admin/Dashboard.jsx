import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../lib/format'

const LOW_STOCK_LIMIT = 5

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [lowStockItems, setLowStockItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadStats() {
      // 1. All orders (for counts + sales totals)
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, status, total_amount')
      if (ordersError) return setError(ordersError.message)

      // 2. Order items with the product's net rate (for cost + profit)
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('quantity, line_total, order:orders(status), product:products(net_rate)')
      if (itemsError) return setError(itemsError.message)

      // 3. Inventory joined with product names (for low stock warning)
      const { data: inventory, error: inventoryError } = await supabase
        .from('inventory')
        .select('closing_stock, product:products(name, size)')
      if (inventoryError) return setError(inventoryError.message)

      // Cancelled orders are excluded from money calculations.
      const activeItems = orderItems.filter(
        (item) => item.order?.status !== 'cancelled'
      )

      // Sales Amount = Qty Sold × Selling Price (already stored as line_total)
      const totalSales = activeItems.reduce(
        (sum, item) => sum + Number(item.line_total),
        0
      )
      // Cost Amount = Qty Sold × Net Rate
      const totalCost = activeItems.reduce(
        (sum, item) => sum + item.quantity * Number(item.product?.net_rate || 0),
        0
      )

      const pendingOrders = orders.filter((order) =>
        ['new', 'confirmed', 'preparing'].includes(order.status)
      ).length

      const lowStock = inventory.filter(
        (row) => Number(row.closing_stock) <= LOW_STOCK_LIMIT
      )

      setStats({
        totalOrders: orders.length,
        totalSales,
        totalCost,
        // Profit = Sales Amount - Cost Amount
        totalProfit: totalSales - totalCost,
        pendingOrders,
        lowStockCount: lowStock.length,
      })
      setLowStockItems(lowStock)
    }

    loadStats()
  }, [])

  if (error) {
    return (
      <p className="rounded-lg bg-maroon/10 px-4 py-3 text-sm text-maroon">
        Could not load dashboard: {error}. Make sure you ran{' '}
        <code>supabase/schema.sql</code> in your Supabase project.
      </p>
    )
  }

  if (!stats) {
    return <p className="text-forest/70">Loading dashboard…</p>
  }

  const cards = [
    { label: 'Total Orders', value: stats.totalOrders, emoji: '🧾' },
    { label: 'Total Sales Amount', value: formatPrice(stats.totalSales), emoji: '💰' },
    { label: 'Total Cost Amount', value: formatPrice(stats.totalCost), emoji: '🏷️' },
    { label: 'Total Profit', value: formatPrice(stats.totalProfit), emoji: '📈' },
    { label: 'Pending Orders', value: stats.pendingOrders, emoji: '⏳' },
    { label: 'Low Stock Items', value: stats.lowStockCount, emoji: '⚠️' },
  ]

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-maroon">Dashboard</h1>

      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="card p-4">
            <span className="text-2xl">{card.emoji}</span>
            <p className="mt-2 text-xs text-forest/70">{card.label}</p>
            <p className="mt-1 font-heading text-xl font-bold text-maroon sm:text-2xl">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {lowStockItems.length > 0 && (
        <div className="card mt-6 p-4">
          <h2 className="font-heading text-lg font-semibold text-maroon">
            ⚠️ Low Stock Items (≤ {LOW_STOCK_LIMIT})
          </h2>
          <ul className="mt-3 space-y-1 text-sm text-forest">
            {lowStockItems.map((row, index) => (
              <li key={index} className="flex justify-between border-b border-gold/20 pb-1">
                <span>
                  {row.product?.name} ({row.product?.size})
                </span>
                <span className="font-semibold text-maroon">
                  {row.closing_stock} left
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-6 text-xs text-forest/60">
        💡 Formulas: Sales = Qty × Selling Price · Cost = Qty × Net Rate ·
        Profit = Sales − Cost. Cancelled orders are not counted in totals.
      </p>
    </div>
  )
}
