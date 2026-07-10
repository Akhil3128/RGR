import { useEffect, useMemo, useState } from 'react'
import { fetchProducts } from '../services/products'
import ProductCard from './ProductCard'

export default function ProductMenu() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingSample, setUsingSample] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    let active = true
    fetchProducts({ onlyAvailable: false }).then((res) => {
      if (!active) return
      setProducts(res.data)
      setUsingSample(res.usingSample)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [products])

  const visible = useMemo(() => {
    if (activeCategory === 'All') return products
    return products.filter((p) => p.category === activeCategory)
  }, [products, activeCategory])

  return (
    <section id="menu" className="bg-cream py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="section-title">Our Menu</h2>
          <div className="divider" />
          <p className="mx-auto mt-4 max-w-2xl text-ink/60">
            Choose your favourites, add to cart, and place your pre-order.
          </p>
        </div>

        {usingSample && (
          <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-gold/50 bg-gold/10 px-4 py-3 text-center text-sm text-maroon">
            Showing sample products. Connect Supabase (see{' '}
            <code className="rounded bg-cream px-1">README.md</code>) to manage
            the live menu from the admin panel.
          </div>
        )}

        {/* Category filter */}
        {categories.length > 1 && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  activeCategory === cat
                    ? 'bg-maroon text-cream shadow-soft'
                    : 'border border-gold/40 bg-white text-maroon hover:bg-cream-dark'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="mt-12 text-center text-forest">Loading menu…</p>
        ) : visible.length === 0 ? (
          <p className="mt-12 text-center text-forest">
            No products available right now. Please check back soon.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
