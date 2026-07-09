import { BUSINESS } from '../config'

export default function BrandStory() {
  return (
    <section id="story" className="bg-cream py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
        <div>
          <h2 className="section-title">Our Story</h2>
          <div className="divider !mx-0" />
          <p className="mt-6 text-forest-dark/90">
            {BUSINESS.name} began in a family kitchen with recipes passed down
            through generations from the fertile banks of the Godavari. From the
            sweet lanes of <strong>Rajahmundry</strong> to homes across{' '}
            <strong>{BUSINESS.city}</strong>, we bring you the authentic taste of
            traditional Andhra sweets and snacks.
          </p>
          <p className="mt-4 text-forest-dark/90">
            Every item — from melt-in-the-mouth <em>Kova</em> and{' '}
            <em>Sunnundalu</em> to delicate <em>Putharekulu</em> — is made in
            small batches using time-honoured methods, pure ghee and honest
            ingredients. No shortcuts, no preservatives. Just{' '}
            <span className="font-semibold text-maroon">
              Traditional Taste, Pure Love
            </span>
            .
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {['100% Homemade', 'Godavari Recipes', 'Pure Ghee', 'Made to Order'].map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gold/40 bg-white px-3 py-1 text-xs font-medium text-maroon shadow-soft"
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="relative">
          <div className="card overflow-hidden">
            <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-maroon via-maroon-light to-forest">
              <div className="text-center text-cream">
                <div className="text-7xl">🪔</div>
                <p className="mt-3 font-heading text-2xl text-gold-light">
                  Rajahmundry → Vizag
                </p>
                <p className="mt-1 text-sm text-cream/80">
                  Tradition in every bite
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 hidden rounded-2xl border border-gold/40 bg-gold px-5 py-3 text-center text-maroon-dark shadow-card sm:block">
            <p className="font-heading text-2xl font-bold">100%</p>
            <p className="text-xs font-medium">Homemade</p>
          </div>
        </div>
      </div>
    </section>
  )
}
