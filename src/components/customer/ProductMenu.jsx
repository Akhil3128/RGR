import ProductCard from './ProductCard'

export default function ProductMenu({ products, loading }) {
  const categories = [...new Set(products.map((p) => p.category))]

  if (loading) {
    return (
      <section id="menu" className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-500">Loading menu...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="menu" className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-maroon">
            Our Menu
          </h2>
          <div className="w-20 h-0.5 bg-gold mx-auto mt-3" />
          <p className="text-gray-500 mt-4 text-sm sm:text-base">
            Authentic Godavari sweets & snacks — tap "Add to Order" to build your cart
          </p>
        </div>

        {categories.map((category) => {
          const categoryProducts = products.filter((p) => p.category === category)
          return (
            <div key={category} className="mb-12">
              <h3 className="font-display text-2xl font-bold text-forest mb-6 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-gold" />
                {category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
