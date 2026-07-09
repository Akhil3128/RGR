import { BUSINESS } from '../config'

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-maroon text-cream"
    >
      {/* Decorative pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, #C79A3A 0, transparent 40%), radial-gradient(circle at 80% 0%, #E0BE63 0, transparent 35%)',
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
        <p className="mb-3 inline-block rounded-full border border-gold/50 px-4 py-1 text-xs font-medium uppercase tracking-widest text-gold-light">
          Authentic {BUSINESS.origin} Sweets
        </p>
        <h1 className="font-heading text-4xl font-bold leading-tight sm:text-6xl">
          {BUSINESS.name}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-heading text-xl text-gold-light sm:text-2xl">
          {BUSINESS.tagline}
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-cream/85 sm:text-base">
          Homemade Rajahmundry &amp; Godavari sweets, snacks and pure dairy —
          freshly prepared and delivered with love in {BUSINESS.city}.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#menu" className="btn-gold border-gold text-cream hover:text-maroon">
            View Menu &amp; Order
          </a>
          <a href="#story" className="text-sm font-medium text-gold-light underline-offset-4 hover:underline">
            Read our story →
          </a>
        </div>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-cream/10 px-4 py-2 text-sm text-gold-light">
          <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
          Pre-orders only — place your order on WhatsApp
        </div>
      </div>
    </section>
  )
}
