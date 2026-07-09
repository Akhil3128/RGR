import { useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import BrandStory from '../components/BrandStory'
import ProductMenu from '../components/ProductMenu'
import QualitySection from '../components/QualitySection'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'
import WhatsAppFloat from '../components/WhatsAppFloat'

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <main>
        <Hero />
        <BrandStory />
        <ProductMenu />
        <QualitySection />
      </main>
      <Footer />
      <WhatsAppFloat />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
