import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'
import { BUSINESS_NAME } from '../../lib/constants'

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/admin/products', label: 'Products', icon: '🍬' },
  { path: '/admin/inventory', label: 'Inventory', icon: '📦' },
  { path: '/admin/orders', label: 'Orders', icon: '📋' },
]

export default function AdminLayout() {
  const { signOut } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-forest text-cream fixed h-full">
        <div className="p-6 border-b border-cream/10">
          <h1 className="font-display text-lg font-bold text-gold">{BUSINESS_NAME}</h1>
          <p className="text-xs text-cream/60 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === item.path
                  ? 'bg-maroon text-white'
                  : 'text-cream/80 hover:bg-cream/10'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-cream/10">
          <Button variant="ghost" size="sm" className="w-full text-cream/80" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-forest text-cream">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="font-display text-lg font-bold text-gold">Admin</h1>
          <Button variant="ghost" size="sm" className="text-cream/80" onClick={signOut}>
            Sign Out
          </Button>
        </div>
        <nav className="flex overflow-x-auto px-2 pb-2 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap ${
                location.pathname === item.path
                  ? 'bg-maroon text-white'
                  : 'text-cream/80 bg-cream/10'
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-20 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
