const colors = {
  maroon: 'bg-maroon/10 text-maroon border-maroon/20',
  forest: 'bg-forest/10 text-forest border-forest/20',
  gold: 'bg-gold/15 text-maroon-dark border-gold/30',
  green: 'bg-green-100 text-green-800 border-green-200',
  red: 'bg-red-100 text-red-800 border-red-200',
  gray: 'bg-gray-100 text-gray-700 border-gray-200',
}

export default function Badge({ children, color = 'maroon', className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color]} ${className}`}
    >
      {children}
    </span>
  )
}
