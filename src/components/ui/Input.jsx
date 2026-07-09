export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-maroon-dark">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2.5 rounded-lg border border-gold/30 bg-white
          focus:outline-none focus:ring-2 focus:ring-maroon/30 focus:border-maroon
          placeholder:text-gray-400 text-sm
          ${error ? 'border-red-400' : ''} ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
