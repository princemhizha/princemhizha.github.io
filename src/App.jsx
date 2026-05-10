import { useEffect, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { BriefcaseBusiness, Code2, Globe, Mail } from 'lucide-react'
import Button from './components/ui/Button'
import Card from './components/ui/Card'
import LanguageGrid from './components/LanguageGrid'
import Container from './components/ui/Container'
import Section from './components/ui/Section'
import Tag from './components/ui/Tag'
import BinaryStream from './components/BinaryStream'
import DigitalFog from './components/DigitalFog'
import CustomCursor from './components/CustomCursor'

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

function App() {
  const reducedMotion = useReducedMotion()
  const [activeSection, setActiveSection] = useState('about')
  const { scrollY } = useScroll()
  const heroParallaxY = useTransform(scrollY, [0, 520], [0, -34])
  const heroImageParallaxY = useTransform(scrollY, [0, 520], [0, 20])

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
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

  return (
    <div className="relative min-h-screen overflow-x-clip bg-bg text-slate-100">
      {/* Background layer components */}
      <BinaryStream />
      <DigitalFog />
      <CustomCursor />

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

      <nav className="sticky top-4 z-50 px-4">
        <Container className="max-w-5xl px-0">
          <div className="mx-auto flex w-full items-center justify-between rounded-xl border border-accent-cyan/30 bg-black/40 px-4 py-3 shadow-neon backdrop-blur-2xl sm:px-6">
            <a href="#" className="font-display text-sm font-bold tracking-widest uppercase text-accent-cyan">
              PKM
            </a>
            <ul className="flex items-center gap-1 rounded-lg border border-accent-cyan/20 bg-black/30 p-1.5">
              {navItems.map((item) => (
                <li key={item.id} className="list-none">
                  <a
                    href={`#${item.id}`}
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

                <motion.h1
                  variants={heroItemVariants}
                  className="mt-8 font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white"
                >
                  <span className="bg-gradient-to-r from-accent-cyan via-accent-teal to-accent-cyan bg-clip-text text-transparent">
                    Prince Kudzai Mhizha
                  </span>
                </motion.h1>

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
              >
                <Card className="h-full">
                  <h3 className="font-display text-xl font-semibold text-white">{project.title}</h3>
                  <p className="mt-2 text-sm text-slate-200">{project.summary}</p>
                  <p className="mt-2 text-sm text-slate-300">{project.scope}</p>
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
  )
}

export default App
