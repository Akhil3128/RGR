import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { createOrder } from '../../lib/api'
import { buildWhatsAppMessage, openWhatsAppOrder, formatPrice } from '../../lib/utils'
import { isSupabaseConfigured } from '../../lib/supabase'
import CartSummary from './CartSummary'
import SectionHeading from '../shared/SectionHeading'

const initialForm = {
  name: '',
  phone: '',
  deliveryType: 'pickup',
  address: '',
  notes: '',
}

export default function OrderForm() {
  const { items, total, clearCart } = useCart()
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    if (items.length === 0) return 'Please add at least one item to your order.'
    if (!form.name.trim()) return 'Please enter your name.'
    if (!form.phone.trim() || form.phone.trim().length < 10) {
      return 'Please enter a valid phone number.'
    }
    if (form.deliveryType === 'delivery' && !form.address.trim()) {
      return 'Please enter your delivery address.'
    }
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)

    const customer = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      deliveryType: form.deliveryType,
      address: form.address.trim(),
      notes: form.notes.trim(),
    }

    try {
      await createOrder({ customer, items, total })

      const waMessage = buildWhatsAppMessage({ customer, items, total })
      openWhatsAppOrder(waMessage)

      setMessage(
        isSupabaseConfigured
          ? 'Order saved! WhatsApp is opening with your order details.'
          : 'Order saved locally (demo mode). WhatsApp is opening with your order details.'
      )
      clearCart()
      setForm(initialForm)
    } catch (err) {
      setError(err.message || 'Could not place order. Please try again or WhatsApp us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="order" className="pattern-bg border-t border-gold/20 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Pre-Order"
          title="Place Your Order"
          subtitle="Fill in your details and send the order on WhatsApp. We prepare everything fresh after confirmation."
        />

        <div className="mb-6 rounded-lg border border-gold/40 bg-gold/15 px-4 py-3 text-center text-sm font-medium text-maroon-dark">
          Pre-orders only — Please order ahead. Freshly made after confirmation.
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <CartSummary />

          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-gold/35 bg-cream-light p-4 shadow-sm md:p-5"
          >
            <h3 className="font-display text-2xl text-maroon">Your Details</h3>
            <div className="gold-divider my-3" />

            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-maroon">Name *</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className="w-full rounded-md border border-gold/40 bg-cream px-3 py-2.5 outline-none focus:border-maroon focus:ring-1 focus:ring-maroon"
                  placeholder="Your full name"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-maroon">Phone Number *</span>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={onChange}
                  className="w-full rounded-md border border-gold/40 bg-cream px-3 py-2.5 outline-none focus:border-maroon focus:ring-1 focus:ring-maroon"
                  placeholder="10-digit mobile number"
                  required
                />
              </label>

              <fieldset>
                <legend className="mb-2 text-sm font-medium text-maroon">
                  Delivery or Pickup *
                </legend>
                <div className="flex flex-wrap gap-3">
                  <label className="inline-flex items-center gap-2 rounded-md border border-gold/40 bg-cream px-3 py-2 text-sm">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="pickup"
                      checked={form.deliveryType === 'pickup'}
                      onChange={onChange}
                    />
                    Pickup
                  </label>
                  <label className="inline-flex items-center gap-2 rounded-md border border-gold/40 bg-cream px-3 py-2 text-sm">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="delivery"
                      checked={form.deliveryType === 'delivery'}
                      onChange={onChange}
                    />
                    Delivery
                  </label>
                </div>
              </fieldset>

              {form.deliveryType === 'delivery' && (
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-maroon">Address *</span>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={onChange}
                    rows={3}
                    className="w-full rounded-md border border-gold/40 bg-cream px-3 py-2.5 outline-none focus:border-maroon focus:ring-1 focus:ring-maroon"
                    placeholder="Full delivery address in Vizag"
                    required
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-maroon">Notes</span>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={onChange}
                  rows={2}
                  className="w-full rounded-md border border-gold/40 bg-cream px-3 py-2.5 outline-none focus:border-maroon focus:ring-1 focus:ring-maroon"
                  placeholder="Preferred time, special requests, etc."
                />
              </label>
            </div>

            {error && (
              <p className="mt-4 rounded-md bg-maroon/10 px-3 py-2 text-sm text-maroon">{error}</p>
            )}
            {message && (
              <p className="mt-4 rounded-md bg-green/10 px-3 py-2 text-sm text-green">{message}</p>
            )}

            <button
              type="submit"
              disabled={submitting || items.length === 0}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-green px-4 py-3 text-sm font-bold text-cream shadow hover:bg-green-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? 'Sending...'
                : `Send Order on WhatsApp · ${formatPrice(total)}`}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
