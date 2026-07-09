export default function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-maroon-dark">
          {label}
        </label>
      )}
      <select
        className={`
          w-full px-4 py-2.5 rounded-lg border border-gold/30 bg-white
          focus:outline-none focus:ring-2 focus:ring-maroon/30 focus:border-maroon
          text-sm
          ${error ? 'border-red-400' : ''} ${className}
        `}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
