// Central place for business info. Edit here to change contact details site-wide.

export const BUSINESS = {
  name: 'Ranganayaki Godavari Ruchulu',
  tagline: 'Traditional Taste, Pure Love',
  city: 'Visakhapatnam (Vizag)',
  origin: 'Rajahmundry / Godavari',
  phoneDisplay: '+91 99638 14860',
  // Digits only with country code (used for tel: and WhatsApp links)
  phoneRaw: '919963814860',
}

// WhatsApp number can be overridden via env, else falls back to shop number.
export const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER || BUSINESS.phoneRaw
