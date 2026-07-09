export default function PreOrderBanner() {
  return (
    <div className="bg-forest text-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-center gap-2 text-center text-xs sm:text-sm font-medium">
        <span aria-hidden>🌿</span>
        <p>
          <span className="font-bold text-gold">Pre-Orders Only</span> — every item is made fresh to order. Please
          order at least a few hours in advance on WhatsApp.
        </p>
      </div>
    </div>
  )
}
