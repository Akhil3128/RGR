import { useState } from 'react'

export default function AdminLogin({ isConfigured, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    const result = await onLogin(email, password)
    setLoading(false)

    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-10">
      <div className="mx-auto max-w-md rounded-3xl border border-gold/30 bg-white p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Admin Login</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-maroon-dark">
          Ranganayaki Godavari Ruchulu
        </h1>
        <p className="mt-3 text-sm leading-6 text-maroon-dark/80">
          Login with a Supabase Auth admin account to manage products, inventory, orders, and dashboard totals.
        </p>

        {!isConfigured ? (
          <div className="mt-6 rounded-2xl bg-cream p-4 text-sm text-maroon-dark">
            Supabase is not configured yet. Add <strong>VITE_SUPABASE_URL</strong> and{' '}
            <strong>VITE_SUPABASE_ANON_KEY</strong> to <strong>.env</strong>, then restart the app.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-semibold text-maroon-dark">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-2xl border border-sandal bg-cream/60 px-4 py-3 outline-none focus:border-gold"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-maroon-dark">
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-2xl border border-sandal bg-cream/60 px-4 py-3 outline-none focus:border-gold"
              />
            </label>
            {error && <p className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-maroon px-6 py-4 font-bold text-white transition hover:bg-maroon-dark disabled:bg-gray-300"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
