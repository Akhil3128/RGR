import SectionHeading from '../shared/SectionHeading'

const POINTS = [
  {
    title: 'Freshly Made',
    text: 'Every item is prepared after your pre-order — never sitting on a shelf.',
  },
  {
    title: 'Hygienically Prepared',
    text: 'Clean kitchen practices and careful handling from start to finish.',
  },
  {
    title: 'Quality Assured',
    text: 'Traditional Godavari recipes with pure ingredients you can trust.',
  },
]

export default function QualitySection() {
  return (
    <section className="bg-green px-4 py-16 text-cream">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          light
          eyebrow="Our Promise"
          title="Made with Care"
          subtitle="Three things we never compromise on."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {POINTS.map((point) => (
            <div
              key={point.title}
              className="rounded-xl border border-gold/30 bg-green-dark/40 p-5 shadow-sm"
            >
              <div className="mb-3 h-1 w-10 bg-gold" />
              <h3 className="font-display text-2xl text-gold-light">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/80">{point.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
