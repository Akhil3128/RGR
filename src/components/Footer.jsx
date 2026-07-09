import { Link } from 'react-router-dom'
import { WhatsAppIcon } from './WhatsAppFloatButton'
import { getShopWhatsAppNumber } from '../utils/whatsapp'

export default function Footer() {
  const number = getShopWhatsAppNumber()
  const displayNumber = '+91 99638 14860'
  const whatsappLink = `https://wa.me/${number}`

  return (
    <footer id="footer" className="bg-maroon-dark text-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-xl text-gold">Ranganayaki Godavari Ruchulu</h3>
            <p className="mt-2 text-sm text-cream/80 italic">Traditional Taste, Pure Love</p>
            <p className="mt-3 text-sm text-cream/70 leading-relaxed">
              Authentic Rajahmundry / Godavari sweets &amp; snacks, homemade with love, serving Vizag on a
              pre-order basis.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gold mb-3 text-sm uppercase tracking-wide">Contact &amp; Orders</h4>
            <p className="text-sm text-cream/80 mb-2">Pre-orders only — via WhatsApp</p>
            <a href={`tel:${number}`} className="block text-sm text-cream/90 hover:text-gold mb-3">
              📞 {displayNumber}
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream hover:bg-forest-light transition-colors"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Chat on WhatsApp
            </a>
          </div>

          <div>
            <h4 className="font-semibold text-gold mb-3 text-sm uppercase tracking-wide">Service Area</h4>
            <p className="text-sm text-cream/80">Vizag (Visakhapatnam)</p>
            <p className="text-sm text-cream/80 mt-1">Homemade in Rajahmundry tradition</p>
            <Link to="/admin/login" className="mt-4 inline-block text-xs text-cream/50 hover:text-gold underline">
              Admin Login
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-cream/10 pt-5 text-center text-xs text-cream/50">
          © {new Date().getFullYear()} Ranganayaki Godavari Ruchulu. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
