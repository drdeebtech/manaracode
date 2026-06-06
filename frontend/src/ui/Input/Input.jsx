import { forwardRef } from 'react'
import { cn } from '../../lib/cn'
import { useId } from '../../hooks/useId'

/**
 * @typedef {object} InputOwnProps
 * @property {string} label required for accessibility; rendered as <label>
 * @property {string} name
 * @property {string} [id] defaults to a generated id
 * @property {string} [type='text']
 * @property {string} [error] error message; sets aria-invalid + describedby
 * @property {string} [hint] helper text (aria-describedby)
 * @property {boolean} [required=false]
 * @property {boolean} [hideLabel=false] visually hide the label (still in AT)
 * @property {string} [className]
 */

const FIELD =
  'w-full px-4 py-3 rounded-xl border bg-surface text-fg text-sm placeholder:text-muted ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
  'disabled:opacity-60 disabled:cursor-not-allowed'

// Fields whose content is inherently left-to-right; default dir="ltr" so they
// enter correctly on an RTL page unless the caller overrides.
const LTR_TYPES = new Set(['email', 'password', 'url', 'tel'])

/**
 * Labelled text input with hint and error wiring.
 *
 * @type {React.ForwardRefExoticComponent<InputOwnProps & React.InputHTMLAttributes<HTMLInputElement>>}
 */
export const Input = forwardRef(function Input(
  { label, name, id, type = 'text', error, hint, required = false, hideLabel = false, dir, className, ...rest },
  ref,
) {
  const fieldId = useId(id)
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`
  const describedBy = cn(hint && hintId, error && errorId) || undefined
  const resolvedDir = dir || (LTR_TYPES.has(type) ? 'ltr' : undefined)

  return (
    <div className="w-full">
      <label
        htmlFor={fieldId}
        className={cn('block text-sm font-semibold text-fg mb-1.5 cursor-pointer', hideLabel && 'sr-only')}
      >
        {label}
        {required && (
          <span className="text-error" aria-hidden="true">
            {' *'}
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="text-xs text-muted mb-1.5">
          {hint}
        </p>
      )}
      <input
        ref={ref}
        id={fieldId}
        name={name}
        type={type}
        dir={resolvedDir}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={cn(FIELD, error ? 'border-error' : 'border-border', className)}
        {...rest}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-error">
          {error}
        </p>
      )}
    </div>
  )
})
