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
  const imageSrc = product.image || product.image_url || ''

  const [selectedId, setSelectedId] = useState(
    () => pickDefaultVariant(variants)?.id || '',
  )
  const [justAdded, setJustAdded] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    setImageFailed(false)
  }, [imageSrc])

  useEffect(() => {
    if (!variants.length) {
      setSelectedId('')
      return
    }
    if (!variants.some((v) => v.id === selectedId)) {
      setSelectedId(pickDefaultVariant(variants)?.id || variants[0].id)
    }
  }, [variants, selectedId])

  useEffect(() => {
    if (!justAdded) return undefined
    const timer = window.setTimeout(() => setJustAdded(false), 1200)
    return () => window.clearTimeout(timer)
  }, [justAdded])

  const selected = variants.find((v) => v.id === selectedId) || variants[0]
  const available =
    Boolean(product.available) && Boolean(selected?.is_available)
  const inCart = selected ? items.find((it) => it.id === selected.id) : null
  const showImage = Boolean(imageSrc) && !imageFailed

  function handleAdd() {
    if (!selected || !available) return
    addItem({
      id: selected.id,
      name: product.name,
      size: selected.size,
      price: selected.price,
    })
    setJustAdded(true)
  }

  if (!selected) return null

  return (
    <article className="product-card group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-gold/20 bg-white shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-card">
      {showImage && (
        <div className="relative h-44 shrink-0 overflow-hidden sm:h-48 md:h-[200px]">
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-xl font-bold leading-snug text-maroon sm:text-[1.35rem]">
            {product.name}
          </h3>
          <span
            className={`mt-1 shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium tracking-wide ${
              available
                ? 'bg-forest/10 text-forest'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {available ? 'Available' : 'Out of stock'}
          </span>
        </div>

        {product.description ? (
          <p className="mt-1.5 line-clamp-1 text-sm text-ink/55">
            {product.description}
          </p>
        ) : (
          <div className="mt-1.5 h-5" aria-hidden="true" />
        )}

        {!hasMultiple && selected.size ? (
          <p className="mt-3 text-sm text-forest/75">{selected.size}</p>
        ) : (
          <div className="mt-3 h-5" aria-hidden="true" />
        )}

        <div className="mt-1 min-h-[4.5rem]">
          {hasMultiple && (
            <>
              <label
                className="mb-1.5 block text-xs font-medium text-maroon/80"
                htmlFor={`weight-${product.id}`}
              >
                Weight
              </label>
              <select
                id={`weight-${product.id}`}
                className="input h-11 min-h-[44px] w-full rounded-xl border-gold/25 bg-cream/40 py-0 text-sm leading-none transition duration-200 focus:bg-white"
                value={selected.id}
                onChange={(e) => setSelectedId(e.target.value)}
                aria-label={`Select weight for ${product.name}`}
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
            </>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-gold/15 pt-4">
          <span className="font-heading text-2xl font-bold tracking-tight text-maroon">
            {formatINR(selected.price)}
          </span>

          {justAdded ? (
            <button
              type="button"
              className="inline-flex h-11 min-w-[8.5rem] items-center justify-center rounded-2xl bg-forest px-4 text-sm font-medium text-cream transition-all duration-200"
              disabled
            >
              ✓ Added
            </button>
          ) : inCart ? (
            <div className="flex h-11 items-center gap-0.5 rounded-2xl border border-gold/25 bg-cream/60 p-0.5">
              <button
                type="button"
                onClick={() => decrement(selected.id)}
                className="rounded-xl p-2 text-maroon transition duration-200 hover:bg-white"
                aria-label="Decrease quantity"
              >
                <MinusIcon />
              </button>
              <span className="w-8 text-center text-sm font-bold text-maroon">
                {inCart.quantity}
              </span>
              <button
                type="button"
                onClick={() => increment(selected.id)}
                disabled={!available}
                className="rounded-xl p-2 text-maroon transition duration-200 hover:bg-white disabled:opacity-40"
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
              className="inline-flex h-11 min-w-[8.5rem] items-center justify-center gap-1.5 rounded-2xl bg-maroon px-4 text-sm font-medium text-cream shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-maroon-light hover:shadow-card active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <PlusIcon />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
