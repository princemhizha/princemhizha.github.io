import { motion, useReducedMotion } from 'framer-motion'

export default function ArchitectureSchematic({
  engineeringMode = false,
  focusMode = false,
  viewedSections = [],
  throughput = 0,
  predictedSections = [],
  workerLoad = 0,
  packetRate = 0,
  dynamicTheme = 'standard',
}) {
  const reducedMotion = useReducedMotion()
  const componentTree = ['APP SHELL', 'WORKER FIELD', 'GPU FIELD', 'NEURAL GRAPH', 'RUNTIME HUD']
  const apiGraph = ['UI BUS -> RUNTIME WORKER', 'WORKER -> TELEMETRY HUD', 'PREDICTOR -> NAV PREFETCH']

  return (
    <motion.aside
      className={`hidden xl:block fixed top-24 right-5 z-[65] rounded-xl border border-accent-cyan/30 bg-black/55 p-3 backdrop-blur-xl transition-all duration-300 ${engineeringMode ? 'w-80 shadow-neon' : 'w-64'}`}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <p className="terminal-label">{engineeringMode ? 'Engineering Interface Mode' : 'Runtime Architecture'}</p>
      <div className="mt-2 space-y-2 font-mono text-[11px] text-slate-200">
        {[
          'UI SHELL -> SIGNAL BUS',
          'NEURAL LAYER -> NODE MESH',
          'TIMELINE -> DEPLOY LOGS',
          'PALETTE -> COMMAND ROUTER',
        ].map((line, idx) => (
          <motion.p
            key={line}
            animate={reducedMotion ? {} : { opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.6, delay: idx * 0.2, repeat: Infinity }}
          >
            {line}
          </motion.p>
        ))}
        {engineeringMode && (
          <>
            <div className="mt-3 border-t border-accent-cyan/15 pt-3">
              <p>FOCUS FIELD: {focusMode ? 'ENGAGED' : 'AMBIENT'}</p>
              <p>VISITED NODES: {viewedSections.length}</p>
              <p>THROUGHPUT BUS: {Math.round(throughput * 100)}%</p>
              <p>WORKER LOAD: {Math.round(workerLoad * 100)}%</p>
              <p>PACKET FLOW: {packetRate}/s</p>
              <p>THEME STATE: {dynamicTheme.toUpperCase()}</p>
            </div>
            <div className="mt-3 rounded-lg border border-accent-cyan/15 bg-black/25 p-2 text-[10px]">
              <p className="terminal-label">Live Component Tree</p>
              {componentTree.map((node, index) => (
                <p key={node} className="mt-1 text-slate-300">{`${' '.repeat(index)}${index > 0 ? '\u2514\u2500' : ''}${node}`}</p>
              ))}
            </div>
            <div className="mt-2 rounded-lg border border-accent-cyan/15 bg-black/25 p-2 text-[10px]">
              <p className="terminal-label">Infrastructure Flow</p>
              {apiGraph.map((edge) => (
                <p key={edge} className="mt-1 text-slate-300">{edge}</p>
              ))}
            </div>
            <div className="mt-2 rounded-lg border border-accent-cyan/15 bg-black/25 p-2 text-[10px]">
              <p className="terminal-label">Predictive Navigation</p>
              <p className="mt-1 text-slate-300">{predictedSections.join(' -> ') || 'LEARNING...'}</p>
            </div>
            <div className="rounded-lg border border-accent-cyan/20 bg-accent-cyan/5 p-2 text-[10px] uppercase tracking-[0.18em] text-accent-cyan/65">
              Ctrl+Shift+E toggles this layer. Ctrl+Shift+X toggles neural overlay.
            </div>
          </>
        )}
      </div>
    </motion.aside>
  )
}
