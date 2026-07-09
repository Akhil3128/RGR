import { useState } from 'react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { useCart } from '../../context/CartContext'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { buildWhatsAppMessage, openWhatsApp } from '../../utils/whatsapp'
import { DELIVERY_OPTIONS } from '../../lib/constants'

export default function OrderForm() {
  const { items, total, dispatch } = useCart()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    deliveryOption: 'Pickup',
    address: '',
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit Indian mobile number'
    }
    if (form.deliveryOption === 'Delivery' && !form.address.trim()) {
      newErrors.address = 'Address is required for delivery'
    }
    if (items.length === 0) newErrors.cart = 'Add at least one item to your cart'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const saveOrderToSupabase = async () => {
    if (!isSupabaseConfigured) return null

    const orderData = {
      customer_name: form.name.trim(),
      customer_phone: form.phone.trim(),
      delivery_option: form.deliveryOption,
      address: form.deliveryOption === 'Delivery' ? form.address.trim() : null,
      notes: form.notes.trim() || null,
      total_amount: total,
      status: 'New',
      payment_status: 'Pending',
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (orderError) throw orderError

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      product_size: item.size,
      quantity: item.quantity,
      unit_price: item.price,
      line_total: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    return order
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setSuccess(false)

    try {
      await saveOrderToSupabase()

      const message = buildWhatsAppMessage({
        customer: { name: form.name, phone: form.phone },
        items,
        total,
        deliveryOption: form.deliveryOption,
        address: form.address,
        notes: form.notes,
      })

      openWhatsApp(message)
      dispatch({ type: 'CLEAR_CART' })
      setForm({ name: '', phone: '', deliveryOption: 'Pickup', address: '', notes: '' })
      setSuccess(true)
    } catch (err) {
      console.error('Order error:', err)
      const message = buildWhatsAppMessage({
        customer: { name: form.name, phone: form.phone },
        items,
        total,
        deliveryOption: form.deliveryOption,
        address: form.address,
        notes: form.notes,
      })
      openWhatsApp(message)
      dispatch({ type: 'CLEAR_CART' })
      setSuccess(true)
    }

    setSubmitting(false)
  }

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return (
    <Card className="p-6">
      <h3 className="font-display text-xl font-bold text-maroon mb-4">
        Customer Details
      </h3>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
          ✅ Order sent! WhatsApp should open with your order details.
          {isSupabaseConfigured && ' Order saved to our system.'}
        </div>
      )}

      {errors.cart && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {errors.cart}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Your Name *"
          placeholder="Enter your full name"
          value={form.name}
          onChange={(e) => updateField('name', e.target.value)}
          error={errors.name}
        />

        <Input
          label="Phone Number *"
          placeholder="10-digit mobile number"
          type="tel"
          value={form.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          error={errors.phone}
        />

        <Select
          label="Delivery or Pickup *"
          value={form.deliveryOption}
          onChange={(e) => updateField('deliveryOption', e.target.value)}
        >
          {DELIVERY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </Select>

        {form.deliveryOption === 'Delivery' && (
          <div>
            <label className="block text-sm font-medium text-maroon-dark mb-1">
              Delivery Address *
            </label>
            <textarea
              className="w-full px-4 py-2.5 rounded-lg border border-gold/30 bg-white focus:outline-none focus:ring-2 focus:ring-maroon/30 focus:border-maroon text-sm placeholder:text-gray-400"
              rows={3}
              placeholder="House no, street, area, landmark, Vizag"
              value={form.address}
              onChange={(e) => updateField('address', e.target.value)}
            />
            {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-maroon-dark mb-1">
            Special Notes (optional)
          </label>
          <textarea
            className="w-full px-4 py-2.5 rounded-lg border border-gold/30 bg-white focus:outline-none focus:ring-2 focus:ring-maroon/30 focus:border-maroon text-sm placeholder:text-gray-400"
            rows={2}
            placeholder="Preferred delivery date, special requests..."
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
          />
        </div>

        <Button
          type="submit"
          variant="whatsapp"
          size="lg"
          className="w-full"
          disabled={submitting || items.length === 0}
        >
          {submitting ? 'Placing Order...' : '💬 Place Pre-Order via WhatsApp'}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Your order will be sent to WhatsApp and saved to our system.
          We will confirm your pre-order shortly.
        </p>
      </form>
    </Card>
  )
}
