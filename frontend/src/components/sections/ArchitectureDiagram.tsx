import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Monitor, Shield, Lock, Server, Zap, Database,
  Play, RotateCcw, Radio, Settings, Network,
} from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cn } from '@/lib/utils'
import { EASE } from '@/lib/animations'

const NODE_W = 172
const NODE_H = 90
const H     = 640

/* ─── Types ──────────────────────────────────────────────────────────── */
interface NodeDef {
  id: string
  label: string
  tech: string
  role: string
  Icon: React.ElementType
  xp: number
  yp: number
  color: string
  layer: string
  tooltip: string
  chips?: string[]
}

/* ─── Nodes ──────────────────────────────────────────────────────────── */
const NODES: NodeDef[] = [
  /* PRESENTATION */
  {
    id: 'client',
    label: 'Browser / SPA',
    tech: 'React 18 + TypeScript',
    role: 'UI · Routing · State management',
    Icon: Monitor,
    xp: 50, yp: 7,
    color: '#7a7aff',
    layer: 'presentation',
    tooltip: 'React 18 SPA built with Vite + TypeScript. Handles routing, global state via Redux Toolkit, real-time WebSocket connection, and REST API calls through the gateway.',
  },

  /* INFRASTRUCTURE */
  {
    id: 'config',
    label: 'Config Server',
    tech: 'Spring Cloud Config',
    role: 'Centralized config · Git-backed',
    Icon: Settings,
    xp: 22, yp: 21,
    color: '#f59e0b',
    layer: 'infrastructure',
    tooltip: 'Centralized configuration management backed by a Git repository. Services pull environment-specific properties at startup. Supports encryption for sensitive values and live refresh via Spring Cloud Bus.',
    chips: ['Properties', 'Git-backed', 'Profiles'],
  },
  {
    id: 'discovery',
    label: 'Eureka Discovery',
    tech: 'Spring Cloud Eureka',
    role: 'Service registry · Health checks',
    Icon: Network,
    xp: 78, yp: 21,
    color: '#f59e0b',
    layer: 'infrastructure',
    tooltip: 'Service registry and discovery server. All microservices self-register on startup. The API Gateway queries Eureka for live instance addresses, enabling dynamic routing and client-side load balancing.',
    chips: ['Service Registry', 'Health Check', 'Load Balance'],
  },

  /* GATEWAY */
  {
    id: 'gateway',
    label: 'API Gateway',
    tech: 'Spring Cloud Gateway',
    role: 'JWT pre-auth · Rate limit · SSL',
    Icon: Shield,
    xp: 50, yp: 42,
    color: '#5c9fff',
    layer: 'gateway',
    tooltip: 'Single entry point for all traffic. Validates JWT signatures before routing, enforces per-client rate limits via token bucket, terminates SSL, and load-balances across discovered service instances.',
    chips: ['Rate Limiter', 'Sec Filter', 'HTTP Ctx', 'Retry'],
  },

  /* SERVICES */
  {
    id: 'auth',
    label: 'Auth Service',
    tech: 'Spring Security 6 + JWT',
    role: 'RS256 tokens · OAuth2 PKCE',
    Icon: Lock,
    xp: 13, yp: 62,
    color: '#3ecfcf',
    layer: 'service',
    tooltip: 'Issues RS256-signed JWT access tokens (15 min TTL) and opaque refresh tokens (7 day TTL). Supports OAuth2 PKCE flow, token introspection, and session revocation list stored in Redis.',
    chips: ['Auth Provider', 'UserDetails', 'Token Store'],
  },
  {
    id: 'app',
    label: 'App Service',
    tech: 'Spring Boot 3.3 REST',
    role: 'Domain logic · Validation · Events',
    Icon: Server,
    xp: 50, yp: 62,
    color: '#7a7aff',
    layer: 'service',
    tooltip: 'Core business logic layer. Exposes REST endpoints with Bean Validation, orchestrates DB reads/writes, and publishes domain events to the message queue on each state change.',
    chips: ['Circuit Break', 'Retry', 'Validation'],
  },
  {
    id: 'ws',
    label: 'WebSocket Server',
    tech: 'Node.js + Socket.io',
    role: 'Rooms · Presence · <100ms',
    Icon: Zap,
    xp: 87, yp: 62,
    color: '#3ecfcf',
    layer: 'service',
    tooltip: 'Maintains persistent WebSocket connections per user session. Subscribes to the message queue for domain events, then broadcasts to relevant room subscribers with <100ms end-to-end latency.',
    chips: ['Eureka Client', 'Room Manager'],
  },

  /* DATA */
  {
    id: 'redis',
    label: 'Redis Cache',
    tech: 'Redis 7 · Lettuce client',
    role: 'Sessions · API cache · Pub/Sub',
    Icon: Database,
    xp: 22, yp: 82,
    color: '#5c9fff',
    layer: 'data',
    tooltip: 'In-memory store for session tokens with TTL-based expiry, API response cache-aside pattern, and pub/sub channel used by the WebSocket server to receive broadcast events.',
  },
  {
    id: 'mq',
    label: 'Message Queue',
    tech: 'RabbitMQ · AMQP',
    role: 'Event bus · Fanout · Dead-letter',
    Icon: Radio,
    xp: 50, yp: 82,
    color: '#a78bfa',
    layer: 'data',
    tooltip: 'AMQP-based event bus for async service-to-service communication. App Service publishes domain events; WebSocket Server consumes via fanout exchange. Dead-letter queue handles failed deliveries.',
  },
  {
    id: 'postgres',
    label: 'PostgreSQL',
    tech: 'PostgreSQL 15 + HikariCP',
    role: 'ACID · Flyway · Indexed queries',
    Icon: Database,
    xp: 78, yp: 82,
    color: '#7a7aff',
    layer: 'data',
    tooltip: 'Primary relational store. HikariCP connection pool (max 20 conns), schema versioned with Flyway migrations, composite indexes for optimized query patterns. Read replicas serve analytics queries.',
  },
]

/* ─── Edges ──────────────────────────────────────────────────────────── */
const EDGES = [
  { id: 'c-g',    from: 'client',    to: 'gateway',  label: 'HTTPS / 443',   dashed: false },
  { id: 'cfg-g',  from: 'config',    to: 'gateway',  label: 'pull config',   dashed: true  },
  { id: 'disc-g', from: 'discovery', to: 'gateway',  label: 'svc lookup',    dashed: true  },
  { id: 'g-a',    from: 'gateway',   to: 'auth',     label: 'gRPC · token',  dashed: false },
  { id: 'g-ap',   from: 'gateway',   to: 'app',      label: 'HTTP REST',     dashed: false },
  { id: 'g-ws',   from: 'gateway',   to: 'ws',       label: 'WS upgrade',    dashed: false },
  { id: 'ap-r',   from: 'app',       to: 'redis',    label: 'TCP / 6379',    dashed: false },
  { id: 'ap-mq',  from: 'app',       to: 'mq',       label: 'AMQP publish',  dashed: false },
  { id: 'ap-db',  from: 'app',       to: 'postgres', label: 'JDBC / 5432',   dashed: false },
  { id: 'mq-ws',  from: 'mq',        to: 'ws',       label: 'AMQP consume',  dashed: true  },
]

/* ─── Simulation steps ───────────────────────────────────────────────── */
const SIM_STEPS = [
  { edgeId: 'c-g',   nodes: ['client', 'gateway'],  label: 'POST /api/v1/messages',     ms: 780 },
  { edgeId: 'g-a',   nodes: ['gateway', 'auth'],    label: 'gRPC: introspect(token)',   ms: 780 },
  { edgeId: 'g-ap',  nodes: ['gateway', 'app'],     label: 'PUT /messages → route',     ms: 780 },
  { edgeId: 'ap-r',  nodes: ['app', 'redis'],       label: 'GET cache:session:uid',     ms: 780 },
  { edgeId: 'ap-db', nodes: ['app', 'postgres'],    label: 'INSERT INTO messages',      ms: 780 },
  { edgeId: 'ap-mq', nodes: ['app', 'mq'],          label: 'publish: message.created',  ms: 780 },
  { edgeId: 'mq-ws', nodes: ['mq', 'ws'],           label: 'consume → broadcast event', ms: 780 },
  { edgeId: 'g-ws',  nodes: ['gateway', 'ws'],      label: 'WS emit to client rooms',   ms: 780 },
]

/* ─── Layer bands ────────────────────────────────────────────────────── */
const LAYERS = [
  { label: 'PRESENTATION',  yStart: 0,  yEnd: 14  },
  { label: 'INFRASTRUCTURE', yStart: 14, yEnd: 31  },
  { label: 'GATEWAY',        yStart: 31, yEnd: 51  },
  { label: 'SERVICES',       yStart: 51, yEnd: 72  },
  { label: 'DATA',           yStart: 72, yEnd: 100 },
]

/* ─── Path computation ───────────────────────────────────────────────── */
function computeEdgePath(
  from: NodeDef,
  to:   NodeDef,
  w: number,
  h: number,
  isMqWs: boolean,
) {
  const x1 = w * from.xp / 100
  const x2 = w * to.xp / 100
  const fmt = (n: number) => n.toFixed(1)

  if (isMqWs) {
    const y1 = h * from.yp / 100
    const y2 = h * to.yp / 100 + NODE_H / 2
    const fx = w * from.xp / 100 + NODE_W / 2
    const tx = w * to.xp / 100
    const mx = (fx + tx) / 2
    return {
      d: `M ${fmt(fx)},${fmt(y1)} C ${fmt(mx)},${fmt(y1)} ${fmt(tx)},${fmt(y2 - 40)} ${fmt(tx)},${fmt(y2)}`,
      waypoints: { cx: [fx, mx, tx], cy: [y1, y1, y2] },
      labelPos: { x: mx + 10, y: (y1 + y2) / 2 },
    }
  }

  const y1   = h * from.yp / 100 + NODE_H / 2
  const y2   = h * to.yp   / 100 - NODE_H / 2
  const midY = (y1 + y2) / 2

  if (Math.abs(x1 - x2) < 10) {
    return {
      d: `M ${fmt(x1)},${fmt(y1)} L ${fmt(x2)},${fmt(y2)}`,
      waypoints: { cx: [x1, x2], cy: [y1, y2] },
      labelPos: { x: x1 + 18, y: midY - 2 },
    }
  }

  const mx = (x1 + x2) / 2
  return {
    d: `M ${fmt(x1)},${fmt(y1)} C ${fmt(x1)},${fmt(midY)} ${fmt(x2)},${fmt(midY)} ${fmt(x2)},${fmt(y2)}`,
    waypoints: { cx: [x1, mx, x2], cy: [y1, midY, y2] },
    labelPos: { x: mx, y: midY - 6 },
  }
}

/* ─── Component ──────────────────────────────────────────────────────── */
export function ArchitectureDiagram() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims]           = useState({ w: 900, h: H })
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [simIndex, setSimIndex]   = useState(-1)
  const [simRunning, setSimRunning] = useState(false)
  const [done, setDone]           = useState(false)

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect()
        setDims({ w: Math.max(720, width), h: H })
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const edgeData = useMemo(() =>
    EDGES.map(edge => {
      const from = NODES.find(n => n.id === edge.from)!
      const to   = NODES.find(n => n.id === edge.to)!
      return { edge, ...computeEdgePath(from, to, dims.w, dims.h, edge.id === 'mq-ws') }
    }),
  [dims])

  const currentStep    = simIndex >= 0 && simIndex < SIM_STEPS.length ? SIM_STEPS[simIndex] : null
  const activeEdgeInfo = currentStep ? edgeData.find(e => e.edge.id === currentStep.edgeId) : null
  const activeNodeIds  = new Set(currentStep?.nodes ?? [])

  const startSim = useCallback(() => {
    if (simRunning) return
    setDone(false)
    setSimRunning(true)
    setSimIndex(0)
  }, [simRunning])

  useEffect(() => {
    if (!simRunning || simIndex < 0) return
    if (simIndex >= SIM_STEPS.length) {
      const t = setTimeout(() => { setSimRunning(false); setSimIndex(-1); setDone(true) }, 500)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setSimIndex(i => i + 1), SIM_STEPS[simIndex].ms + 320)
    return () => clearTimeout(t)
  }, [simIndex, simRunning])

  const stepPath = (edgeId: string) => {
    const e = EDGES.find(x => x.id === edgeId)
    if (!e) return ''
    const f = NODES.find(n => n.id === e.from)!.label
    const t = NODES.find(n => n.id === e.to)!.label
    return `${f} → ${t}`
  }

  return (
    <section id="architecture" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <SectionHeader
            index="05 / ARCHITECTURE"
            title="System Architecture"
            subtitle="A full microservices topology — trace a live request from browser to database and back."
            className="mb-10"
          />

          <div
            className="rounded-2xl border border-border/[0.09] overflow-hidden"
            style={{ background: 'rgb(var(--secondary))' }}
          >
            {/* Window chrome */}
            <div
              className="flex items-center justify-between px-5 py-3 border-b border-border/[0.07]"
              style={{ background: 'rgb(var(--elevated))' }}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </div>
                <span className="text-[11px] font-mono text-faint/40">
                  microservices · 10 services · 10 connections
                </span>
              </div>
              <button
                onClick={simRunning ? undefined : startSim}
                disabled={simRunning}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono border transition-all duration-200',
                  simRunning
                    ? 'border-accent/20 text-accent/50 cursor-not-allowed'
                    : 'border-accent/30 text-accent hover:bg-accent/10 cursor-pointer hover:border-accent/50',
                )}
              >
                {simRunning ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="inline-flex"
                    >
                      <RotateCcw size={11} />
                    </motion.span>
                    simulating…
                  </>
                ) : (
                  <><Play size={11} />simulate request</>
                )}
              </button>
            </div>

            {/* Diagram */}
            <div className="overflow-x-auto">
              <div ref={containerRef} className="relative" style={{ width: '100%', minWidth: 720, height: H }}>

                {/* Layer bands */}
                {LAYERS.map(layer => (
                  <div
                    key={layer.label}
                    className="absolute left-0 right-0 flex items-center"
                    style={{
                      top:    `${layer.yStart}%`,
                      height: `${layer.yEnd - layer.yStart}%`,
                      borderTop: layer.yStart > 0 ? '1px dashed rgba(255,255,255,0.04)' : 'none',
                    }}
                  >
                    <span
                      className="absolute left-2 text-[8px] font-mono tracking-[0.18em] select-none pointer-events-none"
                      style={{
                        color: 'rgba(68,68,90,0.35)',
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        top: '50%',
                        marginTop: '-24px',
                      }}
                    >
                      {layer.label}
                    </span>
                  </div>
                ))}

                {/* SVG for connections */}
                <svg
                  className="absolute inset-0 overflow-visible pointer-events-none"
                  width={dims.w}
                  height={dims.h}
                >
                  <defs>
                    <filter id="arch-glow2" x="-60%" y="-60%" width="220%" height="220%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="packet-glow2" x="-120%" y="-120%" width="340%" height="340%">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M 0,0 L 6,3 L 0,6 Z" fill="rgba(255,255,255,0.12)" />
                    </marker>
                    <marker id="arrowhead-active" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M 0,0 L 6,3 L 0,6 Z" fill="rgb(122,122,255)" />
                    </marker>
                  </defs>

                  {/* Static edges */}
                  {edgeData.map(({ edge, d }) => (
                    <path
                      key={edge.id}
                      d={d}
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth={1}
                      strokeDasharray={edge.dashed ? '5 4' : undefined}
                      markerEnd="url(#arrowhead)"
                    />
                  ))}

                  {/* Edge labels */}
                  {edgeData.map(({ edge, labelPos }) => (
                    <text
                      key={`lbl-${edge.id}`}
                      x={labelPos.x}
                      y={labelPos.y}
                      textAnchor="middle"
                      fontSize={8}
                      fill="rgba(68,68,90,0.75)"
                      fontFamily="'JetBrains Mono', monospace"
                    >
                      {edge.label}
                    </text>
                  ))}

                  {/* Active edge glow */}
                  {activeEdgeInfo && (
                    <motion.path
                      key={`ae-${simIndex}`}
                      d={activeEdgeInfo.d}
                      fill="none"
                      stroke="rgb(122,122,255)"
                      strokeWidth={1.5}
                      strokeOpacity={0.7}
                      filter="url(#arch-glow2)"
                      markerEnd="url(#arrowhead-active)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  )}

                  {/* Animated packet */}
                  {activeEdgeInfo && (
                    <motion.circle
                      key={`pk-${simIndex}`}
                      r={5}
                      fill="rgb(122,122,255)"
                      filter="url(#packet-glow2)"
                      cx={activeEdgeInfo.waypoints.cx[0] ?? 0}
                      cy={activeEdgeInfo.waypoints.cy[0] ?? 0}
                      animate={{
                        cx: activeEdgeInfo.waypoints.cx,
                        cy: activeEdgeInfo.waypoints.cy,
                        opacity: [0, 1, 1, 0],
                      }}
                      transition={{ duration: 0.65, ease: EASE, times: [0, 0.08, 0.88, 1] }}
                    />
                  )}
                </svg>

                {/* Node cards */}
                {NODES.map(node => {
                  const isActive  = activeNodeIds.has(node.id)
                  const isHovered = hoveredNode === node.id
                  const Icon = node.Icon

                  return (
                    <div
                      key={node.id}
                      className={cn(
                        'absolute flex flex-col justify-center py-2 px-3 gap-1.5 rounded-xl border transition-all duration-300 cursor-default select-none',
                        isActive
                          ? 'border-accent/40 bg-secondary'
                          : isHovered
                          ? 'border-border/[0.22] bg-secondary'
                          : 'border-border/[0.10] bg-primary',
                      )}
                      style={{
                        width: NODE_W,
                        height: NODE_H,
                        left: `calc(${node.xp}% - ${NODE_W / 2}px)`,
                        top:  `calc(${node.yp}% - ${NODE_H / 2}px)`,
                        boxShadow: isActive
                          ? `0 0 20px ${node.color}22, 0 0 40px ${node.color}0c`
                          : undefined,
                      }}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      {/* Icon + text row */}
                      <div className="flex items-center gap-2.5">
                        <div
                          className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                          style={{ background: isActive ? `${node.color}18` : 'rgb(var(--elevated))' }}
                        >
                          <Icon
                            size={14}
                            style={{ color: isActive ? node.color : 'rgb(var(--faint))' }}
                            className="transition-colors duration-300"
                          />
                        </div>
                        <div className="overflow-hidden flex-1">
                          <p className="text-[10.5px] font-semibold text-content leading-tight truncate">
                            {node.label}
                          </p>
                          <p className="text-[9px] font-mono text-faint/60 leading-tight mt-0.5 truncate">
                            {node.tech}
                          </p>
                          <p className="text-[8.5px] text-faint/40 leading-tight mt-0.5 truncate">
                            {node.role}
                          </p>
                        </div>
                      </div>

                      {/* Sub-component chips */}
                      {node.chips && (
                        <div className="flex flex-wrap gap-1">
                          {node.chips.map(chip => (
                            <span
                              key={chip}
                              className="text-[7px] font-mono px-1.5 py-0.5 rounded leading-none border transition-all duration-300"
                              style={{
                                background:  isActive ? `${node.color}12` : 'rgb(var(--elevated))',
                                borderColor: isActive ? `${node.color}35` : 'rgba(255,255,255,0.05)',
                                color:       isActive ? `${node.color}aa` : 'rgba(148,148,170,0.5)',
                              }}
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Active pulse ring */}
                      {isActive && (
                        <motion.span
                          className="absolute -top-1 -right-1 w-2 h-2 rounded-full shrink-0"
                          style={{ background: node.color }}
                          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                          transition={{ repeat: Infinity, duration: 1.1 }}
                        />
                      )}
                    </div>
                  )
                })}

                {/* Hover tooltip */}
                <AnimatePresence>
                  {hoveredNode && (() => {
                    const node = NODES.find(n => n.id === hoveredNode)!
                    const isRight = node.xp > 62

                    return (
                      <motion.div
                        key={hoveredNode}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.13 }}
                        className="absolute z-30 w-60 p-3.5 rounded-xl border border-border/[0.14] pointer-events-none shadow-2xl"
                        style={{
                          background: 'rgb(var(--elevated))',
                          left: isRight
                            ? `calc(${node.xp}% - ${NODE_W / 2}px - 16px - 240px)`
                            : `calc(${node.xp}% + ${NODE_W / 2}px + 16px)`,
                          top: `calc(${node.yp}% - ${NODE_H / 2}px)`,
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: node.color }} />
                          <p className="text-xs font-semibold" style={{ color: node.color }}>{node.label}</p>
                        </div>
                        <p className="text-[11px] font-mono text-faint/50 mb-2">{node.tech}</p>
                        {node.chips && (
                          <div className="flex flex-wrap gap-1 mb-2.5">
                            {node.chips.map(chip => (
                              <span
                                key={chip}
                                className="text-[8px] font-mono px-1.5 py-0.5 rounded border"
                                style={{
                                  background:  `${node.color}10`,
                                  borderColor: `${node.color}30`,
                                  color:       `${node.color}cc`,
                                }}
                              >
                                {chip}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-[11px] text-muted/80 leading-relaxed">{node.tooltip}</p>
                      </motion.div>
                    )
                  })()}
                </AnimatePresence>
              </div>
            </div>

            {/* Status bar */}
            <div
              className="px-5 py-2.5 border-t border-border/[0.07] flex items-center gap-3 min-h-[42px]"
              style={{ background: 'rgb(var(--elevated))' }}
            >
              <AnimatePresence mode="wait">
                {currentStep ? (
                  <motion.div
                    key={`step-${simIndex}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-center gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
                    <span className="text-[11px] font-mono font-medium text-accent">{currentStep.label}</span>
                    <span className="text-[11px] font-mono text-faint/35">{stepPath(currentStep.edgeId)}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-center gap-2"
                  >
                    {done && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
                    <span className="text-[11px] font-mono text-faint/40">
                      {done
                        ? '200 OK · 8 hops · message delivered to all subscribers'
                        : 'hover any service to inspect · click simulate to trace a live request'}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {simRunning && simIndex >= 0 && (
                <span className="ml-auto text-[10px] font-mono text-faint/30 shrink-0">
                  {simIndex + 1} / {SIM_STEPS.length}
                </span>
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
