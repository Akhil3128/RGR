import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../lib/format'

const EMPTY_FORM = {
  name: '',
  size: '',
  category: 'Sweets',
  price: '',
  net_rate: '',
  is_available: true,
}

const CATEGORIES = ['Sweets', 'Snacks', 'Dairy', 'Ghee']

export default function ProductsAdmin() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })
    if (!error) setProducts(data)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const showMessage = (text) => {
    setMessage(text)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const startEditing = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      size: product.size,
      category: product.category,
      price: product.price,
      net_rate: product.net_rate ?? '',
      is_available: product.is_available,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      name: form.name.trim(),
      size: form.size.trim(),
      category: form.category,
      price: Number(form.price),
      net_rate: Number(form.net_rate || 0),
      is_available: form.is_available,
    }

    const { error } = editingId
      ? await supabase.from('products').update(payload).eq('id', editingId)
      : await supabase
          .from('products')
          .insert({ ...payload, sort_order: products.length + 1 })

    if (error) {
      showMessage(`❌ ${error.message}`)
    } else {
      showMessage(editingId ? '✅ Product updated' : '✅ Product added')
      cancelEditing()
      loadProducts()
    }
  }

  const toggleAvailability = async (product) => {
    const { error } = await supabase
      .from('products')
      .update({ is_available: !product.is_available })
      .eq('id', product.id)
    if (!error) loadProducts()
  }

  const deleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name} (${product.size})"? This cannot be undone.`
    )
    if (!confirmed) return

    const { error } = await supabase.from('products').delete().eq('id', product.id)
    if (error) {
      showMessage(`❌ ${error.message}`)
    } else {
      showMessage('🗑️ Product deleted')
      loadProducts()
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-maroon">Products</h1>

      {/* ── Add / Edit form ────────────────────────────── */}
      <form onSubmit={handleSubmit} className="card mt-5 p-5">
        <h2 className="font-heading text-lg font-semibold text-forest">
          {editingId ? '✏️ Edit Product' : '➕ Add New Product'}
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Name *</label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Kova"
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Size *</label>
            <input
              name="size"
              required
              value={form.size}
              onChange={handleChange}
              placeholder="e.g. 250 gm"
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="input-field"
            >
              {CATEGORIES.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Selling Price (₹) *
            </label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 175"
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Net Rate / Cost Price (₹)
            </label>
            <input
              name="net_rate"
              type="number"
              min="0"
              step="0.01"
              value={form.net_rate}
              onChange={handleChange}
              placeholder="e.g. 120"
              className="input-field"
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                name="is_available"
                checked={form.is_available}
                onChange={handleChange}
                className="h-4 w-4 accent-maroon"
              />
              Available for ordering
            </label>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button type="submit" className="btn-primary">
            {editingId ? 'Save Changes' : 'Add Product'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEditing} className="btn-outline">
              Cancel
            </button>
          )}
        </div>

        {message && <p className="mt-3 text-sm">{message}</p>}
      </form>

      {/* ── Product list ───────────────────────────────── */}
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b-2 border-gold/40 bg-cream-dark text-xs uppercase text-forest/70">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Net Rate</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/20">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3 font-medium text-maroon">
                  {product.name}{' '}
                  <span className="text-xs font-normal text-forest/60">
                    ({product.size})
                  </span>
                </td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">{formatPrice(product.price)}</td>
                <td className="px-4 py-3">{formatPrice(product.net_rate)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleAvailability(product)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      product.is_available
                        ? 'bg-forest/10 text-forest'
                        : 'bg-maroon/10 text-maroon'
                    }`}
                  >
                    {product.is_available ? '● Available' : '○ Unavailable'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => startEditing(product)}
                    className="mr-2 text-forest underline hover:text-forest-dark"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product)}
                    className="text-maroon underline hover:text-maroon-dark"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-forest/60">
                  No products yet. Add your first product above, or run the seed
                  SQL from <code>supabase/schema.sql</code>.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
