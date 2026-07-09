export function formatCurrency(amount) {
  return `₹${Number(amount).toLocaleString('en-IN')}`
}

export function formatProductName(product) {
  return `${product.name} (${product.size})`
}

export function getDisplayName(product) {
  if (product.size) return `${product.name} — ${product.size}`
  return product.name
}

export function calcClosingStock(opening, received, sales) {
  return opening + received - sales
}

export function calcSalesAmount(qty, price) {
  return qty * price
}

export function calcCostAmount(qty, netRate) {
  return qty * netRate
}

export function calcProfit(salesAmount, costAmount) {
  return salesAmount - costAmount
}
