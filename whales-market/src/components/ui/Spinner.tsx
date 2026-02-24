interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  xs: 'w-3 h-3 border',
  sm: 'w-4 h-4 border-2',
  md: 'w-5 h-5 border-2',
  lg: 'w-6 h-6 border-2',
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'sm', className = '' }) => {
  return (
    <div
      className={`${sizeMap[size]} rounded-full border-text-muted border-t-accent animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}
