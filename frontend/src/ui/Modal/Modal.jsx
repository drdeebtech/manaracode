import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../lib/cn'
import { KEYS } from '../../lib/a11y'
import { useId } from '../../hooks/useId'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { DURATION, EASE } from '../../styles/tokens'

/**
 * @typedef {object} ModalProps
 * @property {boolean} open
 * @property {() => void} onClose
 * @property {string} title labels the dialog (aria-labelledby)
 * @property {string} [description] aria-describedby
 * @property {'sm'|'md'|'lg'} [size='md']
 * @property {boolean} [closeOnOverlay=true]
 * @property {React.ReactNode} [footer]
 * @property {React.ReactNode} children
 */

const SIZES = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

/**
 * Accessible modal dialog rendered in a portal. Traps focus while open,
 * restores it on close, locks body scroll, closes on Escape / overlay click.
 *
 * @param {ModalProps} props
 */
export function Modal({ open, onClose, title, description, size = 'md', closeOnOverlay = true, footer, children }) {
  const reduced = useReducedMotion()
  const trapRef = useFocusTrap(open)
  const titleId = useId()
  const descId = useId()

  // Lock body scroll while open. Keyed only on `open` so an unstable onClose
  // reference from the parent can't thrash the scroll lock on every render.
  useEffect(() => {
    if (!open) return undefined
    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = prevOverflow
    }
  }, [open])

  // Close on Escape.
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === KEYS.ESCAPE) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  const motionProps = reduced
    ? { initial: false, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, scale: 0.96, y: 8 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.98, y: 4 },
        transition: { duration: DURATION.short, ease: EASE.out },
      }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ zIndex: 'var(--z-modal, 60)' }}>
          <motion.div
            className={cn('absolute inset-0 bg-black/50', closeOnOverlay && 'cursor-pointer')}
            onClick={closeOnOverlay ? onClose : undefined}
            aria-hidden="true"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.short }}
          />
          <motion.div
            ref={trapRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            className={cn(
              'relative w-full rounded-2xl bg-surface p-6 shadow-2xl shadow-black/30 border border-border',
              SIZES[size] || SIZES.md,
            )}
            {...motionProps}
          >
            <h2 id={titleId} className="font-heading text-xl font-bold text-fg">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-1 text-sm text-muted">
                {description}
              </p>
            )}
            <div className="mt-4 text-sm text-fg">{children}</div>
            {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
