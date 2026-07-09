const QUALITY_POINTS = [
  {
    emoji: '🍯',
    title: 'Freshly Made',
    text: 'Every item is prepared only after your pre-order is confirmed. Nothing is stored, nothing is stale.',
  },
  {
    emoji: '🧼',
    title: 'Hygienically Prepared',
    text: 'Cooked in a clean home kitchen with the same care we take for our own family.',
  },
  {
    emoji: '✅',
    title: 'Quality Assured',
    text: 'Pure ghee, quality ingredients and traditional methods — no shortcuts, no compromises.',
  },
]

export default function QualitySection() {
  return (
    <section className="bg-forest-dark py-14 text-cream">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="font-heading text-3xl font-bold text-gold-light sm:text-4xl">
          Our Promise To You
        </h2>
        <div className="gold-divider">❖</div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {QUALITY_POINTS.map((point) => (
            <div
              key={point.title}
              className="rounded-xl border border-gold/40 bg-forest p-6 shadow-card"
            >
              <span className="text-4xl">{point.emoji}</span>
              <h3 className="mt-3 font-heading text-lg font-semibold text-gold-light">
                {point.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/85">
                {point.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
