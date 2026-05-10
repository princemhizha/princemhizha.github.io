import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

const nodes = [
  { id: 'react', label: 'React', x: 20, y: 48, group: 'frontend' },
  { id: 'next', label: 'Next.js', x: 35, y: 28, group: 'frontend' },
  { id: 'tailwind', label: 'TailwindCSS', x: 34, y: 68, group: 'frontend' },
  { id: 'motion', label: 'Framer Motion', x: 49, y: 50, group: 'frontend' },
  { id: 'ts', label: 'TypeScript', x: 50, y: 22, group: 'engineering' },
  { id: 'ux', label: 'UX Systems', x: 66, y: 36, group: 'design' },
  { id: 'ai', label: 'AI UX', x: 66, y: 64, group: 'ai' },
  { id: 'viz', label: 'Data Viz', x: 81, y: 50, group: 'ai' },
]

const links = [
  ['react', 'next'],
  ['react', 'tailwind'],
  ['react', 'motion'],
  ['react', 'ts'],
  ['motion', 'ux'],
  ['ts', 'ux'],
  ['ux', 'ai'],
  ['ai', 'viz'],
  ['motion', 'ai'],
]

const groupColor = {
  frontend: 'rgba(0,229,255,0.9)',
  engineering: 'rgba(2,195,154,0.92)',
  design: 'rgba(142,197,255,0.9)',
  ai: 'rgba(94,234,212,0.9)',
}

export default function SkillConstellation({ reducedMotion = false }) {
  const [activeNode, setActiveNode] = useState('react')

  const connectedNodes = useMemo(() => {
    const set = new Set([activeNode])
    links.forEach(([a, b]) => {
      if (a === activeNode) set.add(b)
      if (b === activeNode) set.add(a)
    })
    return set
  }, [activeNode])

  const connectedLinks = useMemo(
    () => links.filter(([a, b]) => connectedNodes.has(a) && connectedNodes.has(b)),
    [connectedNodes],
  )

  return (
    <div className="constellation-shell relative overflow-hidden rounded-2xl border border-accent-cyan/30 bg-black/35 p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="terminal-label">INTERACTIVE SKILL CONSTELLATION</p>
          <p className="mt-1 text-sm text-slate-300">Hover nodes to activate connected technologies and signal routes.</p>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-cyan/70">ACTIVE NODE: {activeNode}</p>
      </div>

      <div className="relative h-[360px] w-full overflow-hidden rounded-xl border border-accent-cyan/20 bg-[#05080d]/80">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <radialGradient id="constellationGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0,229,255,0.35)" />
              <stop offset="100%" stopColor="rgba(0,229,255,0)" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width="100" height="100" fill="url(#constellationGlow)" opacity="0.5" />

          {links.map(([a, b]) => {
            const left = nodes.find((node) => node.id === a)
            const right = nodes.find((node) => node.id === b)
            const isActive = connectedNodes.has(a) && connectedNodes.has(b)

            return (
              <g key={`${a}-${b}`}>
                <line
                  x1={left.x}
                  y1={left.y}
                  x2={right.x}
                  y2={right.y}
                  stroke={isActive ? 'rgba(0,229,255,0.62)' : 'rgba(74,95,120,0.35)'}
                  strokeWidth={isActive ? 0.42 : 0.22}
                  strokeLinecap="round"
                />
                {isActive && !reducedMotion && (
                  <line
                    x1={left.x}
                    y1={left.y}
                    x2={right.x}
                    y2={right.y}
                    className="constellation-pulse"
                    stroke="rgba(0,229,255,0.95)"
                    strokeWidth="0.24"
                    strokeDasharray="2.2 2"
                  />
                )}
              </g>
            )
          })}

          {nodes.map((node) => {
            const isActive = node.id === activeNode
            const isConnected = connectedNodes.has(node.id)

            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isActive ? 2.6 : 2.1}
                  fill={isConnected ? groupColor[node.group] : 'rgba(129,149,180,0.45)'}
                  opacity={isConnected ? 1 : 0.68}
                />
                {isConnected && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isActive ? 5.8 : 4.5}
                    fill="none"
                    stroke={groupColor[node.group]}
                    strokeWidth="0.35"
                    opacity={isActive ? 0.7 : 0.35}
                    className={isActive && !reducedMotion ? 'constellation-node-wave' : ''}
                  />
                )}
              </g>
            )
          })}
        </svg>

        <div className="pointer-events-none absolute inset-0">
          {nodes.map((node) => {
            const isConnected = connectedNodes.has(node.id)
            return (
              <button
                key={node.id}
                type="button"
                className="constellation-hit absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onMouseEnter={() => setActiveNode(node.id)}
                onFocus={() => setActiveNode(node.id)}
                aria-label={`Activate ${node.label}`}
              >
                <span className={`constellation-label ${isConnected ? 'is-connected' : ''}`}>{node.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from(connectedNodes).map((id) => {
          const node = nodes.find((item) => item.id === id)
          return (
            <motion.span
              key={id}
              initial={{ opacity: 0, y: reducedMotion ? 0 : 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24 }}
              className="rounded-full border border-accent-cyan/45 bg-accent-cyan/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-cyan"
            >
              {node.label}
            </motion.span>
          )
        })}
      </div>

      <ul className="mt-3 space-y-1 text-xs text-slate-300">
        {connectedLinks.map(([a, b]) => (
          <li key={`meta-${a}-${b}`} className="font-mono tracking-wide text-slate-400">
            {nodes.find((n) => n.id === a).label} {'->'} {nodes.find((n) => n.id === b).label}
          </li>
        ))}
      </ul>
    </div>
  )
}
