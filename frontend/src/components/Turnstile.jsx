import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

// Cloudflare Turnstile widget. The sitekey is PUBLIC by design (it ships in the
// HTML); the matching secret lives only on the backend. Override at build time
// with VITE_TURNSTILE_SITEKEY if the widget is ever rotated.
export const TURNSTILE_SITEKEY =
  import.meta.env.VITE_TURNSTILE_SITEKEY || '0x4AAAAAADgbKqkr1Dyq9Bcm'

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

// Module-level memoised loader so the script is injected at most once even with
// multiple widgets / re-renders.
let scriptPromise
function loadTurnstile() {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.turnstile) return Promise.resolve()
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = SCRIPT_SRC
    s.async = true
    s.defer = true
    s.onload = () => resolve()
    s.onerror = () => {
      scriptPromise = undefined // allow a later retry
      reject(new Error('Turnstile failed to load'))
    }
    document.head.appendChild(s)
  })
  return scriptPromise
}

/**
 * Renders an invisible/managed Turnstile challenge. Calls `onVerify(token)` when
 * solved, `onExpire()` when the token expires, and `onError()` on widget error.
 * Exposes an imperative `reset()` so a parent can re-arm it after a failed submit
 * (Turnstile tokens are single-use).
 */
const Turnstile = forwardRef(function Turnstile({ onVerify, onExpire, onError }, ref) {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)
  // Hold the latest callbacks in a ref so the render effect can run once on
  // mount without re-rendering the widget when inline callbacks change identity.
  const cbRef = useRef({ onVerify, onExpire, onError })
  cbRef.current = { onVerify, onExpire, onError }

  useImperativeHandle(ref, () => ({
    reset() {
      if (widgetIdRef.current != null && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current)
      }
    },
  }), [])

  useEffect(() => {
    let cancelled = false
    loadTurnstile()
      .then(() => {
        if (cancelled || widgetIdRef.current != null) return
        if (!containerRef.current || !window.turnstile) return
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITEKEY,
          action: 'contact',
          callback: (token) => cbRef.current.onVerify?.(token),
          'expired-callback': () => cbRef.current.onExpire?.(),
          'error-callback': () => cbRef.current.onError?.(),
        })
      })
      .catch(() => cbRef.current.onError?.())
    return () => {
      cancelled = true
      if (widgetIdRef.current != null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [])

  return <div ref={containerRef} className="cf-turnstile flex justify-center" aria-hidden="true" />
})

export default Turnstile
