import { useState } from 'react'
import { useCart } from '../context/CartContext'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Our Story', href: '#story' },
  { label: 'Menu', href: '#menu' },
  { label: 'Quality', href: '#quality' },
  { label: 'Contact', href: '#footer' },
]

export default function Navbar({ onCartClick }) {
  const [open, setOpen] = useState(false)
  const { totalItems } = useCart()

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b-2 border-gold/40 shadow-soft">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <a href="#home" className="flex items-center gap-2 min-w-0">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-maroon text-gold font-display text-lg border-2 border-gold">
              R
            </span>
            <span className="min-w-0">
              <span className="block font-display text-maroon text-base sm:text-lg leading-tight truncate">
                Ranganayaki Godavari Ruchulu
              </span>
              <span className="block text-[11px] sm:text-xs text-forest font-medium tracking-wide">
                Traditional Taste, Pure Love
              </span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-forest-dark hover:text-maroon transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={onCartClick}
              className="relative flex items-center gap-1.5 rounded-full bg-maroon text-cream px-3.5 py-2 text-sm font-semibold shadow-soft hover:bg-maroon-dark transition-colors"
              aria-label="Open cart"
            >
              <CartIcon />
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold text-maroon-dark text-[11px] font-bold px-1 border border-cream">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              className="md:hidden rounded-md p-2 text-forest-dark hover:bg-forest/10"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        {open && (
          <nav className="md:hidden flex flex-col gap-1 pb-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-forest-dark hover:bg-forest/10"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13 5.4 5M7 13l-1.5 3H18M9 21a1 1 0 100-2 1 1 0 000 2zM17 21a1 1 0 100-2 1 1 0 000 2z"
      />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}
