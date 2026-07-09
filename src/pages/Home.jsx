import { useState } from 'react'
import Navbar from '../components/Navbar'
import PreOrderBanner from '../components/PreOrderBanner'
import Hero from '../components/Hero'
import BrandStory from '../components/BrandStory'
import QualitySection from '../components/QualitySection'
import ProductMenu from '../components/ProductMenu'
import Footer from '../components/Footer'
import CartPanel from '../components/CartPanel'
import StickyCartBar from '../components/StickyCartBar'
import WhatsAppFloatButton from '../components/WhatsAppFloatButton'

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <div className="min-h-screen bg-cream font-body text-forest-dark">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <PreOrderBanner />
      <Hero />
      <BrandStory />
      <ProductMenu />
      <QualitySection />
      <Footer />

      <StickyCartBar onViewCart={() => setCartOpen(true)} />
      <WhatsAppFloatButton />
      <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
