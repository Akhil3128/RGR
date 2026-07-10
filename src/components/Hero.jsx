import { BUSINESS } from '../config'
import { buildWhatsAppLink } from '../utils/whatsapp'
import { WhatsAppIcon } from './icons'

export default function Hero() {
  const waLink = buildWhatsAppLink(
    `Hello ${BUSINESS.name}! I would like to place a pre-order.`,
  )

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-maroon via-maroon-dark to-forest" />
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, #D4AF37 0, transparent 35%), radial-gradient(circle at 85% 10%, #E8C96A 0, transparent 30%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
        <span className="badge-pill border border-gold/40 bg-white/10 text-gold-light backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
          Pre-orders only
        </span>

        <h1 className="mt-6 font-heading text-4xl font-bold leading-tight text-cream sm:text-6xl">
          {BUSINESS.name}
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-heading text-xl text-gold-light sm:text-2xl">
          {BUSINESS.tagline}
        </p>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-cream/85 sm:text-base">
          Homemade sweets, snacks, pure ghee and fresh items — authentic
          Godavari flavors, freshly prepared with care in {BUSINESS.city}.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#menu" className="btn-gold min-w-[200px] border-gold text-cream hover:text-maroon">
            View Menu
          </a>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp min-w-[200px]"
          >
            <WhatsAppIcon />
            Order on WhatsApp
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs text-cream/75">
          {['Homemade Goodness', 'Hygienically Prepared', 'Quality Assured'].map(
            (t) => (
              <span
                key={t}
                className="rounded-full border border-cream/20 px-3 py-1"
              >
                {t}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
