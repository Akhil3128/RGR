export const ORDER_STATUSES = [
  'New',
  'Confirmed',
  'Preparing',
  'Ready',
  'Delivered',
  'Completed',
  'Cancelled',
]

export const PAYMENT_METHODS = [
  { id: 'UPI', label: 'Pay via UPI' },
  { id: 'Pay Later', label: 'Pay Later / Cash on Delivery' },
  { id: 'WhatsApp', label: 'WhatsApp Order' },
]

export const PAYMENT_STATUSES = [
  'Pending',
  'Pending Verification',
  'Paid',
  'Partial',
  'Failed',
]

export const PRODUCT_CATEGORIES = ['Sweets', 'Snacks', 'Dairy', 'Other']

export const INVENTORY_DEDUCT_STATUSES = ['Delivered', 'Completed']

export const PENDING_STATUSES = ['New', 'Confirmed', 'Preparing', 'Ready']

export const STATUS_COLORS = {
  New: 'bg-blue-100 text-blue-800',
  Confirmed: 'bg-indigo-100 text-indigo-800',
  Preparing: 'bg-amber-100 text-amber-800',
  Ready: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
  Pending: 'bg-amber-100 text-amber-800',
  'Pending Verification': 'bg-orange-100 text-orange-800',
  Paid: 'bg-green-100 text-green-800',
  Partial: 'bg-yellow-100 text-yellow-800',
  Failed: 'bg-red-100 text-red-800',
  UPI: 'bg-forest/10 text-forest',
  'Pay Later': 'bg-beige text-ink',
  WhatsApp: 'bg-green-50 text-green-800',
}

// Map payment method → default payment_status when order is placed.
export const PAYMENT_STATUS_BY_METHOD = {
  UPI: 'Pending Verification',
  'Pay Later': 'Pending',
  WhatsApp: 'Pending',
}
