import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Github, ExternalLink, ArrowRight, Check, Slash } from 'lucide-react'
import type { Project } from '@/data/portfolio'
import { EASE } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface CaseStudyModalProps {
  project: Project | null
  onClose: () => void
}

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-[10px] font-mono text-faint/50">{index}</span>
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">{label}</span>
      <span className="flex-1 h-px bg-border/[0.06]" />
    </div>
  )
}

export function CaseStudyModal({ project, onClose }: CaseStudyModalProps) {
  useEffect(() => {
    if (!project) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-primary/75 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[210] flex items-start sm:items-center justify-center p-4 sm:p-8 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`Case study: ${project.title}`}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.22, ease: EASE }}
              className={cn(
                'pointer-events-auto w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col',
                'rounded-2xl border border-border/[0.10]',
                'shadow-2xl shadow-black/50',
              )}
              style={{ background: 'rgb(var(--secondary))' }}
            >
              {/* Window chrome */}
              <div
                className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border/[0.07] shrink-0"
                style={{ background: 'rgb(var(--elevated))' }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={onClose}
                      aria-label="Close"
                      className="w-2.5 h-2.5 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors"
                    />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <span className="text-[11px] font-mono text-faint/40 truncate">
                    case-studies / {project.title.toLowerCase().replace(/\s+/g, '-')}.md
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono
                                 text-faint hover:text-content border border-border/[0.08]
                                 hover:border-border/[0.16] hover:bg-secondary transition-all"
                    >
                      <Github size={11} />
                      source
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono
                                 text-faint hover:text-content border border-border/[0.08]
                                 hover:border-border/[0.16] hover:bg-secondary transition-all"
                    >
                      <ExternalLink size={11} />
                      live
                    </a>
                  )}
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="w-7 h-7 flex items-center justify-center rounded
                               text-faint hover:text-content hover:bg-secondary transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Header */}
              <div className="px-7 sm:px-10 pt-8 pb-6 border-b border-border/[0.06] shrink-0">
                <div className="flex items-start gap-4">
                  <span
                    className="font-mono text-3xl font-semibold leading-none mt-1"
                    style={{ color: project.accent, opacity: 0.4 }}
                  >
                    {project.index}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-content tracking-tight">
                      {project.title}
                    </h2>
                    <p className="text-sm text-muted leading-relaxed mt-2.5 max-w-2xl">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {project.tech.map(t => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-2 py-0.5 rounded
                                     border"
                          style={{
                            background:  `${project.accent}10`,
                            borderColor: `${project.accent}28`,
                            color:       `${project.accent}cc`,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Big metric */}
                  <div
                    className="hidden sm:flex flex-col items-center justify-center px-5 py-3 rounded-xl border shrink-0"
                    style={{
                      background:  `${project.accent}0d`,
                      borderColor: `${project.accent}28`,
                    }}
                  >
                    <span
                      className="font-mono font-semibold text-xl leading-none"
                      style={{ color: project.accent }}
                    >
                      {project.metric}
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-faint/60 mt-1.5">
                      {project.metricLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Body */}
              {project.caseStudy && (
                <div className="px-7 sm:px-10 py-8 overflow-y-auto flex-1">
                  {/* Problem */}
                  <section className="mb-10">
                    <SectionLabel index="01" label="The Problem" />
                    <p className="text-sm text-muted leading-7 max-w-3xl">
                      {project.caseStudy.problem}
                    </p>
                  </section>

                  {/* Architecture */}
                  <section className="mb-10">
                    <SectionLabel index="02" label="Architecture" />
                    <ul className="space-y-3">
                      {project.caseStudy.architecture.map((line, i) => (
                        <li key={i} className="flex gap-3 text-sm text-muted leading-relaxed">
                          <span
                            className="font-mono text-[10px] mt-1.5 shrink-0 select-none"
                            style={{ color: project.accent, opacity: 0.5 }}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Decisions */}
                  <section className="mb-10">
                    <SectionLabel index="03" label="Engineering Decisions" />
                    <div className="space-y-4">
                      {project.caseStudy.decisions.map((d, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-border/[0.07] p-5"
                          style={{ background: 'rgb(var(--elevated) / 0.4)' }}
                        >
                          <p className="text-[11px] font-mono uppercase tracking-widest text-faint/60 mb-3">
                            decision {String(i + 1).padStart(2, '0')}
                          </p>
                          <h4 className="text-[15px] font-semibold text-content mb-4">
                            {d.title}
                          </h4>

                          <div className="grid sm:grid-cols-2 gap-3 mb-4">
                            <div className="flex items-start gap-2 px-3 py-2 rounded-lg
                                            bg-emerald-500/[0.06] border border-emerald-500/[0.18]">
                              <Check size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                              <div className="min-w-0">
                                <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/70 mb-0.5">
                                  chose
                                </p>
                                <p className="text-xs text-content leading-relaxed">{d.chose}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 px-3 py-2 rounded-lg
                                            bg-rose-500/[0.04] border border-rose-500/[0.14]">
                              <Slash size={12} className="text-rose-400/70 mt-0.5 shrink-0" />
                              <div className="min-w-0">
                                <p className="text-[10px] font-mono uppercase tracking-widest text-rose-400/60 mb-0.5">
                                  rejected
                                </p>
                                <p className="text-xs text-muted leading-relaxed">{d.rejected}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <ArrowRight size={11} className="text-accent/60 mt-1 shrink-0" />
                            <p className="text-xs text-muted leading-relaxed">
                              <span className="text-faint/60 font-mono text-[10px] uppercase tracking-widest mr-2">why</span>
                              {d.why}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Stack */}
                  <section className="mb-10">
                    <SectionLabel index="04" label="Stack Rationale" />
                    <div className="rounded-xl border border-border/[0.07] overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{ background: 'rgb(var(--elevated) / 0.5)' }}>
                            <th className="text-left px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest text-faint/60 font-medium">
                              Layer
                            </th>
                            <th className="text-left px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest text-faint/60 font-medium">
                              Tech
                            </th>
                            <th className="text-left px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest text-faint/60 font-medium">
                              Why
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {project.caseStudy.stack.map((row, i) => (
                            <tr
                              key={i}
                              className={cn(
                                'border-t border-border/[0.05]',
                                i % 2 === 1 && 'bg-elevated/20',
                              )}
                            >
                              <td className="px-4 py-2.5 text-xs font-mono text-faint align-top whitespace-nowrap">
                                {row.layer}
                              </td>
                              <td className="px-4 py-2.5 text-xs font-mono text-content align-top whitespace-nowrap">
                                {row.tech}
                              </td>
                              <td className="px-4 py-2.5 text-xs text-muted align-top leading-relaxed">
                                {row.rationale}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* Outcomes */}
                  <section>
                    <SectionLabel index="05" label="Outcomes" />
                    <ul className="space-y-2.5">
                      {project.caseStudy.outcomes.map((line, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-muted leading-relaxed">
                          <span
                            className="mt-2 w-1 h-1 rounded-full shrink-0"
                            style={{ background: project.accent, opacity: 0.7 }}
                          />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <div className="mt-12 pt-6 border-t border-border/[0.06] flex items-center justify-between">
                    <p className="text-[10px] font-mono text-faint/40">
                      end of case study · press <kbd className="mx-0.5 px-1 py-0.5 rounded border border-border/[0.10] bg-elevated text-faint">esc</kbd> to close
                    </p>
                    <button
                      onClick={onClose}
                      className="text-[11px] font-mono text-faint hover:text-content
                                 px-3 py-1 rounded border border-border/[0.08]
                                 hover:border-border/[0.16] hover:bg-elevated transition-all"
                    >
                      close
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
