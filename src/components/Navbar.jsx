import { BUSINESS } from '../config'
import { useCart } from '../context/CartContext'
import { CartIcon } from './icons'

export default function Navbar({ onCartClick }) {
  const { count } = useCart()

  return (
    <header className="sticky top-0 z-30 border-b border-gold/30 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <a href="#home" className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-maroon text-lg font-bold text-gold shadow-soft">
            RG
          </span>
          <span className="leading-tight">
            <span className="block font-heading text-base font-bold text-maroon sm:text-lg">
              {BUSINESS.name}
            </span>
            <span className="block text-[11px] font-medium uppercase tracking-wide text-forest sm:text-xs">
              {BUSINESS.tagline}
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 text-sm font-medium text-forest-dark md:flex">
          <a href="#menu" className="hover:text-maroon">Menu</a>
          <a href="#story" className="hover:text-maroon">Our Story</a>
          <a href="#quality" className="hover:text-maroon">Quality</a>
          <a href="#contact" className="hover:text-maroon">Contact</a>
        </nav>

        <button
          onClick={onCartClick}
          className="relative flex items-center gap-2 rounded-full bg-maroon px-4 py-2 text-cream shadow-soft transition hover:bg-maroon-light"
          aria-label="Open cart"
        >
          <CartIcon className="h-5 w-5" />
          <span className="hidden text-sm font-medium sm:inline">Cart</span>
          {count > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-xs font-bold text-maroon-dark">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
