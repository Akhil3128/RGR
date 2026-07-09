const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919963814860'

/**
 * Builds the pre-order message that gets sent to the shop's WhatsApp number.
 * @param {{name: string, phone: string, fulfillment: 'pickup'|'delivery', address: string, notes: string}} customer
 * @param {Array<{name: string, size: string, price: number, quantity: number}>} items
 * @param {number} total
 */
export function buildOrderMessage(customer, items, total) {
  const lines = []

  lines.push('*New Pre-Order - Ranganayaki Godavari Ruchulu*')
  lines.push('')
  lines.push(`*Name:* ${customer.name}`)
  lines.push(`*Phone:* ${customer.phone}`)
  lines.push(
    `*Order Type:* ${customer.fulfillment === 'delivery' ? 'Home Delivery' : 'Store Pickup'}`
  )
  if (customer.fulfillment === 'delivery' && customer.address) {
    lines.push(`*Address:* ${customer.address}`)
  }
  lines.push('')
  lines.push('*Items:*')
  items.forEach((item, index) => {
    const lineTotal = item.price ? item.price * item.quantity : 0
    const priceLabel = item.price ? `₹${item.price} x ${item.quantity} = ₹${lineTotal}` : 'Price to be confirmed'
    lines.push(`${index + 1}. ${item.name} (${item.size}) - ${priceLabel}`)
  })
  lines.push('')
  lines.push(`*Total Amount:* ₹${total}`)

  if (customer.notes) {
    lines.push('')
    lines.push(`*Notes:* ${customer.notes}`)
  }

  lines.push('')
  lines.push('Please confirm my pre-order. Thank you!')

  return lines.join('\n')
}

export function buildWhatsAppLink(message, number = WHATSAPP_NUMBER) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function getShopWhatsAppNumber() {
  return WHATSAPP_NUMBER
}
