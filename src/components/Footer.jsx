import { Link } from 'react-router-dom'
import { BUSINESS, whatsappLink } from '../lib/business'
import WhatsAppIcon from './WhatsAppIcon'

export default function Footer() {
  return (
    <footer className="border-t-4 border-gold bg-forest-dark text-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <h3 className="font-heading text-lg font-semibold text-gold-light">
            {BUSINESS.name}
          </h3>
          <p className="mt-2 text-sm text-cream/80">{BUSINESS.tagline}</p>
          <p className="mt-2 text-sm text-cream/80">
            Authentic {BUSINESS.origin} / Godavari sweets &amp; snacks, made with
            love in {BUSINESS.city}.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-lg font-semibold text-gold-light">
            Contact
          </h3>
          <p className="mt-2 text-sm">
            <a href={`tel:${BUSINESS.phoneDisplay.replace(/\s/g, '')}`} className="hover:text-gold-light">
              📞 {BUSINESS.phoneDisplay}
            </a>
          </p>
          <a
            href={whatsappLink('Hi! I would like to know more about your sweets.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-3 text-sm"
          >
            <WhatsAppIcon />
            Chat on WhatsApp
          </a>
        </div>

        <div>
          <h3 className="font-heading text-lg font-semibold text-gold-light">
            Please Note
          </h3>
          <p className="mt-2 text-sm text-cream/80">
            🕉️ We take <strong className="text-gold-light">pre-orders only</strong>.
            Every item is freshly made after your order is confirmed.
          </p>
          <Link to="/admin/login" className="mt-3 inline-block text-xs text-cream/50 hover:text-cream/80">
            Admin Login
          </Link>
        </div>
      </div>

      <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} {BUSINESS.name} · Made with ❤️ in Vizag
      </div>
    </footer>
  )
}
