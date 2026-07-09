import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export function useOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    setLoading(true)
    if (!isSupabaseConfigured) {
      setOrders([])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, size)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (err) {
      console.error('Failed to fetch orders:', err)
      setOrders([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return { orders, loading, refetch: fetchOrders }
}

export function useInventory() {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchInventory = async () => {
    setLoading(true)
    if (!isSupabaseConfigured) {
      setInventory([])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          products (name, size, price, net_rate, available)
        `)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setInventory(data || [])
    } catch (err) {
      console.error('Failed to fetch inventory:', err)
      setInventory([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  return { inventory, loading, refetch: fetchInventory }
}
