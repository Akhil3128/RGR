import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Badge from '../ui/Badge'
import { useInventory } from '../../hooks/useAdminData'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { calcClosingStock } from '../../utils/formatters'

export default function InventoryManager() {
  const { inventory, loading, refetch } = useInventory()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ opening_stock: 0, stock_received: 0, sales: 0 })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const openEdit = (inv) => {
    setEditing(inv.id)
    setForm({
      opening_stock: inv.opening_stock,
      stock_received: inv.stock_received,
      sales: inv.sales,
    })
    setError('')
  }

  const closingStock = calcClosingStock(
    Number(form.opening_stock) || 0,
    Number(form.stock_received) || 0,
    Number(form.sales) || 0
  )

  const handleSave = async () => {
    if (!isSupabaseConfigured || !editing) return
    setSaving(true)
    setError('')

    try {
      const { error: updateError } = await supabase
        .from('inventory')
        .update({
          opening_stock: Number(form.opening_stock) || 0,
          stock_received: Number(form.stock_received) || 0,
          sales: Number(form.sales) || 0,
          closing_stock: closingStock,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editing)

      if (updateError) throw updateError
      setEditing(null)
      refetch()
    } catch (err) {
      setError(err.message)
    }
    setSaving(false)
  }

  if (!isSupabaseConfigured) {
    return (
      <div>
        <h2 className="font-display text-2xl font-bold text-maroon mb-6">Inventory</h2>
        <Card className="p-8 text-center text-gray-500">
          Configure Supabase to manage inventory.
        </Card>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-maroon mb-2">Inventory</h2>
      <p className="text-sm text-gray-500 mb-6">
        Closing Stock = Opening Stock + Stock Received − Sales
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading inventory...</p>
      ) : inventory.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">No inventory records. Add products first.</Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-forest/5 text-left">
                <th className="p-3 font-medium text-maroon">Product</th>
                <th className="p-3 font-medium text-maroon">Opening</th>
                <th className="p-3 font-medium text-maroon">Received</th>
                <th className="p-3 font-medium text-maroon">Sales</th>
                <th className="p-3 font-medium text-maroon">Closing</th>
                <th className="p-3 font-medium text-maroon">Action</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((inv) => (
                <tr key={inv.id} className="border-b border-gold/10">
                  {editing === inv.id ? (
                    <>
                      <td className="p-3 font-medium">
                        {inv.products?.name} — {inv.products?.size}
                      </td>
                      <td className="p-3">
                        <Input type="number" value={form.opening_stock} onChange={(e) => setForm({ ...form, opening_stock: e.target.value })} className="!py-1 !px-2 w-20" />
                      </td>
                      <td className="p-3">
                        <Input type="number" value={form.stock_received} onChange={(e) => setForm({ ...form, stock_received: e.target.value })} className="!py-1 !px-2 w-20" />
                      </td>
                      <td className="p-3">
                        <Input type="number" value={form.sales} onChange={(e) => setForm({ ...form, sales: e.target.value })} className="!py-1 !px-2 w-20" />
                      </td>
                      <td className="p-3 font-bold text-forest">{closingStock}</td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>Save</Button>
                          <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>Cancel</Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3 font-medium text-maroon-dark">
                        {inv.products?.name} — {inv.products?.size}
                      </td>
                      <td className="p-3">{inv.opening_stock}</td>
                      <td className="p-3">{inv.stock_received}</td>
                      <td className="p-3">{inv.sales}</td>
                      <td className="p-3">
                        <Badge color={inv.closing_stock <= 5 ? 'red' : 'green'}>
                          {inv.closing_stock}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Button variant="outline" size="sm" onClick={() => openEdit(inv)}>Edit</Button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
