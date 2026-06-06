import { cloneElement, useState } from 'react'
import { cn } from '../../lib/cn'
import { KEYS } from '../../lib/a11y'
import { useId } from '../../hooks/useId'

/**
 * @typedef {object} TooltipProps
 * @property {string} label the tooltip text
 * @property {'top'|'bottom'} [side='top']
 * @property {React.ReactElement} children the trigger (must accept aria-describedby)
 * @property {string} [className]
 */

const SIDE = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
}

/**
 * Text tooltip shown on hover and keyboard focus, dismissible with Escape
 * (WCAG 1.4.13). The trigger keeps its own semantics; the tip is wired via
 * aria-describedby. Wrap a single focusable element.
 *
 * @param {TooltipProps} props
 */
export function Tooltip({ label, side = 'top', children, className }) {
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === KEYS.ESCAPE) setOpen(false)
      }}
    >
      {/* Apply aria-describedby to the actual trigger, not the wrapper, so the
          description reliably reaches the focused element. Merge with any
          existing value (space-separated per ARIA) rather than replacing it. */}
      {cloneElement(children, {
        'aria-describedby': open
          ? [children.props['aria-describedby'], id].filter(Boolean).join(' ')
          : children.props['aria-describedby'],
      })}
      <span
        role="tooltip"
        id={id}
        className={cn(
          'pointer-events-none absolute z-[60] whitespace-nowrap rounded-md bg-fg px-2 py-1 text-xs text-surface',
          'transition-opacity duration-150 motion-reduce:transition-none',
          open ? 'opacity-100' : 'opacity-0',
          SIDE[side] || SIDE.top,
          className,
        )}
      >
        {label}
      </span>
    </span>
  )
}
