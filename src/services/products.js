import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { SAMPLE_PRODUCTS } from '../data/sampleProducts'

// Remove duplicate rows (same name + size) — keeps the first occurrence.
export function dedupeProducts(products) {
  const seen = new Map()
  for (const p of products) {
    const key = `${p.name}|${p.size || ''}`
    if (!seen.has(key)) seen.set(key, p)
  }
  return Array.from(seen.values()).sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  )
}

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
    return { data: SAMPLE_PRODUCTS, usingSample: true, error }
  }

  return { data: dedupeProducts(data ?? []), usingSample: false, error: null }
}
