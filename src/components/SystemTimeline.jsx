import { motion, useReducedMotion } from 'framer-motion'
import Section from './ui/Section'

const logs = [
  { phase: '2021', title: 'Foundation Layer', note: 'Computer Science pathway established and core engineering stack initialized.' },
  { phase: '2023', title: 'Operational UX', note: 'Advanced product systems, trust patterns, and accessibility architecture refined.' },
  { phase: '2024', title: 'Field Deployments', note: 'Hackathon deployments, healthcare systems, and embedded safety experiences shipped.' },
  { phase: '2026', title: 'Cybernetic Portfolio Runtime', note: 'Portfolio evolved into a live engineering interface with adaptive visual systems.' },
]

export default function SystemTimeline({ reducedMotion = false, engineeringMode = false, viewed = false }) {
  const localReducedMotion = useReducedMotion() || reducedMotion

  return (
    <Section
      id="timeline"
      title="System Timeline"
      subtitle="A classified progression log of design and engineering evolution."
      reducedMotion={localReducedMotion}
    >
      <ol className="relative space-y-5 border-l border-accent-cyan/25 pl-6">
        {logs.map((log, index) => (
          <motion.li
            key={log.phase}
            className="relative"
            initial={{ opacity: 0, x: localReducedMotion ? 0 : -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
          >
            <span className="absolute -left-[1.86rem] top-2 h-3 w-3 rounded-full bg-accent-cyan shadow-neon" />
            <article className={`energy-border cyber-card p-4 ${viewed ? 'memory-trace' : ''}`}>
              <p className="font-mono text-xs uppercase tracking-widest text-accent-cyan/65">{log.phase}</p>
              <h3 className="mt-1 font-display text-lg font-semibold text-white">{log.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{log.note}</p>
              {engineeringMode && <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-accent-cyan/55">Deployment record verified</p>}
            </article>
          </motion.li>
        ))}
      </ol>
    </Section>
  )
}
