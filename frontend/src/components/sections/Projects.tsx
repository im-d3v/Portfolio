import { useState } from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink, ArrowUpRight, BookOpen } from 'lucide-react'
import { PROJECTS, type Project } from '@/data/portfolio'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { CaseStudyModal } from '@/components/ui/CaseStudyModal'
import { EASE } from '@/lib/animations'

export function Projects() {
  const [active, setActive] = useState<Project | null>(null)

  return (
    <section id="projects" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <SectionHeader
            index="03 / PROJECTS"
            title="Featured Work"
            subtitle="Selected projects built with a focus on scalability, real-time performance, and engineering quality. Click any card for the full case study."
            className="mb-14"
          />

          <div className="grid md:grid-cols-3 gap-5">
            {PROJECTS.map((project, i) => (
              <motion.div
                key={project.index}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1, y: 0,
                    transition: { duration: 0.6, ease: EASE, delay: i * 0.1 },
                  },
                }}
              >
                <SpotlightCard
                  className="group relative flex flex-col h-full rounded-2xl surface
                             hover:border-border/[0.16] transition-all duration-300 overflow-hidden"
                  radius={320}
                >
                  {/* Accent top bar */}
                  <div
                    className="h-[2px] w-full opacity-50 group-hover:opacity-100 transition-opacity duration-400"
                    style={{ background: project.accent }}
                  />

                  <div className="flex flex-col flex-1 p-6">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-4">
                      <span className="font-mono text-3xl font-semibold text-faint/30 leading-none select-none">
                        {project.index}
                      </span>
                      <div className="flex items-center gap-2">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="w-7 h-7 flex items-center justify-center rounded-lg
                                       text-faint hover:text-content hover:bg-elevated
                                       border border-border/[0.08] hover:border-border/[0.16]
                                       transition-all duration-150"
                            aria-label="GitHub"
                          >
                            <Github size={13} />
                          </a>
                        )}
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="w-7 h-7 flex items-center justify-center rounded-lg
                                       text-faint hover:text-content hover:bg-elevated
                                       border border-border/[0.08] hover:border-border/[0.16]
                                       transition-all duration-150"
                            aria-label="Live demo"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Metric */}
                    <div className="mb-4">
                      <span
                        className="inline-flex flex-col px-3 py-1.5 rounded-lg border text-xs"
                        style={{
                          background: `${project.accent}10`,
                          borderColor: `${project.accent}28`,
                          color: project.accent,
                        }}
                      >
                        <span className="font-mono font-semibold text-base leading-tight">
                          {project.metric}
                        </span>
                        <span className="text-[10px] opacity-65">{project.metricLabel}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-semibold text-content mb-2 leading-snug">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-muted leading-relaxed mb-4 flex-1">
                      {project.description}
                    </p>

                    {/* Tech badges */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.tech.map(t => (
                        <span
                          key={t}
                          className="px-2 py-0.5 text-[10px] font-mono rounded
                                     bg-elevated border border-border/[0.07] text-faint"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Case study CTA */}
                    {project.caseStudy ? (
                      <button
                        onClick={() => setActive(project)}
                        className="mt-auto flex items-center justify-between gap-2 px-3 py-2 -mx-1
                                   rounded-lg text-[11px] font-mono
                                   text-faint hover:text-content
                                   border border-transparent hover:border-border/[0.08]
                                   hover:bg-elevated/50 transition-all duration-200"
                        aria-label={`Read ${project.title} case study`}
                      >
                        <span className="flex items-center gap-2">
                          <BookOpen size={12} className="opacity-70 group-hover:opacity-100" />
                          Read Case Study
                        </span>
                        <ArrowUpRight
                          size={12}
                          className="opacity-50 group-hover:opacity-100
                                     group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                                     transition-all duration-200"
                        />
                      </button>
                    ) : (
                      <p className="mt-auto text-[11px] font-mono text-faint/40 italic">
                        {project.impact}
                      </p>
                    )}
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>

      <CaseStudyModal project={active} onClose={() => setActive(null)} />
    </section>
  )
}
