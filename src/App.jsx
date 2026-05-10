import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { BriefcaseBusiness, Code2, Globe, Mail } from 'lucide-react'
import Button from './components/ui/Button'
import Card from './components/ui/Card'
import LanguageGrid from './components/LanguageGrid'
import Container from './components/ui/Container'
import Section from './components/ui/Section'
import Tag from './components/ui/Tag'
import CustomCursor from './components/CustomCursor'
import AmbientLightingEngine from './components/AmbientLightingEngine'
import TacticalGridOverlay from './components/TacticalGridOverlay'
import TelemetryHud from './components/TelemetryHud'
import AIAssistantOrb from './components/AIAssistantOrb'
import CommandPalette from './components/CommandPalette'
import ArchitectureSchematic from './components/ArchitectureSchematic'
import TerminalAssistant from './components/TerminalAssistant'
import RuntimeSelfVisualizer from './components/RuntimeSelfVisualizer'
import { deriveAdaptiveSignature, loadSignalWasm } from './utils/wasmSignals'

const skills = [
  {
    title: 'Product & UX',
    description: 'Designing flows and information structures that keep complex tasks understandable.',
    tags: ['Information Architecture', 'Interaction Design', 'Prototyping', 'Usability Testing', 'Accessibility'],
  },
  {
    title: 'UI Engineering',
    description: 'Building reliable interface systems with strong performance and maintainability.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Component Architecture', 'Performance'],
  },
  {
    title: 'Fintech UX',
    description: 'Shipping trust-oriented product patterns for financial workflows and compliance needs.',
    tags: ['Onboarding / KYC', 'Risk & Trust Patterns', 'Dashboards', 'Audit-Friendly UI'],
  },
  {
    title: 'AI Systems UX',
    description: 'Translating model outputs into operator-friendly, decision-ready interfaces.',
    tags: ['Fraud Signal Visualization', 'Model Output UX', 'Human-in-the-Loop', 'Alert Triage'],
  },
]

const projects = [
  {
    title: 'Pfuma Pamwe',
    summary: 'Fintech credit empowerment and AI fraud intelligence platform.',
    scope: 'Lead UI/UX Engineer, end-to-end experience across onboarding, analyst tools, and operations dashboard.',
    bullets: [
      'Reduced analyst decision time by structuring fraud signals into a confidence-first review workflow.',
      'Introduced trust cues and plain-language risk messaging to improve clarity during credit onboarding.',
      'Designed role-based dashboards that balance speed, evidence visibility, and compliance traceability.',
    ],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Data Visualization'],
    links: {
      live: 'https://example.com/pfuma-pamwe',
      repo: 'https://github.com/replace-with-your-repo',
    },
  },
  {
    title: 'Hackathon Achievement: Top 5',
    summary: 'Rapid product concept built and shipped as an MVP under tight constraints.',
    scope: 'UI/UX + frontend execution from problem framing to validated prototype in under 48 hours.',
    bullets: [
      'Scoped core flows quickly, prioritized highest-risk assumptions, and validated interactions with users.',
      'Built a cohesive UI system to keep implementation speed high without sacrificing quality.',
      'Delivered a working MVP with measurable outcomes and clear rationale behind key design choices.',
    ],
    stack: ['React', 'Framer Motion', 'Tailwind CSS', 'Rapid Prototyping'],
    links: {
      live: 'https://example.com/hackathon-project',
      repo: 'https://github.com/replace-with-your-repo-2',
    },
  },
  {
    title: 'Medilink Experience',
    summary: 'HealthTech system design contribution focused on digital healthcare access and patient workflow quality.',
    scope:
      'UI/UX Engineer + frontend contributor across patient-facing and operational experiences in a healthcare environment.',
    bullets: [
      'Designed healthcare UX systems that reduce friction in appointment, triage, and care-coordination workflows.',
      'Implemented interface patterns that improve readability, consistency, and speed for both patients and clinical teams.',
      'Aligned product decisions with real-world constraints such as trust, accessibility, and workflow reliability.',
    ],
    stack: ['HealthTech UX', 'React', 'Design Systems', 'Workflow Engineering'],
    links: {
      live: 'https://example.com/medilink-experience',
      repo: 'https://github.com/princemhizha',
    },
  },
  {
    title: 'Smart Panic Bracelet',
    summary: 'IoT-based safety concept combining emergency alerts with real-time location distress signaling.',
    scope:
      'Product and UX engineering for a hardware + software safety system integrating embedded behavior with mobile response flows.',
    bullets: [
      'Mapped end-to-end emergency journeys from wearable trigger to responder action with minimal decision latency.',
      'Designed safety infrastructure UX that prioritizes signal clarity, confirmation states, and location confidence.',
      'Bridged embedded system thinking and interface design to support reliable operation in high-stress scenarios.',
    ],
    stack: ['IoT UX', 'Embedded Systems', 'Real-Time Signaling', 'Safety Infrastructure'],
    links: {
      live: 'https://example.com/smart-panic-bracelet',
      repo: 'https://github.com/princemhizha',
    },
  },
]

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

function AnimatedTagline({ reducedMotion }) {
  const text =
    'I design and build user-centered digital experiences that are intuitive, accessible, and engineered for real-world impact.'
  const words = text.split(' ')

  return (
    <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="mr-1.5 inline-block"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.2 + index * 0.03 }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  )
}

function AnimatedIdentityLock({ reducedMotion }) {
  const chars = 'Prince Kudzai Mhizha'.split('')

  return (
    <motion.h1
      className="mt-8 font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {chars.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="inline-block bg-gradient-to-r from-accent-cyan via-accent-teal to-accent-cyan bg-clip-text text-transparent"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 8, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.25, delay: 0.06 + index * 0.02 }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.h1>
  )
}

function App() {
  const reducedMotion = useReducedMotion()
  const [activeSection, setActiveSection] = useState('about')
  const [commandOpen, setCommandOpen] = useState(false)
  const [interactionCount, setInteractionCount] = useState(0)
  const [idle, setIdle] = useState(false)
  const [revealPhase, setRevealPhase] = useState(0)
  const [runtimeMode, setRuntimeMode] = useState('standard')
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const [scrollDepth, setScrollDepth] = useState(0)
  const [prewarmNav, setPrewarmNav] = useState(false)
  const [engineeringMode, setEngineeringMode] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [viewedSections, setViewedSections] = useState([])
  const [sectionVisitCounts, setSectionVisitCounts] = useState({})
  const [viewedProjects, setViewedProjects] = useState([])
  const [projectHoverCounts, setProjectHoverCounts] = useState({})
  const [hoverBeacon, setHoverBeacon] = useState({ x: 0.5, y: 0.5, intensity: 0, radius: 0.22, id: null })
  const [transitionPulse, setTransitionPulse] = useState({ id: 'about', tick: 0 })
  const [interactionTrail, setInteractionTrail] = useState([])
  const [navigationPattern, setNavigationPattern] = useState(['about'])
  const [readingFlow, setReadingFlow] = useState(0)
  const [neuralOverlayMode, setNeuralOverlayMode] = useState(false)
  const [spatialMode, setSpatialMode] = useState(false)
  const [runtimeTelemetry, setRuntimeTelemetry] = useState({
    fps: 0,
    workerLoad: 0,
    binaryLoad: 0,
    packetRate: 0,
    predictedSections: [],
    frequencies: [],
    dynamicTheme: 'standard',
    sessionAgeMs: 0,
    particles: 0,
  })
  const [hudVisible, setHudVisible] = useState(true)
  const [wasmRuntime, setWasmRuntime] = useState(null)
  const [sceneTilt, setSceneTilt] = useState({ x: 0, y: 0 })
  const activeSectionRef = useRef('about')
  const focusTimeoutRef = useRef(null)
  const sectionEnteredAtRef = useRef(performance.now())
  const pointerRafRef = useRef(null)
  const pointerPendingRef = useRef({ x: 0.5, y: 0.5, clientY: 0 })
  const { scrollY, scrollYProgress } = useScroll()
  const heroParallaxY = useTransform(scrollY, [0, 520], [0, -34])
  const heroImageParallaxY = useTransform(scrollY, [0, 520], [0, 20])
  const distortionY = useTransform(scrollY, [0, 1400], [0, -12])

  const effectProfile = useMemo(() => {
    if (typeof navigator === 'undefined') {
      return {
        tier: 'balanced',
        networkDensity: 0.8,
        streamDensity: 0.76,
        fogDensity: 0.82,
      }
    }

    const connection = navigator.connection ?? navigator.mozConnection ?? navigator.webkitConnection
    const saveData = Boolean(connection?.saveData)
    const deviceMemory = navigator.deviceMemory ?? 8
    const cores = navigator.hardwareConcurrency ?? 8

    if (reducedMotion || saveData || deviceMemory <= 4 || cores <= 4) {
      return {
        tier: 'low-power',
        networkDensity: 0.58,
        streamDensity: 0.52,
        fogDensity: 0.56,
      }
    }

    if (deviceMemory <= 8 || cores <= 8) {
      return {
        tier: 'balanced',
        networkDensity: 0.78,
        streamDensity: 0.76,
        fogDensity: 0.8,
      }
    }

    return {
      tier: 'cinematic',
      networkDensity: 1,
      streamDensity: 1,
      fogDensity: 1,
    }
  }, [reducedMotion])

  const floatTransition = reducedMotion
    ? { duration: 0 }
    : {
        duration: 20,
        ease: 'easeInOut',
        repeat: Infinity,
      }

  const heroContainerVariants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.08,
        delayChildren: 0.08,
      },
    },
  }

  const heroItemVariants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? current
    const delta = current - previous
    setScrollVelocity(Math.min(22, Math.abs(delta)))
  })

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    setScrollDepth(current)
  })

  const engagementBoost = useMemo(() => {
    const interactionSignal = Math.min(1, interactionCount / 28)
    const scrollSignal = Math.min(1, scrollDepth)
    const velocitySignal = Math.min(1, scrollVelocity / 20)
    const modeBoost = runtimeMode === 'deploy' ? 0.2 : 0
    const idlePenalty = idle ? -0.22 : 0
    return Math.max(0, Math.min(1, interactionSignal * 0.5 + scrollSignal * 0.35 + velocitySignal * 0.15 + modeBoost + idlePenalty))
  }, [idle, interactionCount, runtimeMode, scrollDepth, scrollVelocity])

  const throughput = Math.max(0.15, Math.min(0.95, 0.25 + engagementBoost * 0.7))
  const nodeCount = Math.max(18, Math.round(44 * effectProfile.networkDensity))
  const memorySignal = useMemo(() => {
    const viewedSectionBoost = Math.min(1, viewedSections.length / navItems.length)
    const viewedProjectBoost = Math.min(1, viewedProjects.length / projects.length)
    return Math.min(1, viewedSectionBoost * 0.45 + viewedProjectBoost * 0.55)
  }, [viewedProjects, viewedSections])

  const aiAdaptation = useMemo(
    () =>
      deriveAdaptiveSignature(wasmRuntime, {
        engagementBoost,
        scrollVelocity,
        focusMode,
        idle,
        sectionVisitCounts,
        viewedProjectsCount: viewedProjects.length,
        interactionCount,
      }),
    [engagementBoost, focusMode, idle, interactionCount, scrollVelocity, sectionVisitCounts, viewedProjects.length, wasmRuntime],
  )

  const adaptiveNavItems = useMemo(() => {
    const aboutItem = navItems.find((item) => item.id === 'about')
    const dynamicItems = navItems
      .filter((item) => item.id !== 'about')
      .sort((left, right) => {
        const leftCount = sectionVisitCounts[left.id] ?? 0
        const rightCount = sectionVisitCounts[right.id] ?? 0

        if (leftCount === rightCount) {
          return navItems.findIndex((item) => item.id === left.id) - navItems.findIndex((item) => item.id === right.id)
        }

        return rightCount - leftCount
      })

    return aboutItem ? [aboutItem, ...dynamicItems] : dynamicItems
  }, [sectionVisitCounts])

  const dynamicTheme = runtimeMode === 'showcase' ? 'showcase' : runtimeTelemetry.dynamicTheme
  const displayNeuralOverlay = neuralOverlayMode || engineeringMode
  const predictedSections = runtimeTelemetry.predictedSections ?? []
  const frequencies = runtimeTelemetry.frequencies ?? []
  const liveParticleCount = runtimeTelemetry.particles || nodeCount

  const sceneTransform = useMemo(() => {
    if (!spatialMode || reducedMotion) {
      return { transform: 'none' }
    }

    const rotateX = sceneTilt.y * -5
    const rotateY = sceneTilt.x * 6
    return {
      transform: `perspective(1400px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`,
      transformStyle: 'preserve-3d',
      transition: 'transform 220ms ease-out',
    }
  }, [reducedMotion, sceneTilt.x, sceneTilt.y, spatialMode])

  const publishTelemetry = useCallback((payload) => {
    setRuntimeTelemetry((current) => ({ ...current, ...payload }))
  }, [])

  const prewarmSection = useCallback((sectionId) => {
    const section = document.getElementById(sectionId)
    if (!section) return
    section.getBoundingClientRect()
    window.dispatchEvent(new CustomEvent('runtime-prefetch', { detail: { sectionId } }))
  }, [])

  const runCommand = useCallback((command) => {
    if (command === 'mode-deploy') {
      setRuntimeMode('deploy')
      setInteractionCount((value) => value + 2)
      return
    }

    if (command === 'mode-theme') {
      setRuntimeMode((value) => (value === 'spectrum' ? 'standard' : 'spectrum'))
      setInteractionCount((value) => value + 1)
      return
    }

    if (command === 'mode-engineering') {
      setEngineeringMode((value) => !value)
      setInteractionCount((value) => value + 2)
      return
    }

    if (command === 'mode-focus') {
      setFocusMode((value) => !value)
      setInteractionCount((value) => value + 1)
      return
    }

    if (command === 'mode-productivity') {
      setRuntimeMode('productivity')
      setInteractionCount((value) => value + 1)
      return
    }

    if (command === 'mode-showcase') {
      setRuntimeMode('showcase')
      setInteractionCount((value) => value + 2)
      return
    }

    if (command === 'mode-neural') {
      setNeuralOverlayMode((value) => !value)
      setInteractionCount((value) => value + 1)
      return
    }

    if (command === 'mode-spatial') {
      setSpatialMode((value) => !value)
      setInteractionCount((value) => value + 1)
      return
    }

    const section = document.getElementById(command)
    if (section) {
      section.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
      setInteractionCount((value) => value + 1)
    }
  }, [reducedMotion])

  const markProjectViewed = useCallback((projectTitle) => {
    setViewedProjects((current) => (current.includes(projectTitle) ? current : [...current, projectTitle]))
  }, [])

  const registerProjectHover = useCallback((projectTitle, event) => {
    markProjectViewed(projectTitle)
    setProjectHoverCounts((current) => ({
      ...current,
      [projectTitle]: (current[projectTitle] ?? 0) + 1,
    }))

    if (!event?.currentTarget) return

    const rect = event.currentTarget.getBoundingClientRect()
    setHoverBeacon({
      x: (rect.left + rect.width * 0.5) / window.innerWidth,
      y: (rect.top + rect.height * 0.5) / window.innerHeight,
      intensity: 1,
      radius: 0.26,
      id: projectTitle,
    })
  }, [markProjectViewed])

  useEffect(() => {
    let cancelled = false

    loadSignalWasm()
      .then((runtime) => {
        if (!cancelled) setWasmRuntime(runtime)
      })
      .catch(() => {
        if (!cancelled) setWasmRuntime(null)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    try {
      const snapshot = window.sessionStorage.getItem('pkm-runtime-memory')
      if (!snapshot) return

      const parsed = JSON.parse(snapshot)
      if (Array.isArray(parsed.viewedSections)) setViewedSections(parsed.viewedSections)
      if (Array.isArray(parsed.viewedProjects)) setViewedProjects(parsed.viewedProjects)
      if (parsed.sectionVisitCounts && typeof parsed.sectionVisitCounts === 'object') setSectionVisitCounts(parsed.sectionVisitCounts)
      if (parsed.projectHoverCounts && typeof parsed.projectHoverCounts === 'object') {
        setProjectHoverCounts(parsed.projectHoverCounts)
      }
      if (typeof parsed.engineeringMode === 'boolean') setEngineeringMode(parsed.engineeringMode)
    } catch {
      // Ignore invalid session snapshots.
    }
  }, [])

  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        'pkm-runtime-memory',
        JSON.stringify({
          viewedSections,
          sectionVisitCounts,
          viewedProjects,
          projectHoverCounts,
          engineeringMode,
        }),
      )
    } catch {
      // Ignore storage failures.
    }
  }, [engineeringMode, projectHoverCounts, sectionVisitCounts, viewedProjects, viewedSections])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
            setViewedSections((current) => (current.includes(entry.target.id) ? current : [...current, entry.target.id]))
            setSectionVisitCounts((current) => ({
              ...current,
              [entry.target.id]: (current[entry.target.id] ?? 0) + 1,
            }))
          }
        })
      },
      {
        rootMargin: '-30% 0px -48% 0px',
        threshold: 0.12,
      },
    )

    navItems.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let lastInteractionStamp = 0

    const updateInteraction = () => {
      const now = performance.now()
      if (now - lastInteractionStamp > 120) {
        lastInteractionStamp = now
        setInteractionCount((value) => value + 1)
      }
      setIdle(false)
    }

    const onMove = (event) => {
      updateInteraction()
      const normalizedX = event.clientX / window.innerWidth
      const normalizedY = event.clientY / window.innerHeight
      pointerPendingRef.current = { x: normalizedX, y: normalizedY, clientY: event.clientY }

      if (!pointerRafRef.current) {
        pointerRafRef.current = requestAnimationFrame(() => {
          pointerRafRef.current = null
          const { x, y, clientY } = pointerPendingRef.current

          setPrewarmNav(clientY < 120)
          document.documentElement.style.setProperty('--pointer-x', `${Math.round(x * 100)}%`)
          document.documentElement.style.setProperty('--pointer-y', `${Math.round(y * 100)}%`)
          setSceneTilt({
            x: (x - 0.5) * 2,
            y: (y - 0.5) * 2,
          })
          setInteractionTrail((current) => {
            const next = [...current, { x, y, t: Date.now() }]
            return next.slice(-64)
          })
          setHoverBeacon((current) => ({
            ...current,
            x,
            y,
            intensity: Math.min(1, current.intensity + 0.08),
          }))
        })
      }

      if (focusTimeoutRef.current) clearTimeout(focusTimeoutRef.current)
      setFocusMode(false)
      focusTimeoutRef.current = setTimeout(() => setFocusMode(true), 1200)
    }

    window.addEventListener('pointerdown', updateInteraction)
    window.addEventListener('keydown', updateInteraction)
    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      window.removeEventListener('pointerdown', updateInteraction)
      window.removeEventListener('keydown', updateInteraction)
      window.removeEventListener('mousemove', onMove)
      if (pointerRafRef.current) cancelAnimationFrame(pointerRafRef.current)
      if (focusTimeoutRef.current) clearTimeout(focusTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    let idleTimeout = null

    const arm = () => {
      if (idleTimeout) clearTimeout(idleTimeout)
      idleTimeout = setTimeout(() => setIdle(true), 5200)
    }

    const onActivity = () => {
      setIdle(false)
      arm()
    }

    arm()
    window.addEventListener('mousemove', onActivity, { passive: true })
    window.addEventListener('pointerdown', onActivity)
    window.addEventListener('keydown', onActivity)

    return () => {
      if (idleTimeout) clearTimeout(idleTimeout)
      window.removeEventListener('mousemove', onActivity)
      window.removeEventListener('pointerdown', onActivity)
      window.removeEventListener('keydown', onActivity)
    }
  }, [])

  useEffect(() => {
    sectionEnteredAtRef.current = performance.now()
    setNavigationPattern((current) => [...current.slice(-7), activeSection])
  }, [activeSection])

  useEffect(() => {
    const timer = setInterval(() => {
      const dwellMs = performance.now() - sectionEnteredAtRef.current
      const dwellScore = Math.min(1, dwellMs / 16000)
      const velocityPenalty = Math.min(1, scrollVelocity / 18)
      const focusBoost = focusMode ? 0.2 : 0
      setReadingFlow(Math.max(0, Math.min(1, dwellScore * (1 - velocityPenalty) + focusBoost)))
      setHoverBeacon((current) => ({ ...current, intensity: Math.max(0, current.intensity * 0.94) }))
    }, 320)

    return () => clearInterval(timer)
  }, [focusMode, scrollVelocity])

  useEffect(() => {
    if (!predictedSections.length) return
    predictedSections.forEach((sectionId) => prewarmSection(sectionId))
  }, [predictedSections, prewarmSection])

  useEffect(() => {
    document.body.dataset.runtimeTheme = dynamicTheme
    document.body.dataset.runtimeMode = runtimeMode
    return () => {
      delete document.body.dataset.runtimeTheme
      delete document.body.dataset.runtimeMode
    }
  }, [dynamicTheme, runtimeMode])

  useEffect(() => {
    const onPaletteShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen((value) => !value)
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'e') {
        event.preventDefault()
        setEngineeringMode((value) => !value)
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'f') {
        event.preventDefault()
        setFocusMode((value) => !value)
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'x') {
        event.preventDefault()
        setNeuralOverlayMode((value) => !value)
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'v') {
        event.preventDefault()
        setRuntimeMode((value) => (value === 'showcase' ? 'standard' : 'showcase'))
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'd') {
        event.preventDefault()
        setSpatialMode((value) => !value)
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'h') {
        event.preventDefault()
        setHudVisible((value) => !value)
      }
      if (event.key === 'Escape') {
        setCommandOpen(false)
      }
    }

    window.addEventListener('keydown', onPaletteShortcut)
    return () => window.removeEventListener('keydown', onPaletteShortcut)
  }, [])

  useEffect(() => {
    if (reducedMotion) {
      setRevealPhase(4)
      return
    }

    const steps = [
      setTimeout(() => setRevealPhase(1), 260),
      setTimeout(() => setRevealPhase(2), 680),
      setTimeout(() => setRevealPhase(3), 1120),
      setTimeout(() => setRevealPhase(4), 1600),
    ]

    return () => steps.forEach(clearTimeout)
  }, [reducedMotion])

  useEffect(() => {
    const onCardEnergy = (event) => {
      if (!event.detail) return
      setHoverBeacon(event.detail)
    }

    const onCardEnergyEnd = () => {
      setHoverBeacon((current) => ({ ...current, intensity: 0 }))
    }

    window.addEventListener('card-energy', onCardEnergy)
    window.addEventListener('card-energy-end', onCardEnergyEnd)

    return () => {
      window.removeEventListener('card-energy', onCardEnergy)
      window.removeEventListener('card-energy-end', onCardEnergyEnd)
    }
  }, [])

  useEffect(() => {
    if (activeSectionRef.current === activeSection) return
    activeSectionRef.current = activeSection
    setTransitionPulse({ id: activeSection, tick: Date.now() })
  }, [activeSection])

  // For demo: always show terminal, wire up navigation/mode
  const handleTerminalNavigate = (section) => {
    const nav = navItems.find((item) => item.id === section)
    if (nav) {
      document.getElementById(nav.id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
    }
  }
  const handleTerminalMode = (mode) => {
    if (mode === 'engineering') setEngineeringMode(true)
    if (mode === 'focus') setFocusMode(true)
  }

  return (
    <div className={`relative min-h-screen overflow-x-clip bg-bg text-slate-100 ${idle ? 'low-power' : ''} ${focusMode ? 'focus-mode' : ''} ${engineeringMode ? 'engineering-mode' : ''} ${runtimeMode === 'showcase' ? 'showcase-mode' : ''} ${spatialMode ? 'spatial-mode' : ''} theme-${dynamicTheme}`}>
      <TerminalAssistant visible={true} onNavigate={handleTerminalNavigate} onSetMode={handleTerminalMode} />
      
      {/* Lightweight Background Effects */}
      <TacticalGridOverlay />
      <AmbientLightingEngine
        activeSection={activeSection}
        interactionBoost={engagementBoost + memorySignal * 0.12}
        idle={idle}
        hoverBeacon={hoverBeacon}
        focusMode={focusMode}
        engineeringMode={engineeringMode}
        adaptation={aiAdaptation}
      />
      
      {/* UI Overlays & System Components */}
      {effectProfile.tier !== 'low-power' && <CustomCursor />}
      
      <ArchitectureSchematic
        engineeringMode={engineeringMode}
        focusMode={focusMode}
        viewedSections={viewedSections}
        throughput={throughput}
        predictedSections={predictedSections}
        workerLoad={runtimeTelemetry.workerLoad}
        packetRate={runtimeTelemetry.packetRate}
        dynamicTheme={dynamicTheme}
      />
      
      {hudVisible && (
        <TelemetryHud
          activeSection={activeSection}
          interactionCount={interactionCount}
          nodeCount={nodeCount}
          throughput={throughput}
          idle={idle}
          quality={effectProfile.tier}
          engineeringMode={engineeringMode}
          focusMode={focusMode}
          viewedProjects={viewedProjects.length}
          aiMode={aiAdaptation.layoutMode}
          wasmReady={aiAdaptation.wasmReady}
          workerLoad={runtimeTelemetry.workerLoad}
          dynamicTheme={dynamicTheme}
          packetRate={runtimeTelemetry.packetRate}
          predictedSections={predictedSections}
          particles={liveParticleCount}
          binaryLoad={runtimeTelemetry.binaryLoad}
          onClose={() => setHudVisible(false)}
        />
      )}
      
      <RuntimeSelfVisualizer
        visible={displayNeuralOverlay}
        activeSection={activeSection}
        dynamicTheme={dynamicTheme}
        predictedSections={predictedSections}
        packetRate={runtimeTelemetry.packetRate}
        workerLoad={runtimeTelemetry.workerLoad}
        frequencies={frequencies}
        sessionAgeMs={runtimeTelemetry.sessionAgeMs}
      />
      
      <AIAssistantOrb
        onOpenCommand={() => setCommandOpen(true)}
        interactionBoost={engagementBoost}
        engineeringMode={engineeringMode}
        focusMode={focusMode}
      />
      
      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onRun={runCommand}
        sectionPriority={aiAdaptation.sectionPriority}
        layoutMode={aiAdaptation.layoutMode}
      />

      {transitionPulse.tick > 0 && !reducedMotion && (
        <motion.div
          key={transitionPulse.tick}
          className="pointer-events-none fixed inset-0 z-[40]"
          initial={{ opacity: 0.22, scale: 0.985 }}
          animate={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.09),transparent_55%)]" />
        </motion.div>
      )}

      {revealPhase < 4 && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-[#030507]/95 backdrop-blur-sm"
          initial={{ opacity: 1 }}
          animate={{ opacity: revealPhase >= 3 ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          aria-hidden="true"
        >
          <div className="text-center font-mono">
            <p className="terminal-label">BOOTSTRAP SEQUENCE</p>
            <p className="mt-2 text-sm text-accent-cyan/90">
              {revealPhase === 0 && 'Stabilizing shader environment...'}
              {revealPhase === 1 && 'Forming UI shell...'}
              {revealPhase === 2 && 'Routing neural signal mesh...'}
              {revealPhase >= 3 && 'Finalizing atmospheric locks...'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Atmospheric mesh overlay */}
      <div aria-hidden="true" className="mesh-overlay pointer-events-none fixed inset-0 opacity-40" />

      {/* Floating glowing orbs with cyberpunk colors */}
      <motion.div
        aria-hidden="true"
        className="floating-orb pointer-events-none fixed -top-32 left-1/4 h-96 w-96 rounded-full bg-accent-cyan/15 blur-3xl"
        animate={reducedMotion ? {} : { x: [0, -15, 8, 0], y: [0, 12, -8, 0] }}
        transition={floatTransition}
      />
      <motion.div
        aria-hidden="true"
        className="floating-orb pointer-events-none fixed right-0 top-1/3 h-80 w-80 rounded-full bg-accent-teal/10 blur-3xl"
        animate={reducedMotion ? {} : { x: [0, -12, 0], y: [0, -10, 0] }}
        transition={{ ...floatTransition, duration: 24 }}
      />
      <motion.div
        aria-hidden="true"
        className="floating-orb pointer-events-none fixed -left-20 bottom-1/4 h-72 w-72 rounded-full bg-accent-violet/8 blur-3xl"
        animate={reducedMotion ? {} : { x: [0, 12, 0], y: [0, -8, 0] }}
        transition={{ ...floatTransition, duration: 26 }}
      />

      <div style={sceneTransform}>
      <nav className={`sticky top-4 z-50 px-4 transition duration-500 ${prewarmNav ? 'scale-[1.01]' : ''}`}>
        <Container className="max-w-5xl px-0">
          <div className="mx-auto flex w-full items-center justify-between rounded-xl border border-accent-cyan/30 bg-black/40 px-4 py-3 shadow-neon backdrop-blur-2xl sm:px-6">
            <a href="#" className="font-display text-sm font-bold tracking-widest uppercase text-accent-cyan">
              PKM
            </a>
            <ul className="flex items-center gap-1 rounded-lg border border-accent-cyan/20 bg-black/30 p-1.5">
              {adaptiveNavItems.map((item) => (
                <li key={item.id} className="list-none">
                  <a
                    href={`#${item.id}`}
                    onMouseEnter={() => prewarmSection(item.id)}
                    className={`nav-link-underline relative inline-flex rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan sm:text-sm ${
                      activeSection === item.id ? 'text-accent-cyan' : 'text-slate-300 hover:text-accent-cyan'
                    }`}
                  >
                    {activeSection === item.id && (
                      <motion.span
                        layoutId="active-nav-indicator"
                        className="absolute inset-0 -z-10 rounded-lg border border-accent-cyan/50 bg-accent-cyan/10"
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                      />
                    )}
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </nav>

      <header className="relative pb-20 pt-12 sm:pb-28 sm:pt-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="cyber-card relative overflow-hidden border-accent-cyan/40 p-8 sm:p-12"
            style={{ y: reducedMotion ? 0 : distortionY }}
          >
            {/* Cyberpunk gradient overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 via-transparent to-accent-teal/10"
              aria-hidden="true"
            />

            {/* Corner glow effects */}
            <div
              className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full bg-accent-cyan/20 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.8fr)]">
              <motion.div
                variants={heroContainerVariants}
                initial="hidden"
                animate="show"
                style={{ y: reducedMotion ? 0 : heroParallaxY }}
              >
                <motion.span
                  variants={heroItemVariants}
                  className="inline-flex items-center rounded-full border border-accent-cyan/50 bg-accent-cyan/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent-cyan font-mono"
                >
                  UI/UX Engineer | Developer
                </motion.span>

                <motion.div variants={heroItemVariants}>
                  <AnimatedIdentityLock reducedMotion={reducedMotion} />
                </motion.div>

                <motion.p variants={heroItemVariants} className="mt-5 text-sm font-semibold text-accent-cyan/80 font-mono">
                  Computer Science | Zimbabwe
                </motion.p>

                <motion.p variants={heroItemVariants} className="mt-3 max-w-3xl text-base text-slate-200 leading-relaxed">
                  Building intuitive, accessible, and performance-driven digital experiences that solve real problems with elegant systems thinking.
                </motion.p>

                <motion.div variants={heroItemVariants} className="mt-8">
                  <AnimatedTagline reducedMotion={reducedMotion} />
                </motion.div>

                <motion.div variants={heroItemVariants} className="mt-10 flex flex-wrap gap-3">
                  <Button href="#projects">Explore Work</Button>
                  <Button href="#contact" variant="ghost">
                    Get In Touch
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                className="mx-auto w-full max-w-sm lg:max-w-none"
                style={{ y: reducedMotion ? 0 : heroImageParallaxY }}
                initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.96, y: reducedMotion ? 0 : 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              >
                <div className="cyber-card relative overflow-hidden rounded-2xl border-accent-cyan/40 p-4">
                  <div
                    className="absolute inset-x-4 top-0 h-28 rounded-full bg-accent-cyan/30 blur-3xl"
                    aria-hidden="true"
                  />
                  <img
                    src="/profile.png"
                    alt="Portrait of Prince Kudzai Mhizha"
                    className="relative aspect-[4/5] w-full rounded-xl object-cover object-top"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </Container>
      </header>

      <main className="relative">
        <Section
          id="about"
          title="About"
          subtitle="I work across product strategy, interaction design, and implementation to deliver interfaces that hold up under real operational pressure."
          reducedMotion={reducedMotion}
        >
          <Card>
            <p className="text-sm leading-7 text-slate-200 sm:text-base">
              My approach combines systems thinking with practical engineering. I focus on accessibility,
              predictable interaction patterns, and measurable product outcomes. I collaborate closely with
              product, design, and risk teams to move from discovery to production without losing intent.
            </p>
          </Card>
        </Section>

        <Section
          id="skills"
          title="Skills"
          subtitle="Capabilities I use to design and ship trustworthy product experiences."
          reducedMotion={reducedMotion}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {skills.map((group, index) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
              >
                <Card className="h-full">
                  <h3 className="font-display text-lg font-semibold text-white">{group.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{group.description}</p>
                  <motion.div
                    className="mt-4 flex flex-wrap gap-2"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.25 }}
                    variants={{
                      hidden: {},
                      show: {
                        transition: {
                          staggerChildren: 0.05,
                        },
                      },
                    }}
                  >
                    {group.tags.map((tag) => (
                      <motion.div
                        key={tag}
                        variants={{
                          hidden: { opacity: 0, y: reducedMotion ? 0 : 6 },
                          show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
                        }}
                      >
                        <Tag>{tag}</Tag>
                      </motion.div>
                    ))}
                  </motion.div>
                </Card>
              </motion.div>
            ))}
          </div>
          <LanguageGrid />
        </Section>

        <Section
          id="projects"
          title="Projects"
          subtitle="Selected work focused on trust-critical product flows and execution quality."
          reducedMotion={reducedMotion}
        >
          <div className="grid gap-5">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.38, delay: index * 0.1 }}
                onViewportEnter={() => markProjectViewed(project.title)}
                onMouseEnter={(event) => registerProjectHover(project.title, event)}
              >
                <Card className={`h-full ${viewedProjects.includes(project.title) ? 'memory-trace' : ''}`} dataCardId={project.title}>
                  <h3 className="font-display text-xl font-semibold text-white">{project.title}</h3>
                  <p className="mt-2 text-sm text-slate-200">{project.summary}</p>
                  <p className="mt-2 text-sm text-slate-300">{project.scope}</p>
                  {viewedProjects.includes(project.title) && (
                    <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-accent-cyan/60">
                      Session memory retained
                    </p>
                  )}
                  <ul className="mt-4 space-y-2 text-sm text-slate-200">
                    {project.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-accent-cyan/70 shadow-neon" aria-hidden="true" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <motion.div
                    className="mt-5 flex flex-wrap gap-2"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{
                      hidden: {},
                      show: {
                        transition: {
                          staggerChildren: 0.045,
                        },
                      },
                    }}
                  >
                    {project.stack.map((item) => (
                      <motion.div
                        key={item}
                        variants={{
                          hidden: { opacity: 0, y: reducedMotion ? 0 : 6 },
                          show: { opacity: 1, y: 0, transition: { duration: 0.24 } },
                        }}
                      >
                        <Tag>{item}</Tag>
                      </motion.div>
                    ))}
                  </motion.div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section
          id="contact"
          title="Contact"
          subtitle="Let's collaborate on products where thoughtful design meets engineering excellence."
          reducedMotion={reducedMotion}
        >
          <Card>
            <div className="flex flex-wrap gap-3">
              {[
                {
                  label: 'GitHub',
                  href: 'https://github.com/princemhizha',
                  icon: Code2,
                },
                {
                  label: 'LinkedIn',
                  href: 'https://www.linkedin.com/in/prince-kudzai-mhizha-952977258',
                  icon: BriefcaseBusiness,
                },
                {
                  label: 'Facebook',
                  href: 'https://www.facebook.com/prince.mhizha.77/',
                  icon: Globe,
                },
                {
                  label: 'Email',
                  href: 'mailto:princemhizha58@gmail.com',
                  icon: Mail,
                },
              ].map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                  className="group inline-flex items-center gap-2 rounded-lg border border-accent-cyan/40 bg-accent-cyan/5 px-4 py-2 text-sm text-accent-cyan font-semibold transition duration-300 hover:border-accent-cyan/80 hover:bg-accent-cyan/15 hover:shadow-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                  aria-label={item.label}
                  whileHover={reducedMotion ? {} : { y: -3, scale: 1.05 }}
                  whileTap={reducedMotion ? {} : { y: -1, scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                >
                  <item.icon
                    size={18}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:scale-125 group-hover:drop-shadow-lg"
                  />
                  <span>{item.label}</span>
                </motion.a>
              ))}
            </div>
          </Card>
        </Section>
      </main>
      </div>
    </div>
  )
}

export default App
