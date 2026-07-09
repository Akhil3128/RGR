import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const TODAY = () => new Date().toISOString().slice(0, 10)

const EMPTY_FORM = {
  product_id: '',
  date: TODAY(),
  opening_stock: '',
  stock_received: '',
  sales: '',
}

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [lowStock, setLowStock] = useState([])

  async function loadData() {
    setLoading(true)
    const [{ data: productData }, { data: inventoryData, error: invError }, { data: latestData }] =
      await Promise.all([
        supabase.from('products').select('id, name, size, low_stock_threshold').order('name'),
        supabase
          .from('inventory')
          .select('*, products(name, size)')
          .order('date', { ascending: false })
          .limit(50),
        supabase.from('latest_inventory').select('product_id, closing_stock, products(name, size, low_stock_threshold)'),
      ])
    setProducts(productData || [])
    if (invError) setError(invError.message)
    setEntries(inventoryData || [])
    setLowStock(
      (latestData || []).filter(
        (row) => row.closing_stock !== null && row.closing_stock <= (row.products?.low_stock_threshold ?? 5)
      )
    )
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.product_id) {
      setError('Please select a product.')
      return
    }
    setSaving(true)
    setError('')

    const { error: upsertError } = await supabase.from('inventory').upsert(
      {
        product_id: form.product_id,
        date: form.date,
        opening_stock: Number(form.opening_stock) || 0,
        stock_received: Number(form.stock_received) || 0,
        sales: Number(form.sales) || 0,
      },
      { onConflict: 'product_id,date' }
    )

    setSaving(false)

    if (upsertError) {
      setError(upsertError.message)
      return
    }

    setForm({ ...EMPTY_FORM, product_id: form.product_id })
    loadData()
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-maroon mb-5">Inventory</h1>

      {error && <p className="mb-4 rounded-lg bg-maroon/10 text-maroon text-sm px-4 py-2">{error}</p>}

      {lowStock.length > 0 && (
        <div className="mb-5 rounded-xl border border-maroon/30 bg-maroon/5 px-4 py-3">
          <p className="text-sm font-semibold text-maroon">⚠ Low Stock Alert</p>
          <p className="text-xs text-forest-dark/70 mt-1">
            {lowStock.map((row) => `${row.products?.name} (${row.products?.size})`).join(', ')}
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-maroon/10 bg-white p-5 shadow-soft space-y-3 lg:col-span-1"
        >
          <h2 className="font-display text-lg text-maroon mb-1">Add / Update Stock Entry</h2>
          <p className="text-xs text-forest-dark/60 mb-2">
            Closing Stock = Opening + Received − Sales (calculated automatically).
          </p>

          <div>
            <label className="block text-xs font-semibold text-forest-dark mb-1">Product</label>
            <select
              required
              value={form.product_id}
              onChange={(e) => setForm({ ...form, product_id: e.target.value })}
              className="w-full rounded-lg border border-maroon/20 bg-white px-3 py-2 text-sm"
            >
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.size})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-forest-dark mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full rounded-lg border border-maroon/20 bg-white px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-forest-dark mb-1">Opening</label>
              <input
                type="number"
                min="0"
                value={form.opening_stock}
                onChange={(e) => setForm({ ...form, opening_stock: e.target.value })}
                className="w-full rounded-lg border border-maroon/20 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest-dark mb-1">Received</label>
              <input
                type="number"
                min="0"
                value={form.stock_received}
                onChange={(e) => setForm({ ...form, stock_received: e.target.value })}
                className="w-full rounded-lg border border-maroon/20 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest-dark mb-1">Sales</label>
              <input
                type="number"
                min="0"
                value={form.sales}
                onChange={(e) => setForm({ ...form, sales: e.target.value })}
                className="w-full rounded-lg border border-maroon/20 bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-maroon text-cream font-semibold py-2.5 text-sm hover:bg-maroon-dark disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Entry'}
          </button>
        </form>

        <div className="lg:col-span-2 overflow-x-auto rounded-2xl border border-maroon/10 bg-white shadow-soft">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-maroon/5 text-left text-forest-dark/80">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Opening</th>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Sales</th>
                <th className="px-4 py-3">Closing</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-forest-dark/60">
                    Loading...
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-forest-dark/60">
                    No inventory entries yet.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="border-t border-maroon/5">
                    <td className="px-4 py-3 whitespace-nowrap">{entry.date}</td>
                    <td className="px-4 py-3">
                      {entry.products?.name} <span className="text-forest-dark/50">({entry.products?.size})</span>
                    </td>
                    <td className="px-4 py-3">{entry.opening_stock}</td>
                    <td className="px-4 py-3">{entry.stock_received}</td>
                    <td className="px-4 py-3">{entry.sales}</td>
                    <td className="px-4 py-3 font-semibold text-forest-dark">{entry.closing_stock}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
