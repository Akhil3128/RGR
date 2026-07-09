import { Link } from 'react-router-dom'
import { BUSINESS, whatsappLink } from '../lib/business'
import WhatsAppIcon from './WhatsAppIcon'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-maroon text-cream">
      {/* Subtle traditional pattern using layered gradients */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 25%, #C99A2E 2px, transparent 2px), radial-gradient(circle at 75% 75%, #C99A2E 2px, transparent 2px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
        <p className="mx-auto inline-block rounded-full border border-gold bg-maroon-dark px-4 py-1 text-xs font-medium tracking-widest text-gold-light">
          ✦ PRE-ORDERS ONLY · VIZAG ✦
        </p>

        <h1 className="mt-6 font-heading text-4xl font-bold leading-tight text-cream sm:text-5xl md:text-6xl">
          {BUSINESS.name}
        </h1>

        <p className="mt-3 font-heading text-xl italic text-gold-light sm:text-2xl">
          “{BUSINESS.tagline}”
        </p>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-cream/85 sm:text-base">
          Authentic Rajahmundry &amp; Godavari sweets and snacks — Kova,
          Sunnundalu, Putharekulu and more — handmade in small batches and
          delivered fresh in Vizag.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#menu" className="btn-primary w-full border border-gold sm:w-auto">
            🍬 View Our Menu
          </a>
          <a
            href={whatsappLink('Hi! I would like to place a pre-order.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp w-full sm:w-auto"
          >
            <WhatsAppIcon />
            Pre-Order on WhatsApp
          </a>
        </div>

        <p className="mt-6 text-xs text-cream/70">
          📞 {BUSINESS.phoneDisplay} · Freshly made after every order
        </p>
      </div>
    </section>
  )
}
