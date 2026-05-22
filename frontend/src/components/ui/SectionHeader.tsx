import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  index: string
  title: string
  subtitle?: string
  className?: string
  align?: 'left' | 'center'
}

export function SectionHeader({ index, title, subtitle, className, align = 'left' }: SectionHeaderProps) {
  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      <motion.p
        variants={fadeUp}
        className="font-mono text-xs tracking-[0.25em] uppercase text-accent mb-3"
      >
        {index}
      </motion.p>
      <motion.h2
        variants={fadeUp}
        className="text-3xl md:text-4xl font-semibold text-content tracking-tight"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeUp}
          className={cn(
            'mt-3 text-base md:text-lg text-muted leading-relaxed',
            align === 'left' ? 'max-w-xl' : 'max-w-2xl mx-auto'
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
