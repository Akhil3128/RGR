import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/format'
import { buildOrderMessage, buildWhatsAppLink } from '../utils/whatsapp'
import { saveOrderToSupabase } from '../utils/orderService'
import OrderForm from './OrderForm'

const INITIAL_FORM = { name: '', phone: '', fulfillment: 'pickup', address: '', notes: '' }

export default function CartPanel({ open, onClose }) {
  const { items, increment, decrement, removeItem, totalAmount, hasPriceOnRequestItems, clearCart } = useCart()
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [placed, setPlaced] = useState(false)

  function validate() {
    const nextErrors = {}
    if (!formData.name.trim()) nextErrors.name = 'Please enter your name.'
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      nextErrors.phone = 'Please enter a valid phone number.'
    }
    if (formData.fulfillment === 'delivery' && !formData.address.trim()) {
      nextErrors.address = 'Please enter your delivery address.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handlePlaceOrder() {
    if (items.length === 0) return
    if (!validate()) return

    setSubmitting(true)

    const message = buildOrderMessage(formData, items, totalAmount)
    const whatsappLink = buildWhatsAppLink(message)

    await saveOrderToSupabase({ customer: formData, items, total: totalAmount })

    window.open(whatsappLink, '_blank')

    setPlaced(true)
    clearCart()
    setSubmitting(false)
  }

  function handleClose() {
    onClose()
    if (placed) {
      setPlaced(false)
      setFormData(INITIAL_FORM)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        className="absolute inset-0 bg-black/40"
        aria-label="Close cart"
        onClick={handleClose}
      />

      <div className="relative h-full w-full sm:max-w-md bg-cream shadow-2xl flex flex-col animate-in">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gold/30 bg-maroon text-cream">
          <h2 className="font-display text-lg">Your Pre-Order</h2>
          <button onClick={handleClose} className="text-cream/80 hover:text-cream text-2xl leading-none" aria-label="Close">
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6">
          {placed ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">🙏</div>
              <h3 className="font-display text-xl text-maroon mb-2">Order Sent!</h3>
              <p className="text-sm text-forest-dark/80">
                Your pre-order details have been sent via WhatsApp. Our team will confirm your order shortly.
              </p>
              <button
                onClick={handleClose}
                className="mt-6 rounded-full bg-forest text-cream font-semibold px-6 py-2.5 text-sm hover:bg-forest-dark"
              >
                Continue Browsing
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-14 text-forest-dark/60">
              <div className="text-4xl mb-3">🛒</div>
              <p className="text-sm">Your cart is empty.</p>
              <p className="text-xs mt-1">Add sweets &amp; snacks from the menu to get started.</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between gap-2 rounded-xl border border-maroon/15 bg-white px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-maroon truncate">{item.name}</p>
                      <p className="text-xs text-forest-dark/60">
                        {item.size} &bull; {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => decrement(item.productId)}
                        className="h-7 w-7 rounded-md bg-forest/10 text-forest-dark font-bold hover:bg-forest/20"
                        aria-label={`Decrease ${item.name}`}
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm font-bold text-forest-dark">{item.quantity}</span>
                      <button
                        onClick={() => increment(item.productId)}
                        className="h-7 w-7 rounded-md bg-forest/10 text-forest-dark font-bold hover:bg-forest/20"
                        aria-label={`Increase ${item.name}`}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="ml-1 text-maroon/70 hover:text-maroon text-lg"
                        aria-label={`Remove ${item.name}`}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between rounded-xl bg-gold/15 border border-gold/40 px-4 py-3">
                <span className="text-sm font-semibold text-maroon-dark">Total Amount</span>
                <span className="text-lg font-bold text-maroon-dark">{formatCurrency(totalAmount)}</span>
              </div>

              {hasPriceOnRequestItems && (
                <p className="text-xs text-forest-dark/70 -mt-2">
                  Some items have a &ldquo;price on request&rdquo; — our team will confirm the final price on
                  WhatsApp.
                </p>
              )}

              <div className="border-t border-maroon/10 pt-5">
                <h3 className="font-display text-base text-maroon mb-3">Your Details</h3>
                <OrderForm formData={formData} onChange={setFormData} errors={errors} />
              </div>
            </>
          )}
        </div>

        {!placed && items.length > 0 && (
          <div className="border-t border-gold/30 bg-cream-light px-4 sm:px-6 py-4">
            <button
              onClick={handlePlaceOrder}
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-forest text-cream font-bold py-3 text-sm shadow-card hover:bg-forest-dark transition-colors disabled:opacity-60"
            >
              {submitting ? 'Sending...' : 'Send Pre-Order via WhatsApp'}
            </button>
            <p className="mt-2 text-center text-[11px] text-forest-dark/60">
              This opens WhatsApp with your order details to +91 99638 14860.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
