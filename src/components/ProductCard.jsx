import { formatCurrency } from '../utils/order'

export default function ProductCard({ product, onAdd }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gold/25 bg-white shadow-soft">
      <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-sandal via-cream to-white">
        <div className="absolute left-4 top-4 rounded-full bg-maroon px-3 py-1 text-xs font-semibold text-white">
          Pre-order
        </div>
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-gold/30 bg-white font-display text-3xl font-bold text-maroon shadow-inner">
          RGR
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">{product.size}</p>
        <h3 className="mt-2 font-display text-2xl font-bold text-maroon-dark">{product.name}</h3>
        <p className="mt-2 text-lg font-bold text-godavari">{formatCurrency(product.price)}</p>
        <button
          type="button"
          disabled={!product.available}
          onClick={() => onAdd(product)}
          className="mt-5 rounded-full bg-maroon px-5 py-3 text-sm font-bold text-white transition hover:bg-maroon-dark disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {product.available ? 'Add to Order' : 'Unavailable'}
        </button>
      </div>
    </article>
  )
}
