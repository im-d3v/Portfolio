import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, ArrowRight, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { HERO } from '@/data/portfolio'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { fadeUp, EASE } from '@/lib/animations'

interface FormState {
  name: string
  email: string
  message: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-lg text-sm text-content placeholder:text-faint/60 ' +
    'bg-secondary border border-border/[0.09] focus:border-accent/40 focus:outline-none ' +
    'focus:ring-1 focus:ring-accent/20 transition-all duration-200 font-mono'

  return (
    <section id="contact" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <SectionHeader
            index="07 / CONTACT"
            title="Let's build something together."
            subtitle="Open to full-time roles, freelance projects, and interesting conversations."
            className="mb-14"
          />

          <div className="grid md:grid-cols-5 gap-12">
            {/* Left — contact info */}
            <div className="md:col-span-2 space-y-6">
              <motion.div variants={fadeUp} className="space-y-3">
                {[
                  { icon: Mail,     label: 'Email',    value: HERO.email,    href: `mailto:${HERO.email}` },
                  { icon: Github,   label: 'GitHub',   value: 'im-d3v',      href: HERO.github },
                  { icon: Linkedin, label: 'LinkedIn', value: 'im-d3v',      href: HERO.linkedin },
                ].map(item => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 px-4 py-3 rounded-xl
                               border border-border/[0.08] hover:border-border/[0.16]
                               bg-secondary/40 hover:bg-elevated
                               transition-all duration-200"
                  >
                    <item.icon
                      size={15}
                      className="text-faint group-hover:text-accent transition-colors duration-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-faint mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted group-hover:text-content truncate transition-colors duration-200">
                        {item.value}
                      </p>
                    </div>
                    <ArrowRight
                      size={12}
                      className="text-faint/40 group-hover:text-accent group-hover:translate-x-0.5
                                 transition-all duration-200"
                    />
                  </a>
                ))}
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="p-4 rounded-xl border border-border/[0.07] bg-secondary/30"
              >
                <p className="text-xs text-faint leading-relaxed font-mono">
                  Based in India · Available for remote roles globally
                </p>
              </motion.div>
            </div>

            {/* Right — contact form */}
            <motion.form
              variants={{
                hidden: { opacity: 0, x: 24 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE, delay: 0.15 } },
              }}
              onSubmit={handleSubmit}
              className="md:col-span-3 space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-faint mb-1.5">
                    Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-faint mb-1.5">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-faint mb-1.5">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="What are you working on?"
                  required
                  className={inputClass + ' resize-none'}
                />
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={status === 'loading'}
                  className="min-w-[140px]"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader size={14} className="animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight size={14} />
                    </>
                  )}
                </Button>

                {status === 'success' && (
                  <motion.span
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-xs text-emerald-400 font-mono"
                  >
                    <CheckCircle size={13} />
                    Message sent!
                  </motion.span>
                )}
                {status === 'error' && (
                  <motion.span
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-xs text-rose-400 font-mono"
                  >
                    <AlertCircle size={13} />
                    Failed — try email directly
                  </motion.span>
                )}
              </div>
            </motion.form>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
