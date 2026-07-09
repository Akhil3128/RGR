export default function BrandStory() {
  return (
    <section id="story" className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-gold text-2xl">🪷</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-maroon mt-2">
            Our Story
          </h2>
          <div className="w-20 h-0.5 bg-gold mx-auto mt-3" />
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-maroon/20 via-gold/10 to-forest/20 flex items-center justify-center border-2 border-gold/30 card-shadow">
              <div className="text-center p-8">
                <span className="text-6xl block mb-4">🏡</span>
                <p className="font-display text-xl text-maroon font-semibold">
                  Rajahmundry → Vizag
                </p>
                <p className="text-sm text-gray-500 mt-2">Godavari traditions, Vizag homes</p>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 w-24 h-24 bg-gold/20 rounded-full blur-xl" />
          </div>

          <div className="space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
            <p>
              <strong className="text-maroon">Ranganayaki Godavari Ruchulu</strong> brings
              the authentic taste of Rajahmundry and the Godavari region to the homes of Vizag.
              Every sweet and snack is prepared using time-honoured recipes passed down through generations.
            </p>
            <p>
              From the delicate layers of Putharekulu to the rich sweetness of Kova,
              from crispy Jantikalu to pure homemade Ghee — each product reflects
              the warmth and love of a traditional Telugu kitchen.
            </p>
            <p>
              We believe in <em className="text-forest font-medium">"Traditional Taste, Pure Love"</em> —
              no shortcuts, no compromises. Every order is prepared fresh,
              hygienically, and with the care your family deserves.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: '🌾', label: 'Traditional Recipes' },
                { icon: '❤️', label: 'Homemade with Love' },
                { icon: '🏠', label: 'Vizag Delivery' },
              ].map((item) => (
                <div key={item.label} className="text-center p-3 bg-white rounded-xl border border-gold/20">
                  <span className="text-2xl block mb-1">{item.icon}</span>
                  <span className="text-xs font-medium text-maroon-dark">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
