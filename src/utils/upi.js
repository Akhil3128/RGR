import { UPI } from '../config'

// Build a UPI deep-link for mobile payment apps.
export function buildUpiLink({ amount, note }) {
  const params = new URLSearchParams({
    pa: UPI.id,
    pn: UPI.name,
    am: String(Number(amount).toFixed(2)),
    cu: 'INR',
    tn: note,
  })
  return `upi://pay?${params.toString()}`
}

export function buildOrderNote({ customerName, orderId }) {
  const parts = ['Ranganayaki order', customerName]
  if (orderId) parts.push(orderId.slice(0, 8))
  return parts.join(' - ')
}

// Detect mobile-ish devices for UPI intent.
export function isMobileDevice() {
  if (typeof navigator === 'undefined') return false
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}
