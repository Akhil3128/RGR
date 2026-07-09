import { useMemo } from 'react'
import { useProducts } from '../hooks/useProducts'
import { productCategories } from '../data/sampleProducts'
import ProductCard from './ProductCard'

export default function ProductMenu() {
  const { products, loading, usingSampleData } = useProducts({ onlyAvailable: false })

  const grouped = useMemo(() => {
    const categories = [...new Set(products.map((p) => p.category))].filter(Boolean)
    const orderedCategories = productCategories.filter((c) => categories.includes(c))
    const extraCategories = categories.filter((c) => !productCategories.includes(c))
    return [...orderedCategories, ...extraCategories].map((category) => ({
      category,
      items: products.filter((p) => p.category === category),
    }))
  }, [products])

  return (
    <section id="menu" className="bg-cream py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Our Menu</p>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl text-maroon">Pre-Order Your Favourites</h2>
          <p className="mt-2 text-sm text-forest-dark/70">
            Tap &ldquo;Add to Order&rdquo; to build your pre-order basket.
          </p>
        </div>

        {usingSampleData && (
          <div className="mx-auto mb-8 max-w-2xl rounded-xl border border-gold/50 bg-gold/10 px-4 py-3 text-center text-xs sm:text-sm text-maroon-dark">
          Showing sample menu items. Connect Supabase (see <code className="font-mono">.env</code>) to manage
          real products from the admin panel.
          </div>
        )}

        {loading ? (
          <p className="text-center text-forest-dark/60 py-10">Loading menu...</p>
        ) : (
          <div className="space-y-10">
            {grouped.map((group) => (
              <div key={group.category}>
                <h3 className="font-display text-lg sm:text-xl text-forest-dark mb-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  {group.category}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {group.items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
