import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/format'
import { CATEGORY_EMOJI } from '../lib/sampleProducts'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const [justAdded, setJustAdded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1200)
  }

  const emoji = product.emoji || CATEGORY_EMOJI[product.category] || '🍬'

  return (
    <div className="card flex flex-col overflow-hidden transition hover:shadow-card-hover">
      {/* Image placeholder — replace with a real photo later */}
      <div className="flex h-32 items-center justify-center bg-gradient-to-br from-cream to-cream-dark text-5xl sm:h-36">
        {emoji}
      </div>

      <div className="flex flex-1 flex-col gap-1 border-t-2 border-gold/40 p-4">
        <h3 className="font-heading text-base font-semibold text-maroon">
          {product.name}
        </h3>
        <p className="text-xs text-forest/70">{product.size}</p>
        <p className="mt-1 text-lg font-semibold text-forest">
          {formatPrice(product.price)}
        </p>

        <button
          onClick={handleAdd}
          disabled={!product.is_available}
          className={`mt-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition ${
            justAdded
              ? 'bg-forest text-cream'
              : 'bg-maroon text-cream hover:bg-maroon-dark'
          } disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500`}
        >
          {!product.is_available
            ? 'Currently Unavailable'
            : justAdded
              ? '✓ Added!'
              : '+ Add to Order'}
        </button>
      </div>
    </div>
  )
}
