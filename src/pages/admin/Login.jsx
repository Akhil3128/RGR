import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { isSupabaseConfigured } from '../../lib/supabaseClient'

export default function Login() {
  const { session, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (session) return <Navigate to="/admin" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: signInError } = await signIn(email, password)
    setLoading(false)
    if (signInError) setError(signInError.message)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-maroon-dark to-forest-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-cream shadow-card border border-gold/40 p-6 sm:p-8">
        <div className="text-center mb-6">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-maroon text-gold font-display text-xl border-2 border-gold mb-3">
            R
          </span>
          <h1 className="font-display text-xl text-maroon">Admin Login</h1>
          <p className="text-xs text-forest-dark/60 mt-1">Ranganayaki Godavari Ruchulu</p>
        </div>

        {!isSupabaseConfigured && (
          <p className="mb-4 rounded-lg bg-gold/10 border border-gold/40 text-xs text-maroon-dark p-3">
            Supabase is not configured yet. Set up your <code>.env</code> file to enable admin login.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-forest-dark mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-maroon/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-forest-dark mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-maroon/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          {error && <p className="text-xs text-maroon bg-maroon/10 rounded-lg px-3 py-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-maroon text-cream font-semibold py-2.5 text-sm hover:bg-maroon-dark transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <Link to="/" className="block text-center text-xs text-forest-dark/60 hover:text-maroon mt-6">
          ← Back to website
        </Link>
      </div>
    </div>
  )
}
