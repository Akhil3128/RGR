import { useCart } from '../context/CartContext'
import { formatINR } from '../utils/format'
import { MinusIcon, PlusIcon } from './icons'

export default function ProductCard({ product }) {
  const { addItem, items, increment, decrement } = useCart()
  const inCart = items.find((it) => it.id === product.id)
  const available = product.is_available

  return (
    <div className="card-premium group flex flex-col p-3.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-glow sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-base font-bold leading-snug text-maroon sm:text-lg">
            {product.name}
          </h3>
          {product.size && (
            <p className="mt-0.5 text-xs text-forest/80 sm:text-sm">
              {product.size}
            </p>
          )}
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold sm:text-xs ${
            available
              ? 'bg-forest/10 text-forest'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {available ? 'Available' : 'Out of stock'}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-gold/15 pt-3">
        <span className="font-heading text-lg font-bold text-ink">
          {formatINR(product.price)}
        </span>

        {inCart ? (
          <div className="flex items-center gap-0.5 rounded-2xl border border-gold/25 bg-cream-dark/50 p-0.5">
            <button
              type="button"
              onClick={() => decrement(product.id)}
              className="rounded-xl p-1.5 text-maroon transition hover:bg-white"
              aria-label="Decrease quantity"
            >
              <MinusIcon />
            </button>
            <span className="w-7 text-center text-sm font-bold text-maroon">
              {inCart.quantity}
            </span>
            <button
              type="button"
              onClick={() => increment(product.id)}
              disabled={!available}
              className="rounded-xl p-1.5 text-maroon transition hover:bg-white disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <PlusIcon />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => addItem(product)}
            disabled={!available}
            className="btn-primary px-3 py-1.5 text-xs sm:text-sm"
          >
            <PlusIcon />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  )
}
