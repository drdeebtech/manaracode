/**
 * Join class names, dropping falsy values. Tiny dependency-free helper so
 * components can compose a base class string with conditional and caller
 * `className` overrides.
 *
 * @param {...(string|false|null|undefined)} parts
 * @returns {string}
 */
export function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}
