import Navbar from '../components/Navbar'
import PreOrderBanner from '../components/PreOrderBanner'
import Hero from '../components/Hero'
import BrandStory from '../components/BrandStory'
import ProductMenu from '../components/ProductMenu'
import QualitySection from '../components/QualitySection'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/format'

export default function HomePage() {
  const { totalItems, totalAmount } = useCart()

  return (
    <div className="min-h-screen">
      <PreOrderBanner />
      <Navbar />
      <main>
        <Hero />
        <BrandStory />
        <ProductMenu />
        <QualitySection />
      </main>
      <Footer />

      {/* Floating "view order" bar on mobile once the cart has items */}
      {totalItems > 0 && (
        <Link
          to="/order"
          className="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between rounded-xl border-2 border-gold bg-forest px-4 py-3 text-cream shadow-card-hover sm:left-auto sm:w-80"
        >
          <span className="text-sm font-medium">
            🛒 {totalItems} item{totalItems > 1 ? 's' : ''} · {formatPrice(totalAmount)}
          </span>
          <span className="rounded-lg bg-gold px-3 py-1 text-sm font-semibold text-maroon-dark">
            Review Order →
          </span>
        </Link>
      )}
    </div>
  )
}
