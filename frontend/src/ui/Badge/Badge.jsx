import { cn } from '../../lib/cn'

/**
 * @typedef {object} BadgeOwnProps
 * @property {'neutral'|'accent'|'success'|'warning'|'error'} [tone='neutral']
 * @property {string} [className]
 */

// Soft token background + fg text keeps contrast safe in both themes; tone is
// carried by the background.
const TONES = {
  neutral: 'bg-neutral-soft text-muted',
  accent: 'bg-accent-soft text-fg',
  success: 'bg-success-soft text-fg',
  warning: 'bg-warning-soft text-fg',
  error: 'bg-error-soft text-fg',
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
