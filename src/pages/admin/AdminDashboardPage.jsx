import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { BUSINESS } from '../../config'
import DashboardStats from '../../components/admin/DashboardStats'
import ProductsManager from '../../components/admin/ProductsManager'
import InventoryManager from '../../components/admin/InventoryManager'
import OrdersManager from '../../components/admin/OrdersManager'

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'orders', label: 'Orders' },
  { id: 'products', label: 'Products' },
  { id: 'inventory', label: 'Inventory' },
]

export default function AdminDashboardPage() {
  const { user, signOut } = useAuth()
  const [tab, setTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <header className="border-b border-gold/30 bg-maroon text-cream">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div>
            <h1 className="font-heading text-lg font-bold">Admin Panel</h1>
            <p className="text-xs text-cream/70">{BUSINESS.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-cream/80 hover:text-gold-light">
              View site ↗
            </Link>
            <span className="hidden text-xs text-cream/60 sm:inline">
              {user?.email}
            </span>
            <button
              onClick={signOut}
              className="rounded-full bg-cream/15 px-3 py-1.5 text-sm hover:bg-cream/25"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="border-b border-gold/30 bg-cream-dark">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${
                tab === t.id
                  ? 'border-maroon text-maroon'
                  : 'border-transparent text-forest hover:text-maroon'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === 'dashboard' && <DashboardStats />}
        {tab === 'orders' && <OrdersManager />}
        {tab === 'products' && <ProductsManager />}
        {tab === 'inventory' && <InventoryManager />}
      </main>
    </div>
  )
}
