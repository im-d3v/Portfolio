import { motion } from 'framer-motion'
import { Briefcase, MapPin, Calendar, Sparkles } from 'lucide-react'
import { EXPERIENCE } from '@/data/portfolio'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { fadeUp, EASE } from '@/lib/animations'

export function Experience() {
  return (
    <section id="experience" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <SectionHeader
            index="04 / EXPERIENCE"
            title="Work Experience"
            subtitle="Where code met production systems."
            className="mb-14"
          />

          <div className="relative">
            {/* Vertical timeline line — desktop */}
            <div className="absolute left-0 top-3 bottom-3 w-px bg-border/[0.08] hidden md:block" />

            {EXPERIENCE.map((exp, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, x: -24 },
                  visible: {
                    opacity: 1, x: 0,
                    transition: { duration: 0.6, ease: EASE, delay: i * 0.12 },
                  },
                }}
                className="relative md:pl-10 pb-8 last:pb-0"
              >
                {/* Timeline dot */}
                <div
                  className={`absolute -left-[4.5px] top-5 hidden md:flex w-[9px] h-[9px] rounded-full
                              border-2 border-primary transition-colors
                              ${exp.current ? 'bg-accent' : 'bg-faint'}`}
                />

                <SpotlightCard
                  className="group p-6 md:p-7 rounded-2xl surface
                             hover:border-border/[0.14] transition-all duration-300 cursor-default"
                >
                  {/* Role row */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                    <div className="flex items-start gap-4">
                      {/* Company logo */}
                      {exp.logo && (
                        <div className="shrink-0 w-11 h-11 rounded-xl bg-elevated border border-border/[0.10]
                                        flex items-center justify-center overflow-hidden mt-0.5">
                          <img
                            src={exp.logo}
                            alt={exp.company}
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase
                                           tracking-widest px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent">
                            <Briefcase size={9} />
                            {exp.type}
                          </span>
                          {exp.current && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase
                                             tracking-widest px-2 py-0.5 rounded bg-emerald-500/10
                                             border border-emerald-500/20 text-emerald-400">
                              <Sparkles size={8} />
                              Latest
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-content leading-tight">{exp.role}</h3>
                        <p className="text-sm font-medium mt-0.5 text-accent">{exp.company}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 text-xs text-faint font-mono sm:text-right shrink-0">
                      <span className="flex sm:justify-end items-center gap-1.5">
                        <Calendar size={11} />{exp.period}
                      </span>
                      <span className="flex sm:justify-end items-center gap-1.5">
                        <MapPin size={11} />{exp.location}
                      </span>
                    </div>
                  </div>

                  {/* Achievements */}
                  <ul className="space-y-2.5">
                    {exp.achievements.map((item, j) => (
                      <motion.li
                        key={j}
                        variants={{
                          hidden: { opacity: 0, x: -10 },
                          visible: {
                            opacity: 1, x: 0,
                            transition: { duration: 0.35, ease: 'easeOut', delay: 0.15 + j * 0.06 },
                          },
                        }}
                        className="flex items-start gap-3 text-sm text-muted leading-relaxed"
                      >
                        <span className="mt-2 w-1 h-1 rounded-full bg-accent/50 shrink-0" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>

                  {/* Highlight stat — only for CodeQuotient */}
                  {!exp.current && (
                    <motion.div
                      variants={fadeUp}
                      className="mt-5 pt-5 border-t border-border/[0.07] flex items-center gap-3"
                    >
                      <span className="text-2xl font-semibold text-content">30%</span>
                      <span className="text-xs text-faint font-mono leading-tight">
                        API response<br />improvement
                      </span>
                    </motion.div>
                  )}
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
