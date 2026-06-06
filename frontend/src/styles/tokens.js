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
