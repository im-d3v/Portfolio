import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { stagger } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  className?: string
  delay?: number
  once?: boolean
}

export function AnimatedSection({ children, className, delay = 0, once = true }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-80px 0px' })

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.09, delayChildren: delay },
        },
      }}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
