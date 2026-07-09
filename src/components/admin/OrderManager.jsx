import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Select from '../ui/Select'
import { useOrders } from '../../hooks/useAdminData'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { formatCurrency } from '../../utils/formatters'
import { ORDER_STATUSES, PAYMENT_STATUSES } from '../../lib/constants'

const statusColors = {
  New: 'gold',
  Confirmed: 'forest',
  Preparing: 'maroon',
  Ready: 'green',
  Delivered: 'green',
  Cancelled: 'red',
}

const paymentColors = {
  Pending: 'gold',
  Paid: 'green',
  Partial: 'maroon',
}

export default function OrderManager() {
  const { orders, loading, refetch } = useOrders()

  const updateOrder = async (id, field, value) => {
    if (!isSupabaseConfigured) return
    try {
      await supabase.from('orders').update({ [field]: value }).eq('id', id)
      refetch()
    } catch (err) {
      console.error('Failed to update order:', err)
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div>
        <h2 className="font-display text-2xl font-bold text-maroon mb-6">Orders</h2>
        <Card className="p-8 text-center text-gray-500">
          Configure Supabase to view orders.
        </Card>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-maroon mb-6">Orders</h2>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">No orders received yet.</Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium text-maroon-dark text-lg">{order.customer_name}</h4>
                    <Badge color={statusColors[order.status]}>{order.status}</Badge>
                    <Badge color={paymentColors[order.payment_status]}>{order.payment_status}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    📞 {order.customer_phone} · {order.delivery_option}
                    {order.address && ` · ${order.address}`}
                  </p>
                  {order.notes && (
                    <p className="text-sm text-gray-500 mt-1">📝 {order.notes}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.created_at).toLocaleString('en-IN')}
                  </p>

                  <div className="mt-3 space-y-1">
                    {order.order_items?.map((item) => (
                      <p key={item.id} className="text-sm">
                        {item.product_name} ({item.product_size}) × {item.quantity} = {formatCurrency(item.line_total)}
                      </p>
                    ))}
                  </div>

                  <p className="font-bold text-forest mt-2">
                    Total: {formatCurrency(order.total_amount)}
                  </p>
                </div>

                <div className="flex flex-col gap-2 min-w-[160px]">
                  <Select
                    label="Order Status"
                    value={order.status}
                    onChange={(e) => updateOrder(order.id, 'status', e.target.value)}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Select>
                  <Select
                    label="Payment Status"
                    value={order.payment_status}
                    onChange={(e) => updateOrder(order.id, 'payment_status', e.target.value)}
                  >
                    {PAYMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
