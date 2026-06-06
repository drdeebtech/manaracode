import { cn } from '../../lib/cn'

/**
 * @typedef {object} SkeletonOwnProps
 * @property {string} [width] CSS width (e.g. '100%', '8rem')
 * @property {string} [height] CSS height
 * @property {boolean} [circle=false]
 * @property {string} [className]
 */

/**
 * Content placeholder shown while data loads. Decorative (aria-hidden); pair
 * with a visually-hidden "Loading" status where the loading state isn't
 * otherwise announced. Pulse is opacity-based and disabled under reduced motion.
 *
 * @param {SkeletonOwnProps & React.HTMLAttributes<HTMLSpanElement>} props
 */
export function Skeleton({ width, height, circle = false, className, style, ...rest }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'block animate-pulse bg-blue-100/70 motion-reduce:animate-none',
        circle ? 'rounded-full' : 'rounded-md',
        className,
      )}
      style={{ width, height, ...style }}
      {...rest}
    />
  )
}
