import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PreOrderBanner from '../components/PreOrderBanner'
import WhatsAppIcon from '../components/WhatsAppIcon'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/format'
import { BUSINESS, whatsappLink } from '../lib/business'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

// Sample products use ids like "kova-200"; real Supabase products use UUIDs.
// We only store product_id in the database when it is a real UUID.
const isUuid = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)

export default function OrderPage() {
  const {
    items,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    totalAmount,
  } = useCart()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    deliveryType: 'delivery',
    address: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const isFormValid =
    form.name.trim() !== '' &&
    form.phone.trim().length >= 10 &&
    (form.deliveryType === 'pickup' || form.address.trim() !== '')

  // Builds the WhatsApp message with the full order details.
  const buildWhatsAppMessage = () => {
    const lines = [
      `🪔 *New Pre-Order — ${BUSINESS.name}*`,
      '',
      `👤 *Name:* ${form.name}`,
      `📞 *Phone:* ${form.phone}`,
      '',
      '🛒 *Order Items:*',
      ...items.map(
        (item, index) =>
          `${index + 1}. ${item.name} (${item.size}) × ${item.quantity} = ${formatPrice(item.price * item.quantity)}`
      ),
      '',
      `💰 *Total Amount: ${formatPrice(totalAmount)}*`,
      '',
      form.deliveryType === 'delivery'
        ? `🚚 *Delivery* to:\n📍 ${form.address}`
        : '🏠 *Pickup* (I will collect the order)',
    ]
    if (form.notes.trim()) lines.push('', `📝 *Notes:* ${form.notes}`)
    lines.push('', 'Please confirm my pre-order. Thank you! 🙏')
    return lines.join('\n')
  }

  // Saves the order to Supabase (when configured). Failures are logged
  // but never block the WhatsApp order, so the customer is never stuck.
  const saveOrderToSupabase = async () => {
    if (!isSupabaseConfigured) return

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: form.name,
          phone: form.phone,
          delivery_type: form.deliveryType,
          address: form.deliveryType === 'delivery' ? form.address : '',
          notes: form.notes,
          total_amount: totalAmount,
        })
        .select()
        .single()

      if (orderError) throw orderError

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: isUuid(item.id) ? item.id : null,
        product_name: item.name,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
        line_total: item.price * item.quantity,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
      if (itemsError) throw itemsError
    } catch (error) {
      console.error('Could not save order to Supabase:', error.message)
    }
  }

  const handlePlaceOrder = async () => {
    if (!isFormValid || items.length === 0) return
    setSubmitting(true)

    const message = buildWhatsAppMessage()
    await saveOrderToSupabase()

    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer')
    clearCart()
    setOrderPlaced(true)
    setSubmitting(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PreOrderBanner />
      <Navbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <h1 className="text-center font-heading text-3xl font-bold text-maroon">
          Your Order
        </h1>
        <div className="gold-divider">❖</div>

        {orderPlaced ? (
          <div className="card mt-8 p-8 text-center">
            <span className="text-5xl">🙏</span>
            <h2 className="mt-4 font-heading text-2xl font-semibold text-forest">
              Thank you!
            </h2>
            <p className="mt-2 text-sm text-forest/80">
              Your order has been sent on WhatsApp. We will confirm your
              pre-order shortly. For any questions call us at{' '}
              <strong>{BUSINESS.phoneDisplay}</strong>.
            </p>
            <Link to="/" className="btn-primary mt-6">
              ← Back to Menu
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="card mt-8 p-8 text-center">
            <span className="text-5xl">🛒</span>
            <p className="mt-4 text-forest/80">Your order is empty.</p>
            <Link to="/" className="btn-primary mt-6">
              ← Browse Our Menu
            </Link>
          </div>
        ) : (
          <>
            {/* ── Cart items ─────────────────────────────── */}
            <div className="card mt-8 divide-y divide-gold/20">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-maroon">
                      {item.name}{' '}
                      <span className="text-xs font-normal text-forest/60">
                        ({item.size})
                      </span>
                    </p>
                    <p className="text-sm text-forest/80">
                      {formatPrice(item.price)} each
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-maroon text-maroon transition hover:bg-maroon hover:text-cream"
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-maroon text-maroon transition hover:bg-maroon hover:text-cream"
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      +
                    </button>
                  </div>

                  <div className="w-20 text-right">
                    <p className="font-semibold text-forest">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-maroon/70 underline hover:text-maroon"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between bg-cream-dark p-4">
                <span className="font-heading text-lg font-semibold text-maroon">
                  Total
                </span>
                <span className="font-heading text-xl font-bold text-forest">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            {/* ── Customer details form ──────────────────── */}
            <div className="card mt-6 p-5">
              <h2 className="font-heading text-xl font-semibold text-maroon">
                Your Details
              </h2>

              <div className="mt-4 grid gap-4">
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Lakshmi Devi"
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-1 block text-sm font-medium">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g. 98765 43210"
                    className="input-field"
                  />
                </div>

                <div>
                  <span className="mb-1 block text-sm font-medium">
                    Delivery or Pickup? *
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'delivery', label: '🚚 Home Delivery' },
                      { value: 'pickup', label: '🏠 Self Pickup' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                          form.deliveryType === option.value
                            ? 'border-maroon bg-maroon text-cream'
                            : 'border-gold/40 bg-white text-forest hover:border-gold'
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryType"
                          value={option.value}
                          checked={form.deliveryType === option.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                {form.deliveryType === 'delivery' && (
                  <div>
                    <label htmlFor="address" className="mb-1 block text-sm font-medium">
                      Delivery Address *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows="3"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="House no, street, area, landmark…"
                      className="input-field"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="notes" className="mb-1 block text-sm font-medium">
                    Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="2"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="e.g. Need it by Saturday evening"
                    className="input-field"
                  />
                </div>
              </div>

              <p className="mt-4 rounded-lg bg-gold/15 px-3 py-2 text-xs text-forest">
                🪔 <strong>Pre-orders only:</strong> we start preparing your
                sweets only after you confirm on WhatsApp.
              </p>

              <button
                onClick={handlePlaceOrder}
                disabled={!isFormValid || submitting}
                className="btn-whatsapp mt-5 w-full text-base"
              >
                <WhatsAppIcon />
                {submitting ? 'Sending…' : 'Place Pre-Order on WhatsApp'}
              </button>

              {!isFormValid && (
                <p className="mt-2 text-center text-xs text-maroon/70">
                  Please fill your name, a valid phone number
                  {form.deliveryType === 'delivery' ? ' and delivery address' : ''}.
                </p>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
