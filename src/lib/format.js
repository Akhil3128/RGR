// Small helpers used across the app.

export const formatPrice = (amount) =>
  `₹${Number(amount || 0).toLocaleString('en-IN')}`

export const formatDate = (isoString) =>
  new Date(isoString).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
