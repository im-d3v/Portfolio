import { useEffect, useState } from 'react'
import { Github, Linkedin, Mail, ArrowUp, MapPin } from 'lucide-react'
import { HERO } from '@/data/portfolio'

const STACK = ['React 18', 'Vite', 'TypeScript', 'Tailwind', 'Framer Motion']
const BACKEND = ['Spring Boot 3.3', 'Java 17', 'AWS']

function useLocalTime(timeZone = 'Asia/Kolkata') {
  const [time, setTime] = useState(() => formatTime(new Date(), timeZone))
  useEffect(() => {
    const tick = () => setTime(formatTime(new Date(), timeZone))
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [timeZone])
  return time
}

function formatTime(d: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone,
  }).format(d)
}

export function Footer() {
  const time = useLocalTime()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border/[0.07] mt-8">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Top row — brand + socials */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-1 font-mono text-sm">
            <span className="text-accent">mp</span>
            <span className="text-muted">.dev</span>
            <span className="mx-3 text-faint/30">·</span>
            <span className="text-muted">Mohit Pal — Full-Stack Engineer</span>
          </div>

          <div className="flex items-center gap-1.5">
            {[
              { Icon: Github,   href: HERO.github,                  label: 'GitHub'   },
              { Icon: Linkedin, href: HERO.linkedin,                label: 'LinkedIn' },
              { Icon: Mail,     href: `mailto:${HERO.email}`,       label: 'Email'    },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 flex items-center justify-center rounded-lg
                           text-faint hover:text-content hover:bg-elevated
                           border border-border/[0.07] hover:border-border/[0.15]
                           transition-all duration-150"
              >
                <Icon size={14} />
              </a>
            ))}
            <span className="w-px h-5 bg-border/[0.10] mx-1.5" />
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className="w-8 h-8 flex items-center justify-center rounded-lg
                         text-faint hover:text-accent hover:bg-elevated
                         border border-border/[0.07] hover:border-accent/30
                         transition-all duration-150"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/[0.06] my-8" />

        {/* Colophon grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Frontend stack */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-faint mb-3">
              Frontend
            </p>
            <div className="flex flex-wrap gap-1">
              {STACK.map(s => (
                <span
                  key={s}
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded
                             text-muted bg-elevated/60 border border-border/[0.06]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Backend stack */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-faint mb-3">
              Backend
            </p>
            <div className="flex flex-wrap gap-1">
              {BACKEND.map(s => (
                <span
                  key={s}
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded
                             text-muted bg-elevated/60 border border-border/[0.06]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-faint mb-3">
              Location
            </p>
            <div className="flex items-center gap-1.5 text-xs font-mono text-muted">
              <MapPin size={11} className="text-faint" />
              Hyderabad, IN
            </div>
            <div className="text-xs font-mono text-faint mt-1.5">
              <span className="inline-flex items-center gap-1.5">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50 animate-ping" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                {time} <span className="text-faint/60">IST · UTC+5:30</span>
              </span>
            </div>
          </div>

          {/* Build / version */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-faint mb-3">
              Build
            </p>
            <p className="text-xs font-mono text-muted">v1.0.0</p>
            <p className="text-[10px] font-mono text-faint/70 mt-1.5 leading-relaxed">
              Hand-built · 0 trackers <br />
              No cookies · No analytics
            </p>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-10 pt-6 border-t border-border/[0.05] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-[10px] font-mono text-faint/50">
            © {year} Mohit Pal · All rights reserved
          </p>
          <p className="text-[10px] font-mono text-faint/40">
            Press <kbd className="px-1 py-0.5 rounded border border-border/[0.10] bg-elevated text-faint mx-0.5">?</kbd>
            for shortcuts ·
            <kbd className="px-1 py-0.5 rounded border border-border/[0.10] bg-elevated text-faint mx-0.5">`</kbd>
            for terminal ·
            <kbd className="px-1 py-0.5 rounded border border-border/[0.10] bg-elevated text-faint mx-0.5">⌘K</kbd>
            command palette
          </p>
        </div>
      </div>
    </footer>
  )
}
