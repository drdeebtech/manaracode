import { forwardRef, useRef } from 'react'
import { cn } from '../../lib/cn'
import { FOCUS_RING } from '../../lib/a11y'
import { useThreeButton } from '../../hooks/useThreeButton'
import { Spinner } from '../Spinner/Spinner'

/**
 * @typedef {'primary'|'secondary'|'ghost'|'webgl'} ButtonVariant
 * @typedef {'sm'|'md'|'lg'} ButtonSize
 *
 * @typedef {object} ButtonOwnProps
 * @property {ButtonVariant} [variant='primary']
 * @property {ButtonSize} [size='md']
 * @property {boolean} [loading=false] shows a spinner, sets aria-busy, blocks onClick
 * @property {boolean} [disabled=false]
 * @property {boolean} [fullWidth=false]
 * @property {React.ComponentType<{ className?: string }>} [Icon] Lucide SVG icon (never emoji)
 * @property {'left'|'right'} [iconPosition='right']
 * @property {'button'|'submit'|'reset'} [type='button']
 * @property {string} [className]
 * @property {React.ReactNode} children visible label = accessible name
 */

const BASE =
  'relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl cursor-pointer ' +
  'transition-opacity duration-200 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed ' +
  FOCUS_RING

const VARIANTS = {
  // `webgl` renders identically to `primary` at the DOM level; the optional 3D
  // mesh is decorative and layered behind it. Tokens only — see styles/tokens.css.
  // Transitions stay on opacity (compositor-friendly). text-on-accent is dark so
  // it stays readable on the light/medium accent-warm fill (white fails ~1.7:1).
  primary: 'bg-accent-warm text-on-accent',
  webgl: 'bg-accent-warm text-on-accent',
  secondary: 'border-2 border-accent text-accent bg-transparent hover:bg-accent-soft',
  ghost: 'text-accent bg-transparent hover:bg-accent-soft',
}

const SIZES = {
  sm: 'text-sm px-3.5 py-2 min-h-[36px]',
  md: 'text-sm px-5 py-3 min-h-[44px]', // >= 44px touch target
  lg: 'text-base px-7 py-3.5 min-h-[52px]',
}

/**
 * Accessible button. Always a real <button> so keyboard, focus, and click are
 * native. The `webgl` variant additionally registers its rect with the shared
 * 3D scene (no-op until the Three.js layer ships); 3D never gates interaction.
 *
 * @type {React.ForwardRefExoticComponent<ButtonOwnProps & React.ButtonHTMLAttributes<HTMLButtonElement>>}
 */
export const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    Icon,
    iconPosition = 'right',
    type = 'button',
    className,
    children,
    onClick,
    ...rest
  },
  forwardedRef,
) {
  const innerRef = useRef(null)
  const ref = forwardedRef || innerRef

  // Decorative 3D hook — no-op unless the engine is mounted and supported.
  useThreeButton(variant === 'webgl' ? ref : null, { variant })

  const isDisabled = disabled || loading
  const icon = Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      onClick={onClick}
      className={cn(
        BASE,
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading && <Spinner size="sm" label="" className="text-current" />}
      {!loading && icon && iconPosition === 'left' && icon}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  )
})
