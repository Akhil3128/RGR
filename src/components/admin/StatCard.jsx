export default function StatCard({ label, value, accent = 'maroon', icon }) {
  const accentClasses = {
    maroon: 'text-maroon border-maroon/20 bg-maroon/5',
    forest: 'text-forest-dark border-forest/20 bg-forest/5',
    gold: 'text-gold-dark border-gold/30 bg-gold/10',
  }

  return (
    <div className={`rounded-2xl border p-4 shadow-soft bg-white ${accentClasses[accent] || accentClasses.maroon}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{label}</p>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  )
}
