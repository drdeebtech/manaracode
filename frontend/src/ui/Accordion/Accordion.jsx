import { createContext, useContext, useId as useReactId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../lib/cn'
import { FOCUS_RING } from '../../lib/a11y'
import { useId } from '../../hooks/useId'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { DURATION, EASE } from '../../styles/tokens'

const AccordionContext = createContext(null)

/**
 * @typedef {object} AccordionProps
 * @property {boolean} [allowMultiple=false] allow several items open at once
 * @property {string[]} [defaultOpen=[]] item values open initially
 * @property {string} [className]
 * @property {React.ReactNode} children
 */

/**
 * Accessible accordion. Compose with Accordion.Item. Each item's header is a
 * button with aria-expanded/aria-controls; content is a region.
 *
 * @param {AccordionProps} props
 */
export function Accordion({ allowMultiple = false, defaultOpen = [], className, children }) {
  const [open, setOpen] = useState(() => new Set(defaultOpen))

  const toggle = (value) => {
    setOpen((prev) => {
      const next = new Set(allowMultiple ? prev : [])
      if (prev.has(value)) next.delete(value)
      else next.add(value)
      return next
    })
  }

  return (
    <AccordionContext.Provider value={{ open, toggle }}>
      <div className={cn('divide-y divide-border rounded-xl border border-border', className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

/** One collapsible item. `value` identifies it; `title` is the header label. */
Accordion.Item = function AccordionItem({ value, title, children, className }) {
  const ctx = useContext(AccordionContext)
  if (!ctx) throw new Error('Accordion.Item must be used within <Accordion>')
  const reduced = useReducedMotion()
  const headerId = useId()
  const panelId = useId()
  const expanded = ctx.open.has(value)

  return (
    <div className={className}>
      <h3 className="m-0">
        <button
          type="button"
          id={headerId}
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => ctx.toggle(value)}
          className={cn('flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-fg', FOCUS_RING)}
        >
          <span>{title}</span>
          <ChevronDown
            aria-hidden="true"
            className={cn('h-4 w-4 shrink-0 text-muted transition-transform duration-200 motion-reduce:transition-none', expanded && 'rotate-180')}
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={headerId}
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: DURATION.short, ease: EASE.out }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-sm text-muted">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
