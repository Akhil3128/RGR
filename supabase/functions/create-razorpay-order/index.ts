import {
  createServiceClient,
  getEnv,
  handleCors,
  jsonResponse,
  razorpayAuthHeader,
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
    if (!orderId) {
      return jsonResponse({ error: 'order_id is required' }, 400)
    }

    const supabase = createServiceClient()
    const { data: order, error } = await supabase
      .from('orders')
      .select(
        'id, total_amount, payment_method, payment_status, customer_name, customer_phone, razorpay_order_id',
      )
      .eq('id', orderId)
      .maybeSingle()

    if (error) return jsonResponse({ error: error.message }, 500)
    if (!order) return jsonResponse({ error: 'Order not found' }, 404)

    if (order.payment_status === 'Paid') {
      return jsonResponse({
        key_id: getEnv('RAZORPAY_KEY_ID'),
        order_id: order.razorpay_order_id,
        amount: Math.round(Number(order.total_amount) * 100),
        currency: 'INR',
        already_paid: true,
      })
    }

    const amountPaise = Math.round(Number(order.total_amount) * 100)
    if (!Number.isFinite(amountPaise) || amountPaise < 100) {
      return jsonResponse(
        { error: 'Order total must be at least ₹1.00 for Razorpay' },
        400,
      )
    }

    // Reuse existing Razorpay order if present.
    if (order.razorpay_order_id) {
      return jsonResponse({
        key_id: getEnv('RAZORPAY_KEY_ID'),
        order_id: order.razorpay_order_id,
        amount: amountPaise,
        currency: 'INR',
        receipt: order.id,
        customer: {
          name: order.customer_name,
          contact: order.customer_phone,
        },
      })
    }

    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: razorpayAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: 'INR',
        receipt: String(order.id).slice(0, 40),
        notes: {
          supabase_order_id: order.id,
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
        },
      }),
    })

    const rzpJson = await rzpRes.json()
    if (!rzpRes.ok) {
      return jsonResponse(
        {
          error:
            rzpJson?.error?.description ||
            rzpJson?.error?.reason ||
            'Failed to create Razorpay order',
        },
        502,
      )
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_method: 'Razorpay',
        payment_status: 'Pending',
        razorpay_order_id: rzpJson.id,
      })
      .eq('id', order.id)

    if (updateError) {
      return jsonResponse({ error: updateError.message }, 500)
    }

    return jsonResponse({
      key_id: getEnv('RAZORPAY_KEY_ID'),
      order_id: rzpJson.id,
      amount: amountPaise,
      currency: 'INR',
      receipt: order.id,
      customer: {
        name: order.customer_name,
        contact: order.customer_phone,
      },
    })
  } catch (err) {
    return jsonResponse({ error: err.message || 'Unexpected error' }, 500)
  }
})
