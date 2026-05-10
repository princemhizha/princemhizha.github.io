import { motion, useReducedMotion } from 'framer-motion'

export default function RuntimeSelfVisualizer({
  visible = false,
  activeSection = 'about',
  dynamicTheme = 'standard',
  predictedSections = [],
  packetRate = 0,
  workerLoad = 0,
  frequencies = [],
  sessionAgeMs = 0,
}) {
  const reducedMotion = useReducedMotion()

  if (!visible) return null

  return (
    <motion.aside
      className="fixed bottom-5 left-5 z-[80] w-[22rem] rounded-xl border border-accent-cyan/30 bg-black/70 p-3 backdrop-blur-xl"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.32 }}
    >
      <p className="terminal-label">RUNTIME SELF VISUALIZATION</p>
      <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-200">
        <span>ACTIVE NODE</span>
        <span className="text-accent-cyan">{activeSection.toUpperCase()}</span>
        <span>DYNAMIC THEME</span>
        <span className="text-accent-cyan">{dynamicTheme.toUpperCase()}</span>
        <span>WORKER LOAD</span>
        <span className="text-accent-cyan">{Math.round(workerLoad * 100)}%</span>
        <span>PACKET RATE</span>
        <span className="text-accent-cyan">{packetRate}/s</span>
        <span>SESSION AGE</span>
        <span className="text-accent-cyan">{Math.round(sessionAgeMs / 1000)}s</span>
      </div>

      <div className="mt-3 rounded-lg border border-accent-cyan/20 bg-accent-cyan/5 p-2 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-cyan/65">
        Next predicted navigation: {predictedSections.join(' -> ') || 'calculating'}
      </div>

      <div className="mt-3">
        <p className="terminal-label">Harmonic Signal Bus</p>
        <div className="mt-1 grid grid-cols-5 gap-1">
          {(frequencies.length ? frequencies : [0.3, 0.45, 0.6, 0.5, 0.4]).slice(0, 5).map((value, index) => (
            <motion.div
              key={`${index}-${value}`}
              className="h-12 rounded bg-accent-cyan/20"
              animate={reducedMotion ? {} : { height: 16 + value * 42 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            />
          ))}
        </div>
      </div>
    </motion.aside>
  )
}
