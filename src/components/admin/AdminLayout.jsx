import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { BUSINESS_NAME } from '../../data/sampleProducts'
import ConfigBanner from '../shared/ConfigBanner'

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/inventory', label: 'Inventory' },
  { to: '/admin/orders', label: 'Orders' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen pattern-bg">
      <ConfigBanner />
      <header className="border-b border-gold/30 bg-maroon text-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="font-display text-xl text-gold-light">{BUSINESS_NAME}</p>
            <p className="text-xs text-cream/70">Admin Panel · {user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <NavLink
              to="/"
              className="rounded-md border border-cream/30 px-3 py-1.5 text-xs hover:bg-cream/10"
            >
              View Website
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-gold px-3 py-1.5 text-xs font-semibold text-maroon-dark hover:bg-gold-light"
            >
              Logout
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-gold text-maroon-dark'
                    : 'text-cream/85 hover:bg-cream/10'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
