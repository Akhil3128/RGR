import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { BUSINESS, RAZORPAY_KEY_ID } from '../config'

function functionsBaseUrl() {
  const url = import.meta.env.VITE_SUPABASE_URL || ''
  return url.replace(/\/$/, '') + '/functions/v1'
}

async function callFunction(name, body) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      data: null,
      error: {
        message:
          'Supabase is not connected. Razorpay needs Supabase Edge Functions.',
      },
    }
  }

  // Prefer the SDK invoke helper.
  const { data, error } = await supabase.functions.invoke(name, { body })
  if (!error) return { data, error: null }

  // Fallback fetch (useful if invoke fails on older clients).
  try {
    const anon = import.meta.env.VITE_SUPABASE_ANON_KEY
    const res = await fetch(`${functionsBaseUrl()}/${name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${anon}`,
        apikey: anon,
      },
      body: JSON.stringify(body),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      return {
        data: null,
        error: { message: json.error || error.message || 'Payment request failed' },
      }
    }
    return { data: json, error: null }
  } catch (err) {
    return {
      data: null,
      error: { message: err.message || error.message || 'Payment request failed' },
    }
  }
}

export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false)
      return
    }
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    )
    if (existing) {
      existing.addEventListener('load', () => resolve(Boolean(window.Razorpay)))
      existing.addEventListener('error', () => resolve(false))
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(Boolean(window.Razorpay))
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export async function createRazorpayOrder(orderId) {
  return callFunction('create-razorpay-order', { order_id: orderId })
}

export async function verifyRazorpayPayment({
  orderId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  return callFunction('verify-razorpay-payment', {
    order_id: orderId,
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_signature: razorpaySignature,
  })
}

/**
 * Opens Razorpay Checkout and resolves with verification result.
 * Rejects if the user closes the modal or script fails to load.
 */
export async function openRazorpayCheckout({
  orderId,
  razorpayOrder,
  customer,
  onDismiss,
}) {
  const ready = await loadRazorpayScript()
  if (!ready || !window.Razorpay) {
    throw new Error('Could not load Razorpay Checkout. Check your network.')
  }

  const key = razorpayOrder.key_id || RAZORPAY_KEY_ID
  if (!key) {
    throw new Error(
      'Razorpay Key ID missing. Set VITE_RAZORPAY_KEY_ID and redeploy.',
    )
  }

  if (razorpayOrder.already_paid) {
    return { paid: true, alreadyPaid: true }
  }

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency || 'INR',
      name: BUSINESS.name,
      description: `Order ${String(orderId).slice(0, 8)}`,
      order_id: razorpayOrder.order_id,
      prefill: {
        name: customer?.name || razorpayOrder.customer?.name || '',
        contact: customer?.phone || razorpayOrder.customer?.contact || '',
      },
      notes: {
        supabase_order_id: orderId,
      },
      theme: {
        color: '#7A1F2B',
      },
      handler: async (response) => {
        try {
          const { data, error } = await verifyRazorpayPayment({
            orderId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          })
          if (error || !data?.paid) {
            reject(
              new Error(
                error?.message ||
                  data?.error ||
                  'Payment verification failed. Contact us on WhatsApp with your payment ID.',
              ),
            )
            return
          }
          resolve({
            paid: true,
            paymentId: response.razorpay_payment_id,
            orderId,
          })
        } catch (err) {
          reject(err)
        }
      },
      modal: {
        ondismiss: () => {
          if (onDismiss) onDismiss()
          reject(new Error('Payment cancelled. Your order is saved as Pending.'))
        },
      },
    })

    rzp.on('payment.failed', (response) => {
      reject(
        new Error(
          response?.error?.description ||
            'Payment failed. You can try again or choose Pay Later.',
        ),
      )
    })

    rzp.open()
  })
}
