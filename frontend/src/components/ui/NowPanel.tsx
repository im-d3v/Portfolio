import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { NOW } from '@/data/portfolio'
import { fadeUp } from '@/lib/animations'

function useLocalTime(timeZone = 'Asia/Kolkata') {
  const [time, setTime] = useState(() => format(new Date(), timeZone))
  useEffect(() => {
    const tick = () => setTime(format(new Date(), timeZone))
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [timeZone])
  return time
}

function format(d: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone,
  }).format(d)
}

const FIELDS: Array<{ key: keyof typeof NOW; label: string }> = [
  { key: 'workingOn', label: 'working on' },
  { key: 'reading',   label: 'reading'    },
  { key: 'learning',  label: 'learning'   },
  { key: 'available', label: 'available'  },
]

export function NowPanel() {
  const time = useLocalTime()

  return (
    <motion.div
      variants={fadeUp}
      className="relative rounded-xl border border-border/[0.10] overflow-hidden"
      style={{ background: 'rgb(var(--secondary))' }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b border-border/[0.07]"
        style={{ background: 'rgb(var(--elevated))' }}
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-faint/70">
            now · live
          </span>
        </div>
        <span className="text-[10px] font-mono text-faint/60">
          {time} <span className="text-faint/40">IST</span>
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-3.5 space-y-2 font-mono text-xs">
        {FIELDS.map(({ key, label }) => (
          <div key={key} className="flex items-baseline gap-2.5 leading-relaxed min-w-0">
            <span className="text-accent/80 select-none shrink-0">$</span>
            <span className="w-[88px] text-faint shrink-0">{label}</span>
            <span className="text-faint/50 select-none shrink-0">→</span>
            <span className="text-muted truncate min-w-0">{NOW[key]}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
