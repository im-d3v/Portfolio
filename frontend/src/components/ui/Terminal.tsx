import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Square } from 'lucide-react'
import { EASE } from '@/lib/animations'

type Line = { type: 'cmd' | 'out' | 'error' | 'blank'; text: string }

const PROMPT = 'mohit@portfolio:~$'

const ASCII_LOGO = `
  _ __ ___  _ __
 | '_ \` _ \\| '_ \\
 | | | | | | |_) |
 |_| |_| |_| .__/
           |_|     `.trim()

const NEOFETCH_OUTPUT = [
  `${PROMPT} neofetch`,
  '                                        ',
  '  ██████╗  ███████╗██╗   ██╗            OS: Portfolio OS v2.0.26',
  '  ██╔══██╗ ██╔════╝██║   ██║            Host: Mohit Pal',
  '  ██║  ██║ █████╗  ██║   ██║            Role: Full-Stack Engineer',
  '  ██║  ██║ ██╔══╝  ╚██╗ ██╔╝            Shell: bash 5.2.0',
  '  ██████╔╝ ███████╗ ╚████╔╝             Languages: Java · TypeScript · Python',
  '  ╚═════╝  ╚══════╝  ╚═══╝              Frameworks: Spring Boot · React.js',
  '                                        Cloud: AWS EC2 · S3 · RDS',
  '                                        DB: MySQL · PostgreSQL · MongoDB',
  '                                        Tools: Docker · Git · Nginx',
  '                                        Status: Open to Opportunities ✓',
]

const GIT_LOG = [
  'commit a3f91bc  feat: add real-time sync to collab editor (<100ms latency)',
  'commit 8e2d047  feat: multilingual dubbing pipeline (20+ languages)',
  'commit 1c7b3a9  feat: production chat app with Cloudinary media support',
  'commit 4f88e21  perf: 30% API response improvement via Redis caching',
  'commit 7a20d5f  feat: RBAC system with JWT refresh token rotation',
  'commit 9c14b80  chore: AWS EC2 deployment with Nginx reverse proxy',
  'commit 2e6f3c1  init: portfolio — because every engineer needs one',
]

const PROJECTS_LS = [
  'drwxr-xr-x  collab-editor/       Real-time multi-user code editor',
  'drwxr-xr-x  video-dubbing/       Multilingual AI dubbing pipeline',
  'drwxr-xr-x  chat-app/            Production-grade messaging platform',
]

const RESUME_TEXT = [
  '═══════════════════════════════════════════════════════════',
  '  MOHIT PAL — FULL-STACK ENGINEER',
  '═══════════════════════════════════════════════════════════',
  '',
  '  CONTACT',
  '    Email      mohitpal2204@gmail.com',
  '    GitHub     github.com/im-d3v',
  '    LinkedIn   linkedin.com/in/im-d3v',
  '    Location   Hyderabad, IN · UTC+5:30',
  '',
  '  EXPERIENCE',
  '    Junior Software Engineer Intern · EPAM Systems',
  '      Jan 2025 – Jun 2025 · Hyderabad',
  '    Full-Stack Developer Intern · CodeQuotient',
  '      May 2024 – Jul 2024 · Mohali',
  '',
  '  STACK',
  '    Backend    Java · Spring Boot · Spring Cloud · Security',
  '    Frontend   React.js · TypeScript · Tailwind · Redux Toolkit',
  '    Cloud      AWS EC2/S3/RDS · Docker · GitHub Actions',
  '    Database   PostgreSQL · MySQL · MongoDB · Redis',
  '',
  '  PROJECTS',
  '    Collaborative Code Editor    Real-time multi-user IDE',
  '    Video Dubbing Pipeline       20+ language automation',
  '    Real-Time Chat Application   <50ms message delivery',
  '',
  '  Type "sudo hire-me" to initiate contact.',
]

const MAN_MOHIT = [
  'MOHIT(1)                  Engineer Manual                  MOHIT(1)',
  '',
  'NAME',
  '    mohit — full-stack engineer with a backend-first mindset',
  '',
  'SYNOPSIS',
  '    mohit [--remote] [--available] [--java] [--spring] [--react]',
  '',
  'DESCRIPTION',
  '    Mohit Pal is a Full-Stack Engineer specializing in Java,',
  '    Spring Boot microservices, and modern React interfaces.',
  '    Combines deep backend engineering with product-quality',
  '    sensibilities on the frontend.',
  '',
  'OPTIONS',
  '    --remote        Available for remote roles globally',
  '    --available     Currently open to opportunities',
  '    --spring        Spring Boot 3.3 · Cloud · Security · Data',
  '    --react         React 18 · TypeScript · Redux Toolkit',
  '    --aws           EC2 · S3 · RDS · IAM',
  '',
  'ENVIRONMENT',
  '    LOCATION        Hyderabad, India (UTC+5:30)',
  '    LANGUAGES       English · Hindi',
  '    COFFEE_LEVEL    Sufficient',
  '',
  'SEE ALSO',
  '    sudo hire-me(1), whoami(1), neofetch(1), cat resume(1)',
]

const KUBECTL_PODS = [
  'NAME                            READY   STATUS    RESTARTS   AGE',
  'api-gateway-7d4f9c-x8z2m        1/1     Running   0          47d',
  'auth-service-6b8d24-k4n9p       1/1     Running   0          47d',
  'app-service-9c2f51-m7q4r        1/1     Running   0          12d',
  'ws-server-3a1e8f-l5p6w          1/1     Running   2          47d',
  'config-server-1a4b6e-h3d2v      1/1     Running   0          47d',
  'discovery-eureka-2c5f8a-r1t9    1/1     Running   0          47d',
  'postgres-0                      1/1     Running   0          47d',
  'redis-master-0                  1/1     Running   0          47d',
  'rabbitmq-7f3a2b-n8x4q           1/1     Running   1          47d',
]

const DIG_OUTPUT = [
  '; <<>> DiG 9.18.0 <<>> mp.dev',
  ';; global options: +cmd',
  ';; Got answer:',
  ';; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 42',
  ';; flags: qr rd ra; QUERY: 1, ANSWER: 6, AUTHORITY: 0',
  '',
  ';; ANSWER SECTION:',
  'mp.dev.            300   IN   A       203.0.113.42',
  'mp.dev.            300   IN   AAAA    2001:db8::1',
  'mp.dev.            300   IN   MX      10 mail.mp.dev.',
  'mp.dev.            300   IN   TXT     "engineer=mohit-pal"',
  'mp.dev.            300   IN   TXT     "available=true"',
  'mp.dev.            300   IN   TXT     "stack=java+spring+react"',
  '',
  ';; Query time: 12 msec',
  ';; SERVER: 1.1.1.1#53(cloudflare)',
]

const CURL_STATUS = [
  'HTTP/1.1 200 OK',
  'Content-Type: application/json',
  'X-Powered-By: Spring Boot',
  '',
  '{',
  '  "engineer":      "Mohit Pal",',
  '  "status":        "available",',
  '  "uptime":        "100%",',
  '  "current_focus": "distributed systems",',
  '  "languages":     ["Java", "TypeScript", "Python"],',
  '  "frameworks":    ["Spring Boot", "React.js"],',
  '  "stage":         "production",',
  '  "timezone":      "Asia/Kolkata"',
  '}',
]

function buildOutput(cmd: string): Line[] {
  const c = cmd.trim().toLowerCase()

  if (c === 'help') {
    return [
      { type: 'out', text: 'Available commands:' },
      { type: 'out', text: '' },
      { type: 'out', text: '  PROFILE' },
      { type: 'out', text: '    whoami            developer profile' },
      { type: 'out', text: '    neofetch          system info' },
      { type: 'out', text: '    cat resume        full resume printout' },
      { type: 'out', text: '    man mohit         engineer manual page' },
      { type: 'out', text: '' },
      { type: 'out', text: '  PROJECTS / SYSTEMS' },
      { type: 'out', text: '    ls projects       list projects' },
      { type: 'out', text: '    git log           commit history' },
      { type: 'out', text: '    kubectl get pods  show running services' },
      { type: 'out', text: '    curl /api/status  get engineer status' },
      { type: 'out', text: '    dig mp.dev        DNS records lookup' },
      { type: 'out', text: '    ssh prod          attempt prod connection' },
      { type: 'out', text: '' },
      { type: 'out', text: '  ACTIONS' },
      { type: 'out', text: '    sudo hire-me      initiate contact' },
      { type: 'out', text: '    goto <section>    scroll to section' },
      { type: 'out', text: '    open <github|linkedin>' },
      { type: 'out', text: '    theme             toggle dark/light' },
      { type: 'out', text: '    clear             clear terminal' },
    ]
  }

  if (c === 'whoami') {
    return [
      { type: 'out', text: 'Mohit Pal' },
      { type: 'out', text: 'Full-Stack Engineer · Java & Spring Boot · React.js' },
      { type: 'out', text: 'Hyderabad, India · mohitpal2204@gmail.com' },
      { type: 'out', text: 'github.com/im-d3v · linkedin.com/in/im-d3v' },
    ]
  }

  if (c === 'neofetch') {
    return NEOFETCH_OUTPUT.map(t => ({ type: 'out' as const, text: t }))
  }

  if (c === 'ls projects' || c === 'ls') {
    return [
      { type: 'out', text: 'total 3 projects' },
      ...PROJECTS_LS.map(t => ({ type: 'out' as const, text: t })),
    ]
  }

  if (c === 'git log' || c === 'git log --oneline') {
    return GIT_LOG.map(t => ({ type: 'out' as const, text: t }))
  }

  if (c === 'sudo hire-me') {
    return [
      { type: 'out', text: '[sudo] password for recruiter: ••••••••' },
      { type: 'out', text: 'Authenticating...' },
      { type: 'out', text: '✓ Authorization granted. Redirecting to contact...' },
    ]
  }

  if (c.startsWith('goto ')) {
    const section = c.replace('goto ', '').trim()
    const valid = ['about', 'stack', 'projects', 'experience', 'architecture', 'philosophy', 'contact', 'top']
    if (valid.includes(section)) {
      return [{ type: 'out', text: `→ Navigating to #${section}` }]
    }
    return [{ type: 'error', text: `goto: no section '${section}'. Try: ${valid.join(', ')}` }]
  }

  if (c === 'cat resume' || c === 'cat resume.txt' || c === 'cat resume.md') {
    return RESUME_TEXT.map(t => ({ type: 'out' as const, text: t }))
  }

  if (c === 'man mohit') {
    return MAN_MOHIT.map(t => ({ type: 'out' as const, text: t }))
  }

  if (c === 'kubectl get pods' || c === 'k get pods') {
    return KUBECTL_PODS.map(t => ({ type: 'out' as const, text: t }))
  }

  if (c === 'dig mp.dev' || c === 'dig mp.dev a') {
    return DIG_OUTPUT.map(t => ({ type: 'out' as const, text: t }))
  }

  if (c === 'curl /api/status' || c === 'curl mp.dev/api/status' || c === 'curl https://mp.dev/api/status') {
    return CURL_STATUS.map(t => ({ type: 'out' as const, text: t }))
  }

  if (c === 'ssh prod' || c === 'ssh prod.mp.dev') {
    return [
      { type: 'out',   text: 'ssh: connecting to prod.mp.dev port 22...' },
      { type: 'out',   text: '' },
      { type: 'error', text: 'Permission denied (publickey).' },
      { type: 'out',   text: '' },
      { type: 'out',   text: "hint: this terminal is air-gapped. try 'sudo hire-me'." },
    ]
  }

  if (c === 'sudo make me a sandwich') {
    return [{ type: 'out', text: 'Okay.    — xkcd #149' }]
  }

  if (c === 'make me a sandwich') {
    return [{ type: 'error', text: 'What? Make it yourself.' }]
  }

  if (c === 'rm -rf /' || c === 'rm -rf /*' || c === 'sudo rm -rf /') {
    return [
      { type: 'error', text: 'rm: permission denied — nice try.' },
      { type: 'out',   text: 'no destructive shells in this portfolio :)' },
    ]
  }

  if (c === 'exit' || c === 'quit' || c === ':q') {
    return [{ type: 'out', text: "use the close button (esc) — i'm not your shell." }]
  }

  if (c === 'open github') {
    return [{ type: 'out', text: 'Opening github.com/im-d3v...' }]
  }

  if (c === 'open linkedin') {
    return [{ type: 'out', text: 'Opening linkedin.com/in/im-d3v...' }]
  }

  if (c === 'theme') {
    return [{ type: 'out', text: 'Toggling theme...' }]
  }

  if (c === 'clear' || c === '') {
    return []
  }

  return [{ type: 'error', text: `command not found: ${cmd}. Type 'help' for available commands.` }]
}

interface TerminalProps {
  onToggleTheme?: () => void
}

export function Terminal({ onToggleTheme }: TerminalProps) {
  const [open, setOpen] = useState(false)
  const [lines, setLines] = useState<Line[]>([
    { type: 'out', text: "Welcome to mp.dev terminal." },
    { type: 'out', text: "Try 'help', 'man mohit', or 'cat resume' to get started." },
    { type: 'blank', text: '' },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === '`' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = (e.target as HTMLElement).tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        e.preventDefault()
        setOpen(o => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    const openHandler = () => setOpen(true)
    window.addEventListener('keydown', keyHandler)
    window.addEventListener('open-terminal', openHandler)
    return () => {
      window.removeEventListener('keydown', keyHandler)
      window.removeEventListener('open-terminal', openHandler)
    }
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80)
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  const runCommand = useCallback((raw: string) => {
    const cmd = raw.trim()
    if (!cmd) return

    setHistory(h => [cmd, ...h])
    setHistIdx(-1)

    const cmdLine: Line = { type: 'cmd', text: `${PROMPT} ${cmd}` }

    if (cmd.toLowerCase() === 'clear') {
      setLines([{ type: 'out', text: "Welcome to mp.dev terminal." }])
      return
    }

    const output = buildOutput(cmd)

    // Side effects
    const c = cmd.toLowerCase()
    if (c === 'sudo hire-me') {
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
        setOpen(false)
      }, 1200)
    } else if (c.startsWith('goto ')) {
      const section = c.replace('goto ', '').trim()
      const el = document.getElementById(section)
      if (el) { setTimeout(() => { el.scrollIntoView({ behavior: 'smooth' }); setOpen(false) }, 300) }
    } else if (c === 'open github') {
      setTimeout(() => window.open('https://github.com/im-d3v', '_blank'), 400)
    } else if (c === 'open linkedin') {
      setTimeout(() => window.open('https://linkedin.com/in/im-d3v', '_blank'), 400)
    } else if (c === 'theme') {
      onToggleTheme?.()
    }

    setLines(prev => [
      ...prev,
      cmdLine,
      ...output,
      { type: 'blank', text: '' },
    ])
  }, [onToggleTheme])

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(next)
      setInput(history[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(histIdx - 1, -1)
      setHistIdx(next)
      setInput(next === -1 ? '' : history[next])
    }
  }

  return (
    <>
      {/* Floating terminal badge */}
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.8, duration: 0.45, ease: EASE }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="fixed bottom-7 right-7 z-40 hidden md:flex items-center gap-2
                   px-4 py-2 rounded-xl font-mono text-xs
                   text-accent border border-accent/25 bg-secondary/90 backdrop-blur-md
                   hover:border-accent/50 hover:bg-secondary transition-all duration-200
                   shadow-lg shadow-black/30"
        title="Open terminal (`)"
      >
        {/* Pulse ring */}
        <span className="relative flex w-2 h-2 shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-50 animate-ping" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
        </span>
        <span>›_ terminal</span>
        <kbd className="ml-0.5 px-1.5 py-px rounded text-[10px] bg-elevated border border-border/[0.12] text-faint/60">
          `
        </kbd>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 8, opacity: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="w-full max-w-2xl rounded-xl overflow-hidden border border-border/[0.12]
                         shadow-2xl shadow-black/60"
              style={{ background: 'rgb(var(--secondary))' }}
            >
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/[0.07]"
                style={{ background: 'rgb(var(--elevated))' }}>
                <button onClick={() => setOpen(false)}
                  className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs font-mono text-faint/50">
                  mohit@portfolio — bash
                </span>
              </div>

              {/* Output area */}
              <div
                className="h-72 overflow-y-auto px-4 pt-3 pb-1 font-mono text-xs leading-relaxed"
                onClick={() => inputRef.current?.focus()}
              >
                {lines.map((line, i) => (
                  <div
                    key={i}
                    className={
                      line.type === 'cmd'
                        ? 'text-accent'
                        : line.type === 'error'
                        ? 'text-red-400'
                        : line.type === 'blank'
                        ? 'h-2'
                        : 'text-muted'
                    }
                  >
                    {line.text}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input row */}
              <div className="flex items-center gap-2 px-4 py-3 border-t border-border/[0.07]">
                <span className="font-mono text-xs text-accent shrink-0">{PROMPT}</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  className="flex-1 bg-transparent font-mono text-xs text-content
                             outline-none caret-accent placeholder:text-faint/30"
                  placeholder="type a command…"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
