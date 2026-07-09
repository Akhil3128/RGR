import Card from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { useCart } from '../../context/CartContext'
import { formatCurrency } from '../../utils/formatters'

const categoryIcons = {
  Sweets: '🍬',
  Snacks: '🥨',
  Dairy: '🧀',
  Ghee: '🫕',
}

export default function ProductCard({ product }) {
  const { dispatch } = useCart()

  const handleAdd = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        size: product.size,
        price: product.price,
      },
    })
  }

  return (
    <Card hover className="flex flex-col">
      <div className="aspect-square bg-gradient-to-br from-cream-dark to-gold/10 flex items-center justify-center relative">
        <span className="text-5xl opacity-60">
          {categoryIcons[product.category] || '🍬'}
        </span>
        <Badge color="gold" className="absolute top-3 right-3">
          {product.category}
        </Badge>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display text-lg font-bold text-maroon leading-tight">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">{product.size}</p>
        <p className="text-xl font-bold text-forest mt-2">
          {formatCurrency(product.price)}
        </p>

        <Button
          variant="primary"
          size="sm"
          className="mt-auto pt-3 w-full"
          onClick={handleAdd}
        >
          + Add to Order
        </Button>
      </div>
    </Card>
  )
}
