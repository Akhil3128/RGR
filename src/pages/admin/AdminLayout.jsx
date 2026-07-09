import { useEffect, useState } from 'react'
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { BUSINESS } from '../../lib/business'

const NAV_LINKS = [
  { to: '/admin', label: '📊 Dashboard', end: true },
  { to: '/admin/products', label: '🍬 Products' },
  { to: '/admin/inventory', label: '📦 Inventory' },
  { to: '/admin/orders', label: '🧾 Orders' },
]

// Wraps every admin page: checks the Supabase session and
// redirects to the login page when the admin is not signed in.
export default function AdminLayout() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setChecking(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => setSession(newSession)
    )
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-forest/70">Checking login…</p>
      </div>
    )
  }

  if (!isSupabaseConfigured || !session) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b-2 border-gold bg-maroon text-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪔</span>
            <div>
              <p className="font-heading text-sm font-semibold sm:text-base">
                {BUSINESS.name}
              </p>
              <p className="text-[11px] text-gold-light">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-gold px-3 py-1.5 text-sm transition hover:bg-maroon-dark"
          >
            Logout
          </button>
        </div>

        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-t-lg px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-cream text-maroon'
                    : 'text-cream/80 hover:bg-maroon-dark hover:text-cream'
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
