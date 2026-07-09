import { WHATSAPP_NUMBER } from '../lib/constants'
import { formatCurrency, formatProductName } from './formatters'

export function buildWhatsAppMessage({ customer, items, total, deliveryOption, address, notes }) {
  const lines = [
    `🍬 *New Pre-Order — Ranganayaki Godavari Ruchulu*`,
    ``,
    `*Customer:* ${customer.name}`,
    `*Phone:* ${customer.phone}`,
    ``,
    `*Order Items:*`,
  ]

  items.forEach((item, i) => {
    const lineTotal = item.price * item.quantity
    lines.push(
      `${i + 1}. ${formatProductName(item)} × ${item.quantity} = ${formatCurrency(lineTotal)}`
    )
  })

  lines.push(
    ``,
    `*Total Amount:* ${formatCurrency(total)}`,
    `*Delivery/Pickup:* ${deliveryOption}`,
  )

  if (deliveryOption === 'Delivery' && address) {
    lines.push(`*Address:* ${address}`)
  }

  if (notes) {
    lines.push(`*Notes:* ${notes}`)
  }

  lines.push(``, `Please confirm my pre-order. Thank you! 🙏`)

  return lines.join('\n')
}

export function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}
