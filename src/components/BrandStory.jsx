import { BUSINESS } from '../config'

export default function BrandStory() {
  return (
    <section id="story" className="bg-cream py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2">
        <div>
          <h2 className="section-title">Our Story</h2>
          <div className="divider !mx-0" />
          <p className="mt-6 leading-relaxed text-ink/80">
            {BUSINESS.name} began in a family kitchen with recipes cherished
            across generations. We bring you authentic Godavari flavors —
            homemade sweets and snacks prepared with care for homes across{' '}
            <strong>{BUSINESS.city}</strong>.
          </p>
          <p className="mt-4 leading-relaxed text-ink/80">
            Every item — from melt-in-the-mouth <em>Kova</em> and{' '}
            <em>Sunnundalu</em> to delicate <em>Putharekulu</em> — is made in
            small batches on pre-order. Pure ghee, honest ingredients, no
            shortcuts. Just{' '}
            <span className="font-semibold text-maroon">
              Traditional Taste, Pure Love
            </span>
            .
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {[
              '100% Homemade',
              'Godavari Flavors',
              'Pure Ghee',
              'Made to Order',
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gold/30 bg-white px-3 py-1.5 text-xs font-medium text-maroon shadow-soft"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="card-premium relative overflow-hidden p-8">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/10" />
          <div className="relative text-center">
            <div className="text-6xl">🪔</div>
            <p className="mt-4 font-heading text-2xl font-bold text-maroon">
              Homemade Goodness
            </p>
            <p className="mt-2 text-sm text-forest">
              Traditional taste, freshly prepared on every pre-order
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              {[
                { n: '100%', l: 'Homemade' },
                { n: 'Pure', l: 'Ghee' },
                { n: 'Fresh', l: 'Daily' },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-xl bg-cream-dark/60 px-2 py-3"
                >
                  <p className="font-heading text-lg font-bold text-maroon">
                    {s.n}
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-forest">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
