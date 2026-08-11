import { supabase, isSupabaseConfigured } from '../lib/supabase'
import {
  SAMPLE_PRODUCTS,
  flattenSampleProducts,
} from '../data/sampleProducts'
import { groupProductsByName } from '../utils/groupProducts'

// Remove duplicate rows (same name + size) — keeps the first occurrence.
// Used by admin list views that still work with flat rows.
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

/**
 * Fetch products for the customer menu, already grouped by name with variants[].
 * Falls back to sample data when Supabase is not configured.
 * Returns: { data, usingSample, error }
 */
export async function fetchProducts({ onlyAvailable = false } = {}) {
  if (!isSupabaseConfigured) {
    let data = groupProductsByName(SAMPLE_PRODUCTS)
    if (onlyAvailable) {
      data = data
        .map((p) => ({
          ...p,
          variants: p.variants.filter((v) => v.is_available),
        }))
        .filter((p) => p.variants.length > 0)
        .map((p) => ({ ...p, available: true }))
    }
    return { data, usingSample: true, error: null }
  }

  let query = supabase.from('products').select('*').order('sort_order', {
    ascending: true,
  })
  if (onlyAvailable) query = query.eq('is_available', true)

  const { data, error } = await query
  if (error) {
    return {
      data: groupProductsByName(SAMPLE_PRODUCTS),
      usingSample: true,
      error,
    }
  }

  const flat = dedupeProducts(data ?? [])
  let grouped = groupProductsByName(flat)

  if (onlyAvailable) {
    grouped = grouped
      .map((p) => ({
        ...p,
        variants: p.variants.filter((v) => v.is_available),
      }))
      .filter((p) => p.variants.length > 0)
      .map((p) => ({ ...p, available: true }))
  }

  return { data: grouped, usingSample: false, error: null }
}

/** Flat sample rows (one per size) for tools that need the old shape. */
export { flattenSampleProducts }
