import { clsx } from 'clsx'

interface SkeletonProps {
  width?: string
  height?: string
  rounded?: boolean
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  rounded = false,
  className = '',
}) => {
  return (
    <div
      className={clsx(
        'bg-gradient-to-r from-bg-surface via-bg-hover to-bg-surface bg-[length:200%_100%]',
        'animate-shimmer',
        rounded ? 'rounded-full' : 'rounded-md',
        className,
      )}
      style={{ width, height }}
    />
  )
}
