import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/inventory', label: 'Inventory' },
]

export default function AdminLayout() {
  const { signOut, session } = useAuth()

  return (
    <div className="min-h-screen bg-cream-dark/40">
      <header className="sticky top-0 z-30 bg-maroon text-cream shadow-soft">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-maroon-dark font-display text-base">
              R
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight">Admin Panel</p>
              <p className="text-[11px] text-cream/70 leading-tight">Ranganayaki Godavari Ruchulu</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-cream/70 truncate max-w-[160px]">
              {session?.user?.email}
            </span>
            <button
              onClick={signOut}
              className="rounded-full border border-cream/40 px-3 py-1.5 text-xs font-semibold hover:bg-cream/10"
            >
              Sign Out
            </button>
          </div>
        </div>
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto pb-2">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                  isActive ? 'bg-gold text-maroon-dark' : 'text-cream/80 hover:bg-cream/10'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>
    </div>
  )
}
