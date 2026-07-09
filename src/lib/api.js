import { supabase, isSupabaseConfigured } from './supabase'
import { SAMPLE_PRODUCTS } from '../data/sampleProducts'

const LOCAL_PRODUCTS_KEY = 'rgr_local_products'
const LOCAL_ORDERS_KEY = 'rgr_local_orders'
const LOCAL_INVENTORY_KEY = 'rgr_local_inventory'

function readLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function ensureLocalProducts() {
  const existing = readLocal(LOCAL_PRODUCTS_KEY, null)
  if (existing?.length) return existing
  writeLocal(LOCAL_PRODUCTS_KEY, SAMPLE_PRODUCTS)
  return SAMPLE_PRODUCTS
}

function ensureLocalInventory(products) {
  const existing = readLocal(LOCAL_INVENTORY_KEY, null)
  if (existing?.length) return existing
  const inventory = products.map((p) => ({
    id: `inv-${p.id}`,
    product_id: p.id,
    opening_stock: 0,
    stock_received: 0,
    sales: 0,
    products: p,
  }))
  writeLocal(LOCAL_INVENTORY_KEY, inventory)
  return inventory
}

// ---------- Products ----------

export async function fetchProducts({ availableOnly = false } = {}) {
  if (!isSupabaseConfigured) {
    let products = ensureLocalProducts()
    if (availableOnly) products = products.filter((p) => p.is_available)
    return [...products].sort((a, b) => a.sort_order - b.sort_order)
  }

  let query = supabase.from('products').select('*').order('sort_order', { ascending: true })
  if (availableOnly) query = query.eq('is_available', true)

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function createProduct(product) {
  if (!isSupabaseConfigured) {
    const products = ensureLocalProducts()
    const newProduct = {
      ...product,
      id: `local-${Date.now()}`,
      sort_order: products.length + 1,
    }
    products.push(newProduct)
    writeLocal(LOCAL_PRODUCTS_KEY, products)

    const inventory = ensureLocalInventory(products)
    inventory.push({
      id: `inv-${newProduct.id}`,
      product_id: newProduct.id,
      opening_stock: 0,
      stock_received: 0,
      sales: 0,
      products: newProduct,
    })
    writeLocal(LOCAL_INVENTORY_KEY, inventory)
    return newProduct
  }

  const { data, error } = await supabase.from('products').insert(product).select().single()
  if (error) throw error

  await supabase.from('inventory').insert({
    product_id: data.id,
    opening_stock: 0,
    stock_received: 0,
    sales: 0,
  })

  return data
}

export async function updateProduct(id, updates) {
  if (!isSupabaseConfigured) {
    const products = ensureLocalProducts().map((p) =>
      p.id === id ? { ...p, ...updates } : p
    )
    writeLocal(LOCAL_PRODUCTS_KEY, products)

    const inventory = ensureLocalInventory(products).map((row) =>
      row.product_id === id ? { ...row, products: products.find((p) => p.id === id) } : row
    )
    writeLocal(LOCAL_INVENTORY_KEY, inventory)
    return products.find((p) => p.id === id)
  }

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProduct(id) {
  if (!isSupabaseConfigured) {
    const products = ensureLocalProducts().filter((p) => p.id !== id)
    writeLocal(LOCAL_PRODUCTS_KEY, products)
    const inventory = ensureLocalInventory(products).filter((row) => row.product_id !== id)
    writeLocal(LOCAL_INVENTORY_KEY, inventory)
    return
  }

  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

// ---------- Orders ----------

export async function createOrder({ customer, items, total }) {
  const orderPayload = {
    customer_name: customer.name,
    phone: customer.phone,
    delivery_type: customer.deliveryType,
    address: customer.address || '',
    notes: customer.notes || '',
    total_amount: total,
    status: 'New',
    payment_status: 'Pending',
  }

  if (!isSupabaseConfigured) {
    const orders = readLocal(LOCAL_ORDERS_KEY, [])
    const order = {
      id: `order-${Date.now()}`,
      ...orderPayload,
      created_at: new Date().toISOString(),
      order_items: items.map((item, index) => ({
        id: `item-${Date.now()}-${index}`,
        product_id: item.id,
        product_name: item.name,
        product_size: item.size || '',
        quantity: item.quantity,
        unit_price: item.price,
        net_rate: item.net_rate || 0,
      })),
    }
    orders.unshift(order)
    writeLocal(LOCAL_ORDERS_KEY, orders)
    return order
  }

  const { data: order, error } = await supabase
    .from('orders')
    .insert(orderPayload)
    .select()
    .single()
  if (error) throw error

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: String(item.id).startsWith('sample-') || String(item.id).startsWith('local-')
      ? null
      : item.id,
    product_name: item.name,
    product_size: item.size || '',
    quantity: item.quantity,
    unit_price: item.price,
    net_rate: item.net_rate || 0,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) throw itemsError

  return order
}

export async function fetchOrders() {
  if (!isSupabaseConfigured) {
    return readLocal(LOCAL_ORDERS_KEY, [])
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function updateOrder(id, updates) {
  if (!isSupabaseConfigured) {
    const orders = readLocal(LOCAL_ORDERS_KEY, []).map((o) =>
      o.id === id ? { ...o, ...updates } : o
    )
    writeLocal(LOCAL_ORDERS_KEY, orders)
    return orders.find((o) => o.id === id)
  }

  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select('*, order_items(*)')
    .single()
  if (error) throw error
  return data
}

// ---------- Inventory ----------

export async function fetchInventory() {
  if (!isSupabaseConfigured) {
    const products = ensureLocalProducts()
    return ensureLocalInventory(products)
  }

  const { data, error } = await supabase
    .from('inventory')
    .select('*, products(*)')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function updateInventory(id, updates) {
  if (!isSupabaseConfigured) {
    const products = ensureLocalProducts()
    const inventory = ensureLocalInventory(products).map((row) =>
      row.id === id ? { ...row, ...updates } : row
    )
    writeLocal(LOCAL_INVENTORY_KEY, inventory)
    return inventory.find((row) => row.id === id)
  }

  const { data, error } = await supabase
    .from('inventory')
    .update(updates)
    .eq('id', id)
    .select('*, products(*)')
    .single()
  if (error) throw error
  return data
}
