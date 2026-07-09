const variants = {
  primary: 'bg-maroon text-white hover:bg-maroon-dark shadow-md',
  secondary: 'bg-forest text-white hover:bg-forest-dark shadow-md',
  gold: 'bg-gold text-maroon-dark hover:bg-gold-light shadow-md font-semibold',
  outline: 'border-2 border-maroon text-maroon hover:bg-maroon hover:text-white',
  whatsapp: 'bg-[#25D366] text-white hover:bg-[#1da851] shadow-md',
  ghost: 'text-maroon hover:bg-maroon/10',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
