import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/format'

export default function StickyCartBar({ onViewCart }) {
  const { totalItems, totalAmount } = useCart()

  if (totalItems === 0) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-maroon text-cream border-t-2 border-gold shadow-2xl">
      <button onClick={onViewCart} className="w-full flex items-center justify-between px-4 py-3">
        <span className="text-sm font-semibold">
          {totalItems} item{totalItems > 1 ? 's' : ''} &bull; {formatCurrency(totalAmount)}
        </span>
        <span className="rounded-full bg-gold text-maroon-dark text-xs font-bold px-4 py-2">View Cart</span>
      </button>
    </div>
  )
}
