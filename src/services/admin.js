import { supabase } from '../lib/supabase'

// ---------- Products ----------
export async function getProducts() {
  return supabase.from('products').select('*').order('sort_order', { ascending: true })
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
