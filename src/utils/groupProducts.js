import { formatINR } from './format'

/** Sort key so 200 gm < 250 gm < 500 gm < 1/2 Kg < 1 Kg, etc. */
export function sizeSortValue(size) {
  const raw = String(size || '').trim().toLowerCase()
  if (!raw) return Number.MAX_SAFE_INTEGER

  const pieces = raw.match(/(\d+)\s*pieces?/)
  if (pieces) return Number(pieces[1])

  if (raw.includes('1/2') || raw.includes('½') || raw.includes('0.5')) {
    return 500
  }

  const kg = raw.match(/([\d.]+)\s*kg/)
  if (kg) return Number(kg[1]) * 1000

  const gm = raw.match(/([\d.]+)\s*g/)
  if (gm) return Number(gm[1])

  return Number.MAX_SAFE_INTEGER - 1
}

function sortVariants(variants) {
  return [...variants].sort((a, b) => {
    const byOrder = (a.sort_order ?? 0) - (b.sort_order ?? 0)
    if (byOrder !== 0) return byOrder
    return sizeSortValue(a.size) - sizeSortValue(b.size)
  })
}

/**
 * Group flat product rows (Supabase / admin shape) into one card per name
 * with a variants[] array of sizes and prices.
 */
export function groupProductsByName(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return []

  // Already grouped (sample / previous pass).
  if (rows[0]?.variants && Array.isArray(rows[0].variants)) {
    return rows
      .map((product, index) => {
        const variants = sortVariants(
          (product.variants || []).map((v, vIndex) => ({
            id: v.id || `${slugify(product.name)}-${vIndex}`,
            size: v.size || '',
            price: Number(v.price) || 0,
            net_rate: Number(v.net_rate) || 0,
            is_available: v.is_available !== false,
            sort_order: v.sort_order ?? product.sort_order ?? index,
          })),
        )
        return {
          id: product.id || `group-${slugify(product.name)}`,
          name: product.name,
          category: product.category || '',
          image_url: product.image_url ?? null,
          sort_order: product.sort_order ?? index,
          available:
            product.available !== false &&
            product.is_available !== false &&
            variants.some((v) => v.is_available),
          variants,
        }
      })
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  }

  const map = new Map()

  for (const row of rows) {
    const name = String(row.name || '').trim()
    if (!name) continue
    const key = name.toLowerCase()

    if (!map.has(key)) {
      map.set(key, {
        id: `group-${slugify(name)}`,
        name,
        category: row.category || '',
        image_url: row.image_url ?? null,
        sort_order: row.sort_order ?? 0,
        variants: [],
      })
    }

    const group = map.get(key)
    group.sort_order = Math.min(group.sort_order ?? 0, row.sort_order ?? 0)
    if (!group.category && row.category) group.category = row.category
    if (!group.image_url && row.image_url) group.image_url = row.image_url

    group.variants.push({
      id: row.id,
      size: row.size || '',
      price: Number(row.price) || 0,
      net_rate: Number(row.net_rate) || 0,
      is_available: row.is_available !== false,
      sort_order: row.sort_order ?? 0,
    })
  }

  return Array.from(map.values())
    .map((group) => {
      const variants = sortVariants(group.variants)
      return {
        ...group,
        available: variants.some((v) => v.is_available),
        variants,
      }
    })
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
}

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Label used in the Choose Weight dropdown. */
export function variantOptionLabel(variant) {
  const size = variant.size || 'Standard'
  return `${size} — ${formatINR(variant.price)}`
}
