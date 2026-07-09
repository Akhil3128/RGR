import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
      <p className="text-6xl">🍬</p>
      <h1 className="mt-4 font-heading text-3xl font-bold text-maroon">
        Page not found
      </h1>
      <p className="mt-2 text-forest-dark/80">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to Home
      </Link>
    </div>
  )
}
