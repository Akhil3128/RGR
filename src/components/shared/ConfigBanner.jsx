import { isSupabaseConfigured } from '../../lib/supabase'

export default function ConfigBanner() {
  if (isSupabaseConfigured) return null

  return (
    <div className="bg-gold/20 border-b border-gold/40 px-4 py-2 text-center text-sm text-maroon-dark">
      <strong>Demo mode:</strong> Supabase is not configured yet. Using sample products.
      Copy <code className="mx-1 rounded bg-cream px-1">.env.example</code> to{' '}
      <code className="mx-1 rounded bg-cream px-1">.env</code> and add your keys.
      See README for setup steps.
    </div>
  )
}
