import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { sampleProducts } from '../data/sampleProducts'

/**
 * Loads products from Supabase. Falls back to sample data when Supabase
 * has not been configured yet, so the site is always browsable.
 */
export function useProducts({ onlyAvailable = false } = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [usingSampleData, setUsingSampleData] = useState(!isSupabaseConfigured)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (!isSupabaseConfigured) {
      const data = onlyAvailable ? sampleProducts.filter((p) => p.is_available) : sampleProducts
      setProducts(data)
      setUsingSampleData(true)
      setLoading(false)
      return
    }

    // Only public-safe columns are selected here (no net_rate / cost price),
    // since this hook is used on the customer-facing site.
    let query = supabase
      .from('products')
      .select('id, category, name, size, price, image_url, is_available, sort_order')
      .order('category')
      .order('sort_order')
    if (onlyAvailable) query = query.eq('is_available', true)

    const { data, error: fetchError } = await query

    if (fetchError) {
      setError(fetchError.message)
      setProducts(onlyAvailable ? sampleProducts.filter((p) => p.is_available) : sampleProducts)
      setUsingSampleData(true)
    } else {
      setProducts(data || [])
      setUsingSampleData(false)
    }
    setLoading(false)
  }, [onlyAvailable])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, loading, error, usingSampleData, refetch: fetchProducts }
}
