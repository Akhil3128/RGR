import SectionHeading from '../shared/SectionHeading'

export default function BrandStory() {
  return (
    <section id="story" className="pattern-bg px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Our Journey"
          title="From Rajahmundry to Vizag"
          subtitle="Authentic Godavari sweets made with traditional recipes, pure ingredients, and a mother's love."
        />

        <div className="ornament-border mx-auto max-w-3xl rounded-xl bg-cream-light p-6 md:p-8">
          <p className="text-base leading-relaxed text-maroon/90 md:text-lg">
            <strong className="font-display text-xl text-maroon">Ranganayaki Godavari Ruchulu</strong>{' '}
            brings the beloved flavours of the Godavari belt — Kova, Sunnundalu, Putharekulu,
            and more — to Vizag homes. Every batch is prepared fresh after your pre-order,
            so you get the same warmth and taste that families in Rajahmundry have cherished
            for generations.
          </p>
          <p className="mt-4 text-base leading-relaxed text-green/85">
            We keep it simple: authentic recipes, hygienic preparation, and honest pricing.
            Order ahead on WhatsApp, and we will prepare your sweets with care.
          </p>
        </div>
      </div>
    </section>
  )
}
