import { useState } from 'react'
import { useCart } from '../context/CartContext'
import {
  isRazorpayConfigured,
  isUpiConfigured,
  UPI,
} from '../config'
import {
  PAYMENT_METHODS,
  PAYMENT_STATUS_BY_METHOD,
} from '../constants'
import { formatINR, productLabel } from '../utils/format'
import {
  buildOrderMessage,
  buildWhatsAppLink,
  openWhatsApp,
} from '../utils/whatsapp'
import { buildUpiLink, buildOrderNote, isMobileDevice } from '../utils/upi'
import { saveOrder } from '../services/orders'
import { openRazorpayCheckout, createRazorpayOrder } from '../services/razorpay'
import { CloseIcon, MinusIcon, PlusIcon, TrashIcon, WhatsAppIcon } from './icons'

const EMPTY_CUSTOMER = {
  name: '',
  phone: '',
  orderType: 'delivery',
  address: '',
  notes: '',
  paymentMethod: isRazorpayConfigured ? 'Razorpay' : 'Pay Later',
}

const VISIBLE_PAYMENT_METHODS = PAYMENT_METHODS.filter((m) => {
  if (m.id === 'Razorpay') return isRazorpayConfigured
  return true
})

export default function CartDrawer({ open, onClose }) {
  const { items, total, increment, decrement, removeItem, clearCart } = useCart()
  const [customer, setCustomer] = useState(EMPTY_CUSTOMER)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [saveWarning, setSaveWarning] = useState('')
  const [whatsappLink, setWhatsappLink] = useState('')
  const [upiPaidHint, setUpiPaidHint] = useState(false)
  const [showUpiDesktop, setShowUpiDesktop] = useState(false)

  function update(field, value) {
    setCustomer((c) => ({ ...c, [field]: value }))
  }

  function isValidPhone(phone) {
    const digits = String(phone || '').replace(/\D/g, '')
    return (
      digits.length === 10 ||
      (digits.length === 12 && digits.startsWith('91'))
    )
  }

  function resetCheckoutState() {
    setCustomer(EMPTY_CUSTOMER)
    setUpiPaidHint(false)
    setShowUpiDesktop(false)
    setError('')
    setSaveWarning('')
    setWhatsappLink('')
  }

  function validateCheckout() {
    if (!items.length) return 'Your cart is empty.'
    if (!customer.name.trim() || !customer.phone.trim()) {
      return 'Please fill your name and phone number.'
    }
    if (!isValidPhone(customer.phone)) {
      return 'Please enter a valid 10-digit phone number.'
    }
    if (customer.orderType === 'delivery' && !customer.address.trim()) {
      return 'Please enter your delivery address.'
    }
    if (customer.paymentMethod === 'UPI' && !isUpiConfigured) {
      return 'UPI payment is not configured yet. Please choose another method.'
    }
    if (customer.paymentMethod === 'Razorpay' && !isRazorpayConfigured) {
      return 'Online payment is not configured yet. Please choose another method.'
    }
    return ''
  }

  function finishWithWhatsApp({
    items: orderItems,
    total: orderTotal,
    customer: orderCustomer,
    orderId,
    openedHint,
  }) {
    const message = buildOrderMessage({
      items: orderItems,
      total: orderTotal,
      customer: orderCustomer,
      orderId,
    })
    const link = buildWhatsAppLink(message)
    setWhatsappLink(link)
    const opened = openWhatsApp(link)

    if (opened) {
      clearCart()
      resetCheckoutState()
      onClose()
      return
    }

    setSaveWarning(
      openedHint ||
        'Order saved. Tap “Open WhatsApp” below to send the order message.',
    )
  }

  function handlePayWithUpi() {
    if (!isUpiConfigured) return
    if (!customer.name.trim()) {
      setError('Please enter your name before paying with UPI.')
      return
    }
    const note = buildOrderNote({
      customerName: customer.name.trim() || 'Customer',
    })
    const link = buildUpiLink({ amount: total, note })

    if (isMobileDevice()) {
      window.location.href = link
    } else {
      setShowUpiDesktop(true)
    }
    setUpiPaidHint(true)
  }

  async function handleRazorpayCheckout() {
    const validationError = validateCheckout()
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setSaveWarning('')
    setWhatsappLink('')
    setSubmitting(true)

    const orderCustomer = {
      ...customer,
      paymentMethod: 'Razorpay',
      paymentStatus: PAYMENT_STATUS_BY_METHOD.Razorpay,
    }

    let saveResult = { saved: false, error: null, orderId: null }
    try {
      saveResult = await saveOrder({
        items,
        total,
        customer: orderCustomer,
      })
    } catch (err) {
      saveResult = { saved: false, error: { message: err.message } }
    }

    if (!saveResult.saved) {
      setSubmitting(false)
      setError(
        saveResult.error?.message ||
          'Could not save order before payment. Please try again.',
      )
      return
    }

    try {
      const { data: rzpOrder, error: createError } = await createRazorpayOrder(
        saveResult.orderId,
      )
      if (createError || !rzpOrder?.order_id) {
        throw new Error(
          createError?.message ||
            rzpOrder?.error ||
            'Could not start Razorpay payment. Deploy Edge Functions and set secrets.',
        )
      }

      const paymentResult = await openRazorpayCheckout({
        orderId: saveResult.orderId,
        razorpayOrder: rzpOrder,
        customer,
      })

      const paidCustomer = {
        ...orderCustomer,
        paymentStatus: paymentResult.paid ? 'Paid' : 'Pending',
      }

      setSubmitting(false)
      finishWithWhatsApp({
        items,
        total,
        customer: paidCustomer,
        orderId: saveResult.orderId,
        openedHint:
          'Payment successful. Tap “Open WhatsApp” to send your paid order.',
      })
    } catch (err) {
      setSubmitting(false)
      setSaveWarning(
        `${err.message || 'Payment not completed.'} Order ID: ${String(
          saveResult.orderId,
        ).slice(0, 8)}. You can pay later or contact us on WhatsApp.`,
      )
      const pendingCustomer = {
        ...orderCustomer,
        paymentStatus: 'Pending',
      }
      const message = buildOrderMessage({
        items,
        total,
        customer: pendingCustomer,
        orderId: saveResult.orderId,
      })
      setWhatsappLink(buildWhatsAppLink(message))
    }
  }

  async function handlePlaceOrder() {
    if (customer.paymentMethod === 'Razorpay') {
      await handleRazorpayCheckout()
      return
    }

    const validationError = validateCheckout()
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setSaveWarning('')
    setWhatsappLink('')
    setSubmitting(true)

    const paymentStatus =
      PAYMENT_STATUS_BY_METHOD[customer.paymentMethod] || 'Pending'

    const orderCustomer = {
      ...customer,
      paymentStatus,
    }

    let saveResult = { saved: false, error: null, orderId: null }
    try {
      saveResult = await saveOrder({ items, total, customer: orderCustomer })
    } catch (err) {
      saveResult = { saved: false, error: { message: err.message } }
    }

    const message = buildOrderMessage({
      items,
      total,
      customer: orderCustomer,
      orderId: saveResult.orderId,
    })
    const link = buildWhatsAppLink(message)
    setWhatsappLink(link)

    const opened = openWhatsApp(link)
    setSubmitting(false)

    if (saveResult.saved) {
      if (opened) {
        clearCart()
        resetCheckoutState()
        onClose()
      } else {
        setSaveWarning(
          'Order saved. Tap “Open WhatsApp” below to send the order message.',
        )
      }
    } else if (saveResult.error) {
      setSaveWarning(
        opened
          ? `WhatsApp opened, but order was NOT saved: ${saveResult.error.message}`
          : `Order was NOT saved: ${saveResult.error.message}. Tap “Open WhatsApp” to still send the message.`,
      )
    }
  }

  function handleOpenWhatsAppFallback() {
    if (whatsappLink) clearCart()
  }

  const isRazorpay = customer.paymentMethod === 'Razorpay'
  const primaryLabel = submitting
    ? isRazorpay
      ? 'Opening payment…'
      : 'Placing order…'
    : isRazorpay
      ? `Pay ${formatINR(total)} Online`
      : 'Place Order on WhatsApp'

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-gold/20 bg-gradient-to-r from-maroon to-maroon-dark px-4 py-4 text-cream">
          <h2 className="font-heading text-lg font-bold">Your Order</h2>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="rounded-xl p-1.5 transition hover:bg-white/10"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="border-b border-gold/15 bg-gold/10 px-4 py-2 text-center text-xs font-medium text-maroon">
          Pre-orders only · Freshly prepared on order
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="mt-20 text-center text-forest">
              <p className="text-5xl">🧺</p>
              <p className="mt-4 font-medium text-ink">Your cart is empty</p>
              <p className="mt-1 text-sm text-ink/60">
                Browse the menu and add your favourites.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((it) => (
                <li key={it.id} className="card flex items-center gap-3 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-maroon">
                      {productLabel(it)}
                    </p>
                    <p className="text-xs text-forest/80">
                      {formatINR(it.price)} each
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-xl border border-gold/25 bg-cream-dark/40 p-0.5">
                    <button
                      type="button"
                      onClick={() => decrement(it.id)}
                      className="rounded-lg p-1.5 text-maroon hover:bg-white"
                      aria-label="Decrease"
                    >
                      <MinusIcon />
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-maroon">
                      {it.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => increment(it.id)}
                      className="rounded-lg p-1.5 text-maroon hover:bg-white"
                      aria-label="Increase"
                    >
                      <PlusIcon />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(it.id)}
                    className="rounded-lg p-1.5 text-ink/40 hover:text-maroon"
                    aria-label="Remove"
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {items.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-heading text-base font-bold text-maroon">
                Checkout details
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
                <label className="label" htmlFor="cust-phone">Phone *</label>
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
                      className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-medium capitalize transition ${
                        customer.orderType === type
                          ? 'bg-maroon text-cream shadow-soft'
                          : 'border border-gold/25 bg-white text-maroon hover:bg-cream-dark'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {customer.orderType === 'delivery' && (
                <div>
                  <label className="label" htmlFor="cust-address">
                    Address *
                  </label>
                  <textarea
                    id="cust-address"
                    className="input min-h-[70px]"
                    value={customer.address}
                    onChange={(e) => update('address', e.target.value)}
                    placeholder="House no, street, area, landmark"
                  />
                </div>
              )}

              <div>
                <label className="label" htmlFor="cust-notes">Notes</label>
                <textarea
                  id="cust-notes"
                  className="input min-h-[60px]"
                  value={customer.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  placeholder="Preferred date/time, special requests…"
                />
              </div>

              <div>
                <span className="label">Payment Method *</span>
                <div className="space-y-2">
                  {VISIBLE_PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        update('paymentMethod', m.id)
                        setShowUpiDesktop(false)
                        setUpiPaidHint(false)
                      }}
                      className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                        customer.paymentMethod === m.id
                          ? 'bg-forest text-cream shadow-soft'
                          : 'border border-gold/25 bg-white text-ink hover:bg-cream-dark'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {customer.paymentMethod === 'Razorpay' && (
                  <p className="mt-2 rounded-xl border border-forest/15 bg-forest/5 px-3 py-2 text-xs text-forest">
                    Pay securely with UPI, card, or netbanking via Razorpay.
                    After payment, WhatsApp opens with your paid order details.
                  </p>
                )}

                {customer.paymentMethod === 'UPI' && !isUpiConfigured && (
                  <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                    UPI payment is not configured yet. Please choose another
                    method.
                  </p>
                )}

                {customer.paymentMethod === 'UPI' && isUpiConfigured && (
                  <div className="mt-3 space-y-2">
                    <button
                      type="button"
                      onClick={handlePayWithUpi}
                      className="btn-upi w-full py-3"
                    >
                      Pay with UPI · {formatINR(total)}
                    </button>

                    {showUpiDesktop && (
                      <div className="rounded-xl border border-forest/20 bg-forest/5 p-3 text-sm">
                        <p className="font-medium text-forest">UPI Payment</p>
                        <p className="mt-1 text-ink/80">
                          Pay <strong>{formatINR(total)}</strong> to:
                        </p>
                        <p className="mt-1 font-mono text-maroon">{UPI.id}</p>
                        <p className="mt-1 text-xs text-ink/60">
                          {UPI.name}
                        </p>
                        <p className="mt-2 text-xs text-ink/70">
                          Open your UPI app (PhonePe, GPay, Paytm) and pay
                          manually, then click Place Order below.
                        </p>
                      </div>
                    )}

                    {upiPaidHint && (
                      <p className="text-center text-xs text-forest">
                        After payment, click Place Order and share screenshot on
                        WhatsApp.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gold/20 bg-beige/40 px-4 py-4">
            {error && (
              <p className="mb-2 text-center text-sm text-maroon">{error}</p>
            )}
            {saveWarning && (
              <p className="mb-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs text-amber-900">
                {saveWarning}
              </p>
            )}

            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleOpenWhatsAppFallback}
                className="btn-whatsapp mb-3 flex w-full items-center justify-center gap-2 py-3.5 text-base"
              >
                <WhatsAppIcon />
                Open WhatsApp
              </a>
            )}

            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-ink/70">Total</span>
              <span className="font-heading text-2xl font-bold text-maroon">
                {formatINR(total)}
              </span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={submitting}
              className={`${
                isRazorpay ? 'btn-primary' : 'btn-whatsapp'
              } w-full py-3.5 text-base`}
            >
              {!isRazorpay && <WhatsAppIcon />}
              {primaryLabel}
            </button>

            <button
              onClick={() => {
                clearCart()
                resetCheckoutState()
              }}
              className="mt-2 w-full text-center text-xs text-ink/50 hover:text-maroon"
            >
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
