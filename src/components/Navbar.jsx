import { BUSINESS } from '../config'
import { useCart } from '../context/CartContext'
import { CartIcon } from './icons'

export default function Navbar({ onCartClick }) {
  const { count } = useCart()

  return (
    <header className="sticky top-0 z-30 border-b border-gold/15 bg-cream/90 shadow-soft backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <a href="#home" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-maroon to-maroon-dark text-sm font-bold text-gold shadow-soft transition group-hover:shadow-card sm:h-11 sm:w-11 sm:text-base">
            RG
          </span>
          <span className="leading-tight">
            <span className="block font-heading text-sm font-bold text-maroon sm:text-base">
              {BUSINESS.name}
            </span>
            <span className="block text-[10px] font-medium tracking-wide text-forest sm:text-xs">
              {BUSINESS.tagline}
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 text-sm font-medium text-ink/70 md:flex">
          <a href="#menu" className="transition hover:text-maroon">Menu</a>
          <a href="#story" className="transition hover:text-maroon">Our Story</a>
          <a href="#quality" className="transition hover:text-maroon">Quality</a>
          <a href="#contact" className="transition hover:text-maroon">Contact</a>
        </nav>

        <button
          onClick={onCartClick}
          className="relative flex items-center gap-2 rounded-2xl bg-maroon px-4 py-2 text-cream shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
          aria-label="Open cart"
        >
          <CartIcon className="h-5 w-5" />
          <span className="hidden text-sm font-medium sm:inline">Cart</span>
          {count > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-xs font-bold text-ink">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
