import PageMeta from './PageMeta'

/** A titled section within a legal page. */
export function Section({ heading, children }) {
  return (
    <section className="space-y-3">
      <h2 className="font-heading text-xl font-bold text-fg">{heading}</h2>
      {children}
    </section>
  )
}

/** A paragraph of legal body text. */
export function P({ children }) {
  return <p className="text-muted leading-relaxed">{children}</p>
}

/** An accent-styled inline link (e.g. a mailto). */
export function A({ href, children }) {
  return (
    <a href={href} className="text-accent hover:text-fg underline underline-offset-2 cursor-pointer">
      {children}
    </a>
  )
}

/**
 * Shared layout for legal pages (Privacy, Terms). Readable typographic column,
 * generous spacing, high contrast — a legal page's job is legibility, not flash.
 */
export default function LegalPage({ title, description, updated, intro, children }) {
  return (
    <>
      <PageMeta title={`${title} · manaracode`} description={description} scrollTop />
      <main id="main" className="min-h-screen pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-fg mb-3 tracking-tight text-balance">
            {title}
          </h1>
          {updated && <p className="text-sm text-muted mb-8">Last updated: {updated}</p>}
          {intro && <p className="text-muted leading-relaxed mb-10 max-w-prose">{intro}</p>}
          <div className="space-y-10">{children}</div>
        </div>
      </main>
    </>
  )
}
