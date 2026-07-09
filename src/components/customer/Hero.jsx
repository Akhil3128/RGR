import Button from '../ui/Button'
import { WHATSAPP_NUMBER } from '../../lib/constants'

export default function Hero() {
  const scrollToMenu = () => {
    document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' })
  }

  const openWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-maroon/5 via-cream to-forest/5" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-maroon/10 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-maroon/10 text-maroon px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-6 border border-maroon/20">
          <span>🪷</span>
          <span>Pre-Orders Only — Freshly Made for You</span>
        </div>

        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-maroon leading-tight mb-4 animate-fade-in-up">
          Ranganayaki
          <br />
          <span className="text-forest">Godavari Ruchulu</span>
        </h2>

        <p className="text-gold font-display text-xl sm:text-2xl italic mb-6">
          Traditional Taste, Pure Love
        </p>

        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
          Authentic Rajahmundry & Godavari sweets and snacks, handcrafted with
          generations of tradition and delivered fresh in Vizag.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" onClick={scrollToMenu}>
            🍬 View Menu & Order
          </Button>
          <Button variant="whatsapp" size="lg" onClick={openWhatsApp}>
            💬 Order on WhatsApp
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-1">✨ Freshly Made</span>
          <span className="flex items-center gap-1">🧼 Hygienically Prepared</span>
          <span className="flex items-center gap-1">⭐ Quality Assured</span>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-8" />
    </section>
  )
}
