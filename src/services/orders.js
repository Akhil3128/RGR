import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { PAYMENT_STATUS_BY_METHOD } from '../constants'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function buildItemsPayload(items) {
  return items.map((it) => ({
    product_id: UUID_RE.test(String(it.id)) ? it.id : null,
    product_name: it.name,
    size: it.size || '',
    unit_price: Number(it.price),
    quantity: Number(it.quantity),
    line_total: Number(it.price) * Number(it.quantity),
  }))
}

function resolvePayment(customer) {
  const method = customer.paymentMethod || 'Pay Later'
  const status =
    customer.paymentStatus ||
    PAYMENT_STATUS_BY_METHOD[method] ||
    'Pending'
  return { method, status }
}

async function saveOrderDirect({ orderId, items, total, customer }) {
  const { method, status } = resolvePayment(customer)

  const { error: orderError } = await supabase.from('orders').insert({
    id: orderId,
    customer_name: customer.name,
    customer_phone: customer.phone,
    order_type: customer.orderType,
    address: customer.orderType === 'delivery' ? customer.address : null,
    notes: customer.notes || null,
    total_amount: total,
    status: 'New',
    payment_method: method,
    payment_status: status,
  })
  if (orderError) return { saved: false, error: orderError }

  const orderItems = buildItemsPayload(items).map((it) => ({
    order_id: orderId,
    product_id: it.product_id,
    product_name: it.product_name,
    size: it.size || null,
    unit_price: it.unit_price,
    quantity: it.quantity,
    line_total: it.line_total,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) return { saved: false, error: itemsError }
  return { saved: true, error: null, orderId }
}

export async function saveOrder({ items, total, customer }) {
  if (!isSupabaseConfigured) {
    return {
      saved: false,
      error: {
        message:
          'Supabase is not connected. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file and restart npm run dev.',
      },
    }
  }

  if (!items?.length) {
    return { saved: false, error: { message: 'Cart is empty.' } }
  }

  const { method, status } = resolvePayment(customer)
  const orderId = crypto.randomUUID()

  const payload = {
    p_order_id: orderId,
    p_customer_name: customer.name.trim(),
    p_customer_phone: customer.phone.trim(),
    p_order_type: customer.orderType,
    p_address: customer.orderType === 'delivery' ? customer.address : null,
    p_notes: customer.notes || null,
    p_total_amount: total,
    p_items: buildItemsPayload(items),
    p_payment_method: method,
    p_payment_status: status,
  }

  const { data: rpcId, error: rpcError } = await supabase.rpc(
    'place_order',
    payload,
  )

  if (!rpcError) {
    return { saved: true, error: null, orderId: rpcId || orderId }
  }

  const isMissingRpc =
    rpcError.message?.includes('place_order') ||
    rpcError.code === 'PGRST202'

  if (!isMissingRpc) {
    return { saved: false, error: rpcError }
  }

  return saveOrderDirect({ orderId, items, total, customer })
}
