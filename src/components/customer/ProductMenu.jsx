import { useEffect, useState } from 'react'
import { fetchProducts } from '../../lib/api'
import ProductCard from './ProductCard'
import SectionHeading from '../shared/SectionHeading'
import LoadingSpinner from '../shared/LoadingSpinner'

export default function ProductMenu() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    fetchProducts({ availableOnly: true })
      .then((data) => {
        if (active) setProducts(data)
      })
      .catch((err) => {
        if (active) setError(err.message || 'Could not load products')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <section id="menu" className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Our Menu"
          title="Godavari Sweets & Snacks"
          subtitle="Choose your favourites and add them to your pre-order. Prices shown in ₹."
        />

        {loading && <LoadingSpinner label="Loading menu..." />}
        {error && (
          <p className="rounded-md border border-maroon/20 bg-maroon/5 px-4 py-3 text-center text-sm text-maroon">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
