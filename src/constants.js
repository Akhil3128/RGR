export const ORDER_STATUSES = [
  'New',
  'Confirmed',
  'Preparing',
  'Ready',
  'Delivered',
  'Completed',
  'Cancelled',
]

export const PAYMENT_STATUSES = ['Pending', 'Paid', 'Partial']

export const PRODUCT_CATEGORIES = ['Sweets', 'Snacks', 'Dairy', 'Other']

// Statuses that trigger inventory deduction (once per order).
export const INVENTORY_DEDUCT_STATUSES = ['Delivered', 'Completed']

// Orders that still need attention (used for "Pending Orders" card).
export const PENDING_STATUSES = ['New', 'Confirmed', 'Preparing', 'Ready']

// Tailwind classes for colouring status badges.
export const STATUS_COLORS = {
  New: 'bg-blue-100 text-blue-800',
  Confirmed: 'bg-indigo-100 text-indigo-800',
  Preparing: 'bg-amber-100 text-amber-800',
  Ready: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
  Pending: 'bg-amber-100 text-amber-800',
  Paid: 'bg-green-100 text-green-800',
  Partial: 'bg-orange-100 text-orange-800',
}
