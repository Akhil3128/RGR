import { DISPLAY_PHONE, BUSINESS_NAME, TAGLINE } from '../../data/sampleProducts'
import { openWhatsAppChat } from '../../lib/utils'

export default function Footer() {
  return (
    <footer className="border-t border-gold/30 bg-maroon text-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <h3 className="font-display text-2xl text-gold-light">{BUSINESS_NAME}</h3>
          <p className="mt-2 text-sm text-cream/80">{TAGLINE}</p>
          <p className="mt-3 text-sm text-cream/70">
            Authentic Rajahmundry / Godavari sweets & snacks in Vizag.
          </p>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gold">
            Contact
          </h4>
          <p className="text-sm">
            Phone:{' '}
            <a className="underline hover:text-gold-light" href={`tel:${DISPLAY_PHONE.replace(/\s/g, '')}`}>
              {DISPLAY_PHONE}
            </a>
          </p>
          <p className="mt-2 text-sm text-cream/75">Pre-orders only · Freshly made to order</p>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gold">
            Order on WhatsApp
          </h4>
          <button
            type="button"
            onClick={() => openWhatsAppChat()}
            className="rounded-md bg-green px-4 py-2.5 text-sm font-semibold text-cream shadow hover:bg-green-light"
          >
            Chat on WhatsApp
          </button>
        </div>
      </div>
      <div className="border-t border-cream/10 px-4 py-4 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} {BUSINESS_NAME}. Made with love in Vizag.
      </div>
    </footer>
  )
}
