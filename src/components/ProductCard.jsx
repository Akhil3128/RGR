import { useCart } from '../context/CartContext'
import { formatINR } from '../utils/format'
import { MinusIcon, PlusIcon } from './icons'

export default function ProductCard({ product }) {
  const { addItem, items, increment, decrement } = useCart()
  const inCart = items.find((it) => it.id === product.id)
  const available = product.is_available

  return (
    <div className="card flex flex-col p-3 transition hover:shadow-lg sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-base font-bold leading-tight text-maroon sm:text-lg">
            {product.name}
          </h3>
          {product.size && (
            <p className="mt-0.5 text-xs text-forest sm:text-sm">{product.size}</p>
          )}
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold sm:text-xs ${
            available
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {available ? 'Available' : 'Unavailable'}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-gold/20 pt-3">
        <span className="text-base font-bold text-forest-dark sm:text-lg">
          {formatINR(product.price)}
        </span>

        {inCart ? (
          <div className="flex items-center gap-0.5 rounded-full border border-gold/40 bg-cream/50">
            <button
              type="button"
              onClick={() => decrement(product.id)}
              className="rounded-full p-1.5 text-maroon hover:bg-cream-dark"
              aria-label="Decrease quantity"
            >
              <MinusIcon />
            </button>
            <span className="w-6 text-center text-sm font-semibold text-maroon">
              {inCart.quantity}
            </span>
            <button
              type="button"
              onClick={() => increment(product.id)}
              disabled={!available}
              className="rounded-full p-1.5 text-maroon hover:bg-cream-dark disabled:opacity-40"
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
