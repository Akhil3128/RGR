import { supabase } from '../lib/supabase'
import { dedupeProducts } from './products'

// ---------- Admin check ----------
export async function checkIsAdmin() {
  const { data, error } = await supabase.rpc('is_admin')
  if (error) return { isAdmin: false, error }
  return { isAdmin: Boolean(data), error: null }
}

// ---------- Products ----------
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })
  return { data: dedupeProducts(data ?? []), error }
}

export async function createProduct(product) {
  return supabase.from('products').insert(product).select().single()
}

export async function updateProduct(id, changes) {
  return supabase.from('products').update(changes).eq('id', id).select().single()
}

export async function deleteProduct(id) {
  return supabase.from('products').delete().eq('id', id)
}

// ---------- Inventory ----------
// Returns inventory rows joined with product name/size.
export async function getInventory() {
  return supabase
    .from('inventory')
    .select('*, products(name, size)')
    .order('updated_at', { ascending: false })
}

export async function upsertInventory(row) {
  return supabase
    .from('inventory')
    .upsert(row, { onConflict: 'product_id' })
    .select()
    .single()
}

// ---------- Orders ----------
export async function getOrders() {
  return supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
}

export async function updateOrder(id, changes) {
  return supabase.from('orders').update(changes).eq('id', id).select().single()
}

// Update order status and deduct inventory when marked Delivered / Completed.
// Uses admin_update_order_status RPC (safe: deducts only once per order).
export async function updateOrderStatus(id, status) {
  const { data, error } = await supabase.rpc('admin_update_order_status', {
    p_order_id: id,
    p_new_status: status,
  })

  if (error) {
    // Fallback if migration not run yet — status only, no inventory.
    if (error.message?.includes('admin_update_order_status') || error.code === 'PGRST202') {
      const result = await updateOrder(id, { status })
      return {
        data: result.data
          ? {
              success: true,
              message:
                'Status updated. Run supabase/migration-inventory-on-delivery.sql to enable inventory on delivery.',
              warnings: [],
            }
          : null,
        error: result.error,
      }
    }
    return { data: null, error }
  }

  return { data, error: null }
}

// ---------- Dashboard stats ----------
// Pulls the data needed to compute all dashboard cards.
export async function getDashboardData() {
  const [orders, items, inventory] = await Promise.all([
    supabase.from('orders').select('id, status, total_amount'),
    supabase
      .from('order_items')
      .select('quantity, unit_price, line_total, orders(status), products(net_rate)'),
    supabase.from('inventory').select('*, products(name, size)'),
  ])
  return { orders, items, inventory }
}
