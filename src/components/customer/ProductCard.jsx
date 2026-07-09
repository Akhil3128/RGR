import { formatPrice, productLabel } from '../../lib/utils'
import { useCart } from '../../context/CartContext'

function ProductImage({ name }) {
  return (
    <div className="flex h-36 items-center justify-center rounded-t-xl bg-gradient-to-br from-cream-dark via-cream to-gold/20">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-gold/50 bg-cream-light/80">
        <span className="px-2 text-center font-display text-sm leading-tight text-maroon/70">
          {name.split(' ')[0]}
        </span>
      </div>
    </div>
  )
}

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const priceLabel =
    Number(product.price) > 0 ? formatPrice(product.price) : 'Price on request'

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gold/35 bg-cream-light shadow-[0_6px_20px_rgba(74,18,28,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(74,18,28,0.1)]">
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={productLabel(product)}
          className="h-36 w-full object-cover"
        />
      ) : (
        <ProductImage name={product.name} />
      )}

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-xl text-maroon">{product.name}</h3>
        <p className="mt-1 text-sm text-green/75">{product.size || '—'}</p>
        <p className="mt-3 text-lg font-semibold text-maroon-dark">{priceLabel}</p>

        <button
          type="button"
          onClick={() => addItem(product)}
          disabled={!product.is_available}
          className="mt-auto pt-4"
        >
          <span
            className={`inline-flex w-full items-center justify-center rounded-md px-3 py-2.5 text-sm font-semibold shadow-sm ${
              product.is_available
                ? 'bg-maroon text-cream hover:bg-maroon-light'
                : 'cursor-not-allowed bg-cream-dark text-maroon/40'
            }`}
          >
            {product.is_available ? 'Add to Order' : 'Unavailable'}
          </span>
        </button>
      </div>
    </article>
  )
}
