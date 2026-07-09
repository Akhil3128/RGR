import { buildWhatsAppUrl } from '../utils/order'

export default function CustomerForm({
  customer,
  cartItems,
  isSaving,
  saveMessage,
  onChange,
  onSubmitOrder,
}) {
  const canSubmit = customer.name.trim() && customer.phone.trim() && cartItems.length > 0 && !isSaving

  async function handleSubmit(event) {
    event.preventDefault()
    const saved = await onSubmitOrder()

    if (saved) {
      window.open(buildWhatsAppUrl(customer, cartItems), '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <section className="rounded-3xl border border-gold/25 bg-white p-5 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Pre-orders only</p>
      <h2 className="font-display text-3xl font-bold text-maroon-dark">Customer Details</h2>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-maroon-dark">
          Name
          <input
            required
            value={customer.name}
            onChange={(event) => onChange('name', event.target.value)}
            className="rounded-2xl border border-sandal bg-cream/60 px-4 py-3 outline-none focus:border-gold"
            placeholder="Your name"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-maroon-dark">
          Phone Number
          <input
            required
            value={customer.phone}
            onChange={(event) => onChange('phone', event.target.value)}
            className="rounded-2xl border border-sandal bg-cream/60 px-4 py-3 outline-none focus:border-gold"
            placeholder="+91 ..."
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-maroon-dark">
          Delivery / Pickup
          <select
            value={customer.fulfillmentType}
            onChange={(event) => onChange('fulfillmentType', event.target.value)}
            className="rounded-2xl border border-sandal bg-cream/60 px-4 py-3 outline-none focus:border-gold"
          >
            <option>Pickup</option>
            <option>Delivery</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-maroon-dark">
          Address
          <textarea
            value={customer.address}
            onChange={(event) => onChange('address', event.target.value)}
            className="min-h-24 rounded-2xl border border-sandal bg-cream/60 px-4 py-3 outline-none focus:border-gold"
            placeholder="Required for delivery"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-maroon-dark">
          Notes
          <textarea
            value={customer.notes}
            onChange={(event) => onChange('notes', event.target.value)}
            className="min-h-20 rounded-2xl border border-sandal bg-cream/60 px-4 py-3 outline-none focus:border-gold"
            placeholder="Preferred date, special requests, etc."
          />
        </label>
        {saveMessage && (
          <p className="rounded-2xl bg-cream p-3 text-sm font-semibold text-godavari">{saveMessage}</p>
        )}
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-full bg-godavari px-6 py-4 text-base font-bold text-white transition hover:bg-maroon-dark disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isSaving ? 'Saving Order...' : 'Save Order & Send on WhatsApp'}
        </button>
      </form>
    </section>
  )
}
