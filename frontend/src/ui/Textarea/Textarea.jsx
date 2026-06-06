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
  'w-full px-4 py-3 rounded-xl border text-blue-900 text-sm placeholder-blue-300 resize-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ' +
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
        className={cn('block text-sm font-semibold text-blue-900 mb-1.5', hideLabel && 'sr-only')}
      >
        {label}
        {required && (
          <span className="text-red-500" aria-hidden="true">
            {' *'}
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="text-xs text-blue-400 mb-1.5">
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
        className={cn(FIELD, error ? 'border-red-300' : 'border-blue-100', className)}
        {...rest}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  )
})
