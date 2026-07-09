import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { BUSINESS_NAME } from '../../lib/constants'

export default function Header() {
  const { itemCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#story', label: 'Our Story' },
    { href: '#menu', label: 'Menu' },
    { href: '#order', label: 'Order' },
    { href: '#quality', label: 'Quality' },
  ]

  const scrollTo = (href) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-gold/30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); scrollTo('#home') }}
          className="flex items-center gap-2"
        >
          <span className="text-2xl">🪷</span>
          <div>
            <h1 className="font-display text-lg sm:text-xl font-bold text-maroon leading-tight">
              {BUSINESS_NAME}
            </h1>
            <p className="text-[10px] sm:text-xs text-forest tracking-wide hidden sm:block">
              Traditional Taste, Pure Love
            </p>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href) }}
              className="text-sm font-medium text-maroon-dark hover:text-maroon transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#order"
            onClick={(e) => { e.preventDefault(); scrollTo('#order') }}
            className="relative bg-maroon text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-maroon-dark transition-colors"
          >
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-maroon-dark text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </a>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <a
            href="#order"
            onClick={(e) => { e.preventDefault(); scrollTo('#order') }}
            className="relative bg-maroon text-white px-3 py-1.5 rounded-lg text-sm"
          >
            🛒
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-maroon-dark text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </a>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-maroon"
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-gold/20 bg-cream px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href) }}
              className="block py-2 text-sm font-medium text-maroon-dark"
            >
              {link.label}
            </a>
          ))}
          <Link to="/admin" className="block py-2 text-sm text-forest">
            Admin Login
          </Link>
        </nav>
      )}
    </header>
  )
}
