import { formatCurrency, getCartTotal } from '../utils/order'

export default function CartSummary({ cartItems, onIncrease, onDecrease, onRemove }) {
  return (
    <section className="rounded-3xl border border-gold/25 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Order Summary</p>
          <h2 className="font-display text-3xl font-bold text-maroon-dark">Your Cart</h2>
        </div>
        <span className="rounded-full bg-godavari px-4 py-2 text-sm font-bold text-white">
          {cartItems.length} item{cartItems.length === 1 ? '' : 's'}
        </span>
      </div>

      {cartItems.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-cream p-4 text-sm text-maroon-dark">
          Add sweets or snacks from the menu to start your WhatsApp pre-order.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="rounded-2xl border border-sandal bg-cream/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-maroon-dark">{item.name}</h3>
                  <p className="text-sm text-godavari">{item.size}</p>
                  <p className="mt-1 text-sm font-semibold text-maroon">
                    {item.price ? formatCurrency(Number(item.price) * item.quantity) : 'Price to confirm'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="text-sm font-semibold text-maroon underline"
                >
                  Remove
                </button>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onDecrease(item.id)}
                  className="h-9 w-9 rounded-full border border-gold bg-white font-bold text-maroon"
                >
                  -
                </button>
                <span className="min-w-8 text-center font-bold">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => onIncrease(item.id)}
                  className="h-9 w-9 rounded-full border border-gold bg-white font-bold text-maroon"
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-gold/25 pt-4 text-lg font-bold text-maroon-dark">
            <span>Total</span>
            <span>{formatCurrency(getCartTotal(cartItems))}</span>
          </div>
        </div>
      )}
    </section>
  )
}
