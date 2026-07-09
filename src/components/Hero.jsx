export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-maroon via-maroon-dark to-forest-dark text-cream"
    >
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, #D4A017 0, transparent 45%), radial-gradient(circle at 80% 0%, #D4A017 0, transparent 40%), radial-gradient(circle at 50% 100%, #D4A017 0, transparent 45%)',
        }}
        aria-hidden
      />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <p className="inline-block rounded-full border border-gold/60 bg-cream/10 px-4 py-1 text-xs sm:text-sm font-semibold tracking-wide text-gold uppercase">
          Authentic Rajahmundry &bull; Godavari Sweets
        </p>

        <h1 className="mt-5 font-display text-3xl sm:text-5xl leading-tight text-cream">
          Ranganayaki Godavari Ruchulu
        </h1>

        <p className="mt-3 font-display text-xl sm:text-2xl text-gold italic">Traditional Taste, Pure Love</p>

        <p className="mt-5 max-w-xl mx-auto text-sm sm:text-base text-cream/85">
          Homemade sweets &amp; snacks from the heart of Rajahmundry, made fresh with love and delivered to your
          doorstep in Vizag. 100% pre-orders — every batch is prepared just for you.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#menu"
            className="w-full sm:w-auto rounded-full bg-gold text-maroon-dark font-bold px-8 py-3 shadow-card hover:bg-gold-light transition-colors"
          >
            View Menu &amp; Pre-Order
          </a>
          <a
            href="#footer"
            className="w-full sm:w-auto rounded-full border-2 border-cream/70 px-8 py-3 font-semibold text-cream hover:bg-cream/10 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  )
}
