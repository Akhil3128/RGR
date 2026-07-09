import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Modal from '../../components/admin/Modal'
import { formatCurrency } from '../../utils/format'

const EMPTY_FORM = {
  category: 'Sweets',
  name: '',
  size: '',
  price: '',
  net_rate: '',
  is_available: true,
  low_stock_threshold: 5,
  sort_order: 0,
}

const CATEGORIES = ['Sweets', 'Snacks', 'Dairy & Ghee']

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  async function loadProducts() {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .order('category')
      .order('sort_order')
    if (fetchError) setError(fetchError.message)
    else setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  function openAddModal() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  function openEditModal(product) {
    setEditingId(product.id)
    setForm({
      category: product.category || 'Sweets',
      name: product.name || '',
      size: product.size || '',
      price: product.price ?? '',
      net_rate: product.net_rate ?? '',
      is_available: product.is_available,
      low_stock_threshold: product.low_stock_threshold ?? 5,
      sort_order: product.sort_order ?? 0,
    })
    setModalOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      category: form.category,
      name: form.name.trim(),
      size: form.size.trim(),
      price: form.price === '' ? null : Number(form.price),
      net_rate: form.net_rate === '' ? 0 : Number(form.net_rate),
      is_available: form.is_available,
      low_stock_threshold: Number(form.low_stock_threshold) || 0,
      sort_order: Number(form.sort_order) || 0,
    }

    const result = editingId
      ? await supabase.from('products').update(payload).eq('id', editingId)
      : await supabase.from('products').insert(payload)

    setSaving(false)

    if (result.error) {
      setError(result.error.message)
      return
    }

    setModalOpen(false)
    loadProducts()
  }

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name} (${product.size})"? This cannot be undone.`)) return
    const { error: deleteError } = await supabase.from('products').delete().eq('id', product.id)
    if (deleteError) setError(deleteError.message)
    else loadProducts()
  }

  async function toggleAvailability(product) {
    const { error: updateError } = await supabase
      .from('products')
      .update({ is_available: !product.is_available })
      .eq('id', product.id)
    if (updateError) setError(updateError.message)
    else loadProducts()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-display text-2xl text-maroon">Products</h1>
        <button
          onClick={openAddModal}
          className="rounded-full bg-maroon text-cream text-sm font-semibold px-4 py-2 hover:bg-maroon-dark"
        >
          + Add Product
        </button>
      </div>

      {error && <p className="mb-4 rounded-lg bg-maroon/10 text-maroon text-sm px-4 py-2">{error}</p>}

      <div className="overflow-x-auto rounded-2xl border border-maroon/10 bg-white shadow-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-maroon/5 text-left text-forest-dark/80">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Net Rate</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-forest-dark/60">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-forest-dark/60">
                  No products yet. Click &ldquo;Add Product&rdquo; to create one.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-t border-maroon/5">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-maroon-dark">{product.name}</p>
                    <p className="text-xs text-forest-dark/60">{product.size}</p>
                  </td>
                  <td className="px-4 py-3 text-forest-dark/80">{product.category}</td>
                  <td className="px-4 py-3">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-3">{formatCurrency(product.net_rate)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleAvailability(product)}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        product.is_available
                          ? 'bg-forest/10 text-forest-dark'
                          : 'bg-maroon/10 text-maroon'
                      }`}
                    >
                      {product.is_available ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => openEditModal(product)}
                      className="text-xs font-semibold text-forest-dark hover:text-forest underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="text-xs font-semibold text-maroon hover:text-maroon-dark underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal
          title={editingId ? 'Edit Product' : 'Add Product'}
          onClose={() => setModalOpen(false)}
          footer={
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-full px-4 py-2 text-sm font-semibold text-forest-dark hover:bg-forest/10"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-maroon text-cream px-5 py-2 text-sm font-semibold hover:bg-maroon-dark disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          }
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-forest-dark mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-lg border border-maroon/20 bg-white px-3 py-2 text-sm"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-forest-dark mb-1">Sort Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                  className="w-full rounded-lg border border-maroon/20 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest-dark mb-1">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-maroon/20 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest-dark mb-1">Size</label>
              <input
                type="text"
                required
                placeholder="e.g. 200 gm, 1 Kg, 5 Pieces"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
                className="w-full rounded-lg border border-maroon/20 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-forest-dark mb-1">
                  Selling Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Leave blank for 'price on request'"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full rounded-lg border border-maroon/20 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-forest-dark mb-1">
                  Net Rate / Cost Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.net_rate}
                  onChange={(e) => setForm({ ...form, net_rate: e.target.value })}
                  className="w-full rounded-lg border border-maroon/20 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest-dark mb-1">
                Low Stock Alert Threshold
              </label>
              <input
                type="number"
                min="0"
                value={form.low_stock_threshold}
                onChange={(e) => setForm({ ...form, low_stock_threshold: e.target.value })}
                className="w-full rounded-lg border border-maroon/20 bg-white px-3 py-2 text-sm"
              />
            </div>

            <label className="flex items-center gap-2 text-sm font-medium text-forest-dark">
              <input
                type="checkbox"
                checked={form.is_available}
                onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
                className="h-4 w-4 rounded border-maroon/30"
              />
              Available for ordering
            </label>
          </form>
        </Modal>
      )}
    </div>
  )
}
