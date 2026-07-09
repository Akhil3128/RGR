import { useProducts } from '../hooks/useProducts'

export default function SupabaseNotice() {
  const { usingSampleData } = useProducts()

  if (!usingSampleData) return null

  return (
    <div className="bg-gold/20 border-b border-gold/40 px-4 py-3 text-center text-sm text-maroon-dark">
      <p>
        <strong>Demo Mode:</strong> Supabase is not configured. Showing sample products.
        Add your keys to <code className="bg-cream-dark px-1 rounded">.env</code> file.
        See <code className="bg-cream-dark px-1 rounded">README.md</code> for setup steps.
      </p>
    </div>
  )
}
