import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { FOCUS_RING } from '../../lib/a11y'
import { DURATION, EASE } from '../../styles/tokens'

/**
 * @typedef {object} ToastData
 * @property {string} id
 * @property {string} title
 * @property {string} [description]
 * @property {'info'|'success'|'error'} [tone]
 */

const TONE_BAR = {
  info: 'bg-accent',
  success: 'bg-success',
  error: 'bg-error',
}

/**
 * A single toast card. Decorative tone bar; dismiss button is keyboard
 * accessible. Motion respects the provider's reduced-motion handling.
 *
 * @param {{ toast: ToastData, onDismiss: (id: string) => void, reduced: boolean }} props
 */
export function Toast({ toast, onDismiss, reduced }) {
  const motionProps = reduced
    ? { initial: false, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 24 },
        transition: { duration: DURATION.short, ease: EASE.out },
        layout: true,
      }

  return (
    <motion.div
      {...motionProps}
      className="relative flex w-80 max-w-[90vw] items-start gap-3 overflow-hidden rounded-xl border border-border bg-surface p-4 shadow-xl shadow-black/20"
    >
      <span aria-hidden="true" className={cn('absolute inset-y-0 left-0 w-1', TONE_BAR[toast.tone] || TONE_BAR.info)} />
      <div className="min-w-0 flex-1 pl-1">
        <p className="text-sm font-semibold text-fg">{toast.title}</p>
        {toast.description && <p className="mt-0.5 text-xs text-muted">{toast.description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className={cn(
          '-m-2 inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-md text-muted hover:text-fg cursor-pointer',
          FOCUS_RING,
        )}
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </motion.div>
  )
}
