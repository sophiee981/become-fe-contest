import { clsx } from 'clsx'

interface BadgeProps {
  label: string
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'buy' | 'sell' | 'purple'
  size?: 'sm' | 'md'
  dot?: boolean
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'sm',
  dot = false,
  className = '',
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-md',
        size === 'sm' && 'px-2 py-0.5 text-11',
        size === 'md' && 'px-2.5 py-1 text-12',
        variant === 'success' && 'bg-success/10 text-success',
        variant === 'danger'  && 'bg-danger/10 text-danger',
        variant === 'warning' && 'bg-warning/10 text-warning',
        variant === 'info'    && 'bg-info/10 text-info',
        variant === 'neutral' && 'bg-bg-elevated text-text-secondary',
        variant === 'buy'     && 'bg-buy/10 text-buy',
        variant === 'sell'    && 'bg-sell/10 text-sell',
        variant === 'purple'  && 'bg-purple/10 text-purple',
        className,
      )}
    >
      {dot && (
        <span
          className={clsx(
            'w-1.5 h-1.5 rounded-full shrink-0',
            variant === 'success' && 'bg-success',
            variant === 'danger'  && 'bg-danger',
            variant === 'warning' && 'bg-warning',
            variant === 'info'    && 'bg-info',
            variant === 'neutral' && 'bg-text-muted',
            variant === 'buy'     && 'bg-buy',
            variant === 'sell'    && 'bg-sell',
            variant === 'purple'  && 'bg-purple',
          )}
        />
      )}
      {label}
    </span>
  )
}
