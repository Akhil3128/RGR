import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Badge from '../ui/Badge'
import { useAllProducts } from '../../hooks/useProducts'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { formatCurrency } from '../../utils/formatters'

const CATEGORIES = ['Sweets', 'Snacks', 'Dairy', 'Ghee']

const emptyProduct = {
  name: '',
  size: '',
  price: '',
  net_rate: '',
  category: 'Sweets',
  available: true,
}

export default function ProductManager() {
  const { products, loading, refetch } = useAllProducts()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyProduct)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const openAdd = () => {
    setEditing(null)
    setForm(emptyProduct)
    setShowForm(true)
    setError('')
  }

  const openEdit = (product) => {
    setEditing(product.id)
    setForm({
      name: product.name,
      size: product.size,
      price: String(product.price),
      net_rate: String(product.net_rate || ''),
      category: product.category,
      available: product.available,
    })
    setShowForm(true)
    setError('')
  }

  const handleSave = async () => {
    if (!isSupabaseConfigured) {
      setError('Supabase not configured')
      return
    }

    if (!form.name || !form.size || !form.price) {
      setError('Name, size, and price are required')
      return
    }

    setSaving(true)
    setError('')

    const productData = {
      name: form.name.trim(),
      size: form.size.trim(),
      price: parseFloat(form.price),
      net_rate: parseFloat(form.net_rate) || 0,
      category: form.category,
      available: form.available,
    }

    try {
      if (editing) {
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editing)
        if (updateError) throw updateError
      } else {
        const { data, error: insertError } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single()
        if (insertError) throw insertError

        await supabase.from('inventory').insert({
          product_id: data.id,
          opening_stock: 0,
          stock_received: 0,
          sales: 0,
          closing_stock: 0,
        })
      }

      setShowForm(false)
      refetch()
    } catch (err) {
      setError(err.message)
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    if (!isSupabaseConfigured) return

    try {
      const { error: deleteError } = await supabase.from('products').delete().eq('id', id)
      if (deleteError) throw deleteError
      refetch()
    } catch (err) {
      setError(err.message)
    }
  }

  const toggleAvailable = async (product) => {
    if (!isSupabaseConfigured) return
    try {
      await supabase
        .from('products')
        .update({ available: !product.available })
        .eq('id', product.id)
      refetch()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div>
        <h2 className="font-display text-2xl font-bold text-maroon mb-6">Products</h2>
        <Card className="p-8 text-center text-gray-500">
          Configure Supabase to manage products.
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-maroon">Products</h2>
        <Button variant="primary" size="sm" onClick={openAdd}>+ Add Product</Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <Card className="p-6 mb-6">
          <h3 className="font-display text-lg font-bold text-maroon mb-4">
            {editing ? 'Edit Product' : 'Add New Product'}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Size" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="e.g. 200 gm" />
            <Input label="Selling Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Input label="Net Rate / Cost (₹)" type="number" value={form.net_rate} onChange={(e) => setForm({ ...form, net_rate: e.target.value })} />
            <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select label="Available" value={form.available ? 'true' : 'false'} onChange={(e) => setForm({ ...form, available: e.target.value === 'true' })}>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </Select>
          </div>
          <div className="flex gap-3 mt-4">
            <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <Card key={product.id} className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-maroon-dark">{product.name}</h4>
                    <Badge color={product.available ? 'green' : 'red'}>
                      {product.available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{product.size} · {product.category}</p>
                  <p className="text-sm mt-1">
                    Price: <strong>{formatCurrency(product.price)}</strong>
                    {' · '}
                    Net Rate: <strong>{formatCurrency(product.net_rate || 0)}</strong>
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={() => openEdit(product)}>Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => toggleAvailable(product)}>
                    {product.available ? 'Disable' : 'Enable'}
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
