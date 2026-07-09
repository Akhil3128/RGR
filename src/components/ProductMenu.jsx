import { useProducts } from '../hooks/useProducts'
import ProductCard from './ProductCard'

// Groups products by category so the menu reads like a sweet-shop board.
export default function ProductMenu() {
  const { products, loading } = useProducts()

  if (loading) {
    return (
      <section id="menu" className="bg-cream-dark py-14 text-center">
        <p className="text-forest/70">Loading our menu…</p>
      </section>
    )
  }

  const categories = [...new Set(products.map((p) => p.category))]

  return (
    <section id="menu" className="bg-cream-dark py-14">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center font-heading text-3xl font-bold text-maroon sm:text-4xl">
          Our Menu
        </h2>
        <div className="gold-divider">❖</div>
        <p className="mt-4 text-center text-sm text-forest/80">
          Add items to your order, then send it to us on WhatsApp. Pre-orders only!
        </p>

        {categories.map((category) => (
          <div key={category} className="mt-10">
            <h3 className="flex items-center gap-3 font-heading text-xl font-semibold text-forest">
              <span className="h-px flex-1 bg-gold/50" />
              {category}
              <span className="h-px flex-1 bg-gold/50" />
            </h3>
            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products
                .filter((p) => p.category === category)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
