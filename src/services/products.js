import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { SAMPLE_PRODUCTS } from '../data/sampleProducts'

// Fetch products. Falls back to sample data when Supabase is not configured.
// Returns: { data, usingSample, error }
export async function fetchProducts({ onlyAvailable = false } = {}) {
  if (!isSupabaseConfigured) {
    const data = onlyAvailable
      ? SAMPLE_PRODUCTS.filter((p) => p.is_available)
      : SAMPLE_PRODUCTS
    return { data, usingSample: true, error: null }
  }

  let query = supabase.from('products').select('*').order('sort_order', {
    ascending: true,
  })
  if (onlyAvailable) query = query.eq('is_available', true)

  const { data, error } = await query
  if (error) {
    // If the query fails (e.g. table not created yet) fall back to samples.
    return { data: SAMPLE_PRODUCTS, usingSample: true, error }
  }
  return { data: data ?? [], usingSample: false, error: null }
}
