import { clsx } from 'clsx'

interface Tab {
  id: string
  label: string
  count?: number
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  variant?: 'line' | 'pill'
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'line',
  className = '',
}) => {
  return (
    <div
      className={clsx(
        variant === 'line' && 'flex border-b border-border-default',
        variant === 'pill' && 'flex gap-1 bg-bg-surface rounded-lg p-1',
        className,
      )}
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'inline-flex items-center gap-2 font-medium transition-all duration-150 focus:outline-none',
            variant === 'line' && [
              'px-4 py-2.5 text-14 border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-accent text-text-primary'
                : 'border-transparent text-text-muted hover:text-text-secondary hover:border-border-default',
            ],
            variant === 'pill' && [
              'flex-1 px-3 py-1.5 text-13 rounded-md',
              activeTab === tab.id
                ? 'bg-bg-elevated text-text-primary'
                : 'text-text-muted hover:text-text-secondary',
            ],
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={clsx(
                'text-11 font-medium px-1.5 py-0.5 rounded-full min-w-[20px] text-center',
                activeTab === tab.id
                  ? 'bg-accent/20 text-accent'
                  : 'bg-bg-elevated text-text-muted',
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
