import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

// Smoke test: rendering the whole app catches runtime errors that per-component
// tests miss — e.g. a section that throws during render (a stray reference, a
// bad map) takes the entire tree down to a blank page. Asserting one heading
// per section proves every section mounted without throwing.
describe('App smoke render', () => {
  it('renders every section without crashing', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: /build smarter/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /services that drive growth/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /technologies we master/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /our process/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /what our clients say/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /ready to build something great/i })).toBeInTheDocument()
  })

  it('renders the Process timeline steps in order (the numbered map that crashed)', () => {
    render(<App />)

    // The Process step badges render {i + 1}; a missing map index throws here.
    for (const step of ['Discover', 'Plan', 'Build', 'Launch']) {
      expect(screen.getByRole('heading', { name: step })).toBeInTheDocument()
    }
  })
})
