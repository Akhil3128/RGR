import { WHATSAPP_NUMBER } from '../data/sampleProducts'

export function formatPrice(amount) {
  const value = Number(amount) || 0
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}

export function productLabel(product) {
  if (!product) return ''
  return product.size ? `${product.name} (${product.size})` : product.name
}

export function closingStock(row) {
  const opening = Number(row?.opening_stock) || 0
  const received = Number(row?.stock_received) || 0
  const sales = Number(row?.sales) || 0
  return opening + received - sales
}

export function calcSalesAmount(qty, price) {
  return (Number(qty) || 0) * (Number(price) || 0)
}

export function calcCostAmount(qty, netRate) {
  return (Number(qty) || 0) * (Number(netRate) || 0)
}

export function calcProfit(salesAmount, costAmount) {
  return (Number(salesAmount) || 0) - (Number(costAmount) || 0)
}

export function buildWhatsAppMessage({ customer, items, total }) {
  const lines = [
    `*New Pre-Order — Ranganayaki Godavari Ruchulu*`,
    '',
    `*Name:* ${customer.name}`,
    `*Phone:* ${customer.phone}`,
    `*Type:* ${customer.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}`,
  ]

  if (customer.deliveryType === 'delivery' && customer.address) {
    lines.push(`*Address:* ${customer.address}`)
  }

  if (customer.notes) {
    lines.push(`*Notes:* ${customer.notes}`)
  }

  lines.push('', '*Order Items:*')

  items.forEach((item, index) => {
    const label = item.size ? `${item.name} (${item.size})` : item.name
    const lineTotal = item.quantity * item.price
    lines.push(
      `${index + 1}. ${label} × ${item.quantity} = ${formatPrice(lineTotal)}`
    )
  })

  lines.push('', `*Total Amount:* ${formatPrice(total)}`, '', '_Pre-order only — Thank you!_')

  return lines.join('\n')
}

export function openWhatsAppOrder(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function openWhatsAppChat(text = 'Hello! I would like to place a pre-order.') {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}
