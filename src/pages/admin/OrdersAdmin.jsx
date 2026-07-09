import { useEffect, useState } from 'react'
import { fetchOrders, updateOrder } from '../../lib/api'
import { formatPrice } from '../../lib/utils'
import { ORDER_STATUSES, PAYMENT_STATUSES } from '../../data/sampleProducts'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchOrders()
      setOrders(data)
    } catch (err) {
      setError(err.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onStatusChange = async (id, field, value) => {
    try {
      await updateOrder(id, { [field]: value })
      await load()
    } catch (err) {
      setError(err.message || 'Could not update order')
    }
  }

  const filtered =
    filter === 'All' ? orders : orders.filter((o) => o.status === filter)

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-maroon">Orders</h1>
          <p className="text-sm text-green/75">Orders received from the website</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border border-gold/40 bg-cream px-3 py-2 text-sm"
        >
          <option value="All">All statuses</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="mb-4 rounded-md bg-maroon/10 px-3 py-2 text-sm text-maroon">{error}</p>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gold/50 bg-cream-light p-8 text-center text-sm text-green/70">
          No orders found.
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <article
              key={order.id}
              className="rounded-xl border border-gold/35 bg-cream-light p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl text-maroon">{order.customer_name}</h2>
                  <p className="text-sm text-green/80">{order.phone}</p>
                  <p className="mt-1 text-xs text-maroon/60">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleString('en-IN')
                      : ''}
                  </p>
                </div>
                <p className="font-display text-2xl text-maroon-dark">
                  {formatPrice(order.total_amount)}
                </p>
              </div>

              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <p>
                  <span className="font-medium text-maroon">Type:</span>{' '}
                  {order.delivery_type === 'delivery' ? 'Delivery' : 'Pickup'}
                </p>
                {order.address && (
                  <p className="sm:col-span-2">
                    <span className="font-medium text-maroon">Address:</span> {order.address}
                  </p>
                )}
                {order.notes && (
                  <p className="sm:col-span-2">
                    <span className="font-medium text-maroon">Notes:</span> {order.notes}
                  </p>
                )}
              </div>

              {(order.order_items || []).length > 0 && (
                <ul className="mt-3 space-y-1 rounded-lg border border-cream-dark bg-cream p-3 text-sm">
                  {order.order_items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-2">
                      <span>
                        {item.product_name}
                        {item.product_size ? ` (${item.product_size})` : ''} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatPrice(item.quantity * item.unit_price)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                <label className="text-sm">
                  <span className="mb-1 block font-medium text-maroon">Order Status</span>
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order.id, 'status', e.target.value)}
                    className="rounded-md border border-gold/40 bg-cream px-3 py-2"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm">
                  <span className="mb-1 block font-medium text-maroon">Payment</span>
                  <select
                    value={order.payment_status}
                    onChange={(e) =>
                      onStatusChange(order.id, 'payment_status', e.target.value)
                    }
                    className="rounded-md border border-gold/40 bg-cream px-3 py-2"
                  >
                    {PAYMENT_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
