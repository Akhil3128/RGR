import Button from '../ui/Button'
import { BUSINESS_NAME, WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from '../../lib/constants'

export default function Footer() {
  const openWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <footer className="bg-forest text-cream mt-16">
      <div className="h-1 bg-gradient-to-r from-maroon via-gold to-maroon" />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="font-display text-2xl font-bold text-gold mb-2">
              {BUSINESS_NAME}
            </h3>
            <p className="text-cream/80 text-sm leading-relaxed">
              Authentic Rajahmundry & Godavari sweets and snacks,
              lovingly prepared and delivered in Vizag.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gold mb-3">Contact</h4>
            <p className="text-sm text-cream/80 mb-1">📍 Vizag, Andhra Pradesh</p>
            <p className="text-sm text-cream/80 mb-3">
              📞 <a href={`tel:${WHATSAPP_DISPLAY.replace(/\s/g, '')}`} className="hover:text-gold transition-colors">
                {WHATSAPP_DISPLAY}
              </a>
            </p>
            <Button variant="whatsapp" size="sm" onClick={openWhatsApp}>
              💬 Chat on WhatsApp
            </Button>
          </div>

          <div>
            <h4 className="font-semibold text-gold mb-3">Pre-Orders Only</h4>
            <p className="text-sm text-cream/80 leading-relaxed">
              All orders are pre-orders. We prepare everything fresh
              after you place your order. Minimum 24 hours notice preferred.
            </p>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-8 pt-6 text-center text-xs text-cream/50">
          <p>© {new Date().getFullYear()} {BUSINESS_NAME}. Made with 💛 in Vizag.</p>
        </div>
      </div>
    </footer>
  )
}
