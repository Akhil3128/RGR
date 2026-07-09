import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-maroon">
        Loading…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <div className="card max-w-lg p-6">
          <h1 className="font-heading text-xl font-bold text-maroon">
            Admin access not set up
          </h1>
          <p className="mt-3 text-sm text-forest-dark">
            You are signed in as <strong>{user.email}</strong>, but this account
            is not in the <code className="rounded bg-cream-dark px-1">admin_users</code>{' '}
            table yet. Without that, orders and inventory will look empty.
          </p>

          <div className="mt-4 rounded-xl bg-cream-dark p-4 text-sm">
            <p className="font-medium text-maroon">Fix in Supabase (2 minutes):</p>
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-forest-dark">
              <li>
                Open <strong>Supabase → Authentication → Users</strong> and copy
                your <strong>User UID</strong>.
              </li>
              <li>
                Open <strong>SQL Editor</strong> and run (replace the UUID):
              </li>
            </ol>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-maroon-dark p-3 text-xs text-cream">
{`insert into public.admin_users (id, email)
values ('${user.id}', '${user.email}')
on conflict (id) do nothing;`}
            </pre>
          </div>

          <p className="mt-4 text-xs text-forest/70">
            Or run the full fix file: <code>supabase/fix-admin-orders.sql</code>
          </p>

          <a href="/admin/login" className="btn-primary mt-5 inline-block text-sm">
            Back to login
          </a>
        </div>
      </div>
    )
  }

  return children
}
