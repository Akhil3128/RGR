export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-maroon">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold/40 border-t-maroon" />
      <p className="text-sm text-maroon/70">{label}</p>
    </div>
  )
}
