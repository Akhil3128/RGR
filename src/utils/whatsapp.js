import { WHATSAPP_NUMBER } from '../config'
import { formatINR, productLabel } from './format'

// Build the full WhatsApp order message text from cart + customer details.
export function buildOrderMessage({ items, total, customer }) {
  const lines = []
  lines.push('*New Pre-Order — Ranganayaki Godavari Ruchulu*')
  lines.push('')
  lines.push(`*Name:* ${customer.name}`)
  lines.push(`*Phone:* ${customer.phone}`)
  lines.push(`*Type:* ${customer.orderType === 'pickup' ? 'Pickup' : 'Delivery'}`)
  if (customer.orderType === 'delivery' && customer.address) {
    lines.push(`*Address:* ${customer.address}`)
  }
  lines.push('')
  lines.push('*Order Items:*')
  items.forEach((item, i) => {
    const lineTotal = item.price * item.quantity
    lines.push(
      `${i + 1}. ${productLabel(item)} — ${item.quantity} x ${formatINR(
        item.price,
      )} = ${formatINR(lineTotal)}`,
    )
  })
  lines.push('')
  lines.push(`*Total Amount: ${formatINR(total)}*`)
  if (customer.notes) {
    lines.push('')
    lines.push(`*Notes:* ${customer.notes}`)
  }
  lines.push('')
  lines.push('_Pre-orders only. Thank you! 🙏_')
  return lines.join('\n')
}

// Create a wa.me link that opens WhatsApp with the message pre-filled.
export function buildWhatsAppLink(message, number = WHATSAPP_NUMBER) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
