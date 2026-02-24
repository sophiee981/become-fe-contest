import React from 'react'
import { clsx } from 'clsx'
import { Spinner } from './Spinner'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'buy' | 'sell' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  children,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-1 focus:ring-offset-bg-base',
        variant === 'primary'   && 'bg-accent text-text-inverse hover:bg-accent/90 active:bg-accent/80',
        variant === 'secondary' && 'bg-bg-elevated text-text-primary hover:bg-bg-hover border border-border-default active:bg-bg-active',
        variant === 'ghost'     && 'bg-transparent text-text-secondary hover:bg-bg-hover hover:text-text-primary active:bg-bg-active',
        variant === 'outline'   && 'bg-transparent text-accent border border-accent hover:bg-accent/10 active:bg-accent/20',
        variant === 'danger'    && 'bg-danger text-white hover:bg-danger/90 active:bg-danger/80',
        variant === 'buy'       && 'bg-buy text-text-inverse hover:bg-buy/90 active:bg-buy/80',
        variant === 'sell'      && 'bg-sell text-white hover:bg-sell/90 active:bg-sell/80',
        size === 'sm' && 'px-3 py-1.5 text-12 rounded-md',
        size === 'md' && 'px-4 py-2 text-14 rounded-lg',
        size === 'lg' && 'px-6 py-3 text-16 rounded-lg',
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
        className,
      )}
    >
      {loading ? (
        <Spinner size="sm" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  )
}
