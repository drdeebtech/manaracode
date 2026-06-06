import { cn } from '../../lib/cn'

/**
 * @typedef {object} BadgeOwnProps
 * @property {'neutral'|'accent'|'success'|'warning'|'error'} [tone='neutral']
 * @property {string} [className]
 */

const TONES = {
  neutral: 'bg-blue-50 text-blue-700',
  accent: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-800',
  error: 'bg-red-100 text-red-700',
}

/**
 * Small status/label pill.
 *
 * @param {BadgeOwnProps & React.HTMLAttributes<HTMLSpanElement>} props
 */
export function Badge({ tone = 'neutral', className, children, ...rest }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        TONES[tone] || TONES.neutral,
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}
