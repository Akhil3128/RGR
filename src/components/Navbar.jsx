import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { BUSINESS } from '../lib/business'

export default function Navbar() {
  const { totalItems } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b-2 border-gold bg-maroon text-cream shadow-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gold bg-cream text-xl">
            🪔
          </span>
          <span>
            <span className="block font-heading text-base font-semibold leading-tight sm:text-lg">
              {BUSINESS.name}
            </span>
            <span className="block text-[11px] tracking-wide text-gold-light">
              {BUSINESS.tagline}
            </span>
          </span>
        </Link>

        <Link
          to="/order"
          className="relative flex items-center gap-2 rounded-lg border border-gold bg-maroon-dark px-3 py-2 text-sm font-medium transition hover:bg-maroon-light"
        >
          <span aria-hidden="true">🛒</span>
          <span className="hidden sm:inline">My Order</span>
          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-xs font-bold text-maroon-dark">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
