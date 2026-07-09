const FEATURES = [
  {
    icon: '🌾',
    title: 'Freshly Made',
    description: 'Every sweet and snack is prepared fresh after your order is confirmed — nothing sits on a shelf.',
  },
  {
    icon: '🧼',
    title: 'Hygienically Prepared',
    description: 'Made in a clean home kitchen following strict hygiene practices, from ingredients to packing.',
  },
  {
    icon: '✅',
    title: 'Quality Assured',
    description: 'Pure ghee, quality ingredients, and traditional methods — the same taste, every single time.',
  },
]

export default function QualitySection() {
  return (
    <section id="quality" className="bg-forest-dark py-14 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-gold">Why Choose Us</p>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl text-cream">
            Made With Care, Just Like Home
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-cream/5 border border-gold/30 p-6 text-center shadow-soft hover:bg-cream/10 transition-colors"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-display text-lg text-gold mb-2">{feature.title}</h3>
              <p className="text-sm text-cream/80 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
