import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { isSupabaseConfigured } from '../../lib/supabase'
import { BUSINESS } from '../../config'

export default function AdminLoginPage() {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/admin" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: signInError } = await signIn(email, password)
    setLoading(false)
    if (signInError) {
      setError(signInError.message)
      return
    }
    navigate('/admin')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-maroon px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center text-cream">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-xl font-bold text-maroon-dark">
            RG
          </div>
          <h1 className="font-heading text-2xl font-bold">Admin Login</h1>
          <p className="text-sm text-cream/70">{BUSINESS.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          {!isSupabaseConfigured && (
            <div className="rounded-xl border border-gold/50 bg-gold/10 px-3 py-2 text-sm text-maroon">
              Supabase is not configured yet. Add your keys in{' '}
              <code className="rounded bg-cream px-1">.env</code> and create an
              admin user (see README) to enable login.
            </div>
          )}

          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-sm text-maroon">{error}</p>}

          <button
            type="submit"
            disabled={loading || !isSupabaseConfigured}
            className="btn-primary w-full"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <Link
            to="/"
            className="block text-center text-sm text-forest hover:text-maroon"
          >
            ← Back to website
          </Link>
        </form>
      </div>
    </div>
  )
}
