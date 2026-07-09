export default function Card({ children, className = '', hover = false }) {
  return (
    <div
      className={`
        bg-white rounded-xl border border-gold/20 overflow-hidden
        ${hover ? 'card-shadow transition-shadow duration-300' : 'card-shadow'}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
