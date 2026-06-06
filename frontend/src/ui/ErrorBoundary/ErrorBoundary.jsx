import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'
import { EmptyState } from '../EmptyState/EmptyState'
import { Button } from '../Button/Button'

/**
 * @typedef {object} ErrorBoundaryProps
 * @property {React.ReactNode} children
 * @property {React.ReactNode | ((error: Error, reset: () => void) => React.ReactNode)} [fallback] custom fallback; a function receives the caught error + reset
 * @property {(error: Error, info: object) => void} [onError] error reporter (no console in prod)
 * @property {string} [title]
 * @property {string} [description]
 */

/**
 * Catches render-time errors in its subtree and shows a recoverable fallback.
 * Wrap risky subtrees (e.g. the 3D canvas) so a failure never blanks the page.
 *
 * @extends {Component<ErrorBoundaryProps>}
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
    this.reset = this.reset.bind(this)
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    if (typeof this.props.onError === 'function') {
      this.props.onError(error, info)
    }
  }

  reset() {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) return this.props.children
    const { fallback } = this.props
    if (typeof fallback === 'function') return fallback(this.state.error, this.reset)
    if (fallback) return fallback
    return (
      <EmptyState
        tone="error"
        Icon={AlertTriangle}
        title={this.props.title || 'Something went wrong'}
        description={this.props.description || 'An unexpected error occurred. Please try again.'}
        action={
          <Button variant="secondary" onClick={this.reset}>
            Try again
          </Button>
        }
      />
    )
  }
}
