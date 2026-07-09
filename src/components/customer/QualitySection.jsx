import Card from '../ui/Card'

const features = [
  {
    icon: '🌿',
    title: 'Freshly Made',
    description: 'Every item is prepared fresh after you place your pre-order. No stale stock, ever.',
  },
  {
    icon: '🧼',
    title: 'Hygienically Prepared',
    description: 'Our kitchen follows strict hygiene practices. Clean utensils, fresh ingredients, safe packaging.',
  },
  {
    icon: '⭐',
    title: 'Quality Assured',
    description: 'We use only the finest ingredients — pure ghee, quality dry fruits, and authentic Godavari recipes.',
  },
]

export default function QualitySection() {
  return (
    <section id="quality" className="py-16 sm:py-20 bg-gradient-to-b from-cream to-cream-dark/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-maroon">
            Our Promise to You
          </h2>
          <div className="w-20 h-0.5 bg-gold mx-auto mt-3" />
          <p className="text-gray-500 mt-4 text-sm sm:text-base max-w-xl mx-auto">
            Three pillars that define every product from our kitchen
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} hover className="p-6 text-center">
              <span className="text-4xl block mb-4">{feature.icon}</span>
              <h3 className="font-display text-xl font-bold text-maroon mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
