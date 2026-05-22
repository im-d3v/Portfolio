import { useState, useEffect } from 'react'
import {
  SECTION_IDS,
  SECTION_LABELS,
  useActiveSection,
  scrollToSection,
} from '@/hooks/useActiveSection'
import { cn } from '@/lib/utils'

export function SectionRail() {
  const active = useActiveSection()
  const [pastHero, setPastHero] = useState(false)

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.5)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      aria-label="Page sections"
      className={cn(
        'fixed right-5 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-end gap-1',
        'transition-opacity duration-500',
        pastHero ? 'opacity-100' : 'opacity-0 pointer-events-none',
      )}
    >
      {/* Index marker */}
      <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-faint/40 mb-2 mr-0.5">
        {String(active + 1).padStart(2, '0')} / {String(SECTION_IDS.length).padStart(2, '0')}
      </span>

      {SECTION_IDS.map((id, i) => {
        const isActive = i === active
        return (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            aria-label={`Jump to ${SECTION_LABELS[id]}`}
            aria-current={isActive ? 'true' : undefined}
            className="group relative flex items-center justify-end h-6 pl-6 pr-1"
          >
            {/* Tooltip label */}
            <span
              className={cn(
                'absolute right-full mr-3 px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap',
                'bg-secondary/95 backdrop-blur border border-border/[0.10]',
                'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0',
                'transition-all duration-150 pointer-events-none',
                isActive ? 'text-accent' : 'text-muted',
              )}
            >
              {SECTION_LABELS[id]}
            </span>

            {/* Dot */}
            <span
              className={cn(
                'block rounded-full transition-all duration-200',
                isActive
                  ? 'w-2 h-2 bg-accent shadow-[0_0_8px_rgba(122,122,255,0.5)]'
                  : 'w-1.5 h-1.5 bg-faint/35 group-hover:bg-faint group-hover:scale-125',
              )}
            />
          </button>
        )
      })}
    </nav>
  )
}
