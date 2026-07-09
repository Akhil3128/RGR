import { useEffect, useMemo, useState } from 'react'
import { formatCurrency } from '../utils/order'

const emptyProduct = {
  name: '',
  size: '',
  price: '',
  net_rate: '',
  available: true,
  low_stock_threshold: 5,
  display_order: 99,
}

const orderStatuses = ['New', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled']
const paymentStatuses = ['Pending', 'Paid', 'Partial']

function StatCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-gold/25 bg-white p-5 shadow-soft">
      <p className="text-sm font-semibold text-godavari">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-maroon-dark">{value}</p>
    </div>
  )
}

export default function AdminDashboard({ supabase, onLogout, onProductsChanged }) {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState([])
  const [productForm, setProductForm] = useState(emptyProduct)
  const [editingProductId, setEditingProductId] = useState(null)
  const [message, setMessage] = useState('')

  async function loadAdminData() {
    const [{ data: productRows }, { data: orderRows }, { data: inventoryRows }] = await Promise.all([
      supabase.from('products').select('*').order('display_order', { ascending: true }),
      supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }),
      supabase.from('inventory').select('*'),
    ])

    setProducts(productRows || [])
    setOrders(orderRows || [])
    setInventory(inventoryRows || [])
  }

  useEffect(() => {
    loadAdminData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const inventoryByProductId = useMemo(
    () => Object.fromEntries(inventory.map((item) => [item.product_id, item])),
    [inventory],
  )

  const totals = useMemo(() => {
    const activeOrders = orders.filter((order) => order.status !== 'Cancelled')
    const allItems = activeOrders.flatMap((order) => order.order_items || [])
    const salesAmount = allItems.reduce((sum, item) => sum + Number(item.line_total || 0), 0)
    const costAmount = allItems.reduce((sum, item) => sum + Number(item.cost_total || 0), 0)
    const lowStockItems = products.filter((product) => {
      const stock = inventoryByProductId[product.id]
      return stock && Number(stock.closing_stock || 0) <= Number(product.low_stock_threshold || 0)
    }).length

    return {
      totalOrders: orders.length,
      salesAmount,
      costAmount,
      profit: salesAmount - costAmount,
      pendingOrders: orders.filter((order) => ['New', 'Confirmed', 'Preparing'].includes(order.status)).length,
      lowStockItems,
    }
  }, [inventoryByProductId, orders, products])

  function updateProductForm(field, value) {
    setProductForm((current) => ({ ...current, [field]: value }))
  }

  function editProduct(product) {
    setEditingProductId(product.id)
    setProductForm({
      name: product.name || '',
      size: product.size || '',
      price: product.price ?? '',
      net_rate: product.net_rate ?? '',
      available: product.available,
      low_stock_threshold: product.low_stock_threshold ?? 5,
      display_order: product.display_order ?? 99,
    })
  }

  async function saveProduct(event) {
    event.preventDefault()
    setMessage('')

    const payload = {
      name: productForm.name.trim(),
      size: productForm.size.trim(),
      price: productForm.price === '' ? null : Number(productForm.price),
      net_rate: productForm.net_rate === '' ? 0 : Number(productForm.net_rate),
      available: productForm.available,
      low_stock_threshold: Number(productForm.low_stock_threshold || 0),
      display_order: Number(productForm.display_order || 99),
    }

    const query = editingProductId
      ? supabase.from('products').update(payload).eq('id', editingProductId)
      : supabase.from('products').insert(payload)

    const { error } = await query
    if (error) {
      setMessage(error.message)
      return
    }

    setProductForm(emptyProduct)
    setEditingProductId(null)
    setMessage('Product saved successfully.')
    await loadAdminData()
    await onProductsChanged()
  }

  async function deleteProduct(productId) {
    if (!window.confirm('Delete this product?')) return

    const { error } = await supabase.from('products').delete().eq('id', productId)
    if (error) {
      setMessage(error.message)
      return
    }

    setMessage('Product deleted.')
    await loadAdminData()
    await onProductsChanged()
  }

  async function saveInventory(productId, field, value) {
    const current = inventoryByProductId[productId] || {
      product_id: productId,
      opening_stock: 0,
      stock_received: 0,
      sales: 0,
    }
    const payload = {
      product_id: productId,
      opening_stock: Number(field === 'opening_stock' ? value : current.opening_stock || 0),
      stock_received: Number(field === 'stock_received' ? value : current.stock_received || 0),
      sales: Number(field === 'sales' ? value : current.sales || 0),
    }

    const { error } = await supabase.from('inventory').upsert(payload, { onConflict: 'product_id' })
    if (error) {
      setMessage(error.message)
      return
    }

    await loadAdminData()
  }

  async function updateOrder(orderId, field, value) {
    const { error } = await supabase.from('orders').update({ [field]: value }).eq('id', orderId)
    if (error) {
      setMessage(error.message)
      return
    }

    setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, [field]: value } : order)))
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 rounded-3xl bg-maroon p-6 text-white shadow-soft md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">Admin Dashboard</p>
            <h1 className="font-display text-4xl font-bold">Ranganayaki Godavari Ruchulu</h1>
            <p className="mt-2 text-white/80">Products, inventory, orders, and profit tracking.</p>
          </div>
          <button type="button" onClick={onLogout} className="rounded-full bg-white px-5 py-3 font-bold text-maroon">
            Logout
          </button>
        </div>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <StatCard label="Total Orders" value={totals.totalOrders} />
          <StatCard label="Total Sales Amount" value={formatCurrency(totals.salesAmount)} />
          <StatCard label="Total Cost Amount" value={formatCurrency(totals.costAmount)} />
          <StatCard label="Total Profit" value={formatCurrency(totals.profit)} />
          <StatCard label="Pending Orders" value={totals.pendingOrders} />
          <StatCard label="Low Stock Items" value={totals.lowStockItems} />
        </section>

        {message && <p className="mt-6 rounded-2xl bg-white p-4 font-semibold text-godavari shadow-soft">{message}</p>}

        <section className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]">
          <form onSubmit={saveProduct} className="rounded-3xl border border-gold/25 bg-white p-5 shadow-soft">
            <h2 className="font-display text-3xl font-bold text-maroon-dark">
              {editingProductId ? 'Edit Product' : 'Add Product'}
            </h2>
            <div className="mt-5 grid gap-4">
              <input
                required
                value={productForm.name}
                onChange={(event) => updateProductForm('name', event.target.value)}
                placeholder="Product name"
                className="rounded-2xl border border-sandal bg-cream/60 px-4 py-3 outline-none focus:border-gold"
              />
              <input
                required
                value={productForm.size}
                onChange={(event) => updateProductForm('size', event.target.value)}
                placeholder="Size"
                className="rounded-2xl border border-sandal bg-cream/60 px-4 py-3 outline-none focus:border-gold"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="number"
                  min="0"
                  value={productForm.price}
                  onChange={(event) => updateProductForm('price', event.target.value)}
                  placeholder="Selling price"
                  className="rounded-2xl border border-sandal bg-cream/60 px-4 py-3 outline-none focus:border-gold"
                />
                <input
                  type="number"
                  min="0"
                  value={productForm.net_rate}
                  onChange={(event) => updateProductForm('net_rate', event.target.value)}
                  placeholder="Net rate / cost"
                  className="rounded-2xl border border-sandal bg-cream/60 px-4 py-3 outline-none focus:border-gold"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="number"
                  min="0"
                  value={productForm.low_stock_threshold}
                  onChange={(event) => updateProductForm('low_stock_threshold', event.target.value)}
                  placeholder="Low stock alert"
                  className="rounded-2xl border border-sandal bg-cream/60 px-4 py-3 outline-none focus:border-gold"
                />
                <input
                  type="number"
                  min="0"
                  value={productForm.display_order}
                  onChange={(event) => updateProductForm('display_order', event.target.value)}
                  placeholder="Display order"
                  className="rounded-2xl border border-sandal bg-cream/60 px-4 py-3 outline-none focus:border-gold"
                />
              </div>
              <label className="flex items-center gap-3 font-semibold text-maroon-dark">
                <input
                  type="checkbox"
                  checked={productForm.available}
                  onChange={(event) => updateProductForm('available', event.target.checked)}
                />
                Available
              </label>
              <button type="submit" className="rounded-full bg-maroon px-6 py-4 font-bold text-white">
                Save Product
              </button>
              {editingProductId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProductId(null)
                    setProductForm(emptyProduct)
                  }}
                  className="rounded-full border border-gold px-6 py-3 font-bold text-maroon"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          <div className="rounded-3xl border border-gold/25 bg-white p-5 shadow-soft">
            <h2 className="font-display text-3xl font-bold text-maroon-dark">Products & Inventory</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-[900px] text-left text-sm">
                <thead className="bg-cream text-maroon-dark">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Net Rate</th>
                    <th className="p-3">Available</th>
                    <th className="p-3">Opening</th>
                    <th className="p-3">Received</th>
                    <th className="p-3">Sales</th>
                    <th className="p-3">Closing</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const stock = inventoryByProductId[product.id] || {}
                    return (
                      <tr key={product.id} className="border-b border-sandal/70">
                        <td className="p-3 font-semibold text-maroon-dark">
                          {product.name}
                          <span className="block text-xs font-normal text-godavari">{product.size}</span>
                        </td>
                        <td className="p-3">{formatCurrency(product.price)}</td>
                        <td className="p-3">{formatCurrency(product.net_rate)}</td>
                        <td className="p-3">{product.available ? 'Yes' : 'No'}</td>
                        {['opening_stock', 'stock_received', 'sales'].map((field) => (
                          <td key={field} className="p-3">
                            <input
                              type="number"
                              min="0"
                              defaultValue={stock[field] || 0}
                              onBlur={(event) => saveInventory(product.id, field, event.target.value)}
                              className="w-20 rounded-xl border border-sandal bg-cream/60 px-3 py-2"
                            />
                          </td>
                        ))}
                        <td className="p-3 font-bold text-godavari">{stock.closing_stock || 0}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button type="button" onClick={() => editProduct(product)} className="font-bold text-godavari">
                              Edit
                            </button>
                            <button type="button" onClick={() => deleteProduct(product.id)} className="font-bold text-maroon">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-gold/25 bg-white p-5 shadow-soft">
          <h2 className="font-display text-3xl font-bold text-maroon-dark">Website Orders</h2>
          <div className="mt-5 grid gap-5">
            {orders.length === 0 && <p className="rounded-2xl bg-cream p-4 text-maroon-dark">No orders yet.</p>}
            {orders.map((order) => (
              <article key={order.id} className="rounded-3xl border border-sandal bg-cream/60 p-4">
                <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-maroon-dark">{order.customer_name}</h3>
                    <p className="text-sm text-godavari">
                      {order.customer_phone} • {order.fulfillment_type} • {new Date(order.created_at).toLocaleString()}
                    </p>
                    <p className="mt-2 text-sm text-maroon-dark">Address: {order.address || 'Not provided'}</p>
                    <p className="text-sm text-maroon-dark">Notes: {order.notes || 'None'}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <select
                      value={order.status}
                      onChange={(event) => updateOrder(order.id, 'status', event.target.value)}
                      className="rounded-2xl border border-sandal bg-white px-4 py-3"
                    >
                      {orderStatuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                    <select
                      value={order.payment_status}
                      onChange={(event) => updateOrder(order.id, 'payment_status', event.target.value)}
                      className="rounded-2xl border border-sandal bg-white px-4 py-3"
                    >
                      {paymentStatuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 grid gap-2">
                  {(order.order_items || []).map((item) => (
                    <div key={item.id} className="flex flex-wrap justify-between gap-2 rounded-2xl bg-white p-3 text-sm">
                      <span>
                        {item.product_name} - {item.size} x {item.quantity}
                      </span>
                      <span className="font-bold text-godavari">{formatCurrency(item.line_total)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right font-display text-2xl font-bold text-maroon-dark">
                  Total: {formatCurrency(order.total_amount)}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
