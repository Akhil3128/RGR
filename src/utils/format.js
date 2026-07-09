export function formatCurrency(amount) {
  if (amount === null || amount === undefined || amount === '') return 'Price on request'
  const value = Number(amount)
  if (Number.isNaN(value)) return 'Price on request'
  return `₹${value.toLocaleString('en-IN')}`
}

export function formatNumber(value) {
  const num = Number(value) || 0
  return num.toLocaleString('en-IN')
}
