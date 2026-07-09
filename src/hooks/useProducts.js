import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { sampleProducts } from '../data/sampleProducts'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingSampleData, setUsingSampleData] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    if (!isSupabaseConfigured) {
      setProducts(sampleProducts.filter((p) => p.available))
      setUsingSampleData(true)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('available', true)
        .order('category')
        .order('name')
        .order('size')

      if (error) throw error
      setProducts(data || [])
      setUsingSampleData(false)
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setProducts(sampleProducts.filter((p) => p.available))
      setUsingSampleData(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return { products, loading, usingSampleData, refetch: fetchProducts }
}

export function useAllProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    setLoading(true)
    if (!isSupabaseConfigured) {
      setProducts([...sampleProducts])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('category')
        .order('name')
        .order('size')

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setProducts([...sampleProducts])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return { products, loading, refetch: fetchProducts }
}
