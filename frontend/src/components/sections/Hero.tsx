import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, ArrowDown, ExternalLink } from 'lucide-react'
import { HERO } from '@/data/portfolio'
import { Button } from '@/components/ui/Button'
import { blurUp, stagger, EASE } from '@/lib/animations'

export function Hero() {
  const roleParts = HERO.role.split('|').map(part => part.trim())

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">

      {/* ── Grid ───────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          WebkitMaskImage:
            'radial-gradient(ellipse 90% 80% at 50% 0%, black 15%, transparent 80%)',
          maskImage:
            'radial-gradient(ellipse 90% 80% at 50% 0%, black 15%, transparent 80%)',
        }}
      />

      {/* ── Glow orb ───────────────────────────────────────────────────── */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '780px',
          height: '420px',
          background:
            'radial-gradient(ellipse at 50% 0%, var(--glow-color) 0%, transparent 60%)',
          filter: 'blur(32px)',
        }}
      />

      {/* ── Content ────────────────────────────────────────────────────── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto"
      >
        {/* Status badge */}
        <motion.div variants={blurUp} className="mb-8">
          <span className="inline-flex max-w-full items-center gap-2 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-mono
                           border border-border/[0.1] bg-secondary/50 backdrop-blur-sm text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
            Available for opportunities
          </span>
        </motion.div>

        {/* Name — single clip reveal */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            variants={{
              hidden: { y: '105%', opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.85, ease: EASE } },
            }}
            className="text-4xl sm:text-7xl md:text-[88px] font-semibold tracking-[-0.03em]
                       text-content leading-none"
          >
            Mohit Pal
          </motion.h1>
        </div>

        {/* Role heading */}
        <motion.div variants={blurUp} className="mb-6 max-w-xl space-y-2 text-center">
          <p className="text-base sm:text-lg md:text-xl text-content font-semibold leading-snug">
            {roleParts[0]}
          </p>
          <p className="text-xs sm:text-sm md:text-base text-muted leading-relaxed px-2 sm:px-0">
            {roleParts[1]}
          </p>
          <p className="text-[11px] sm:text-sm text-faint uppercase tracking-[0.22em]">
            {roleParts[2]}
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={blurUp}
          className="text-sm sm:text-base text-faint leading-relaxed max-w-lg mb-6 px-2 sm:px-0"
        >
          {HERO.tagline}
        </motion.p>

        {/* Tech tags */}
        <motion.div variants={blurUp} className="flex max-w-xl flex-wrap items-center justify-center gap-2 mb-10 px-1">
          {HERO.tags.map(tag => (
            <span
              key={tag}
              className="px-2.5 py-0.5 text-xs font-mono rounded-md
                         bg-elevated border border-border/[0.08] text-faint
                         hover:text-muted hover:border-border/[0.14] transition-colors duration-150"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div variants={blurUp} className="flex w-full max-w-sm flex-col sm:max-w-none sm:flex-row flex-wrap items-center justify-center gap-3 mb-10">
          <Button
            variant="primary"
            size="lg"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Projects
            <ExternalLink size={14} />
          </Button>
          <Button variant="outline" size="lg" href={`mailto:${HERO.email}`}>
            Get in Touch
            <Mail size={14} />
          </Button>
        </motion.div>

        {/* Social links */}
        <motion.div variants={blurUp} className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 max-w-xs sm:max-w-none">
          {[
            { icon: Github,   label: 'im-d3v', href: HERO.github },
            { icon: Linkedin, label: 'im-d3v', href: HERO.linkedin },
            { icon: Mail,     label: 'Email',  href: `mailto:${HERO.email}` },
          ].map(({ icon: Icon, label, href }, i) => (
            <span key={label} className="flex items-center gap-4">
              {i > 0 && <span className="hidden sm:block w-px h-3.5 bg-border/[0.15]" />}
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-faint hover:text-content
                           text-xs font-mono transition-colors duration-150 group whitespace-nowrap"
              >
                <Icon size={14} />
                <span className="group-hover:underline underline-offset-2">{label}</span>
              </a>
            </span>
          ))}
        </motion.div>

        {/* Terminal hint — clickable prompt */}
        <motion.button
          variants={blurUp}
          onClick={() => window.dispatchEvent(new CustomEvent('open-terminal'))}
          className="mt-8 hidden sm:inline-flex items-center gap-0.5 px-4 py-2.5 rounded-xl
                     border border-border/[0.10] bg-secondary/40 backdrop-blur-sm
                     hover:border-accent/30 hover:bg-secondary/60
                     font-mono text-xs transition-all duration-200 group"
        >
          <span className="text-accent mr-1.5">›_</span>
          <span className="text-faint">mohit@portfolio</span>
          <span className="text-muted">:~$&nbsp;</span>
          <span className="text-content">whoami</span>
          <span className="ml-1.5 w-[7px] h-[14px] bg-accent/70 group-hover:bg-accent
                           inline-block animate-pulse transition-colors duration-200" />
          <span className="ml-3 text-faint text-[10px] group-hover:text-muted transition-colors">
            press ` to open terminal
          </span>
        </motion.button>
      </motion.div>

      {/* ── Scroll cue ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-faint"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ArrowDown size={15} />
        </motion.div>
      </motion.div>
    </section>
  )
}
