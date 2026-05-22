import { useRef, useState, useCallback } from 'react'

export function useSpotlight(radius = 280) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  const onMouseEnter = useCallback(() => setActive(true), [])
  const onMouseLeave = useCallback(() => setActive(false), [])

  const spotlightStyle: React.CSSProperties = active
    ? {
        background: `radial-gradient(${radius}px circle at ${pos.x}px ${pos.y}px,
          rgb(var(--accent) / 0.065),
          transparent 80%)`,
      }
    : {}

  return { ref, spotlightStyle, handlers: { onMouseMove, onMouseEnter, onMouseLeave } }
}
