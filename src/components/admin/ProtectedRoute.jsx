import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { isSupabaseConfigured } from '../../lib/supabaseClient'

export default function ProtectedRoute({ children }) {
  const { session, isAdmin, loading } = useAuth()

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <div className="max-w-md rounded-2xl border border-gold/40 bg-white p-6 text-center shadow-card">
          <h1 className="font-display text-xl text-maroon mb-2">Supabase Not Configured</h1>
          <p className="text-sm text-forest-dark/80">
            The admin panel needs Supabase to work. Please copy <code>.env.example</code> to <code>.env</code>,
            add your Supabase project URL and anon key, then restart the dev server. See the README for full setup
            steps.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-cream text-forest-dark">Loading...</div>
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <div className="max-w-md rounded-2xl border border-maroon/30 bg-white p-6 text-center shadow-card">
          <h1 className="font-display text-xl text-maroon mb-2">Access Denied</h1>
          <p className="text-sm text-forest-dark/80">
            Your account is not registered as an admin. Ask the site owner to add your user id to the
            <code> admin_users</code> table in Supabase.
          </p>
        </div>
      </div>
    )
  }

  return children
}
