import { BUSINESS } from '../config'
import { buildWhatsAppLink } from '../utils/whatsapp'
import { PhoneIcon, WhatsAppIcon } from './icons'

export default function Footer() {
  const waLink = buildWhatsAppLink(
    `Hello ${BUSINESS.name}! I would like to place a pre-order.`,
  )

  return (
    <footer id="contact" className="bg-ink text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <h3 className="font-heading text-xl font-bold text-gold-light">
            {BUSINESS.name}
          </h3>
          <p className="mt-2 text-sm text-cream/75">{BUSINESS.tagline}</p>
          <p className="mt-3 text-sm leading-relaxed text-cream/60">
            Authentic homemade sweets, snacks, ghee and fresh items — freshly
            prepared with care in {BUSINESS.city}.
          </p>
        </div>

        <div>
          <h4 className="font-heading text-base font-semibold text-gold-light">
            Quick Links
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-cream/70">
            <li><a href="#menu" className="transition hover:text-gold-light">Menu</a></li>
            <li><a href="#story" className="transition hover:text-gold-light">Our Story</a></li>
            <li><a href="#quality" className="transition hover:text-gold-light">Quality</a></li>
            <li><a href="/admin/login" className="transition hover:text-gold-light">Admin Login</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-base font-semibold text-gold-light">
            Contact &amp; Orders
          </h4>
          <p className="mt-4 rounded-xl bg-white/5 px-3 py-2 text-sm text-cream/85">
            Pre-orders only
          </p>
          <a
            href={`tel:+${BUSINESS.phoneRaw}`}
            className="mt-4 flex items-center gap-2 text-sm text-cream/85 transition hover:text-gold-light"
          >
            <PhoneIcon className="h-4 w-4" /> {BUSINESS.phoneDisplay}
          </a>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-4 w-full"
          >
            <WhatsAppIcon /> Order on WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
      </div>
    </footer>
  )
}
