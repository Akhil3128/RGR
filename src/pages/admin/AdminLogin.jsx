import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { BUSINESS_NAME } from '../../data/sampleProducts'
import { isSupabaseConfigured } from '../../lib/supabase'
import ConfigBanner from '../../components/shared/ConfigBanner'

export default function AdminLogin() {
  const { session, login, demoLogin, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && session) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDemo = () => {
    demoLogin()
    navigate('/admin')
  }

  return (
    <div className="min-h-screen pattern-bg">
      <ConfigBanner />
      <div className="mx-auto flex min-h-[90vh] max-w-md flex-col justify-center px-4 py-10">
        <div className="ornament-border rounded-xl bg-cream-light p-6 shadow-sm">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
            Admin Access
          </p>
          <h1 className="mt-2 text-center font-display text-3xl text-maroon">
            {BUSINESS_NAME}
          </h1>
          <p className="mt-1 text-center text-sm text-green/75">Sign in to manage products & orders</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-maroon">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gold/40 bg-cream px-3 py-2.5 outline-none focus:border-maroon"
                placeholder="admin@example.com"
                required={isSupabaseConfigured}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-maroon">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gold/40 bg-cream px-3 py-2.5 outline-none focus:border-maroon"
                placeholder="••••••••"
                required={isSupabaseConfigured}
              />
            </label>

            {error && (
              <p className="rounded-md bg-maroon/10 px-3 py-2 text-sm text-maroon">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting || !isSupabaseConfigured}
              className="w-full rounded-md bg-maroon px-4 py-2.5 text-sm font-semibold text-cream hover:bg-maroon-light disabled:opacity-60"
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {!isSupabaseConfigured && (
            <div className="mt-4 rounded-md border border-gold/40 bg-gold/10 p-3 text-sm text-maroon-dark">
              <p className="font-medium">Supabase not configured</p>
              <p className="mt-1 text-xs leading-relaxed">
                Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to
                your <code>.env</code> file, create an Auth user in Supabase, then sign in here.
              </p>
              <button
                type="button"
                onClick={handleDemo}
                className="mt-3 w-full rounded-md bg-green px-3 py-2 text-sm font-semibold text-cream hover:bg-green-light"
              >
                Continue with Demo Admin
              </button>
            </div>
          )}

          <p className="mt-5 text-center text-sm">
            <Link to="/" className="text-green underline hover:text-green-light">
              ← Back to website
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
