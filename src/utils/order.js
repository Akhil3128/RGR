export const WHATSAPP_NUMBER = '919963814860'
export const DISPLAY_PHONE = '+91 99638 14860'

export function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return 'Price to confirm'
  }

  return `₹${Number(value).toLocaleString('en-IN')}`
}

export function getCartTotal(cartItems) {
  return cartItems.reduce((total, item) => total + Number(item.price || 0) * item.quantity, 0)
}

export function buildWhatsAppMessage(customer, cartItems) {
  const lines = [
    'Namaskaram Ranganayaki Godavari Ruchulu,',
    '',
    'I would like to place a pre-order.',
    '',
    `Customer Name: ${customer.name}`,
    `Phone Number: ${customer.phone}`,
    `Order Type: ${customer.fulfillmentType}`,
    `Address: ${customer.address || 'Not provided'}`,
    `Notes: ${customer.notes || 'None'}`,
    '',
    'Items:',
    ...cartItems.map((item, index) => {
      const lineTotal = Number(item.price || 0) * item.quantity
      const priceText = item.price ? `${formatCurrency(item.price)} each, ${formatCurrency(lineTotal)}` : 'Price to confirm'
      return `${index + 1}. ${item.name} - ${item.size} x ${item.quantity} (${priceText})`
    }),
    '',
    `Total Amount: ${formatCurrency(getCartTotal(cartItems))}`,
    '',
    'Please confirm availability and pickup/delivery details.',
  ]

  return lines.join('\n')
}

export function buildWhatsAppUrl(customer, cartItems) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(customer, cartItems))}`
}
