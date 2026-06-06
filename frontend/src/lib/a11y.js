// Shared accessibility primitives reused across the component library.

/**
 * Focus ring applied to every interactive primitive. focus-visible only (so it
 * shows for keyboard users, not mouse clicks) and uses box-shadow (ring), which
 * is non-compositor-friendly — so it appears instantly with no transition,
 * matching the project's "transitions on transform/opacity only" rule.
 */
export const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

/** Visually hidden but available to screen readers. */
export const SR_ONLY = 'sr-only'

/** Keyboard key constants for handlers. */
export const KEYS = Object.freeze({
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  SPACE: ' ',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
})

/** Selector matching focusable descendants, used by the focus trap. */
export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')
