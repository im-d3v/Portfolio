import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Keyboard } from 'lucide-react'
import { useTheme } from '@/providers/ThemeProvider'
import { SECTION_IDS, scrollToSection } from '@/hooks/useActiveSection'
import { EASE } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface Shortcut {
  keys: string[]
  label: string
}

const NAVIGATE: Shortcut[] = [
  { keys: ['1'], label: 'Jump to About' },
  { keys: ['2'], label: 'Jump to Stack' },
  { keys: ['3'], label: 'Jump to Projects' },
  { keys: ['4'], label: 'Jump to Experience' },
  { keys: ['5'], label: 'Jump to Architecture' },
  { keys: ['6'], label: 'Jump to Philosophy' },
  { keys: ['7'], label: 'Jump to Contact' },
  { keys: ['0'], label: 'Jump to Top' },
  { keys: ['j'], label: 'Next section' },
  { keys: ['k'], label: 'Previous section' },
]

const TOOLS: Shortcut[] = [
  { keys: ['`'],      label: 'Toggle Terminal' },
  { keys: ['⌘', 'K'], label: 'Command Palette' },
]

const INTERFACE: Shortcut[] = [
  { keys: ['t'],   label: 'Toggle Theme' },
  { keys: ['?'],   label: 'Show shortcuts' },
  { keys: ['Esc'], label: 'Close any overlay' },
]

function getActiveIdx(): number {
  const mark = window.scrollY + window.innerHeight * 0.35
  let idx = -1
  SECTION_IDS.forEach((id, i) => {
    const el = document.getElementById(id)
    if (el && el.offsetTop <= mark) idx = i
  })
  return idx
}

function ShortcutGroup({ title, items }: { title: string; items: Shortcut[] }) {
  return (
    <div>
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-faint/60 mb-3">
        {title}
      </p>
      <div className="space-y-1.5">
        {items.map(s => (
          <div key={s.label} className="flex items-center justify-between gap-3 py-1">
            <span className="text-[12px] text-muted">{s.label}</span>
            <div className="flex items-center gap-1 shrink-0">
              {s.keys.map(k => (
                <kbd
                  key={k}
                  className="min-w-[22px] h-[22px] px-1.5 inline-flex items-center justify-center
                             rounded text-[10px] font-mono font-medium
                             bg-elevated border border-border/[0.10] text-content/80
                             shadow-[0_1px_0_rgba(255,255,255,0.04)]"
                >
                  {k}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ShortcutOverlay() {
  const { toggle } = useTheme()
  const [open, setOpen] = useState(false)

  const navByNumber = useCallback((n: number) => {
    if (n === 0) return scrollToSection('top')
    if (n >= 1 && n <= SECTION_IDS.length) {
      scrollToSection(SECTION_IDS[n - 1])
    }
  }, [])

  const navJK = useCallback((dir: 1 | -1) => {
    const cur = getActiveIdx()
    if (dir === 1) {
      const next = Math.min(cur + 1, SECTION_IDS.length - 1)
      if (next > cur) scrollToSection(SECTION_IDS[next])
    } else {
      if (cur <= 0) return scrollToSection('top')
      scrollToSection(SECTION_IDS[cur - 1])
    }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Skip when typing
      const t = e.target as HTMLElement
      if (t?.tagName === 'INPUT' || t?.tagName === 'TEXTAREA' || t?.isContentEditable) return

      // Always-handled keys (work even when overlay open)
      if (e.key === '?') { e.preventDefault(); setOpen(o => !o); return }
      if (e.key === 'Escape') { setOpen(false); return }

      // Don't trigger nav when overlay is open or with modifier keys
      if (open || e.metaKey || e.ctrlKey || e.altKey) return

      const k = e.key

      if (k === 't') { e.preventDefault(); toggle(); return }
      if (k === 'j') { e.preventDefault(); navJK(1); return }
      if (k === 'k') { e.preventDefault(); navJK(-1); return }

      const num = parseInt(k, 10)
      if (!Number.isNaN(num) && num >= 0 && num <= 7) {
        e.preventDefault()
        navByNumber(num)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, toggle, navByNumber, navJK])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[300] bg-primary/60 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.18, ease: EASE }}
            className={cn(
              'fixed top-[12vh] left-1/2 -translate-x-1/2 z-[400]',
              'w-full max-w-[640px] mx-4',
              'bg-secondary/95 backdrop-blur-2xl',
              'border border-border/[0.10] rounded-2xl',
              'shadow-2xl shadow-primary/60 overflow-hidden',
            )}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border/[0.07]">
              <div className="w-8 h-8 rounded-lg bg-elevated border border-border/[0.08]
                              flex items-center justify-center">
                <Keyboard size={14} className="text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-content">Keyboard Shortcuts</h3>
                <p className="text-[11px] font-mono text-faint/60">
                  Power-user navigation · Vim-style
                </p>
              </div>
              <kbd className="text-[10px] font-mono text-faint/50
                              border border-border/[0.08] rounded px-1.5 py-0.5 bg-elevated">
                esc
              </kbd>
            </div>

            {/* Body */}
            <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7 max-h-[60vh] overflow-y-auto">
              <ShortcutGroup title="Navigate"  items={NAVIGATE} />
              <div className="space-y-7">
                <ShortcutGroup title="Tools"      items={TOOLS} />
                <ShortcutGroup title="Interface"  items={INTERFACE} />
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-border/[0.06] flex items-center justify-between">
              <p className="text-[10px] font-mono text-faint/50">
                Inputs are excluded from shortcuts.
              </p>
              <p className="text-[10px] font-mono text-faint/50">
                Press <kbd className="px-1 py-0.5 rounded border border-border/[0.10] bg-elevated text-faint mx-0.5">?</kbd>
                anytime
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
