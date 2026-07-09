import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Saves the order + order items to Supabase.
 * Safe to call even when Supabase isn't configured yet (it will simply skip saving),
 * so the WhatsApp ordering flow always works for the customer.
 */
export async function saveOrderToSupabase({ customer, items, total }) {
  if (!isSupabaseConfigured) {
    return { success: false, skipped: true }
  }

  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: customer.name,
        phone: customer.phone,
        fulfillment_type: customer.fulfillment,
        address: customer.fulfillment === 'delivery' ? customer.address : null,
        notes: customer.notes || null,
        total_amount: total,
      })
      .select()
      .single()

    if (orderError) throw orderError

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: UUID_PATTERN.test(item.productId) ? item.productId : null,
      product_name: item.name,
      size: item.size,
      quantity: item.quantity,
      unit_price: item.price || 0,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) throw itemsError

    return { success: true, orderId: order.id }
  } catch (error) {
    // We don't block the WhatsApp order flow if saving to the database fails.
    console.error('Could not save order to Supabase:', error.message)
    return { success: false, error: error.message }
  }
}
