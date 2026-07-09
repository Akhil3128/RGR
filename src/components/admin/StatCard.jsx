import Card from '../ui/Card'
import { formatCurrency } from '../../utils/formatters'

export default function StatCard({ title, value, icon, color = 'maroon', isCurrency = false }) {
  const colors = {
    maroon: 'from-maroon/10 to-maroon/5 border-maroon/20',
    forest: 'from-forest/10 to-forest/5 border-forest/20',
    gold: 'from-gold/15 to-gold/5 border-gold/30',
    green: 'from-green-100 to-green-50 border-green-200',
    red: 'from-red-100 to-red-50 border-red-200',
  }

  const displayValue = isCurrency && typeof value === 'number'
    ? formatCurrency(value)
    : value

  return (
    <Card className={`p-5 bg-gradient-to-br ${colors[color]} border`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-maroon-dark mt-1">{displayValue}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </Card>
  )
}
