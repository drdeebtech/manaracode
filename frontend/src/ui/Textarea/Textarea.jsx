import { forwardRef } from 'react'
import { cn } from '../../lib/cn'
import { useId } from '../../hooks/useId'

/**
 * @typedef {object} TextareaOwnProps
 * @property {string} label required for accessibility
 * @property {string} name
 * @property {string} [id]
 * @property {string} [error]
 * @property {string} [hint]
 * @property {boolean} [required=false]
 * @property {boolean} [hideLabel=false]
 * @property {number} [rows=4]
 * @property {string} [className]
 */

const FIELD =
  'w-full px-4 py-3 rounded-xl border bg-surface text-fg text-sm placeholder:text-muted resize-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
  'disabled:opacity-60 disabled:cursor-not-allowed'

/**
 * Labelled multiline text field. Mirrors Input's a11y wiring.
 *
 * @type {React.ForwardRefExoticComponent<TextareaOwnProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>>}
 */
export const Textarea = forwardRef(function Textarea(
  { label, name, id, error, hint, required = false, hideLabel = false, rows = 4, className, ...rest },
  ref,
) {
  const fieldId = useId(id)
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`
  const describedBy = cn(hint && hintId, error && errorId) || undefined

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
      <textarea
        ref={ref}
        id={fieldId}
        name={name}
        rows={rows}
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
