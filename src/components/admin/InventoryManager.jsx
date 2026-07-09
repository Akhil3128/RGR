import { useEffect, useState } from 'react'
import { getProducts, getInventory, upsertInventory } from '../../services/admin'
import { productLabel } from '../../utils/format'

// closing = opening + received - sales
function calcClosing(row) {
  return (
    Number(row.opening_stock || 0) +
    Number(row.stock_received || 0) -
    Number(row.sales || 0)
  )
}

export default function InventoryManager() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)

  async function load() {
    setLoading(true)
    const [prodRes, invRes] = await Promise.all([getProducts(), getInventory()])
    if (prodRes.error || invRes.error) {
      setError((prodRes.error || invRes.error).message)
      setLoading(false)
      return
    }
    const invByProduct = {}
    for (const inv of invRes.data || []) invByProduct[inv.product_id] = inv

    // One editable row per product, merged with existing inventory values.
    const merged = (prodRes.data || []).map((p) => {
      const inv = invByProduct[p.id] || {}
      return {
        product_id: p.id,
        label: productLabel(p),
        opening_stock: inv.opening_stock ?? 0,
        stock_received: inv.stock_received ?? 0,
        sales: inv.sales ?? 0,
        low_stock_threshold: inv.low_stock_threshold ?? 5,
      }
    })
    setRows(merged)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  function updateRow(productId, field, value) {
    setRows((prev) =>
      prev.map((r) =>
        r.product_id === productId ? { ...r, [field]: value } : r,
      ),
    )
  }

  async function save(row) {
    setSavingId(row.product_id)
    setError('')
    const { error: err } = await upsertInventory({
      product_id: row.product_id,
      opening_stock: Number(row.opening_stock) || 0,
      stock_received: Number(row.stock_received) || 0,
      sales: Number(row.sales) || 0,
      low_stock_threshold: Number(row.low_stock_threshold) || 0,
    })
    setSavingId(null)
    if (err) setError(err.message)
  }

  if (loading) return <p className="text-forest">Loading inventory…</p>

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-maroon">Inventory</h2>
        <button onClick={load} className="btn-gold px-3 py-1.5 text-sm">
          Refresh
        </button>
      </div>
      <p className="mb-4 text-sm text-forest/70">
        Closing Stock = Opening Stock + Stock Received − Sales.
        <span className="mt-1 block text-maroon/80">
          Sales increase only when an order is marked Delivered or Completed in
          the Orders tab. Set Opening Stock and Stock Received manually.
        </span>
      </p>

      {error && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-cream-dark text-maroon">
            <tr>
              <th className="px-3 py-3">Product</th>
              <th className="px-3 py-3">Opening</th>
              <th className="px-3 py-3">Received</th>
              <th className="px-3 py-3">Sales</th>
              <th className="px-3 py-3">Closing</th>
              <th className="px-3 py-3">Low Alert</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/20">
            {rows.map((r) => {
              const closing = calcClosing(r)
              const low = closing <= Number(r.low_stock_threshold || 0)
              return (
                <tr key={r.product_id} className="hover:bg-cream/60">
                  <td className="px-3 py-2 font-medium text-forest-dark">
                    {r.label}
                  </td>
                  {['opening_stock', 'stock_received', 'sales'].map((field) => (
                    <td key={field} className="px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        className="input w-20 px-2 py-1"
                        value={r[field]}
                        onChange={(e) =>
                          updateRow(r.product_id, field, e.target.value)
                        }
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-sm font-semibold ${
                        low ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {closing}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      className="input w-16 px-2 py-1"
                      value={r.low_stock_threshold}
                      onChange={(e) =>
                        updateRow(r.product_id, 'low_stock_threshold', e.target.value)
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => save(r)}
                      disabled={savingId === r.product_id}
                      className="btn-primary px-3 py-1.5 text-xs"
                    >
                      {savingId === r.product_id ? 'Saving…' : 'Save'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
