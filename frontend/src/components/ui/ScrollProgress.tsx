import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export function ScrollProgress() {
  const [raw, setRaw] = useState(0)
  const smooth = useSpring(raw, { stiffness: 200, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      setRaw(total > 0 ? scrolled / total : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[200] origin-left"
      style={{
        scaleX: smooth,
        background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent) / 0.6))',
      }}
    />
  )
}
