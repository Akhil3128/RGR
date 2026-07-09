import { useEffect, useState } from 'react'
import { fetchInventory, updateInventory } from '../../lib/api'
import { closingStock, formatPrice } from '../../lib/utils'
import { LOW_STOCK_THRESHOLD } from '../../data/sampleProducts'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

export default function InventoryAdmin() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchInventory()
      setRows(
        data.map((row) => ({
          ...row,
          opening_stock: Number(row.opening_stock) || 0,
          stock_received: Number(row.stock_received) || 0,
          sales: Number(row.sales) || 0,
        }))
      )
    } catch (err) {
      setError(err.message || 'Failed to load inventory')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onFieldChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: value === '' ? '' : Number(value) } : row
      )
    )
  }

  const saveRow = async (row) => {
    setSavingId(row.id)
    setError('')
    try {
      await updateInventory(row.id, {
        opening_stock: Number(row.opening_stock) || 0,
        stock_received: Number(row.stock_received) || 0,
        sales: Number(row.sales) || 0,
      })
      await load()
    } catch (err) {
      setError(err.message || 'Could not save inventory')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-maroon">Inventory</h1>
      <p className="mb-2 text-sm text-green/75">
        Closing Stock = Opening Stock + Stock Received − Sales
      </p>
      <p className="mb-6 text-xs text-maroon/70">
        Low stock threshold: {LOW_STOCK_THRESHOLD} units
      </p>

      {error && (
        <p className="mb-4 rounded-md bg-maroon/10 px-3 py-2 text-sm text-maroon">{error}</p>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gold/35 bg-cream-light shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-green text-cream">
              <tr>
                <th className="px-3 py-2 font-medium">Product</th>
                <th className="px-3 py-2 font-medium">Price</th>
                <th className="px-3 py-2 font-medium">Opening</th>
                <th className="px-3 py-2 font-medium">Received</th>
                <th className="px-3 py-2 font-medium">Sales</th>
                <th className="px-3 py-2 font-medium">Closing</th>
                <th className="px-3 py-2 font-medium">Save</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const close = closingStock(row)
                const isLow = close <= LOW_STOCK_THRESHOLD
                return (
                  <tr
                    key={row.id}
                    className={`border-t border-cream-dark ${isLow ? 'bg-gold/10' : ''}`}
                  >
                    <td className="px-3 py-2">
                      <p className="font-medium text-maroon">
                        {row.products?.name || 'Product'}
                      </p>
                      <p className="text-xs text-green/70">{row.products?.size || '—'}</p>
                    </td>
                    <td className="px-3 py-2">{formatPrice(row.products?.price)}</td>
                    {['opening_stock', 'stock_received', 'sales'].map((field) => (
                      <td key={field} className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={row[field]}
                          onChange={(e) => onFieldChange(row.id, field, e.target.value)}
                          className="w-20 rounded-md border border-gold/40 bg-cream px-2 py-1"
                        />
                      </td>
                    ))}
                    <td className="px-3 py-2">
                      <span
                        className={`font-semibold ${isLow ? 'text-maroon' : 'text-green'}`}
                      >
                        {close}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => saveRow(row)}
                        disabled={savingId === row.id}
                        className="rounded-md bg-maroon px-3 py-1 text-xs font-semibold text-cream hover:bg-maroon-light disabled:opacity-60"
                      >
                        {savingId === row.id ? '...' : 'Save'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
