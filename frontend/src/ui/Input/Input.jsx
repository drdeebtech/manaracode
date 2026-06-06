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
  'w-full px-4 py-3 rounded-xl border text-blue-900 text-sm placeholder-blue-300 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ' +
  'disabled:opacity-60 disabled:cursor-not-allowed'

/**
 * Labelled text input with hint and error wiring.
 *
 * @type {React.ForwardRefExoticComponent<InputOwnProps & React.InputHTMLAttributes<HTMLInputElement>>}
 */
export const Input = forwardRef(function Input(
  { label, name, id, type = 'text', error, hint, required = false, hideLabel = false, className, ...rest },
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
      <input
        ref={ref}
        id={fieldId}
        name={name}
        type={type}
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
