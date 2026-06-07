// JS mirror of the motion tokens in tokens.css, for use with framer-motion
// (which takes seconds, not ms). Keep these in sync with tokens.css.

/** Durations in seconds (framer-motion units). */
export const DURATION = Object.freeze({
  micro: 0.08,
  short: 0.2,
  medium: 0.35,
  long: 0.6,
})

/** Easing curves as cubic-bezier arrays. */
export const EASE = Object.freeze({
  out: [0.16, 1, 0.3, 1], // out-expo: entrances
  in: [0.7, 0, 0.84, 0], // exits
  inOut: [0.65, 0, 0.35, 1], // moves
})

// ── Motion presets ──────────────────────────────────────────────────────────
// One reveal language for the whole page (DRY): every section consumes these
// instead of re-declaring initial/whileInView/transition with drifting
// durations. reducedMotion is honored globally via <MotionConfig
// reducedMotion="user"> in App.jsx, so these need no per-use guard.

/**
 * Spreadable scroll-reveal for a standalone block (e.g. a section header):
 * `<motion.div {...reveal}>`. Fade + small rise, fires once on enter.
 */
export const reveal = Object.freeze({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -10% 0px' },
  transition: { duration: DURATION.long, ease: EASE.out },
})

/**
 * Parent variants that stagger children into ONE orchestrated reveal instead of
 * many hand-tuned per-element delays. Pair with `revealItem` on each child.
 * @param {number} [stagger=0.08] gap between children (s)
 * @param {number} [delayChildren=0] lead-in before the first child (s)
 */
export const revealStagger = (stagger = 0.08, delayChildren = 0) =>
  Object.freeze({
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren } },
  })

/** Child variant for a `revealStagger` group (or any hidden/show parent). */
export const revealItem = Object.freeze({
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.long, ease: EASE.out } },
})
