import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { Toast } from './Toast'

/** @typedef {import('./Toast').ToastData} ToastData */

const ToastContext = createContext(null)

const DEFAULT_DURATION = 5000

/**
 * Provides the toast API and renders the live region. Wrap the app once.
 *
 * @param {{ children: React.ReactNode, duration?: number }} props
 */
export function ToastProvider({ children, duration = DEFAULT_DURATION }) {
  const [toasts, setToasts] = useState(/** @type {ToastData[]} */ ([]))
  const reduced = useReducedMotion()
  const counter = useRef(0)
  const timers = useRef(new Map())

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const toast = useCallback(
    /** @param {Omit<ToastData,'id'>} data */
    (data) => {
      counter.current += 1
      const id = `toast-${counter.current}`
      setToasts((list) => [...list, { ...data, id }])
      const timer = setTimeout(() => dismiss(id), duration)
      timers.current.set(id, timer)
      return id
    },
    [dismiss, duration],
  )

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-[70] flex flex-col gap-3"
        style={{ zIndex: 'var(--z-toast, 70)' }}
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <Toast toast={t} onDismiss={dismiss} reduced={reduced} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

/**
 * Access the toast API. Must be used within a ToastProvider.
 *
 * @returns {{ toast: (data: Omit<ToastData,'id'>) => string, dismiss: (id: string) => void }}
 */
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a <ToastProvider>')
  return ctx
}
