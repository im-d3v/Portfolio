import { motion } from 'framer-motion'
import { Github, Linkedin } from 'lucide-react'
import { ABOUT, HERO } from '@/data/portfolio'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { NowPanel } from '@/components/ui/NowPanel'
import { fadeUp, EASE } from '@/lib/animations'

export function About() {
  return (
    <section id="about" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left — text */}
          <div>
            <SectionHeader
              index="01 / ABOUT"
              title="Engineered for scale, designed with purpose."
              className="mb-10"
            />

            {ABOUT.bio.map((para, i) => (
              <motion.p
                key={i}
                variants={fadeUp}
                className="text-muted leading-7 mb-5 text-sm md:text-base"
              >
                {para}
              </motion.p>
            ))}

            {/* Social row */}
            <motion.div variants={fadeUp} className="flex items-center gap-4 mt-8">
              <a
                href={HERO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-mono text-faint hover:text-content
                           border border-border/[0.1] hover:border-border/[0.18] px-3 py-1.5 rounded-lg
                           bg-secondary/40 hover:bg-elevated transition-all duration-200"
              >
                <Github size={14} />
                GitHub
              </a>
              <a
                href={HERO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-mono text-faint hover:text-content
                           border border-border/[0.1] hover:border-border/[0.18] px-3 py-1.5 rounded-lg
                           bg-secondary/40 hover:bg-elevated transition-all duration-200"
              >
                <Linkedin size={14} />
                LinkedIn
              </a>
            </motion.div>
          </div>

          {/* Right — stats */}
          <div>
            <motion.div
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
              }}
              className="grid grid-cols-2 gap-4"
            >
              {ABOUT.stats.map(stat => (
                <motion.div
                  key={stat.label}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.96 },
                    visible: {
                      opacity: 1, y: 0, scale: 1,
                      transition: { duration: 0.55, ease: EASE },
                    },
                  }}
                  className="group p-5 rounded-xl surface
                             hover:border-border/[0.14] hover:bg-elevated
                             transition-all duration-300"
                >
                  <p className="text-3xl font-semibold text-content tracking-tight mb-1 group-hover:text-accent transition-colors duration-200">
                    {stat.value}
                  </p>
                  <p className="text-xs text-faint font-mono uppercase tracking-wide">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Now panel — live status */}
            <div className="mt-4">
              <NowPanel />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
