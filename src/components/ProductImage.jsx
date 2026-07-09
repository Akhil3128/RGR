// Shows the product image if available, otherwise a decorative placeholder
// with a themed emoji based on the product name.

function pickEmoji(name = '') {
  const n = name.toLowerCase()
  if (n.includes('kova')) return '🍥'
  if (n.includes('sunnundalu')) return '🟡'
  if (n.includes('putharekulu')) return '🥮'
  if (n.includes('jantikalu')) return '🥨'
  if (n.includes('boondhi')) return '🟠'
  if (n.includes('paneer')) return '🧀'
  if (n.includes('ghee')) return '🧈'
  return '🍬'
}

export default function ProductImage({ product, className = '' }) {
  if (product.image_url) {
    return (
      <img
        src={product.image_url}
        alt={product.name}
        loading="lazy"
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-cream-dark to-gold/30 ${className}`}
    >
      <span className="text-5xl" role="img" aria-label={product.name}>
        {pickEmoji(product.name)}
      </span>
    </div>
  )
}
