import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { SAMPLE_PRODUCTS } from '../lib/sampleProducts'

// Loads products from Supabase. If Supabase is not configured
// (or the request fails), it falls back to the built-in sample list.
export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingSampleData, setUsingSampleData] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!isSupabaseConfigured) {
        setProducts(SAMPLE_PRODUCTS)
        setUsingSampleData(true)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true })

      if (cancelled) return

      if (error || !data || data.length === 0) {
        setProducts(SAMPLE_PRODUCTS)
        setUsingSampleData(true)
      } else {
        setProducts(data)
      }
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { products, loading, usingSampleData }
}
