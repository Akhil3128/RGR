import { supabase, isSupabaseConfigured } from '../lib/supabase'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Save an order (and its items) to Supabase.
// Returns { saved, error }. When Supabase is not configured we simply skip
// saving so the WhatsApp flow still works.
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

  // Generate the id on the client so we don't need SELECT permission for the
  // anonymous customer (RLS only allows anon to INSERT, not read orders).
  const orderId =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : undefined

  const { error: orderError } = await supabase.from('orders').insert({
    id: orderId,
    customer_name: customer.name,
    customer_phone: customer.phone,
    order_type: customer.orderType,
    address: customer.orderType === 'delivery' ? customer.address : null,
    notes: customer.notes || null,
    total_amount: total,
    status: 'New',
    payment_status: 'Pending',
  })

  if (orderError) return { saved: false, error: orderError }

  const orderItems = items.map((it) => ({
    order_id: orderId,
    // Only link to products table when the id is a real UUID (live data).
    product_id: UUID_RE.test(String(it.id)) ? it.id : null,
    product_name: it.name,
    size: it.size,
    unit_price: it.price,
    quantity: it.quantity,
    line_total: it.price * it.quantity,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) return { saved: false, error: itemsError }

  return { saved: true, error: null, orderId }
}
