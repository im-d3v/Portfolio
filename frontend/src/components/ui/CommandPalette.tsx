import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Hash, Mail, Github, Linkedin,
  Sun, Moon, ArrowRight, User, Layers,
  Briefcase, MessageSquare, Cpu, Sparkles, Command,
} from 'lucide-react'
import { useTheme } from '@/providers/ThemeProvider'
import { HERO } from '@/data/portfolio'
import { cn } from '@/lib/utils'

type Category = 'Navigate' | 'Connect' | 'Interface'

interface Cmd {
  id: string
  label: string
  hint?: string
  icon: React.ElementType
  category: Category
  keywords?: string[]
  run: () => void
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function CommandPalette() {
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const commands: Cmd[] = [
    { id: 'about',      label: 'Go to About',      icon: User,         category: 'Navigate', keywords: ['me', 'bio'],        run: () => scrollTo('about') },
    { id: 'stack',      label: 'Go to Tech Stack',  icon: Layers,       category: 'Navigate', keywords: ['skills', 'tech'],   run: () => scrollTo('stack') },
    { id: 'projects',   label: 'Go to Projects',    icon: Hash,         category: 'Navigate', keywords: ['work', 'code'],     run: () => scrollTo('projects') },
    { id: 'experience',    label: 'Go to Experience',    icon: Briefcase,    category: 'Navigate', keywords: ['jobs', 'epam'],               run: () => scrollTo('experience') },
    { id: 'architecture', label: 'Go to Architecture', icon: Layers,       category: 'Navigate', keywords: ['system', 'diagram', 'services'], run: () => scrollTo('architecture') },
    { id: 'philosophy',   label: 'Go to Philosophy',   icon: Cpu,          category: 'Navigate', keywords: ['principles'],                  run: () => scrollTo('philosophy') },
    { id: 'contact',    label: 'Go to Contact',     icon: MessageSquare,category: 'Navigate', keywords: ['hire', 'reach'],    run: () => scrollTo('contact') },
    { id: 'email',      label: 'Copy email address',icon: Mail,         category: 'Connect',  hint: HERO.email,              run: () => { navigator.clipboard.writeText(HERO.email); setOpen(false) } },
    { id: 'github',     label: 'Open GitHub',       icon: Github,       category: 'Connect',  hint: 'im-d3v',                run: () => { window.open(HERO.github, '_blank'); setOpen(false) } },
    { id: 'linkedin',   label: 'Open LinkedIn',     icon: Linkedin,     category: 'Connect',  hint: 'im-d3v',                run: () => { window.open(HERO.linkedin, '_blank'); setOpen(false) } },
    {
      id: 'theme',
      label: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      icon: theme === 'dark' ? Sun : Moon,
      category: 'Interface',
      keywords: ['dark', 'light', 'color'],
      run: () => { toggle(); setOpen(false) },
    },
  ]

  const filtered = query.trim()
    ? commands.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.keywords?.some(k => k.includes(query.toLowerCase()))
      )
    : commands

  const grouped = (['Navigate', 'Connect', 'Interface'] as Category[])
    .map(cat => ({ cat, items: filtered.filter(c => c.category === cat) }))
    .filter(g => g.items.length > 0)

  const flat = grouped.flatMap(g => g.items)

  const execute = useCallback((cmd: Cmd) => {
    cmd.run()
    if (cmd.category === 'Navigate') setOpen(false)
    setQuery('')
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
        setQuery('')
        setCursor(0)
      }
      if (!open) return
      if (e.key === 'Escape') { setOpen(false); setQuery('') }
      if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, flat.length - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)) }
      if (e.key === 'Enter' && flat[cursor]) execute(flat[cursor])
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, flat, cursor, execute])

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 80) }
  }, [open])

  useEffect(() => { setCursor(0) }, [query])

  // Scroll cursor into view
  useEffect(() => {
    const el = listRef.current?.querySelectorAll('[data-cmd-item]')[cursor] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [cursor])

  return (
    <>
      {/* Trigger hint */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg
                   text-faint hover:text-muted text-xs font-mono
                   border border-border/[0.07] hover:border-border/[0.12]
                   bg-secondary/40 hover:bg-elevated transition-all duration-200"
        aria-label="Open command palette"
      >
        <Command size={11} />
        <span>K</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => { setOpen(false); setQuery('') }}
              className="fixed inset-0 z-[300] bg-primary/60 backdrop-blur-sm"
            />

            {/* Palette */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-[18vh] left-1/2 -translate-x-1/2 z-[400]
                         w-full max-w-[560px] mx-4
                         bg-secondary/95 backdrop-blur-2xl
                         border border-border/[0.1] rounded-2xl
                         shadow-2xl shadow-primary/60 overflow-hidden"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/[0.07]">
                <Search size={15} className="text-faint shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search commands…"
                  className="flex-1 bg-transparent text-sm text-content placeholder:text-faint/50
                             outline-none font-mono"
                />
                <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] font-mono text-faint/50
                                border border-border/[0.08] rounded px-1.5 py-0.5 bg-elevated">
                  esc
                </kbd>
              </div>

              {/* Commands list */}
              <div ref={listRef} className="max-h-[360px] overflow-y-auto py-2">
                {grouped.length === 0 ? (
                  <p className="text-center text-xs text-faint py-8 font-mono">No commands found</p>
                ) : (
                  grouped.map(({ cat, items }) => {
                    return (
                      <div key={cat}>
                        <p className="px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest text-faint/60">
                          {cat}
                        </p>
                        {items.map(cmd => {
                          const globalIdx = flat.indexOf(cmd)
                          const isActive = cursor === globalIdx
                          const Icon = cmd.icon
                          return (
                            <button
                              key={cmd.id}
                              data-cmd-item
                              onClick={() => execute(cmd)}
                              onMouseEnter={() => setCursor(globalIdx)}
                              className={cn(
                                'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100',
                                isActive
                                  ? 'bg-accent/[0.08] text-content'
                                  : 'text-muted hover:bg-elevated'
                              )}
                            >
                              <div className={cn(
                                'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                                isActive ? 'bg-accent/15' : 'bg-elevated'
                              )}>
                                <Icon size={13} className={isActive ? 'text-accent' : 'text-faint'} />
                              </div>
                              <span className="flex-1 text-sm">{cmd.label}</span>
                              {cmd.hint && (
                                <span className="text-[11px] font-mono text-faint/60 truncate max-w-[160px]">
                                  {cmd.hint}
                                </span>
                              )}
                              {isActive && (
                                <ArrowRight size={11} className="text-accent/60 shrink-0" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )
                  })
                )}
              </div>

              {/* Footer hint */}
              <div className="px-4 py-2.5 border-t border-border/[0.06] flex items-center gap-4">
                {[
                  { keys: ['↑', '↓'], label: 'navigate' },
                  { keys: ['↵'], label: 'select' },
                  { keys: ['esc'], label: 'close' },
                ].map(({ keys, label }) => (
                  <span key={label} className="flex items-center gap-1.5 text-[10px] text-faint/50 font-mono">
                    {keys.map(k => (
                      <kbd key={k} className="border border-border/[0.08] rounded px-1 py-0.5 bg-elevated text-faint/60">
                        {k}
                      </kbd>
                    ))}
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
