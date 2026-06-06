import { cn } from '../../lib/cn'

/**
 * @typedef {object} EmptyStateOwnProps
 * @property {React.ComponentType<{ className?: string }>} [Icon] Lucide SVG (decorative)
 * @property {string} title
 * @property {string} [description]
 * @property {React.ReactNode} [action] usually a <Button>
 * @property {'empty'|'success'|'error'} [tone='empty']
 * @property {'h2'|'h3'} [as='h3']
 * @property {string} [className]
 */

const TONE_ICON = {
  empty: 'bg-blue-50 text-blue-500',
  success: 'bg-green-100 text-green-500',
  error: 'bg-red-100 text-red-500',
}

/**
 * Centered status block reused for empty lists, success confirmations, and
 * error fallbacks. `error` announces assertively (role="alert"); others
 * announce politely (role="status").
 *
 * @param {EmptyStateOwnProps & React.HTMLAttributes<HTMLDivElement>} props
 */
export function EmptyState({
  Icon,
  title,
  description,
  action,
  tone = 'empty',
  as: Heading = 'h3',
  className,
  ...rest
}) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn('flex flex-col items-center justify-center py-12 text-center', className)}
      {...rest}
    >
      {Icon && (
        <div
          className={cn(
            'mb-4 flex h-16 w-16 items-center justify-center rounded-full',
            TONE_ICON[tone] || TONE_ICON.empty,
          )}
        >
          <Icon className="h-8 w-8" aria-hidden="true" />
        </div>
      )}
      <Heading className="font-heading text-xl font-bold text-blue-900 mb-2">{title}</Heading>
      {description && <p className="max-w-sm text-sm text-blue-600">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
