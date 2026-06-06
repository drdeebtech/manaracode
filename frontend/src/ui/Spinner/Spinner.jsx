import { cn } from '../../lib/cn'

/**
 * @typedef {object} SpinnerProps
 * @property {'sm'|'md'|'lg'} [size='md']
 * @property {string} [label='Loading'] accessible label; set '' to hide from AT
 * @property {string} [className]
 */

const SIZES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-5 w-5 border-2',
  lg: 'h-7 w-7 border-[3px]',
}

/**
 * Indeterminate loading spinner. Animation is transform-only (compositor
 * friendly). When `label` is non-empty it announces politely; pass '' when a
 * parent already conveys the loading state (e.g. a button with aria-busy).
 *
 * @param {SpinnerProps & React.HTMLAttributes<HTMLSpanElement>} props
 */
export function Spinner({ size = 'md', label = 'Loading', className, ...rest }) {
  return (
    <span
      role={label ? 'status' : undefined}
      aria-live={label ? 'polite' : undefined}
      className={cn('inline-flex items-center justify-center', className)}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={cn(
          'inline-block animate-spin rounded-full border-current border-r-transparent motion-reduce:animate-none',
          SIZES[size] || SIZES.md,
        )}
      />
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  )
}
