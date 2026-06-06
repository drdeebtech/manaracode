import { createContext, useContext, useId as useReactId, useRef, useState } from 'react'
import { cn } from '../../lib/cn'
import { FOCUS_RING, KEYS } from '../../lib/a11y'

const TabsContext = createContext(null)

/**
 * @typedef {object} TabsProps
 * @property {string} [defaultValue]
 * @property {string} [value] controlled active value
 * @property {(value: string) => void} [onValueChange]
 * @property {string} [className]
 * @property {React.ReactNode} children
 */

/**
 * Accessible tabs (WAI-ARIA tabs pattern). Compose with Tabs.List,
 * Tabs.Trigger, Tabs.Content. Controlled (value) or uncontrolled (defaultValue).
 * If neither value nor defaultValue is given, the first Tabs.Trigger is
 * selected so the tablist stays keyboard-reachable.
 *
 * @param {TabsProps} props
 */
export function Tabs({ defaultValue, value, onValueChange, className, children }) {
  const [internal, setInternal] = useState(defaultValue)
  const active = value !== undefined ? value : internal
  const baseId = useReactId()
  // First registered trigger value — used as the fallback selection when none
  // is provided (set during the children's render pass).
  const firstValue = useRef(null)

  const setActive = (v) => {
    if (value === undefined) setInternal(v)
    onValueChange?.(v)
  }
  const registerFirst = (v) => {
    if (firstValue.current === null) firstValue.current = v
  }
  const resolveActive = () => (active !== undefined ? active : firstValue.current)

  return (
    <TabsContext.Provider value={{ active, setActive, baseId, registerFirst, resolveActive }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs.* must be used within <Tabs>')
  return ctx
}

/** Tablist container with roving, direction-aware arrow-key navigation. */
Tabs.List = function TabsList({ className, children, label }) {
  const ref = useRef(null)

  const onKeyDown = (e) => {
    const keys = [KEYS.ARROW_LEFT, KEYS.ARROW_RIGHT, KEYS.HOME, KEYS.END]
    if (!keys.includes(e.key)) return
    const tabs = Array.from(ref.current?.querySelectorAll('[role="tab"]:not([disabled])') || [])
    const idx = tabs.indexOf(document.activeElement)
    if (idx === -1) return
    e.preventDefault()
    // Respect RTL: ArrowRight should move to the previous tab in RTL layouts.
    const rtl = typeof window !== 'undefined' && window.getComputedStyle(ref.current).direction === 'rtl'
    const forward = rtl ? KEYS.ARROW_LEFT : KEYS.ARROW_RIGHT
    const backward = rtl ? KEYS.ARROW_RIGHT : KEYS.ARROW_LEFT
    let next = idx
    if (e.key === forward) next = (idx + 1) % tabs.length
    else if (e.key === backward) next = (idx - 1 + tabs.length) % tabs.length
    else if (e.key === KEYS.HOME) next = 0
    else if (e.key === KEYS.END) next = tabs.length - 1
    tabs[next].focus()
    tabs[next].click()
  }

  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn('flex gap-1 border-b border-border', className)}
    >
      {children}
    </div>
  )
}

/** A tab button. `value` ties it to a Tabs.Content. */
Tabs.Trigger = function TabsTrigger({ value, disabled, className, children }) {
  const { setActive, baseId, registerFirst, resolveActive } = useTabs()
  if (!disabled) registerFirst(value)
  const selected = resolveActive() === value
  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      onClick={() => setActive(value)}
      className={cn(
        '-mb-px inline-flex min-h-[44px] cursor-pointer items-center border-b-2 px-4 py-2 text-sm font-medium transition-opacity duration-200',
        selected ? 'border-accent text-accent' : 'border-transparent text-muted hover:opacity-80',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        FOCUS_RING,
        className,
      )}
    >
      {children}
    </button>
  )
}

/** Panel for a given `value`. Only the active panel is rendered. */
Tabs.Content = function TabsContent({ value, className, children }) {
  const { baseId, resolveActive } = useTabs()
  if (resolveActive() !== value) return null
  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      className={cn('pt-4', FOCUS_RING, className)}
    >
      {children}
    </div>
  )
}
