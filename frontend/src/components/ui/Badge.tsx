import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'outline'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium font-mono tracking-wide',
        {
          'bg-secondary border border-border/[0.08] text-muted': variant === 'default',
          'bg-accent/10 border border-accent/20 text-accent': variant === 'accent',
          'border border-border/[0.12] text-muted bg-transparent': variant === 'outline',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
