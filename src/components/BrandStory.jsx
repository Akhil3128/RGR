export default function BrandStory() {
  return (
    <section id="story" className="bg-cream py-14 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Our Story</p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl text-maroon">From Rajahmundry to Vizag</h2>
            <p className="mt-4 text-sm sm:text-base text-forest-dark/90 leading-relaxed">
              Ranganayaki Godavari Ruchulu began in a small home kitchen in Rajahmundry, where recipes were passed
              down through generations — rich Kova, delicate Sunnundalu, and paper-thin Putharekulu made the
              traditional Godavari way.
            </p>
            <p className="mt-3 text-sm sm:text-base text-forest-dark/90 leading-relaxed">
              Today, we bring that same authentic taste to Vizag — made fresh in small batches, with pure ghee,
              quality ingredients, and the same love that has always gone into every sweet from our home to yours.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {['100% Homemade', 'Traditional Recipes', 'Pure Ghee & Ingredients'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-maroon/30 bg-maroon/5 text-maroon-dark text-xs sm:text-sm font-semibold px-3 py-1.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark flex items-center justify-center shadow-card border-4 border-maroon/20">
              <div className="h-[85%] w-[85%] rounded-full bg-cream flex items-center justify-center border-2 border-dashed border-maroon/30">
                <span className="text-6xl sm:text-7xl" role="img" aria-label="Sweets">
                  🍯
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
