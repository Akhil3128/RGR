import { getShopWhatsAppNumber } from '../utils/whatsapp'

export default function WhatsAppFloatButton() {
  const number = getShopWhatsAppNumber()
  const link = `https://wa.me/${number}?text=${encodeURIComponent(
    'Hello! I would like to ask about Ranganayaki Godavari Ruchulu sweets.'
  )}`

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-forest text-cream shadow-card hover:bg-forest-dark transition-colors"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon />
    </a>
  )
}

export function WhatsAppIcon({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden>
      <path d="M16.02 3C9.4 3 4 8.38 4 15c0 2.42.72 4.68 1.96 6.58L4 29l7.62-1.94A11.9 11.9 0 0 0 16.02 27C22.65 27 28 21.62 28 15S22.65 3 16.02 3zm0 21.7c-1.98 0-3.85-.55-5.44-1.5l-.39-.23-4.5 1.15 1.2-4.38-.25-.4A9.6 9.6 0 0 1 5.5 15c0-5.8 4.72-10.5 10.52-10.5S26.5 9.2 26.5 15 22.82 24.7 16.02 24.7zm5.98-7.87c-.33-.16-1.94-.96-2.24-1.06-.3-.11-.52-.16-.74.16-.22.32-.85 1.06-1.04 1.28-.19.22-.38.24-.7.08-1.9-.95-3.14-1.7-4.4-3.86-.33-.58.33-.54.95-1.8.1-.22.05-.4-.05-.56-.1-.16-.72-1.74-.99-2.38-.26-.62-.53-.54-.74-.55-.19-.01-.41-.01-.63-.01-.22 0-.58.08-.88.4-.3.32-1.16 1.13-1.16 2.76 0 1.63 1.19 3.2 1.35 3.42.16.22 2.28 3.48 5.53 4.74 2.75 1.07 3.31.86 3.9.8.6-.05 1.94-.79 2.21-1.56.27-.77.27-1.42.19-1.56-.08-.14-.3-.22-.63-.38z" />
    </svg>
  )
}
