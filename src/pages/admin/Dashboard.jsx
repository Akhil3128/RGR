import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchOrders, fetchInventory, fetchProducts } from '../../lib/api'
import {
  calcCostAmount,
  calcProfit,
  calcSalesAmount,
  closingStock,
  formatPrice,
} from '../../lib/utils'
import { LOW_STOCK_THRESHOLD } from '../../data/sampleProducts'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

function StatCard({ label, value, tone = 'maroon' }) {
  const tones = {
    maroon: 'border-maroon/20 bg-cream-light text-maroon',
    green: 'border-green/20 bg-green/5 text-green',
    gold: 'border-gold/40 bg-gold/10 text-maroon-dark',
  }

  return (
    <div className={`rounded-xl border p-4 shadow-sm ${tones[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{label}</p>
      <p className="mt-2 font-display text-3xl">{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([fetchOrders(), fetchInventory(), fetchProducts()])
      .then(([orderData, invData, productData]) => {
        if (!active) return
        setOrders(orderData)
        setInventory(invData)
        setProducts(productData)
      })
      .catch((err) => {
        if (active) setError(err.message || 'Failed to load dashboard')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const stats = useMemo(() => {
    const activeOrders = orders.filter((o) => o.status !== 'Cancelled')
    let salesAmount = 0
    let costAmount = 0

    activeOrders.forEach((order) => {
      const items = order.order_items || []
      items.forEach((item) => {
        salesAmount += calcSalesAmount(item.quantity, item.unit_price)
        costAmount += calcCostAmount(item.quantity, item.net_rate)
      })
    })

    // Fallback: if no line items, use order total for sales
    if (salesAmount === 0) {
      salesAmount = activeOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)
    }

    const pendingOrders = orders.filter((o) =>
      ['New', 'Confirmed', 'Preparing', 'Ready'].includes(o.status)
    ).length

    const lowStock = inventory.filter((row) => closingStock(row) <= LOW_STOCK_THRESHOLD)

    return {
      totalOrders: orders.length,
      salesAmount,
      costAmount,
      profit: calcProfit(salesAmount, costAmount),
      pendingOrders,
      lowStockCount: lowStock.length,
      lowStock,
      productCount: products.length,
    }
  }, [orders, inventory, products])

  if (loading) return <LoadingSpinner label="Loading dashboard..." />
  if (error) {
    return <p className="rounded-md bg-maroon/10 px-4 py-3 text-sm text-maroon">{error}</p>
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-maroon">Dashboard</h1>
          <p className="text-sm text-green/75">Overview of orders, sales, and stock</p>
        </div>
        <div className="flex gap-2 text-sm">
          <Link to="/admin/orders" className="rounded-md bg-maroon px-3 py-2 text-cream hover:bg-maroon-light">
            Manage Orders
          </Link>
          <Link to="/admin/products" className="rounded-md border border-maroon/30 px-3 py-2 text-maroon hover:bg-cream-dark">
            Products
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Total Sales Amount" value={formatPrice(stats.salesAmount)} tone="green" />
        <StatCard label="Total Cost Amount" value={formatPrice(stats.costAmount)} />
        <StatCard label="Total Profit" value={formatPrice(stats.profit)} tone="gold" />
        <StatCard label="Pending Orders" value={stats.pendingOrders} tone="green" />
        <StatCard label="Low Stock Items" value={stats.lowStockCount} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gold/35 bg-cream-light p-4 shadow-sm">
          <h2 className="font-display text-xl text-maroon">Recent Orders</h2>
          <div className="gold-divider my-3" />
          {orders.length === 0 ? (
            <p className="text-sm text-green/70">No orders yet.</p>
          ) : (
            <ul className="space-y-2">
              {orders.slice(0, 5).map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border border-cream-dark bg-cream px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium text-maroon">{order.customer_name}</p>
                    <p className="text-xs text-green/70">
                      {order.status} · {order.payment_status}
                    </p>
                  </div>
                  <p className="font-semibold text-maroon-dark">
                    {formatPrice(order.total_amount)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-gold/35 bg-cream-light p-4 shadow-sm">
          <h2 className="font-display text-xl text-maroon">Low Stock</h2>
          <div className="gold-divider my-3" />
          {stats.lowStock.length === 0 ? (
            <p className="text-sm text-green/70">
              No low stock items (threshold: {LOW_STOCK_THRESHOLD}).
            </p>
          ) : (
            <ul className="space-y-2">
              {stats.lowStock.slice(0, 8).map((row) => (
                <li
                  key={row.id}
                  className="flex items-center justify-between rounded-lg border border-cream-dark bg-cream px-3 py-2 text-sm"
                >
                  <span className="text-maroon">
                    {row.products?.name || 'Product'}
                    {row.products?.size ? ` (${row.products.size})` : ''}
                  </span>
                  <span className="font-semibold text-maroon-dark">
                    Closing: {closingStock(row)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
