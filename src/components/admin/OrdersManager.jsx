import { useEffect, useState } from 'react'
import { getOrders, updateOrder, updateOrderStatus } from '../../services/admin'
import { useAuth } from '../../context/AuthContext'
import { formatINR, productLabel } from '../../utils/format'
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  STATUS_COLORS,
  INVENTORY_DEDUCT_STATUSES,
} from '../../constants'

function Badge({ value }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        STATUS_COLORS[value] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {value}
    </span>
  )
}

export default function OrdersManager() {
  const { isAdmin } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [warning, setWarning] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  async function load() {
    setLoading(true)
    const { data, error: err } = await getOrders()
    if (err) setError(err.message)
    else setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 15000)
    const onFocus = () => load()
    window.addEventListener('focus', onFocus)
    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  function clearMessages() {
    setError('')
    setSuccess('')
    setWarning('')
  }

  async function changeStatus(order, status) {
    if (status === order.status) return

    clearMessages()
    setUpdatingId(order.id)

    const { data, error: err } = await updateOrderStatus(order.id, status)

    setUpdatingId(null)

    if (err) {
      setError(err.message || 'Failed to update order status.')
      await load()
      return
    }

    if (data && !data.success) {
      setError(data.message || 'Failed to update order.')
      await load()
      return
    }

    // Refresh from database so inventory_updated flag is correct.
    await load()

    const warnList = Array.isArray(data?.warnings)
      ? data.warnings.filter(Boolean)
      : []
    if (warnList.length) {
      setWarning(warnList.join(' · '))
    }

    if (INVENTORY_DEDUCT_STATUSES.includes(status) && data?.inventory_deducted) {
      setSuccess('Inventory updated successfully.')
    } else if (data?.message) {
      setSuccess(data.message)
    }
  }

  async function changePayment(order, payment_status) {
    clearMessages()
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, payment_status } : o)),
    )
    const { error: err } = await updateOrder(order.id, { payment_status })
    if (err) {
      setError(err.message)
      await load()
    } else {
      setSuccess('Payment status updated.')
    }
  }

  if (loading) return <p className="text-forest">Loading orders…</p>

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-maroon">
          Orders ({orders.length})
        </h2>
        <button onClick={load} className="btn-gold px-3 py-1.5 text-sm">
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-800">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-xl border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-800">
          {success}
        </div>
      )}
      {warning && (
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          ⚠️ {warning}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="rounded-xl border border-gold/40 bg-white p-5 text-sm text-forest-dark">
          <p className="font-medium text-maroon">No orders yet.</p>
          {!isAdmin ? (
            <p className="mt-2">
              Your account may not be set up as admin. Add your user to{' '}
              <code className="rounded bg-cream-dark px-1">admin_users</code> in
              Supabase — see <code>supabase/fix-admin-orders.sql</code>.
            </p>
          ) : (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-forest/80">
              <li>Place a test order from the home page (Cart → Order on WhatsApp).</li>
              <li>Make sure <code>.env</code> has your Supabase URL and anon key.</li>
              <li>Confirm <code>supabase/schema.sql</code> was run in SQL Editor.</li>
              <li>Click <strong>Refresh</strong> after placing an order.</li>
            </ul>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const isOpen = expanded === o.id
            const isUpdating = updatingId === o.id
            return (
              <div key={o.id} className="card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-maroon">
                      {o.customer_name}{' '}
                      <span className="font-normal text-forest">
                        · {o.customer_phone}
                      </span>
                    </p>
                    <p className="text-xs text-forest/70">
                      {new Date(o.created_at).toLocaleString('en-IN')} ·{' '}
                      <span className="capitalize">{o.order_type}</span>
                      {o.inventory_updated && (
                        <span className="ml-2 text-green-700">· Stock deducted</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-lg font-bold text-forest-dark">
                      {formatINR(o.total_amount)}
                    </p>
                    <div className="mt-1 flex flex-wrap justify-end gap-1">
                      <Badge value={o.status} />
                      {o.payment_method && (
                        <Badge value={o.payment_method} />
                      )}
                      <Badge value={o.payment_status} />
                    </div>
                  </div>
                </div>

                {INVENTORY_DEDUCT_STATUSES.includes(o.status) &&
                  o.payment_status !== 'Paid' && (
                  <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                    Payment not marked as Paid — please verify before closing
                    this order.
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-1 text-xs text-forest">
                    Status:
                    <select
                      className="input w-auto px-2 py-1 text-sm"
                      value={o.status}
                      disabled={isUpdating}
                      onChange={(e) => changeStatus(o, e.target.value)}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex items-center gap-1 text-xs text-forest">
                    Payment:
                    <select
                      className="input w-auto px-2 py-1 text-sm"
                      value={o.payment_status}
                      onChange={(e) => changePayment(o, e.target.value)}
                    >
                      {PAYMENT_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <button
                    onClick={() => setExpanded(isOpen ? null : o.id)}
                    className="text-sm text-maroon hover:underline"
                  >
                    {isOpen ? 'Hide items' : 'View items'}
                  </button>
                </div>

                {isOpen && (
                  <div className="mt-3 rounded-xl bg-cream/70 p-3">
                    {o.address && (
                      <p className="mb-2 text-sm text-forest-dark">
                        <span className="font-medium">Address:</span> {o.address}
                      </p>
                    )}
                    {o.notes && (
                      <p className="mb-2 text-sm text-forest-dark">
                        <span className="font-medium">Notes:</span> {o.notes}
                      </p>
                    )}
                    <ul className="divide-y divide-gold/20 text-sm">
                      {(o.order_items || []).map((it) => (
                        <li key={it.id} className="flex justify-between py-1.5">
                          <span className="text-forest-dark">
                            {productLabel(it)} × {it.quantity}
                          </span>
                          <span className="font-medium">
                            {formatINR(it.line_total)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
