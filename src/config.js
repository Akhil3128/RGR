// Central place for business info. Edit here to change contact details site-wide.

export const BUSINESS = {
  name: 'Ranganayaki Godavari Ruchulu',
  tagline: 'Traditional Taste, Pure Love',
  city: 'Visakhapatnam (Vizag)',
  phoneDisplay: '+91 99638 14860',
  phoneRaw: '919963814860',
}

export const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER || BUSINESS.phoneRaw

// UPI payment — set VITE_UPI_ID in .env or replace the placeholder below.
export const UPI = {
  id: import.meta.env.VITE_UPI_ID || 'ENTER_UPI_ID_HERE',
  name: import.meta.env.VITE_UPI_NAME || BUSINESS.name,
}

export const isUpiConfigured =
  Boolean(UPI.id) && UPI.id !== 'ENTER_UPI_ID_HERE'
