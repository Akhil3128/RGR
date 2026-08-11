import { useEffect, useMemo, useState } from 'react'
import { fetchProducts } from '../services/products'
import ProductCard from './ProductCard'

const CATEGORY_ORDER = [
  'All',
  'Sweets',
  'Putharekulu',
  'Savories',
  'Dairy',
  'Ghee',
]

function sortCategories(categories) {
  return [...categories].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a)
    const bi = CATEGORY_ORDER.indexOf(b)
    if (ai === -1 && bi === -1) return a.localeCompare(b)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })
}

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
    const set = new Set(
      products
        .map((p) => p.storefrontCategory || p.category)
        .filter(Boolean),
    )
    return sortCategories(['All', ...Array.from(set)])
  }, [products])

  const visible = useMemo(() => {
    if (activeCategory === 'All') return products
    return products.filter(
      (p) => (p.storefrontCategory || p.category) === activeCategory,
    )
  }, [products, activeCategory])

  return (
    <section id="menu" className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-maroon sm:text-4xl">
            Our Traditional Favorites
          </h2>
          <div className="divider" />
          <p className="mt-4 text-base leading-relaxed text-ink/60 sm:text-lg">
            Authentic flavors made with care and tradition.
            <br className="hidden sm:block" />
            Choose your favorite and select the perfect size.
          </p>
        </div>

        {usingSample && (
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-center text-sm text-maroon">
            Showing sample products. Connect Supabase (see{' '}
            <code className="rounded bg-cream px-1">README.md</code>) to manage
            the live menu from the admin panel.
          </div>
        )}

        {categories.length > 1 && (
          <div className="mt-10 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div
              className="flex gap-2 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap sm:justify-center sm:overflow-visible"
              role="tablist"
              aria-label="Product categories"
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-maroon text-cream shadow-soft'
                        : 'border border-gold/30 bg-white/80 text-maroon hover:border-gold/50 hover:bg-cream-dark'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {loading ? (
          <p className="mt-14 text-center text-forest">Loading menu…</p>
        ) : visible.length === 0 ? (
          <p className="mt-14 text-center text-forest">
            No products available right now. Please check back soon.
          </p>
        ) : (
          <div className="mt-10 grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
            {visible.map((p) => (
              <ProductCard key={p.id || p.name} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
