import { BUSINESS_NAME, TAGLINE } from '../../data/sampleProducts'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-maroon text-cream">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, rgba(201,162,39,0.45), transparent 35%), radial-gradient(circle at 85% 15%, rgba(247,241,232,0.12), transparent 30%), radial-gradient(circle at 70% 80%, rgba(31,77,58,0.45), transparent 40%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #C9A227 0, #C9A227 1px, transparent 1px, transparent 14px)',
        }}
      />

      <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col items-center justify-center px-4 py-16 text-center">
        <p className="animate-fade-up mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-gold-light">
          Homemade · Vizag
        </p>
        <h1 className="animate-fade-up-delay font-display text-4xl leading-tight text-cream sm:text-5xl md:text-6xl">
          {BUSINESS_NAME}
        </h1>
        <p className="animate-fade-up-delay-2 mt-4 max-w-xl text-lg text-gold-light md:text-xl">
          {TAGLINE}
        </p>
        <p className="animate-fade-up-delay-2 mt-3 max-w-lg text-sm text-cream/80 md:text-base">
          Authentic Godavari sweets from Rajahmundry, freshly prepared for Vizag families.
          Pre-orders only via WhatsApp.
        </p>

        <div className="animate-fade-up-delay-2 mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#menu"
            className="rounded-md bg-gold px-6 py-3 text-sm font-bold text-maroon-dark shadow hover:bg-gold-light"
          >
            View Menu
          </a>
          <a
            href="#order"
            className="rounded-md border border-cream/40 bg-transparent px-6 py-3 text-sm font-semibold text-cream hover:bg-cream/10"
          >
            Place Pre-Order
          </a>
        </div>

        <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-maroon-dark/50 px-4 py-2 text-xs font-medium text-gold-light">
          <span className="h-2 w-2 rounded-full bg-gold" />
          Pre-orders only — made fresh after you order
        </div>
      </div>
    </section>
  )
}
