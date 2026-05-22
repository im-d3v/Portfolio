import { useEffect, useState } from 'react'

export const SECTION_IDS = [
  'about',
  'stack',
  'projects',
  'experience',
  'architecture',
  'philosophy',
  'contact',
] as const

export type SectionId = typeof SECTION_IDS[number]

export const SECTION_LABELS: Record<SectionId, string> = {
  about:        'About',
  stack:        'Stack',
  projects:     'Projects',
  experience:   'Experience',
  architecture: 'Architecture',
  philosophy:   'Philosophy',
  contact:      'Contact',
}

export function useActiveSection() {
  const [active, setActive] = useState<number>(-1)

  useEffect(() => {
    const compute = () => {
      const mark = window.scrollY + window.innerHeight * 0.35
      let idx = -1
      SECTION_IDS.forEach((id, i) => {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= mark) idx = i
      })
      setActive(idx)
    }
    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [])

  return active
}

export function scrollToSection(id: SectionId | 'top') {
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
}
