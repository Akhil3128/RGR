import Button from '../ui/Button'
import Card from '../ui/Card'
import { useCart } from '../../context/CartContext'
import { formatCurrency } from '../../utils/formatters'

export default function Cart() {
  const { items, total, dispatch } = useCart()

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <span className="text-4xl block mb-3">🛒</span>
        <p className="text-gray-500 text-sm">Your cart is empty. Add items from the menu above!</p>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="bg-maroon/5 px-4 py-3 border-b border-gold/20">
        <h3 className="font-display text-lg font-bold text-maroon">
          Order Summary ({items.length} item{items.length !== 1 ? 's' : ''})
        </h3>
      </div>

      <div className="divide-y divide-gold/10">
        {items.map((item) => (
          <div key={item.id} className="px-4 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-maroon-dark truncate">
                {item.name}
              </p>
              <p className="text-xs text-gray-500">{item.size}</p>
              <p className="text-sm font-semibold text-forest mt-0.5">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  dispatch({
                    type: 'UPDATE_QUANTITY',
                    payload: { id: item.id, quantity: item.quantity - 1 },
                  })
                }
                className="w-8 h-8 rounded-lg border border-gold/30 flex items-center justify-center text-maroon hover:bg-maroon/5"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
              <button
                onClick={() =>
                  dispatch({
                    type: 'UPDATE_QUANTITY',
                    payload: { id: item.id, quantity: item.quantity + 1 },
                  })
                }
                className="w-8 h-8 rounded-lg border border-gold/30 flex items-center justify-center text-maroon hover:bg-maroon/5"
              >
                +
              </button>
              <button
                onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                className="w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center text-sm"
                title="Remove"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-4 bg-forest/5 border-t border-gold/20 flex items-center justify-between">
        <span className="font-display text-lg font-bold text-maroon">Total</span>
        <span className="text-xl font-bold text-forest">{formatCurrency(total)}</span>
      </div>
    </Card>
  )
}
