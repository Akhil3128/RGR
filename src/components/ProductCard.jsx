import { useCart } from '../context/CartContext'
import { formatINR } from '../utils/format'
import ProductImage from './ProductImage'
import { PlusIcon } from './icons'

export default function ProductCard({ product }) {
  const { addItem, items } = useCart()
  const inCart = items.find((it) => it.id === product.id)
  const available = product.is_available

  return (
    <div className="card flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden">
        <ProductImage product={product} />
        {!available && (
          <div className="absolute inset-0 flex items-center justify-center bg-maroon-dark/70">
            <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-maroon">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-lg font-bold leading-tight text-maroon">
          {product.name}
        </h3>
        <p className="mt-0.5 text-sm text-forest">{product.size}</p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-bold text-forest-dark">
            {formatINR(product.price)}
          </span>
          <button
            onClick={() => addItem(product)}
            disabled={!available}
            className="btn-primary px-3 py-2 text-sm"
          >
            <PlusIcon />
            {inCart ? `Added (${inCart.quantity})` : 'Add to Order'}
          </button>
        </div>
      </div>
    </div>
  )
}
