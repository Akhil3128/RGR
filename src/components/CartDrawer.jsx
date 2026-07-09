import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { formatINR, productLabel } from '../utils/format'
import { buildOrderMessage, buildWhatsAppLink } from '../utils/whatsapp'
import { saveOrder } from '../services/orders'
import { CloseIcon, MinusIcon, PlusIcon, TrashIcon, WhatsAppIcon } from './icons'

const EMPTY_CUSTOMER = {
  name: '',
  phone: '',
  orderType: 'delivery',
  address: '',
  notes: '',
}

export default function CartDrawer({ open, onClose }) {
  const { items, total, increment, decrement, removeItem, clearCart } = useCart()
  const [customer, setCustomer] = useState(EMPTY_CUSTOMER)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [saveWarning, setSaveWarning] = useState('')

  function update(field, value) {
    setCustomer((c) => ({ ...c, [field]: value }))
  }

  const canSubmit =
    items.length > 0 &&
    customer.name.trim() &&
    customer.phone.trim() &&
    (customer.orderType === 'pickup' || customer.address.trim())

  async function handleOrder() {
    if (!canSubmit) {
      setError('Please add items and fill your name, phone and address.')
      return
    }
    setError('')
    setSaveWarning('')
    setSubmitting(true)

    // Save to Supabase before opening WhatsApp.
    let saveResult = { saved: false, error: null }
    try {
      saveResult = await saveOrder({ items, total, customer })
    } catch (err) {
      saveResult = { saved: false, error: { message: err.message } }
    }

    const message = buildOrderMessage({ items, total, customer })
    const link = buildWhatsAppLink(message)
    window.open(link, '_blank', 'noopener,noreferrer')

    setSubmitting(false)

    if (saveResult.saved) {
      clearCart()
      setCustomer(EMPTY_CUSTOMER)
      onClose()
    } else if (saveResult.error) {
      setSaveWarning(
        `WhatsApp opened, but order was NOT saved: ${saveResult.error.message}. Run supabase/fix-orders-complete.sql in Supabase.`,
      )
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-maroon-dark/40 transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-gold/30 bg-maroon px-4 py-4 text-cream">
          <h2 className="font-heading text-lg font-bold">Your Order</h2>
          <button onClick={onClose} aria-label="Close cart" className="rounded-full p-1 hover:bg-maroon-light">
            <CloseIcon />
          </button>
        </div>

        <div className="border-b border-gold/30 bg-gold/15 px-4 py-2 text-center text-xs font-medium text-maroon">
          🛎️ Pre-orders only. Final confirmation happens on WhatsApp.
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="mt-16 text-center text-forest">
              <p className="text-4xl">🧺</p>
              <p className="mt-3 font-medium">Your order is empty</p>
              <p className="mt-1 text-sm text-forest/70">
                Add some sweets from the menu to get started.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((it) => (
                <li key={it.id} className="card flex items-center gap-3 p-3">
                  <div className="flex-1">
                    <p className="font-medium text-maroon">{productLabel(it)}</p>
                    <p className="text-sm text-forest">
                      {formatINR(it.price)} each
                    </p>
                  </div>

                  <div className="flex items-center gap-1 rounded-full border border-gold/40 bg-white">
                    <button
                      onClick={() => decrement(it.id)}
                      className="rounded-full p-1.5 text-maroon hover:bg-cream-dark"
                      aria-label="Decrease quantity"
                    >
                      <MinusIcon />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">
                      {it.quantity}
                    </span>
                    <button
                      onClick={() => increment(it.id)}
                      className="rounded-full p-1.5 text-maroon hover:bg-cream-dark"
                      aria-label="Increase quantity"
                    >
                      <PlusIcon />
                    </button>
                  </div>

                  <div className="w-16 text-right">
                    <p className="font-semibold text-forest-dark">
                      {formatINR(it.price * it.quantity)}
                    </p>
                    <button
                      onClick={() => removeItem(it.id)}
                      className="mt-1 inline-flex items-center gap-1 text-xs text-maroon-light hover:text-maroon"
                      aria-label="Remove item"
                    >
                      <TrashIcon className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Customer form */}
          {items.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-heading text-base font-bold text-maroon">
                Your Details
              </h3>

              <div>
                <label className="label" htmlFor="cust-name">Name *</label>
                <input
                  id="cust-name"
                  className="input"
                  value={customer.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="label" htmlFor="cust-phone">Phone Number *</label>
                <input
                  id="cust-phone"
                  className="input"
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="10-digit mobile number"
                />
              </div>

              <div>
                <span className="label">Delivery or Pickup? *</span>
                <div className="flex gap-2">
                  {['delivery', 'pickup'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => update('orderType', type)}
                      className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium capitalize transition ${
                        customer.orderType === type
                          ? 'border-maroon bg-maroon text-cream'
                          : 'border-gold/40 bg-white text-maroon hover:bg-cream-dark'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {customer.orderType === 'delivery' && (
                <div>
                  <label className="label" htmlFor="cust-address">Delivery Address *</label>
                  <textarea
                    id="cust-address"
                    className="input min-h-[70px]"
                    value={customer.address}
                    onChange={(e) => update('address', e.target.value)}
                    placeholder="House no, street, area, landmark, Vizag"
                  />
                </div>
              )}

              <div>
                <label className="label" htmlFor="cust-notes">Notes (optional)</label>
                <textarea
                  id="cust-notes"
                  className="input min-h-[60px]"
                  value={customer.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  placeholder="Preferred delivery date/time, special requests…"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer / checkout */}
        {items.length > 0 && (
          <div className="border-t border-gold/30 bg-cream-dark px-4 py-4">
            {error && (
              <p className="mb-2 text-center text-sm text-maroon">{error}</p>
            )}
            {saveWarning && (
              <p className="mb-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-center text-xs text-amber-900">
                {saveWarning}
              </p>
            )}
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-forest-dark">Total</span>
              <span className="font-heading text-2xl font-bold text-maroon">
                {formatINR(total)}
              </span>
            </div>
            <button
              onClick={handleOrder}
              disabled={submitting}
              className="btn-whatsapp w-full py-3 text-base"
            >
              <WhatsAppIcon />
              {submitting ? 'Placing order…' : 'Order on WhatsApp'}
            </button>
            <button
              onClick={clearCart}
              className="mt-2 w-full text-center text-xs text-forest/70 hover:text-maroon"
            >
              Clear order
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
