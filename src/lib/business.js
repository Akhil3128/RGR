// All business details in one place so they are easy to change later.

export const BUSINESS = {
  name: 'Ranganayaki Godavari Ruchulu',
  tagline: 'Traditional Taste, Pure Love',
  city: 'Visakhapatnam (Vizag)',
  origin: 'Rajahmundry',
  phoneDisplay: '+91 99638 14860',
  // WhatsApp needs the number without spaces or the + sign.
  whatsappNumber: '919963814860',
}

export const whatsappLink = (message = '') =>
  `https://wa.me/${BUSINESS.whatsappNumber}${
    message ? `?text=${encodeURIComponent(message)}` : ''
  }`
