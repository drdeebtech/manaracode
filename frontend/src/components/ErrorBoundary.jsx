import { Component } from 'react'

/**
 * Minimal error boundary. Renders `props.fallback` if a descendant throws during
 * render — including a `React.lazy` chunk that fails to download — so a localized
 * failure degrades gracefully instead of crashing the app.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null
    return this.props.children
  }
}
