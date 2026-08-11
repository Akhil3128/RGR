import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { dedupeProducts } from './products'

function notConfigured() {
  return {
    data: null,
    error: { message: 'Supabase is not configured. Add keys to .env and restart.' },
  }
}

// ---------- Admin check ----------
export async function checkIsAdmin() {
  if (!isSupabaseConfigured || !supabase) {
    return { isAdmin: false, error: { message: 'Supabase not configured' } }
  }
  const { data, error } = await supabase.rpc('is_admin')
  if (error) return { isAdmin: false, error }
  return { isAdmin: Boolean(data), error: null }
}

// ---------- Products ----------
export async function getProducts() {
  if (!isSupabaseConfigured) return notConfigured()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })
  return { data: dedupeProducts(data ?? []), error }
}

export async function createProduct(product) {
  if (!isSupabaseConfigured) return notConfigured()
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single()

  // Ensure every new product has an inventory row.
  if (!error && data?.id) {
    await supabase
      .from('inventory')
      .upsert({ product_id: data.id }, { onConflict: 'product_id' })
  }

  return { data, error }
}

export async function updateProduct(id, changes) {
  if (!isSupabaseConfigured) return notConfigured()
  return supabase.from('products').update(changes).eq('id', id).select().single()
}

export async function deleteProduct(id) {
  if (!isSupabaseConfigured) return notConfigured()
  return supabase.from('products').delete().eq('id', id)
}

// ---------- Inventory ----------
export async function getInventory() {
  if (!isSupabaseConfigured) return notConfigured()
  return supabase
    .from('inventory')
    .select('*, products(name, size)')
    .order('updated_at', { ascending: false })
}

export async function upsertInventory(row) {
  if (!isSupabaseConfigured) return notConfigured()
  return supabase
    .from('inventory')
    .upsert(row, { onConflict: 'product_id' })
    .select()
    .single()
}

// ---------- Orders ----------
export async function getOrders() {
  if (!isSupabaseConfigured) return notConfigured()
  return supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
}

export async function updateOrder(id, changes) {
  if (!isSupabaseConfigured) return notConfigured()
  return supabase.from('orders').update(changes).eq('id', id).select().single()
}

export async function updateOrderStatus(id, status) {
  if (!isSupabaseConfigured) {
    return { data: null, error: { message: 'Supabase is not configured.' } }
  }

  const { data, error } = await supabase.rpc('admin_update_order_status', {
    p_order_id: id,
    p_new_status: status,
  })

  if (error) {
    // Fallback if migration not run yet — status only, no inventory.
    if (
      error.message?.includes('admin_update_order_status') ||
      error.code === 'PGRST202'
    ) {
      const result = await updateOrder(id, { status })
      return {
        data: result.data
          ? {
              success: true,
              message:
                'Status updated. Run supabase/migration-inventory-revert-on-status-change.sql so inventory updates automatically.',
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
export async function getDashboardData() {
  if (!isSupabaseConfigured) {
    const err = { error: { message: 'Supabase not configured' } }
    return { orders: err, items: err, inventory: err }
  }

  const [orders, items, inventory] = await Promise.all([
    supabase.from('orders').select('id, status, total_amount'),
    supabase
      .from('order_items')
      .select(
        'quantity, unit_price, line_total, orders(status), products(net_rate)',
      ),
    supabase.from('inventory').select('*, products(name, size)'),
  ])
  return { orders, items, inventory }
}
