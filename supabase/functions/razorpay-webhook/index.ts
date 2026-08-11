import {
  createServiceClient,
  getEnv,
  handleCors,
  hmacSha256Hex,
  jsonResponse,
} from '../_shared/razorpay.ts'

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let out = 0
  for (let i = 0; i < a.length; i += 1) out |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return out === 0
}

Deno.serve(async (req) => {
  const cors = handleCors(req)
  if (cors) return cors

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature') || ''
    const secret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')

    if (secret) {
      const expected = await hmacSha256Hex(secret, rawBody)
      if (!timingSafeEqual(expected, signature)) {
        return jsonResponse({ error: 'Invalid webhook signature' }, 400)
      }
    }

    const event = JSON.parse(rawBody)
    const eventName = event?.event
    const payment = event?.payload?.payment?.entity

    if (
      !payment ||
      (eventName !== 'payment.captured' && eventName !== 'payment.authorized')
    ) {
      return jsonResponse({ received: true, ignored: true })
    }

    const razorpayOrderId = payment.order_id
    const razorpayPaymentId = payment.id
    const supabaseOrderId =
      payment.notes?.supabase_order_id ||
      event?.payload?.order?.entity?.notes?.supabase_order_id ||
      null

    const supabase = createServiceClient()
    let query = supabase.from('orders').update({
      payment_method: 'Razorpay',
      payment_status: 'Paid',
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
    })

    if (supabaseOrderId) {
      query = query.eq('id', supabaseOrderId)
    } else if (razorpayOrderId) {
      query = query.eq('razorpay_order_id', razorpayOrderId)
    } else {
      return jsonResponse({ received: true, matched: false })
    }

    const { data, error } = await query.select('id')
    if (error) return jsonResponse({ error: error.message }, 500)

    // Ensure key exists in project secrets (documents required config).
    getEnv('RAZORPAY_KEY_ID')

    return jsonResponse({
      received: true,
      matched: Array.isArray(data) ? data.length > 0 : false,
      event: eventName,
      razorpay_payment_id: razorpayPaymentId,
    })
  } catch (err) {
    return jsonResponse(
      { error: (err as Error).message || 'Unexpected error' },
      500,
    )
  }
})
