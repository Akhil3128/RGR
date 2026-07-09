export default function SectionHeading({ eyebrow, title, subtitle, light = false }) {
  return (
    <div className="mx-auto mb-8 max-w-2xl text-center">
      {eyebrow && (
        <p
          className={`mb-2 text-xs font-semibold uppercase tracking-[0.2em] ${
            light ? 'text-gold-light' : 'text-gold-dark'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2 className={`text-3xl md:text-4xl ${light ? 'text-cream' : 'text-maroon'}`}>
        {title}
      </h2>
      <div className="gold-divider mx-auto my-4 w-24" />
      {subtitle && (
        <p className={`text-base leading-relaxed ${light ? 'text-cream/85' : 'text-green/80'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
