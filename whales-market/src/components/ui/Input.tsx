import React from 'react'
import { clsx } from 'clsx'

interface InputProps {
  label?: string
  placeholder?: string
  value: string | number
  onChange: (value: string) => void
  type?: 'text' | 'number' | 'date' | 'search' | 'email'
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  error?: string
  hint?: string
  disabled?: boolean
  readOnly?: boolean
  rightAction?: React.ReactNode
  className?: string
  id?: string
  min?: number | string
  max?: number
  step?: number | string
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  prefix,
  suffix,
  error,
  hint,
  disabled = false,
  readOnly = false,
  rightAction,
  className = '',
  id,
  min,
  max,
  step,
}) => {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="text-13 font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div
        className={clsx(
          'flex items-center rounded-lg border bg-bg-surface transition-colors duration-150',
          error
            ? 'border-border-danger'
            : 'border-border-default focus-within:border-border-active',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        {prefix && (
          <span className="pl-3 text-text-muted text-14 shrink-0">{prefix}</span>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          min={min}
          max={max}
          step={step}
          onChange={e => onChange(e.target.value)}
          className={clsx(
            'flex-1 bg-transparent px-3 py-2.5 text-14 text-text-primary placeholder:text-text-muted',
            'focus:outline-none',
            readOnly && 'cursor-default select-none',
            disabled && 'cursor-not-allowed',
            !prefix && 'pl-3',
            !suffix && !rightAction && 'pr-3',
          )}
        />
        {suffix && (
          <span className="pr-3 text-text-muted text-13 font-medium shrink-0">{suffix}</span>
        )}
        {rightAction && (
          <div className="pr-2 shrink-0">{rightAction}</div>
        )}
      </div>
      {error && (
        <p className="text-12 text-danger">{error}</p>
      )}
      {hint && !error && (
        <p className="text-12 text-text-muted">{hint}</p>
      )}
    </div>
  )
}
