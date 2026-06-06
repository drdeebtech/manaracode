import { useEffect, useRef } from 'react'
import { FOCUSABLE_SELECTOR, KEYS } from '../lib/a11y'

/**
 * Trap focus within a container while `active`. On activate, saves the current
 * focus and moves it inside; on deactivate, restores it. Cycles Tab / Shift+Tab
 * within the container.
 *
 * @param {boolean} active
 * @returns {import('react').RefObject<HTMLElement>} ref to attach to the container
 */
export function useFocusTrap(active) {
  const ref = useRef(null)

  useEffect(() => {
    if (!active || !ref.current) return
    const container = ref.current
    const previouslyFocused = document.activeElement

    // Exclude explicitly hidden elements. (Avoid offsetParent visibility
    // checks — they're null in layout-less environments like jsdom and would
    // drop every candidate.)
    const isVisible = (el) => !el.hasAttribute('hidden') && !el.closest('[aria-hidden="true"]')
    const focusables = () => Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(isVisible)

    const initial = focusables()[0] || container
    // A bare container isn't focusable without a tabindex; add one so the
    // fallback focus() actually lands (and the trap holds on the first Tab).
    if (initial === container && !container.hasAttribute('tabindex')) {
      container.setAttribute('tabindex', '-1')
    }
    initial.focus()

    const onKeyDown = (e) => {
      if (e.key !== KEYS.TAB) return
      const items = focusables()
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    container.addEventListener('keydown', onKeyDown)
    return () => {
      container.removeEventListener('keydown', onKeyDown)
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus()
      }
    }
  }, [active])

  return ref
}
