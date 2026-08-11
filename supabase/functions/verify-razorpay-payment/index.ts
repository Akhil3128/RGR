import {
  createServiceClient,
  getEnv,
  handleCors,
  hmacSha256Hex,
  jsonResponse,
} from '../_shared/razorpay.ts'

Deno.serve(async (req) => {
  const cors = handleCors(req)
  if (cors) return cors

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  try {
    const body = await req.json()
    const orderId = String(body.order_id || '').trim()
    const razorpayOrderId = String(body.razorpay_order_id || '').trim()
    const razorpayPaymentId = String(body.razorpay_payment_id || '').trim()
    const razorpaySignature = String(body.razorpay_signature || '').trim()

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return jsonResponse(
        {
          error:
            'order_id, razorpay_order_id, razorpay_payment_id and razorpay_signature are required',
        },
        400,
      )
    }

    const expected = await hmacSha256Hex(
      getEnv('RAZORPAY_KEY_SECRET'),
      `${razorpayOrderId}|${razorpayPaymentId}`,
    )

    if (expected !== razorpaySignature) {
      return jsonResponse({ error: 'Invalid payment signature', paid: false }, 400)
    }

    const supabase = createServiceClient()
    const { data: order, error } = await supabase
      .from('orders')
      .select('id, razorpay_order_id, payment_status, total_amount')
      .eq('id', orderId)
      .maybeSingle()

    if (error) return jsonResponse({ error: error.message, paid: false }, 500)
    if (!order) return jsonResponse({ error: 'Order not found', paid: false }, 404)

    if (
      order.razorpay_order_id &&
      order.razorpay_order_id !== razorpayOrderId
    ) {
      return jsonResponse(
        { error: 'Razorpay order mismatch', paid: false },
        400,
      )
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_method: 'Razorpay',
        payment_status: 'Paid',
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
      })
      .eq('id', orderId)

    if (updateError) {
      return jsonResponse({ error: updateError.message, paid: false }, 500)
    }

    return jsonResponse({
      paid: true,
      order_id: orderId,
      payment_status: 'Paid',
      razorpay_payment_id: razorpayPaymentId,
    })
  } catch (err) {
    return jsonResponse(
      { error: err.message || 'Unexpected error', paid: false },
      500,
    )
  }
})
