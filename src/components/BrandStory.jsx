export default function BrandStory() {
  return (
    <section className="bg-cream py-14">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="font-heading text-3xl font-bold text-maroon sm:text-4xl">
          From the Banks of Godavari
        </h2>
        <div className="gold-divider">❖</div>

        <p className="mt-6 text-sm leading-relaxed text-forest sm:text-base">
          Our story begins in <strong>Rajahmundry</strong>, on the banks of the
          holy Godavari — a land famous for its rich culinary heritage.
          The recipes we use have been passed down through generations in our
          family: slow-cooked <strong>Kova</strong>, hand-rolled{' '}
          <strong>Sunnundalu</strong> with pure ghee, and delicate paper-thin{' '}
          <strong>Putharekulu</strong> made the traditional way.
        </p>

        <p className="mt-4 text-sm leading-relaxed text-forest sm:text-base">
          Today, <strong>Ranganayaki Godavari Ruchulu</strong> brings these
          authentic Godavari flavours to <strong>Vizag</strong>. Every sweet is
          made at home, in small batches, only after you place your order —
          because true taste cannot sit on a shelf.
        </p>

        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-3 text-center">
          <div className="card p-4">
            <span className="text-2xl">👵</span>
            <p className="mt-2 text-xs font-medium text-maroon sm:text-sm">
              Family Recipes
            </p>
          </div>
          <div className="card p-4">
            <span className="text-2xl">🥣</span>
            <p className="mt-2 text-xs font-medium text-maroon sm:text-sm">
              Handmade in Small Batches
            </p>
          </div>
          <div className="card p-4">
            <span className="text-2xl">🌊</span>
            <p className="mt-2 text-xs font-medium text-maroon sm:text-sm">
              Godavari Tradition
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
