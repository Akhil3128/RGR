import { useEffect, useState } from 'react'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/admin'
import { formatINR } from '../../utils/format'
import { PRODUCT_CATEGORIES } from '../../constants'

const EMPTY = {
  name: '',
  category: 'Sweets',
  size: '',
  price: '',
  net_rate: '',
  is_available: true,
  image_url: '',
  sort_order: 0,
}

export default function ProductsManager() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // product object or EMPTY (new)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    const { data, error: err } = await getProducts()
    if (err) setError(err.message)
    else setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function toggleAvailable(product) {
    await updateProduct(product.id, { is_available: !product.is_available })
    load()
  }

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name} ${product.size}"?`)) return
    await deleteProduct(product.id)
    load()
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      name: editing.name.trim(),
      category: editing.category,
      size: editing.size.trim(),
      price: Number(editing.price) || 0,
      net_rate: Number(editing.net_rate) || 0,
      is_available: editing.is_available,
      image_url: editing.image_url?.trim() || null,
      sort_order: Number(editing.sort_order) || 0,
    }

    const { error: err } = editing.id
      ? await updateProduct(editing.id, payload)
      : await createProduct(payload)

    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    setEditing(null)
    load()
  }

  if (loading) return <p className="text-forest">Loading products…</p>

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-maroon">
          Products ({products.length})
        </h2>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-primary text-sm">
          + Add Product
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-cream-dark text-maroon">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Net Rate</th>
              <th className="px-4 py-3">Available</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/20">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-cream/60">
                <td className="px-4 py-3">
                  <span className="font-medium text-forest-dark">{p.name}</span>
                  <span className="ml-1 text-forest/70">{p.size}</span>
                </td>
                <td className="px-4 py-3 text-forest">{p.category}</td>
                <td className="px-4 py-3 font-semibold">{formatINR(p.price)}</td>
                <td className="px-4 py-3 text-forest">{formatINR(p.net_rate)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleAvailable(p)}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      p.is_available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {p.is_available ? 'Available' : 'Unavailable'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setEditing({ ...p, image_url: p.image_url || '' })}
                    className="mr-3 text-maroon hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-maroon-dark/50 p-4">
          <form
            onSubmit={handleSave}
            className="card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6"
          >
            <h3 className="font-heading text-lg font-bold text-maroon">
              {editing.id ? 'Edit Product' : 'Add Product'}
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">Name *</label>
                <input
                  className="input"
                  required
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Category</label>
                <select
                  className="input"
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                >
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Size</label>
                <input
                  className="input"
                  placeholder="e.g. 500 gm"
                  value={editing.size}
                  onChange={(e) => setEditing({ ...editing, size: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Selling Price (₹) *</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  required
                  value={editing.price}
                  onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Net Rate / Cost (₹)</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  value={editing.net_rate}
                  onChange={(e) => setEditing({ ...editing, net_rate: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Image URL (optional)</label>
                <input
                  className="input"
                  placeholder="https://…"
                  value={editing.image_url}
                  onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Sort Order</label>
                <input
                  className="input"
                  type="number"
                  value={editing.sort_order}
                  onChange={(e) => setEditing({ ...editing, sort_order: e.target.value })}
                />
              </div>
              <label className="mt-2 flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[#7B1E2B]"
                  checked={editing.is_available}
                  onChange={(e) =>
                    setEditing({ ...editing, is_available: e.target.checked })
                  }
                />
                <span className="text-sm text-forest-dark">Available for order</span>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full px-4 py-2 text-sm text-forest hover:bg-cream-dark"
              >
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary text-sm">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
