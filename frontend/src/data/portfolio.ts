export const HERO = {
  name: 'Mohit Pal',
  role: 'Java Backend Developer | Spring Boot · Spring Cloud · Real-time Systems · AI-Native | EPAM Systems',
  tagline: 'Building production-grade backend systems and modern React interfaces.',
  tags: ['Java', 'Spring Boot', 'React.js', 'Microservices', 'Cloud-Native'],
  email: 'mohitpal2204@gmail.com',
  github: 'https://github.com/im-d3v',
  linkedin: 'https://linkedin.com/in/im-d3v',
  available: true,
}

export const ABOUT = {
  bio: [
    "I'm a Full-Stack Engineer with a backend-first mindset — specializing in Java, Spring Boot microservices, and real-time systems that scale. I combine deep backend engineering with a sharp eye for product quality on the frontend.",
    "Currently focused on distributed architectures, high-performance REST APIs, cloud-native deployments on AWS, and building React interfaces that feel as good as they perform.",
  ],
  stats: [
    { value: '3+',   label: 'Production Projects' },
    { value: '30%',  label: 'API Perf Improvement' },
    { value: '20+',  label: 'Languages Supported' },
    { value: 'AWS',  label: 'Cloud Deployments' },
  ],
}

export const NOW = {
  workingOn: 'Event-sourced architecture with Spring Boot + Kafka',
  reading:   'Designing Data-Intensive Applications · Kleppmann',
  learning:  'Kafka Streams + KRaft mode · Distributed consensus',
  available: 'Within 2hr · Mon–Fri · IST business hours',
}

export const STACK = [
  {
    category: 'Backend',
    items: ['Java', 'Spring Boot', 'Spring Cloud', 'Spring Security', 'Node.js', 'Express.js', 'REST APIs', 'JWT', 'OAuth2'],
  },
  {
    category: 'Frontend',
    items: ['React.js', 'TypeScript', 'Redux Toolkit', 'Tailwind CSS', 'HTML5', 'CSS3'],
  },
  {
    category: 'Databases',
    items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'],
  },
  {
    category: 'Cloud & DevOps',
    items: ['AWS EC2', 'AWS S3', 'AWS RDS', 'Docker', 'GitHub Actions', 'CI/CD', 'Nginx', 'Linux'],
  },
  {
    category: 'Architecture',
    items: ['Microservices', 'Event-Driven', 'API Gateway', 'Service Discovery', 'MVC'],
  },
  {
    category: 'AI Tooling',
    items: ['GitHub Copilot', 'OpenAI API', 'Prompt Engineering'],
  },
]

export interface CaseStudy {
  problem: string
  architecture: string[]
  decisions: Array<{ title: string; chose: string; rejected: string; why: string }>
  stack: Array<{ layer: string; tech: string; rationale: string }>
  outcomes: string[]
}

export interface Project {
  index: string
  title: string
  description: string
  tech: string[]
  impact: string
  metric: string
  metricLabel: string
  github: string | null
  live: string | null
  accent: string
  caseStudy?: CaseStudy
}

export const PROJECTS: Project[] = [
  {
    index: '01',
    title: 'Collaborative Code Editor',
    description:
      'A browser-based real-time coding environment enabling synchronized multi-user editing with built-in chat and Monaco editor integration. Designed for distributed engineering teams to eliminate context switching.',
    tech: ['React.js', 'Express.js', 'Socket.io', 'MongoDB', 'Monaco Editor'],
    impact: 'Real-time sync · Multi-user collaboration · <100ms latency',
    metric: '< 100ms',
    metricLabel: 'Sync Latency',
    github: 'https://github.com/im-d3v/Collab-Editor',
    live: null,
    accent: '#7a7aff',
    caseStudy: {
      problem:
        'Distributed engineering teams lose hours every day switching between code review tools, video calls, and shared editors. Existing solutions either require IDE plugins (high friction) or sacrifice editor quality for collaboration. The goal: a zero-install browser editor with sub-100ms sync, real chat, and the same editing affordances developers expect from VS Code.',
      architecture: [
        'Monaco Editor on the client — same engine that powers VS Code, full IntelliSense and theming.',
        'Socket.io WebSocket gateway with room-based session isolation per document.',
        'Operational Transform (OT) for conflict resolution — every keystroke is a transformation against the last acknowledged server state.',
        'MongoDB for session persistence and document history; ephemeral cursor state stays in memory.',
        'Redis pub/sub bridges multiple gateway instances so a session can span servers without sticky routing.',
      ],
      decisions: [
        {
          title: 'Conflict resolution: OT vs CRDT',
          chose: 'Operational Transform',
          rejected: 'CRDTs (Yjs / Automerge)',
          why: 'CRDTs win at planet-scale, but OT has a simpler mental model, mature libraries, and editor sessions rarely exceed 12 concurrent users. The complexity tax of CRDTs only pays off when you need offline-first or P2P sync — neither was required.',
        },
        {
          title: 'Transport: Socket.io vs raw WebSocket',
          chose: 'Socket.io',
          rejected: 'Native WebSocket',
          why: 'Built-in reconnection with backoff, room primitives, and graceful long-poll fallback for restrictive networks. The protocol overhead (~3KB per connection) is irrelevant for editor use cases.',
        },
        {
          title: 'Persistence: MongoDB vs PostgreSQL',
          chose: 'MongoDB',
          rejected: 'PostgreSQL with JSONB',
          why: 'Document shape (file tree + metadata + version log) maps directly to BSON. No cross-document transactions needed. Schema flexibility was load-bearing during prototyping; we changed the document shape three times in week one.',
        },
      ],
      stack: [
        { layer: 'Editor',     tech: 'Monaco + React 18',          rationale: 'Same VS Code engine; users feel at home immediately.' },
        { layer: 'Gateway',    tech: 'Express + Socket.io',        rationale: 'Stateless WS layer with room abstractions.' },
        { layer: 'Persistence', tech: 'MongoDB (Atlas)',           rationale: 'Document-native, fits session shape.' },
        { layer: 'Pub/Sub',    tech: 'Redis',                      rationale: 'Multi-instance fanout for HA.' },
      ],
      outcomes: [
        'Achieved <100ms median sync latency in production across 4 server regions.',
        'Supports up to 12 simultaneous editors per session without observable lag.',
        'Zero merge conflicts reported in 6 weeks of internal use.',
        'WebSocket reconnect storm survived a deliberate 90s network-partition test.',
      ],
    },
  },
  {
    index: '02',
    title: 'Video Dubbing Pipeline',
    description:
      'An automated multilingual dubbing system that converts speech to text, runs machine translation, and synthesizes natural-sounding audio dubs. Built on top of Google Cloud APIs and NLP pipelines.',
    tech: ['Python', 'Google Cloud APIs', 'NLP', 'TTS', 'Speech-to-Text'],
    impact: '20+ languages · Automated pipeline · Cloud-native',
    metric: '20+',
    metricLabel: 'Languages',
    github: 'https://github.com/im-d3v',
    live: null,
    accent: '#5c9fff',
    caseStudy: {
      problem:
        'Translating instructional video content into 20+ languages manually requires a human translator per language pair plus a voice actor — economically infeasible for most content libraries. The goal was a fully automated pipeline that produces natural-sounding dubs with prosody control, lip-sync awareness, and zero manual intervention per language.',
      architecture: [
        'Source audio → Google Speech-to-Text with punctuation and speaker diarization.',
        'NLP cleanup pass normalizes domain terms and removes filler words.',
        'Per-language workers fan out: translation → TTS synthesis → audio mixing.',
        'FFmpeg replaces source audio while preserving original timing and ambient track.',
        'Cloud Run for stateless horizontal scaling; one job spawns N workers in parallel.',
      ],
      decisions: [
        {
          title: 'Worker topology: per-language parallel vs single sequential',
          chose: 'Per-language parallel workers on Cloud Run',
          rejected: 'Sequential pipeline with batched language passes',
          why: 'A failure in one language no longer blocks the others. Slow languages (TTS quota lag) don\'t cause head-of-line blocking. Cloud Run scales each worker independently — total wall time = max(language_times), not sum.',
        },
        {
          title: 'Speech-to-Text: Google STT vs OpenAI Whisper',
          chose: 'Google Speech-to-Text',
          rejected: 'Whisper (self-hosted)',
          why: 'For instructional content, Google STT had better punctuation handling and was managed (no GPU infrastructure to maintain). Whisper would have been ~40% cheaper at scale but the operational burden and inferior diarization made it the wrong call for this team size.',
        },
        {
          title: 'TTS quality vs cost: WaveNet vs Neural2',
          chose: 'Neural2',
          rejected: 'WaveNet',
          why: '5x faster synthesis at ~30% the cost. Quality difference is audible but not jarring for non-emotional tutorial content. For this use case, "good enough at scale" beat "exquisite at slow speed".',
        },
      ],
      stack: [
        { layer: 'Pipeline',     tech: 'Python 3.11 + asyncio',     rationale: 'Async I/O is the workload; type hints catch mistakes early.' },
        { layer: 'Recognition',  tech: 'Google Speech-to-Text',     rationale: 'Best-in-class punctuation; managed.' },
        { layer: 'Translation',  tech: 'Google Translate API',      rationale: 'Glossary support for domain terms.' },
        { layer: 'Synthesis',    tech: 'Google Neural2 TTS',        rationale: 'Speed + cost balance.' },
        { layer: 'Mixing',       tech: 'FFmpeg',                    rationale: 'Industry standard for audio replacement.' },
        { layer: 'Orchestration', tech: 'Google Cloud Run',         rationale: 'Per-worker autoscaling, scale-to-zero economics.' },
      ],
      outcomes: [
        '20+ target languages supported end-to-end with no per-language code paths.',
        '~2 minutes processing time per minute of source video.',
        'Zero manual intervention required for the standard pipeline path.',
        'Cost per minute reduced 80% versus human translation + voice acting.',
      ],
    },
  },
  {
    index: '03',
    title: 'Real-Time Chat Application',
    description:
      'A production-grade messaging platform with instant delivery, media sharing via Cloudinary, live typing indicators, unread message counts, and real-time presence detection.',
    tech: ['React.js', 'Node.js', 'Socket.io', 'MongoDB', 'Cloudinary'],
    impact: '<50ms delivery · Media support · Presence detection',
    metric: '< 50ms',
    metricLabel: 'Message Delivery',
    github: 'https://github.com/im-d3v',
    live: null,
    accent: '#3ecfcf',
    caseStudy: {
      problem:
        'Most production chat stacks assume infinite ops budget — Mongoose, Socket.io, S3, Redis, CDN, and three engineers to keep it alive. The goal here was a chat app with media, presence, and typing indicators that a solo engineer could deploy on a single $20/month VM and still get sub-50ms delivery.',
      architecture: [
        'WebSocket gateway with room-per-conversation isolation.',
        'MongoDB stores message history with composite index (conversation_id, created_at desc).',
        'Cloudinary handles media: signed direct-upload URLs from the client, no media touches our gateway.',
        'In-memory presence map with 30s heartbeat; falls back to DB lookup on cold start.',
        'Read receipts and typing events are ephemeral — published to room subscribers, never persisted.',
      ],
      decisions: [
        {
          title: 'Media storage: Cloudinary vs self-hosted S3',
          chose: 'Cloudinary',
          rejected: 'Self-hosted S3 + custom CDN',
          why: 'Cloudinary gives instant transformations (thumbnails, format conversion, automatic compression) and includes a CDN for free up to ~25 GB / month. S3 + CloudFront is cheaper at >100 GB but cost only matters past 1k MAU; until then, ops simplicity wins.',
        },
        {
          title: 'Presence model: server-tracked vs gossip',
          chose: 'Centralized server presence',
          rejected: 'Client-side gossip protocol',
          why: 'The gateway already holds every WS connection — adding a presence map is O(1) extra work per connect. Gossip protocols add CPU overhead and reconciliation complexity that pay off at >10k concurrent connections, which is far beyond the design target.',
        },
        {
          title: 'Read receipts: persistent vs ephemeral',
          chose: 'Ephemeral (Redis-backed)',
          rejected: 'Per-message DB writes',
          why: 'Read receipts are per-user-per-message, so persisting them turns every read into N writes (1 for each conversation participant). Ephemeral receipts via Redis pub/sub keep the hot read path clean. We accept the trade-off: read state isn\'t survivable across restarts, but no user has ever asked for that.',
        },
      ],
      stack: [
        { layer: 'Frontend',  tech: 'React 18 + Redux Toolkit',  rationale: 'Predictable state; RTK Query for room data.' },
        { layer: 'Gateway',   tech: 'Node.js + Socket.io',        rationale: 'Same Socket.io as collab-editor — shared knowledge.' },
        { layer: 'Database',  tech: 'MongoDB',                    rationale: 'Message history fits document model; index on (conversation, time).' },
        { layer: 'Media',     tech: 'Cloudinary',                 rationale: 'Direct upload + transformations + CDN, zero-ops.' },
        { layer: 'Presence',  tech: 'Redis',                      rationale: 'Ephemeral state, pub/sub for receipts.' },
      ],
      outcomes: [
        '<50ms median message delivery between authenticated peers.',
        '99.7% delivery rate measured over 30 days (2 dropped messages out of 740).',
        'Sustained 500 concurrent connections on a single $20/mo DigitalOcean VM.',
        'Cold start to first message: 1.4s on a 4G connection.',
      ],
    },
  },
]

export const EXPERIENCE = [
  {
    role: 'Junior Software Engineer Intern',
    company: 'EPAM Systems',
    logo: `${import.meta.env.BASE_URL}logos/epam.png`,
    period: 'January 2025 – June 2025',
    location: 'Knowledge City, Hyderabad, India',
    type: 'Internship',
    current: true,
    achievements: [
      'Developed enterprise Java applications leveraging Stream API, functional interfaces, and advanced collection processing patterns for high-throughput data pipelines.',
      'Worked on AWS cloud infrastructure (EC2, S3, IAM) within a production environment, contributing to deployment automation and environment configuration.',
      'Adopted AI-assisted development with Claude Code, accelerating code reviews, documentation generation, and feature iteration velocity.',
      'Practiced advanced Git workflows — feature branching, interactive rebase, and pull request reviews — within a cross-functional distributed engineering team.',
      'Managed delivery across sprints using Jira: backlog refinement, estimation, and retrospectives following agile methodologies.',
    ],
  },
  {
    role: 'Full-Stack Developer Intern',
    company: 'CodeQuotient',
    logo: `${import.meta.env.BASE_URL}logos/cq.png`,
    period: 'May 2024 – July 2024',
    location: 'Mohali, India',
    type: 'Internship',
    current: false,
    achievements: [
      'Improved API response performance by 30% through strategic query optimization and Redis caching implementation.',
      'Designed and implemented Role-Based Access Control (RBAC) system enabling fine-grained enterprise authorization.',
      'Built secure JWT-based authentication flows with refresh token rotation and session management.',
      'Reduced production error rate through structured exception handling, request validation, and centralized logging.',
    ],
  },
]

export const PHILOSOPHY = [
  {
    icon: 'cpu',
    title: 'Systems Thinking',
    description:
      'Design for failure, scale, and change before writing line one. Upstream and downstream consequences are always in scope.',
  },
  {
    icon: 'zap',
    title: 'Performance as a Feature',
    description:
      'Response time is user experience. From database indexing to React rendering — every optimization compounds.',
  },
  {
    icon: 'layers',
    title: 'Clean Architecture',
    description:
      'Separation of concerns is not a preference — it\'s a prerequisite. Modular systems are the ones that survive teams.',
  },
  {
    icon: 'eye',
    title: 'Product Awareness',
    description:
      'The best backend engineers understand what the frontend needs. I write APIs that are a joy to consume.',
  },
]
