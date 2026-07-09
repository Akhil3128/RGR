import Hero from '../components/customer/Hero'
import PreOrderBanner from '../components/customer/PreOrderBanner'
import BrandStory from '../components/customer/BrandStory'
import ProductMenu from '../components/customer/ProductMenu'
import Cart from '../components/customer/Cart'
import OrderForm from '../components/customer/OrderForm'
import QualitySection from '../components/customer/QualitySection'
import { useProducts } from '../hooks/useProducts'

export default function HomePage() {
  const { products, loading } = useProducts()

  return (
    <>
      <Hero />
      <PreOrderBanner />
      <BrandStory />
      <ProductMenu products={products} loading={loading} />

      <section id="order" className="py-16 sm:py-20 bg-gradient-to-b from-white/50 to-cream">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-maroon">
              Place Your Pre-Order
            </h2>
            <div className="w-20 h-0.5 bg-gold mx-auto mt-3" />
            <p className="text-gray-500 mt-4 text-sm sm:text-base">
              Review your cart, fill in your details, and send via WhatsApp
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Cart />
            <OrderForm />
          </div>
        </div>
      </section>

      <QualitySection />
    </>
  )
}
