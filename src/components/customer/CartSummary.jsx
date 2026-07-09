import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../lib/utils'

export default function CartSummary() {
  const { items, increaseQty, decreaseQty, removeItem, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gold/50 bg-cream-light p-6 text-center">
        <p className="font-display text-xl text-maroon">Your order is empty</p>
        <p className="mt-2 text-sm text-green/70">
          Add items from the menu above to start your pre-order.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gold/35 bg-cream-light p-4 shadow-sm md:p-5">
      <h3 className="font-display text-2xl text-maroon">Order Summary</h3>
      <div className="gold-divider my-3" />

      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-2 rounded-lg border border-cream-dark bg-cream px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="font-medium text-maroon">
                {item.name}
                {item.size ? ` · ${item.size}` : ''}
              </p>
              <p className="text-sm text-green/75">
                {formatPrice(item.price)} each · Line: {formatPrice(item.price * item.quantity)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => decreaseQty(item.id)}
                className="h-8 w-8 rounded-md border border-maroon/20 bg-cream-light text-maroon hover:bg-cream-dark"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
              <button
                type="button"
                onClick={() => increaseQty(item.id)}
                className="h-8 w-8 rounded-md border border-maroon/20 bg-cream-light text-maroon hover:bg-cream-dark"
                aria-label="Increase quantity"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="ml-1 rounded-md px-2 py-1 text-xs font-medium text-maroon/70 hover:bg-maroon/10 hover:text-maroon"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-gold/30 pt-4">
        <span className="text-sm font-medium text-green">Total Amount</span>
        <span className="font-display text-2xl text-maroon">{formatPrice(total)}</span>
      </div>
    </div>
  )
}
