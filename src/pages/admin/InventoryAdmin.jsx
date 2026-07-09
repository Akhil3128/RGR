import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const LOW_STOCK_LIMIT = 5

// One inventory row per product:
// Closing Stock = Opening Stock + Stock Received - Sales
export default function InventoryAdmin() {
  const [rows, setRows] = useState([])
  const [message, setMessage] = useState('')

  const loadInventory = async () => {
    // Every product gets a row; inventory numbers are joined in.
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, size, inventory(id, opening_stock, stock_received, sales)')
      .order('sort_order', { ascending: true })
    if (error) return

    setRows(
      products.map((product) => {
        // Supabase may return the joined inventory as an object or an array.
        const inv = Array.isArray(product.inventory)
          ? product.inventory[0]
          : product.inventory
        return {
          productId: product.id,
          name: product.name,
          size: product.size,
          opening_stock: inv?.opening_stock ?? 0,
          stock_received: inv?.stock_received ?? 0,
          sales: inv?.sales ?? 0,
        }
      })
    )
  }

  useEffect(() => {
    loadInventory()
  }, [])

  const showMessage = (text) => {
    setMessage(text)
    setTimeout(() => setMessage(''), 3000)
  }

  const updateField = (productId, field, value) => {
    setRows((current) =>
      current.map((row) =>
        row.productId === productId
          ? { ...row, [field]: value === '' ? '' : Math.max(0, Number(value)) }
          : row
      )
    )
  }

  const saveRow = async (row) => {
    const { error } = await supabase.from('inventory').upsert(
      {
        product_id: row.productId,
        opening_stock: Number(row.opening_stock || 0),
        stock_received: Number(row.stock_received || 0),
        sales: Number(row.sales || 0),
      },
      { onConflict: 'product_id' }
    )
    showMessage(error ? `❌ ${error.message}` : `✅ Saved ${row.name} (${row.size})`)
  }

  const closingStock = (row) =>
    Number(row.opening_stock || 0) +
    Number(row.stock_received || 0) -
    Number(row.sales || 0)

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-maroon">Inventory</h1>
      <p className="mt-1 text-sm text-forest/70">
        Closing Stock = Opening Stock + Stock Received − Sales. Items with{' '}
        {LOW_STOCK_LIMIT} or fewer left are highlighted.
      </p>

      {message && <p className="mt-3 text-sm">{message}</p>}

      <div className="card mt-5 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b-2 border-gold/40 bg-cream-dark text-xs uppercase text-forest/70">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Opening Stock</th>
              <th className="px-4 py-3">Stock Received</th>
              <th className="px-4 py-3">Sales</th>
              <th className="px-4 py-3">Closing Stock</th>
              <th className="px-4 py-3 text-right">Save</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/20">
            {rows.map((row) => {
              const closing = closingStock(row)
              const isLow = closing <= LOW_STOCK_LIMIT
              return (
                <tr key={row.productId} className={isLow ? 'bg-maroon/5' : ''}>
                  <td className="px-4 py-3 font-medium text-maroon">
                    {row.name}{' '}
                    <span className="text-xs font-normal text-forest/60">
                      ({row.size})
                    </span>
                  </td>
                  {['opening_stock', 'stock_received', 'sales'].map((field) => (
                    <td key={field} className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        value={row[field]}
                        onChange={(e) =>
                          updateField(row.productId, field, e.target.value)
                        }
                        className="input-field w-24"
                      />
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-bold ${
                        isLow ? 'bg-maroon/10 text-maroon' : 'bg-forest/10 text-forest'
                      }`}
                    >
                      {closing} {isLow && '⚠️'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => saveRow(row)} className="btn-primary px-4 py-1.5 text-xs">
                      Save
                    </button>
                  </td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-forest/60">
                  No products found. Add products first on the Products page.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
