// Short one-line blurbs for the customer menu.
// Keys are lowercased product names so they work for sample + Supabase data.
export const PRODUCT_DESCRIPTIONS = {
  kova: 'Rich traditional milk sweet',
  sunnundalu: 'Classic Andhra urad dal laddu',
  'plain putharekulu': 'Paper-thin sweet rolls, simply filled',
  'dryfruit putharekulu': 'Crisp rolls filled with dry fruits',
  'jantikalu hot': 'Crispy spiral snack, lightly spiced',
  'boondhi hot': 'Crunchy pearl snack, freshly fried',
  paneer: 'Fresh homemade paneer',
  'cow ghee': 'Pure traditional cow ghee',
  'buffalo ghee': 'Rich traditional buffalo ghee',
}

export function getProductDescription(product) {
  if (product?.description) return product.description
  const key = String(product?.name || '')
    .trim()
    .toLowerCase()
  return PRODUCT_DESCRIPTIONS[key] || ''
}

/**
 * Softer storefront categories for filters.
 * Falls back to the product.category from the database.
 */
export function getStorefrontCategory(product) {
  if (product?.storefrontCategory) return product.storefrontCategory
  const name = String(product?.name || '').toLowerCase()
  if (name.includes('putharekulu')) return 'Putharekulu'
  if (name.includes('ghee')) return 'Ghee'
  if (product?.category === 'Snacks') return 'Savories'
  return product?.category || 'Sweets'
}
