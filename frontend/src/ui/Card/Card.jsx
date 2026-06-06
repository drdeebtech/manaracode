import { cn } from '../../lib/cn'

/**
 * @typedef {object} CardOwnProps
 * @property {'default'|'outlined'|'elevated'} [variant='default']
 * @property {'sm'|'md'|'lg'} [padding='md']
 * @property {keyof JSX.IntrinsicElements} [as='div']
 * @property {string} [className]
 */

const VARIANTS = {
  default: 'bg-surface border border-border',
  outlined: 'bg-transparent border border-border',
  elevated: 'bg-surface shadow-xl shadow-black/10 border border-border',
}

const PADDING = { sm: 'p-4', md: 'p-6', lg: 'p-8' }

/**
 * Surface container. Renders as a plain <div> by default; pass `as` for a
 * semantic element (e.g. 'article', 'section', 'li').
 *
 * @param {CardOwnProps & React.HTMLAttributes<HTMLElement>} props
 */
export function Card({ variant = 'default', padding = 'md', as: Tag = 'div', className, children, ...rest }) {
  return (
    <Tag
      className={cn('rounded-2xl', VARIANTS[variant] || VARIANTS.default, PADDING[padding] || PADDING.md, className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}
