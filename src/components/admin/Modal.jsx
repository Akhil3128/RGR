export default function Modal({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button className="absolute inset-0 bg-black/50" aria-label="Close modal" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-cream shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gold/30 bg-maroon text-cream px-5 py-3 rounded-t-2xl">
          <h3 className="font-display text-lg">{title}</h3>
          <button onClick={onClose} className="text-cream/80 hover:text-cream text-2xl leading-none">
            &times;
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="border-t border-maroon/10 px-5 py-3">{footer}</div>}
      </div>
    </div>
  )
}
