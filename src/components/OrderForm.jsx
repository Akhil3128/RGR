export default function OrderForm({ formData, onChange, errors }) {
  function handleChange(field, value) {
    onChange({ ...formData, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-forest-dark mb-1" htmlFor="name">
          Your Name *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g. Lakshmi Devi"
          className="w-full rounded-lg border border-maroon/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        />
        {errors.name && <p className="text-xs text-maroon mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-forest-dark mb-1" htmlFor="phone">
          Phone Number *
        </label>
        <input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="e.g. 9876543210"
          className="w-full rounded-lg border border-maroon/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        />
        {errors.phone && <p className="text-xs text-maroon mt-1">{errors.phone}</p>}
      </div>

      <div>
        <span className="block text-xs font-semibold text-forest-dark mb-1">Delivery or Pickup *</span>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'pickup', label: '🏪 Store Pickup' },
            { value: 'delivery', label: '🚴 Home Delivery' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleChange('fulfillment', option.value)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                formData.fulfillment === option.value
                  ? 'bg-maroon text-cream border-maroon'
                  : 'bg-white text-forest-dark border-maroon/20 hover:border-maroon/40'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {formData.fulfillment === 'delivery' && (
        <div>
          <label className="block text-xs font-semibold text-forest-dark mb-1" htmlFor="address">
            Delivery Address *
          </label>
          <textarea
            id="address"
            rows={2}
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="House no, street, area, landmark - Vizag"
            className="w-full rounded-lg border border-maroon/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
          {errors.address && <p className="text-xs text-maroon mt-1">{errors.address}</p>}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-forest-dark mb-1" htmlFor="notes">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          rows={2}
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="e.g. less sweet, needed by Sunday evening, etc."
          className="w-full rounded-lg border border-maroon/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>
    </div>
  )
}
