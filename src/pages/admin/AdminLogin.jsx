import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { BUSINESS } from '../../lib/business'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)
    if (loginError) {
      setError('Login failed. Please check your email and password.')
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-dark px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center text-cream">
          <span className="text-4xl">🪔</span>
          <h1 className="mt-3 font-heading text-2xl font-bold text-gold-light">
            {BUSINESS.name}
          </h1>
          <p className="mt-1 text-sm text-cream/70">Admin Panel</p>
        </div>

        <div className="card mt-6 p-6">
          {!isSupabaseConfigured ? (
            <div className="text-sm leading-relaxed text-forest">
              <h2 className="font-heading text-lg font-semibold text-maroon">
                ⚙️ Supabase is not configured yet
              </h2>
              <p className="mt-3">To enable the admin panel:</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                <li>
                  Create a free project at{' '}
                  <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-maroon underline">
                    supabase.com
                  </a>
                </li>
                <li>
                  Run the SQL from <code className="rounded bg-cream-dark px-1">supabase/schema.sql</code> in the SQL Editor
                </li>
                <li>
                  Copy <code className="rounded bg-cream-dark px-1">.env.example</code> to{' '}
                  <code className="rounded bg-cream-dark px-1">.env</code> and fill in your project URL and anon key
                </li>
                <li>
                  Create an admin user in Supabase: Authentication → Users → Add user
                </li>
                <li>Restart the dev server</li>
              </ol>
              <p className="mt-3">
                Until then, the customer website works with sample products.
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="grid gap-4">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-maroon/10 px-3 py-2 text-sm text-maroon">
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          )}
        </div>

        <p className="mt-4 text-center">
          <Link to="/" className="text-sm text-cream/70 hover:text-cream">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  )
}
