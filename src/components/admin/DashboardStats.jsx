import { useEffect, useState } from 'react'
import { getDashboardData } from '../../services/admin'
import { formatINR } from '../../utils/format'
import { PENDING_STATUSES } from '../../constants'

function StatCard({ label, value, accent = 'text-maroon', hint }) {
  return (
    <div className="card p-5">
      <p className="text-sm font-medium text-forest">{label}</p>
      <p className={`mt-2 font-heading text-3xl font-bold ${accent}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-forest/60">{hint}</p>}
    </div>
  )
}

export default function DashboardStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lowStock, setLowStock] = useState([])

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { orders, items, inventory } = await getDashboardData()

      if (orders.error || items.error || inventory.error) {
        setError(
          'Could not load dashboard data. Make sure the SQL schema has been run in Supabase.',
        )
        setLoading(false)
        return
      }

      const orderRows = orders.data || []
      const itemRows = items.data || []
      const invRows = inventory.data || []

      const activeItems = itemRows.filter(
        (it) => it.orders?.status !== 'Cancelled',
      )

      const totalSales = activeItems.reduce(
        (sum, it) => sum + Number(it.line_total || 0),
        0,
      )
      const totalCost = activeItems.reduce(
        (sum, it) =>
          sum + Number(it.quantity || 0) * Number(it.products?.net_rate || 0),
        0,
      )

      const pendingOrders = orderRows.filter((o) =>
        PENDING_STATUSES.includes(o.status),
      ).length

      const low = invRows.filter(
        (r) => Number(r.closing_stock) <= Number(r.low_stock_threshold ?? 5),
      )

      setLowStock(low)
      setStats({
        totalOrders: orderRows.length,
        totalSales,
        totalCost,
        totalProfit: totalSales - totalCost,
        pendingOrders,
        lowStockCount: low.length,
      })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <p className="text-forest">Loading dashboard…</p>
  if (error)
    return (
      <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
        {error}
      </div>
    )

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard
          label="Total Sales Amount"
          value={formatINR(stats.totalSales)}
          accent="text-forest"
        />
        <StatCard
          label="Total Cost Amount"
          value={formatINR(stats.totalCost)}
          accent="text-forest"
        />
        <StatCard
          label="Total Profit"
          value={formatINR(stats.totalProfit)}
          accent={stats.totalProfit >= 0 ? 'text-green-700' : 'text-red-700'}
        />
        <StatCard
          label="Pending Orders"
          value={stats.pendingOrders}
          accent="text-amber-700"
          hint="New, Confirmed, Preparing or Ready"
        />
        <StatCard
          label="Low Stock Items"
          value={stats.lowStockCount}
          accent={stats.lowStockCount > 0 ? 'text-red-700' : 'text-green-700'}
        />
      </div>

      {lowStock.length > 0 && (
        <div className="card mt-6 p-5">
          <h3 className="font-heading text-lg font-bold text-maroon">
            ⚠️ Low Stock Items
          </h3>
          <ul className="mt-3 divide-y divide-gold/20">
            {lowStock.map((r) => (
              <li key={r.id} className="flex justify-between py-2 text-sm">
                <span className="text-forest-dark">
                  {r.products?.name} {r.products?.size && `(${r.products.size})`}
                </span>
                <span className="font-semibold text-red-700">
                  {r.closing_stock} left
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-6 text-xs text-forest/60">
        Sales &amp; profit are calculated from website orders (excluding
        cancelled). Cost uses each product&apos;s net rate.
      </p>
    </div>
  )
}
