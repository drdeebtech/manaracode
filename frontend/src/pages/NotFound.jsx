import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'

export default function NotFound() {
  return (
    <>
      <PageMeta title="Page not found · manaracode" scrollTop />
      <main id="main" className="min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="text-center max-w-md">
          <p className="font-heading text-6xl font-bold text-accent mb-4">404</p>
          <h1 className="font-heading text-2xl font-bold text-fg mb-3">Page not found</h1>
          <p className="text-muted mb-8">The page you’re looking for doesn’t exist or has moved.</p>
          <Link
            to="/"
            className="inline-flex items-center px-5 py-2 min-h-[44px] bg-accent-warm text-on-accent text-sm font-semibold rounded-xl transition-opacity duration-200 hover:opacity-90 cursor-pointer"
          >
            Back to home
          </Link>
        </div>
      </main>
    </>
  )
}
