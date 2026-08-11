// Sample products used ONLY when Supabase is not configured yet.
// Variants live under one product so the menu shows a single card per name.
// Prices and cost (net_rate) match the SQL seed in /supabase/schema.sql.

export const SAMPLE_PRODUCTS = [
  {
    name: 'Kova',
    category: 'Sweets',
    available: true,
    sort_order: 1,
    image_url: null,
    variants: [
      { id: 'kova-200', size: '200 gm', price: 140, net_rate: 95, is_available: true },
      { id: 'kova-250', size: '250 gm', price: 175, net_rate: 118, is_available: true },
      { id: 'kova-500', size: '500 gm', price: 350, net_rate: 235, is_available: true },
      { id: 'kova-1kg', size: '1 Kg', price: 700, net_rate: 470, is_available: true },
    ],
  },
  {
    name: 'Sunnundalu',
    category: 'Sweets',
    available: true,
    sort_order: 5,
    image_url: null,
    variants: [
      { id: 'sunnundalu-200', size: '200 gm', price: 140, net_rate: 95, is_available: true },
      { id: 'sunnundalu-250', size: '250 gm', price: 175, net_rate: 118, is_available: true },
      { id: 'sunnundalu-500', size: '500 gm', price: 350, net_rate: 235, is_available: true },
      { id: 'sunnundalu-1kg', size: '1 Kg', price: 700, net_rate: 470, is_available: true },
    ],
  },
  {
    name: 'Plain Putharekulu',
    category: 'Sweets',
    available: true,
    sort_order: 9,
    image_url: null,
    variants: [
      { id: 'putharekulu-plain', size: '5 Pieces', price: 150, net_rate: 100, is_available: true },
    ],
  },
  {
    name: 'Dryfruit Putharekulu',
    category: 'Sweets',
    available: true,
    sort_order: 10,
    image_url: null,
    variants: [
      { id: 'putharekulu-dryfruit', size: '5 Pieces', price: 200, net_rate: 135, is_available: true },
    ],
  },
  {
    name: 'Jantikalu Hot',
    category: 'Snacks',
    available: true,
    sort_order: 11,
    image_url: null,
    variants: [
      { id: 'jantikalu-hot-200', size: '200 gm', price: 100, net_rate: 65, is_available: true },
    ],
  },
  {
    name: 'Boondhi Hot',
    category: 'Snacks',
    available: true,
    sort_order: 12,
    image_url: null,
    variants: [
      { id: 'boondhi-hot-200', size: '200 gm', price: 100, net_rate: 65, is_available: true },
    ],
  },
  {
    name: 'Paneer',
    category: 'Dairy',
    available: true,
    sort_order: 13,
    image_url: null,
    variants: [
      { id: 'paneer-250', size: '250 gm', price: 145, net_rate: 100, is_available: true },
      { id: 'paneer-500', size: '500 gm', price: 290, net_rate: 200, is_available: true },
      { id: 'paneer-1kg', size: '1 Kg', price: 580, net_rate: 400, is_available: true },
    ],
  },
  {
    name: 'Cow Ghee',
    category: 'Dairy',
    available: true,
    sort_order: 16,
    image_url: null,
    variants: [
      { id: 'cow-ghee-half', size: '1/2 Kg', price: 390, net_rate: 300, is_available: true },
      { id: 'cow-ghee-1kg', size: '1 Kg', price: 780, net_rate: 600, is_available: true },
    ],
  },
  {
    name: 'Buffalo Ghee',
    category: 'Dairy',
    available: true,
    sort_order: 18,
    image_url: null,
    variants: [
      { id: 'buffalo-ghee-half', size: '1/2 Kg', price: 390, net_rate: 300, is_available: true },
      { id: 'buffalo-ghee-1kg', size: '1 Kg', price: 780, net_rate: 600, is_available: true },
    ],
  },
]

/** Flat rows for any code that still expects one row per size. */
export function flattenSampleProducts(products = SAMPLE_PRODUCTS) {
  const rows = []
  products.forEach((product, index) => {
    const variants = product.variants || []
    variants.forEach((variant, vIndex) => {
      rows.push({
        id: variant.id,
        name: product.name,
        category: product.category,
        size: variant.size,
        price: variant.price,
        net_rate: variant.net_rate,
        is_available:
          variant.is_available ?? product.available ?? product.is_available ?? true,
        image_url: product.image_url ?? null,
        sort_order: variant.sort_order ?? product.sort_order ?? index * 10 + vIndex,
      })
    })
  })
  return rows
}
