import { useEffect, useMemo, useState } from 'react'
import { useCart } from '../context/CartContext'
import { formatINR } from '../utils/format'
import { variantOptionLabel } from '../utils/groupProducts'
import { MinusIcon, PlusIcon } from './icons'

function pickDefaultVariant(variants) {
  if (!variants?.length) return null
  return variants.find((v) => v.is_available) || variants[0]
}

export default function ProductCard({ product }) {
  const { addItem, items, increment, decrement } = useCart()
  const variants = useMemo(() => product.variants || [], [product.variants])
  const hasMultiple = variants.length > 1

  const [selectedId, setSelectedId] = useState(
    () => pickDefaultVariant(variants)?.id || '',
  )

  // Keep selection valid if product/variants change (e.g. after refetch).
  useEffect(() => {
    if (!variants.length) {
      setSelectedId('')
      return
    }
    if (!variants.some((v) => v.id === selectedId)) {
      setSelectedId(pickDefaultVariant(variants)?.id || variants[0].id)
    }
  }, [variants, selectedId])

  const selected = variants.find((v) => v.id === selectedId) || variants[0]
  const available =
    Boolean(product.available) && Boolean(selected?.is_available)
  const inCart = selected ? items.find((it) => it.id === selected.id) : null

  function handleAdd() {
    if (!selected || !available) return
    addItem({
      id: selected.id,
      name: product.name,
      size: selected.size,
      price: selected.price,
    })
  }

  if (!selected) return null

  return (
    <div className="card-premium group flex h-full flex-col p-3.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-glow sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-base font-bold leading-snug text-maroon sm:text-lg">
            {product.name}
          </h3>
          {!hasMultiple && selected.size && (
            <p className="mt-0.5 text-xs text-forest/80 sm:text-sm">
              {selected.size}
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

      {hasMultiple && (
        <div className="mt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-maroon/70">
            Available Sizes
          </p>
          <ul className="mt-1.5 space-y-0.5">
            {variants.map((variant) => (
              <li
                key={variant.id}
                className={`flex items-center justify-between gap-2 text-xs sm:text-sm ${
                  variant.id === selected.id
                    ? 'font-medium text-maroon'
                    : 'text-ink/70'
                } ${!variant.is_available ? 'opacity-45 line-through' : ''}`}
              >
                <span>{variant.size || 'Standard'}</span>
                <span>{formatINR(variant.price)}</span>
              </li>
            ))}
          </ul>

          <label className="label mt-3 mb-1 text-xs" htmlFor={`weight-${product.id}`}>
            Choose Weight
          </label>
          <select
            id={`weight-${product.id}`}
            className="input py-2 text-sm"
            value={selected.id}
            onChange={(e) => setSelectedId(e.target.value)}
            aria-label={`Choose weight for ${product.name}`}
          >
            {variants.map((variant) => (
              <option
                key={variant.id}
                value={variant.id}
                disabled={!variant.is_available}
              >
                {variantOptionLabel(variant)}
                {!variant.is_available ? ' (Out of stock)' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-gold/15 pt-3 mt-3">
        <span className="font-heading text-lg font-bold text-ink">
          {formatINR(selected.price)}
        </span>

        {inCart ? (
          <div className="flex items-center gap-0.5 rounded-2xl border border-gold/25 bg-cream-dark/50 p-0.5">
            <button
              type="button"
              onClick={() => decrement(selected.id)}
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
              onClick={() => increment(selected.id)}
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
            onClick={handleAdd}
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
