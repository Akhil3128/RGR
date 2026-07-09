import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import { BUSINESS_NAME } from '../lib/constants'

export default function AdminLogin() {
  const { user, loading, signIn, isSupabaseConfigured } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (!isSupabaseConfigured) {
        setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.')
        setSubmitting(false)
        return
      }
      await signIn(email, password)
    } catch (err) {
      setError(err.message || 'Login failed. Check your email and password.')
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon/5 via-cream to-forest/5 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <span className="text-4xl">🪷</span>
          <h1 className="font-display text-2xl font-bold text-maroon mt-2">
            Admin Login
          </h1>
          <p className="text-sm text-gray-500 mt-1">{BUSINESS_NAME}</p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 bg-gold/15 border border-gold/30 rounded-lg text-sm text-maroon-dark">
            <p className="font-semibold mb-2">Supabase Not Configured</p>
            <p>Create a <code className="bg-cream-dark px-1 rounded">.env</code> file with:</p>
            <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-x-auto">
{`VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key`}
            </pre>
            <p className="mt-2 text-xs">See README.md for full setup instructions.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center mt-6">
          <a href="/" className="text-sm text-forest hover:text-maroon transition-colors">
            ← Back to Website
          </a>
        </p>
      </Card>
    </div>
  )
}
