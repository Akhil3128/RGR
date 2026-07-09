import { useEffect, useState } from 'react'
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from '../../lib/api'
import { formatPrice } from '../../lib/utils'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

const emptyForm = {
  name: '',
  size: '',
  price: '',
  net_rate: '',
  image_url: '',
  is_available: true,
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch (err) {
      setError(err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const startEdit = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name || '',
      size: product.size || '',
      price: String(product.price ?? ''),
      net_rate: String(product.net_rate ?? ''),
      image_url: product.image_url || '',
      is_available: Boolean(product.is_available),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      name: form.name.trim(),
      size: form.size.trim(),
      price: Number(form.price) || 0,
      net_rate: Number(form.net_rate) || 0,
      image_url: form.image_url.trim(),
      is_available: form.is_available,
    }

    try {
      if (editingId) {
        await updateProduct(editingId, payload)
      } else {
        await createProduct(payload)
      }
      resetForm()
      await load()
    } catch (err) {
      setError(err.message || 'Could not save product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      await load()
    } catch (err) {
      setError(err.message || 'Could not delete product')
    }
  }

  const toggleAvailable = async (product) => {
    try {
      await updateProduct(product.id, { is_available: !product.is_available })
      await load()
    } catch (err) {
      setError(err.message || 'Could not update availability')
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-maroon">Products</h1>
      <p className="mb-6 text-sm text-green/75">
        Add, edit, delete products. Update price and net rate (cost). Plain Putharekulu price can be set here.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-xl border border-gold/35 bg-cream-light p-4 shadow-sm"
      >
        <h2 className="font-display text-xl text-maroon">
          {editingId ? 'Edit Product' : 'Add Product'}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-maroon">Name *</span>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              required
              className="w-full rounded-md border border-gold/40 bg-cream px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-maroon">Size</span>
            <input
              name="size"
              value={form.size}
              onChange={onChange}
              placeholder="200 gm / 5 Pieces"
              className="w-full rounded-md border border-gold/40 bg-cream px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-maroon">Selling Price (₹)</span>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={onChange}
              className="w-full rounded-md border border-gold/40 bg-cream px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-maroon">Net Rate / Cost (₹)</span>
            <input
              name="net_rate"
              type="number"
              min="0"
              step="0.01"
              value={form.net_rate}
              onChange={onChange}
              className="w-full rounded-md border border-gold/40 bg-cream px-3 py-2"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-medium text-maroon">Image URL (optional)</span>
            <input
              name="image_url"
              value={form.image_url}
              onChange={onChange}
              placeholder="https://..."
              className="w-full rounded-md border border-gold/40 bg-cream px-3 py-2"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-maroon sm:col-span-2">
            <input
              type="checkbox"
              name="is_available"
              checked={form.is_available}
              onChange={onChange}
            />
            Available for customers
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-maroon px-4 py-2 text-sm font-semibold text-cream hover:bg-maroon-light disabled:opacity-60"
          >
            {saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-maroon/30 px-4 py-2 text-sm text-maroon"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && (
        <p className="mb-4 rounded-md bg-maroon/10 px-3 py-2 text-sm text-maroon">{error}</p>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gold/35 bg-cream-light shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-maroon text-cream">
              <tr>
                <th className="px-3 py-2 font-medium">Product</th>
                <th className="px-3 py-2 font-medium">Price</th>
                <th className="px-3 py-2 font-medium">Net Rate</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-cream-dark">
                  <td className="px-3 py-2">
                    <p className="font-medium text-maroon">{product.name}</p>
                    <p className="text-xs text-green/70">{product.size || '—'}</p>
                  </td>
                  <td className="px-3 py-2">{formatPrice(product.price)}</td>
                  <td className="px-3 py-2">{formatPrice(product.net_rate)}</td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => toggleAvailable(product)}
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        product.is_available
                          ? 'bg-green/15 text-green'
                          : 'bg-maroon/10 text-maroon'
                      }`}
                    >
                      {product.is_available ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(product)}
                        className="text-xs font-semibold text-green hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="text-xs font-semibold text-maroon hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
