import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { formatCurrency } from '../../utils/format'

const STATUS_OPTIONS = ['New', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled']
const PAYMENT_OPTIONS = ['Pending', 'Paid', 'Partial']

const STATUS_COLORS = {
  New: 'bg-gold/20 text-gold-dark',
  Confirmed: 'bg-forest/10 text-forest-dark',
  Preparing: 'bg-forest/10 text-forest-dark',
  Ready: 'bg-forest/20 text-forest-dark',
  Delivered: 'bg-forest text-cream',
  Cancelled: 'bg-maroon/10 text-maroon',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  async function loadOrders() {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
    if (fetchError) setError(fetchError.message)
    else setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadOrders()
  }, [])

  async function updateField(orderId, field, value) {
    const { error: updateError } = await supabase.from('orders').update({ [field]: value }).eq('id', orderId)
    if (updateError) {
      setError(updateError.message)
      return
    }
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, [field]: value } : o)))
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-maroon mb-5">Orders</h1>

      {error && <p className="mb-4 rounded-lg bg-maroon/10 text-maroon text-sm px-4 py-2">{error}</p>}

      {loading ? (
        <p className="text-forest-dark/60">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-maroon/10 bg-white p-8 text-center text-forest-dark/60 shadow-soft">
          No orders yet. Orders placed from the website will show up here.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-maroon/10 bg-white shadow-soft overflow-hidden">
              <button
                className="w-full flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 text-left"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <div>
                  <p className="font-semibold text-maroon-dark">
                    {order.customer_name}{' '}
                    <span className="text-xs text-forest-dark/50 font-normal">
                      &bull; {new Date(order.created_at).toLocaleString('en-IN')}
                    </span>
                  </p>
                  <p className="text-xs text-forest-dark/60 mt-0.5">
                    {order.phone} &bull; {order.fulfillment_type === 'delivery' ? 'Home Delivery' : 'Store Pickup'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-forest-dark">{formatCurrency(order.total_amount)}</span>
                </div>
              </button>

              {expandedId === order.id && (
                <div className="border-t border-maroon/10 px-4 sm:px-5 py-4 bg-cream/40">
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-semibold text-forest-dark/70 mb-1">Items</p>
                      <ul className="text-sm space-y-1">
                        {order.order_items?.map((item) => (
                          <li key={item.id} className="flex justify-between gap-2">
                            <span>
                              {item.product_name} ({item.size}) x {item.quantity}
                            </span>
                            <span className="font-medium">{formatCurrency(item.quantity * (item.unit_price || 0))}</span>
                          </li>
                        ))}
                      </ul>
                      {order.fulfillment_type === 'delivery' && order.address && (
                        <p className="text-xs text-forest-dark/70 mt-2">
                          <span className="font-semibold">Address:</span> {order.address}
                        </p>
                      )}
                      {order.notes && (
                        <p className="text-xs text-forest-dark/70 mt-2">
                          <span className="font-semibold">Notes:</span> {order.notes}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-forest-dark mb-1">Order Status</label>
                        <select
                          value={order.status}
                          onChange={(e) => updateField(order.id, 'status', e.target.value)}
                          className="w-full rounded-lg border border-maroon/20 bg-white px-3 py-2 text-sm"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-forest-dark mb-1">Payment Status</label>
                        <select
                          value={order.payment_status}
                          onChange={(e) => updateField(order.id, 'payment_status', e.target.value)}
                          className="w-full rounded-lg border border-maroon/20 bg-white px-3 py-2 text-sm"
                        >
                          {PAYMENT_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
