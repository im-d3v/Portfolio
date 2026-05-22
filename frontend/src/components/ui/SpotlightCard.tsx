import { useSpotlight } from '@/hooks/useSpotlight'
import { cn } from '@/lib/utils'

interface SpotlightCardProps {
  children: React.ReactNode
  className?: string
  radius?: number
}

export function SpotlightCard({ children, className, radius }: SpotlightCardProps) {
  const { ref, spotlightStyle, handlers } = useSpotlight(radius)

  return (
    <div ref={ref} className={cn('relative', className)} {...handlers}>
      {/* Spotlight layer */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-0"
        style={spotlightStyle}
      />
      {/* Content */}
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}
