import ConfigBanner from '../../components/shared/ConfigBanner'
import Header from '../../components/customer/Header'
import Footer from '../../components/customer/Footer'
import Hero from '../../components/customer/Hero'
import BrandStory from '../../components/customer/BrandStory'
import ProductMenu from '../../components/customer/ProductMenu'
import QualitySection from '../../components/customer/QualitySection'
import OrderForm from '../../components/customer/OrderForm'

export default function HomePage() {
  return (
    <div className="min-h-screen pattern-bg">
      <ConfigBanner />
      <Header />
      <main>
        <Hero />
        <BrandStory />
        <ProductMenu />
        <QualitySection />
        <OrderForm />
      </main>
      <Footer />
    </div>
  )
}
