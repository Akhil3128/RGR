const FEATURES = [
  {
    icon: '🌿',
    title: 'Freshly Made',
    text: 'Prepared in small batches only after you order — never sitting on a shelf.',
  },
  {
    icon: '🧼',
    title: 'Hygienically Prepared',
    text: 'Clean home kitchen, safe handling and careful packing for every order.',
  },
  {
    icon: '✅',
    title: 'Quality Assured',
    text: 'Pure ghee, honest ingredients and authentic Godavari recipes — every time.',
  },
]

export default function QualitySection() {
  return (
    <section id="quality" className="bg-cream-dark py-16">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="section-title">Why Choose Us</h2>
        <div className="divider" />
        <p className="mx-auto mt-4 max-w-2xl text-forest-dark/80">
          Freshly made, hygienically prepared and quality assured — the way
          homemade sweets should be.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream text-3xl">
                {f.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold text-maroon">{f.title}</h3>
              <p className="mt-2 text-sm text-forest-dark/80">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
