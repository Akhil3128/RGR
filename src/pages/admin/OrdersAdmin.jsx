import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { formatPrice, formatDate } from '../../lib/format'

const ORDER_STATUSES = [
  'new',
  'confirmed',
  'preparing',
  'ready',
  'delivered',
  'cancelled',
]
const PAYMENT_STATUSES = ['pending', 'paid', 'partial']

const STATUS_COLORS = {
  new: 'bg-gold/20 text-gold-dark',
  confirmed: 'bg-forest/10 text-forest',
  preparing: 'bg-gold/20 text-gold-dark',
  ready: 'bg-forest/10 text-forest',
  delivered: 'bg-forest/20 text-forest-dark',
  cancelled: 'bg-maroon/10 text-maroon',
}

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const loadOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
    if (!error) setOrders(data)
    setLoading(false)
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const updateOrder = async (orderId, changes) => {
    const { error } = await supabase.from('orders').update(changes).eq('id', orderId)
    if (!error) {
      setOrders((current) =>
        current.map((order) =>
          order.id === orderId ? { ...order, ...changes } : order
        )
      )
    }
  }

  if (loading) return <p className="text-forest/70">Loading orders…</p>

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-maroon">Orders</h1>
      <p className="mt-1 text-sm text-forest/70">
        Orders placed on the website appear here. Update the status as you
        prepare and deliver each order.
      </p>

      {orders.length === 0 ? (
        <div className="card mt-5 p-8 text-center text-forest/60">
          No orders yet. When a customer places an order on the website it will
          show up here.
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-4">
              {/* Header row */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-heading text-lg font-semibold text-maroon">
                    {order.customer_name}
                  </p>
                  <p className="text-sm text-forest/80">
                    📞{' '}
                    <a href={`tel:${order.phone}`} className="underline">
                      {order.phone}
                    </a>{' '}
                    · {formatDate(order.created_at)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                    STATUS_COLORS[order.status] || 'bg-cream-dark'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="mt-3 rounded-lg bg-cream-dark p-3 text-sm">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between py-0.5">
                    <span>
                      {item.product_name} ({item.size}) × {item.quantity}
                    </span>
                    <span>{formatPrice(item.line_total)}</span>
                  </div>
                ))}
                <div className="mt-2 flex justify-between border-t border-gold/30 pt-2 font-semibold text-maroon">
                  <span>Total</span>
                  <span>{formatPrice(order.total_amount)}</span>
                </div>
              </div>

              {/* Delivery details */}
              <div className="mt-3 text-sm text-forest">
                <p>
                  {order.delivery_type === 'delivery' ? '🚚 Delivery' : '🏠 Pickup'}
                  {order.address && ` — ${order.address}`}
                </p>
                {order.notes && <p className="mt-1">📝 {order.notes}</p>}
              </div>

              {/* Status controls */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase text-forest/60">
                    Order Status
                  </label>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrder(order.id, { status: e.target.value })}
                    className="input-field"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase text-forest/60">
                    Payment Status
                  </label>
                  <select
                    value={order.payment_status}
                    onChange={(e) =>
                      updateOrder(order.id, { payment_status: e.target.value })
                    }
                    className="input-field"
                  >
                    {PAYMENT_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
