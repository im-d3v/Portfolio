import { motion } from 'framer-motion'
import { STACK } from '@/data/portfolio'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { EASE } from '@/lib/animations'

export function TechStack() {
  return (
    <section id="stack" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <SectionHeader
            index="02 / STACK"
            title="Technical Expertise"
            subtitle="Full-stack depth with a backend-first engineering mindset."
            className="mb-14"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STACK.map((group, gi) => (
              <motion.div
                key={group.category}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1, y: 0,
                    transition: { duration: 0.5, ease: EASE, delay: gi * 0.07 },
                  },
                }}
              >
                <SpotlightCard
                  className="group h-full p-5 rounded-xl surface
                             hover:border-border/[0.14] hover:bg-elevated
                             transition-all duration-300 cursor-default"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent opacity-60
                                     group-hover:opacity-100 transition-opacity duration-200" />
                    <p className="text-xs font-mono uppercase tracking-widest text-muted
                                  group-hover:text-accent transition-colors duration-200">
                      {group.category}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.items.map(item => (
                      <span
                        key={item}
                        className="px-2 py-0.5 text-xs font-mono rounded-md
                                   bg-elevated border border-border/[0.07]
                                   text-faint group-hover:text-muted
                                   hover:border-accent/20 hover:text-content
                                   transition-all duration-150 cursor-default"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
