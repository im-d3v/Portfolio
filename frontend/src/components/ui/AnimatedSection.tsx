import { useEffect, useRef, useState } from 'react'
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
  const [forceVisible, setForceVisible] = useState(false)
  const inView = useInView(ref, { once, margin: '-80px 0px' })

  useEffect(() => {
    if (typeof window === 'undefined') return
    setForceVisible(window.innerWidth < 768)
  }, [])

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
      animate={forceVisible || inView ? 'visible' : 'hidden'}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
