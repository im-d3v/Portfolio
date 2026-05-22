import { motion } from 'framer-motion'
import { Cpu, Zap, Layers, Eye } from 'lucide-react'
import { PHILOSOPHY } from '@/data/portfolio'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { EASE } from '@/lib/animations'

const ICONS: Record<string, React.ElementType> = {
  cpu: Cpu,
  zap: Zap,
  layers: Layers,
  eye: Eye,
}

export function Philosophy() {
  return (
    <section id="philosophy" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <SectionHeader
            index="06 / PHILOSOPHY"
            title="Engineering Principles"
            subtitle="The values that shape how I think, design, and build."
            className="mb-14"
          />

          <div className="grid sm:grid-cols-2 gap-5">
            {PHILOSOPHY.map((p, i) => {
              const Icon = ICONS[p.icon]
              return (
                <motion.div
                  key={p.title}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: {
                      opacity: 1, y: 0,
                      transition: { duration: 0.55, ease: EASE, delay: i * 0.1 },
                    },
                  }}
                  className="group p-6 rounded-2xl surface
                             hover:border-border/[0.14] hover:bg-elevated
                             transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="w-9 h-9 rounded-lg bg-accent/[0.08] border border-accent/15
                                  flex items-center justify-center mb-5
                                  group-hover:bg-accent/[0.12] group-hover:border-accent/25
                                  transition-all duration-300">
                    <Icon
                      size={17}
                      className="text-accent/70 group-hover:text-accent transition-colors duration-200"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-content mb-2 tracking-tight">
                    {p.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted leading-relaxed">
                    {p.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
