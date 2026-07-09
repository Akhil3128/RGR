import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { BUSINESS_NAME, DISPLAY_PHONE } from '../../data/sampleProducts'
import { openWhatsAppChat } from '../../lib/utils'

export default function Header() {
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 border-b border-gold/30 bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="min-w-0">
          <p className="font-display text-lg leading-tight text-maroon md:text-xl">
            {BUSINESS_NAME}
          </p>
          <p className="truncate text-xs text-green/80">Vizag · Pre-orders only</p>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium text-maroon md:flex">
          <a href="#story" className="hover:text-gold-dark">
            Our Story
          </a>
          <a href="#menu" className="hover:text-gold-dark">
            Menu
          </a>
          <a href="#order" className="hover:text-gold-dark">
            Order
          </a>
          <a href={`tel:${DISPLAY_PHONE.replace(/\s/g, '')}`} className="hover:text-gold-dark">
            {DISPLAY_PHONE}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openWhatsAppChat()}
            className="hidden rounded-md bg-green px-3 py-2 text-xs font-semibold text-cream shadow-sm hover:bg-green-light sm:inline-flex"
          >
            WhatsApp
          </button>
          <a
            href="#order"
            className="relative inline-flex items-center gap-1 rounded-md bg-maroon px-3 py-2 text-xs font-semibold text-cream shadow-sm hover:bg-maroon-light"
          >
            Cart
            {itemCount > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-maroon-dark">
                {itemCount}
              </span>
            )}
          </a>
        </div>
      </div>
    </header>
  )
}
