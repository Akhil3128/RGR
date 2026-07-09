// Format a number as Indian Rupees, e.g. 1400 -> "₹1,400"
export function formatINR(amount) {
  const value = Number(amount) || 0
  return '₹' + value.toLocaleString('en-IN')
}

// A readable label for a product line, e.g. "Kova (500 gm)".
// Works for both product rows (name) and order_items rows (product_name).
export function productLabel(product) {
  const name = product.name ?? product.product_name ?? ''
  return product.size ? `${name} (${product.size})` : name
}
