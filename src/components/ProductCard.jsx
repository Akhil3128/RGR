import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/format'

const CATEGORY_ICONS = {
  Sweets: '🍬',
  Snacks: '🥨',
  'Dairy & Ghee': '🧈',
}

export default function ProductCard({ product }) {
  const { items, addItem, increment, decrement } = useCart()
  const cartItem = items.find((item) => item.productId === product.id)
  const hasPrice = product.price !== null && product.price !== undefined && product.price !== ''
  const isAvailable = product.is_available !== false

  return (
    <div className="flex flex-col rounded-2xl bg-cream-light border border-maroon/15 shadow-card overflow-hidden">
      <div className="h-28 sm:h-32 bg-gradient-to-br from-gold-light/40 via-cream to-forest/10 flex items-center justify-center border-b border-gold/30">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-4xl" role="img" aria-label={product.category}>
            {CATEGORY_ICONS[product.category] || '🍽️'}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base text-maroon leading-snug">{product.name}</h3>
        <p className="text-xs text-forest-dark/70 font-medium mt-0.5">{product.size}</p>

        <div className="mt-2 flex items-center justify-between">
          <span className={`font-bold ${hasPrice ? 'text-forest-dark' : 'text-gold-dark text-sm'}`}>
            {formatCurrency(product.price)}
          </span>
          {!isAvailable && (
            <span className="text-[11px] font-semibold text-maroon bg-maroon/10 rounded-full px-2 py-0.5">
              Sold Out
            </span>
          )}
        </div>

        <div className="mt-3">
          {!isAvailable ? (
            <button
              disabled
              className="w-full rounded-lg bg-forest-dark/10 text-forest-dark/40 font-semibold py-2 text-sm cursor-not-allowed"
            >
              Currently Unavailable
            </button>
          ) : cartItem ? (
            <div className="flex items-center justify-between rounded-lg border border-forest/30 bg-forest/5 px-2 py-1">
              <button
                onClick={() => decrement(product.id)}
                className="h-7 w-7 rounded-md bg-forest text-cream font-bold leading-none hover:bg-forest-dark"
                aria-label={`Decrease ${product.name}`}
              >
                −
              </button>
              <span className="text-sm font-bold text-forest-dark">{cartItem.quantity}</span>
              <button
                onClick={() => increment(product.id)}
                className="h-7 w-7 rounded-md bg-forest text-cream font-bold leading-none hover:bg-forest-dark"
                aria-label={`Increase ${product.name}`}
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => addItem(product, 1)}
              className="w-full rounded-lg bg-maroon text-cream font-semibold py-2 text-sm shadow-soft hover:bg-maroon-dark transition-colors"
            >
              Add to Order
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
