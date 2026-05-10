import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CommandPalette({ open, onClose, onRun, sectionPriority = [], layoutMode = 'explorer' }) {
  const [query, setQuery] = useState('')
  const commands = useMemo(
    () => [
      { id: 'about', label: 'Navigate: About', action: () => onRun('about') },
      { id: 'timeline', label: 'Navigate: Timeline', action: () => onRun('timeline') },
      { id: 'skills', label: 'Navigate: Skills', action: () => onRun('skills') },
      { id: 'projects', label: 'Navigate: Projects', action: () => onRun('projects') },
      { id: 'contact', label: 'Navigate: Contact', action: () => onRun('contact') },
      { id: 'deploy', label: 'Mode: Deploy Focus', action: () => onRun('mode-deploy') },
      { id: 'theme', label: 'Mode: Toggle Spectrum', action: () => onRun('mode-theme') },
      { id: 'engineering', label: 'Mode: Toggle Engineering Interface', action: () => onRun('mode-engineering') },
      { id: 'focus', label: 'Mode: Toggle Focus Field', action: () => onRun('mode-focus') },
      { id: 'productivity', label: 'Mode: Productivity Interface', action: () => onRun('mode-productivity') },
      { id: 'showcase', label: 'Mode: Cinematic Showcase', action: () => onRun('mode-showcase') },
      { id: 'neural', label: 'Overlay: Neural Interaction Graph', action: () => onRun('mode-neural') },
      { id: 'spatial', label: 'Mode: Pseudo-3D Spatial', action: () => onRun('mode-spatial') },
    ],
    [onRun],
  )

  const prioritizedCommands = useMemo(() => {
    const priorityMap = new Map(sectionPriority.map((id, index) => [id, index]))

    return [...commands].sort((left, right) => {
      const leftRank = priorityMap.get(left.id) ?? Number.MAX_SAFE_INTEGER
      const rightRank = priorityMap.get(right.id) ?? Number.MAX_SAFE_INTEGER

      if (leftRank === rightRank) return 0
      return leftRank - rightRank
    })
  }, [commands, sectionPriority])

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const filtered = prioritizedCommands.filter((command) => command.label.toLowerCase().includes(query.toLowerCase()))

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center bg-black/55 px-4 pt-24 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-2xl rounded-2xl border border-accent-cyan/40 bg-black/70 p-4 shadow-glow-cyan"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onClick={(event) => event.stopPropagation()}
          >
            <label className="terminal-label">SYSTEM COMMAND PALETTE</label>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-accent-cyan/55">
              Adaptive layout: {layoutMode}
            </p>
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type command..."
              className="mt-2 w-full rounded-lg border border-accent-cyan/30 bg-black/45 px-3 py-2 font-mono text-sm text-white outline-none focus:border-accent-cyan/70"
            />
            <ul className="mt-3 max-h-72 space-y-1 overflow-auto">
              {filtered.map((command) => (
                <li key={command.id}>
                  <button
                    type="button"
                    onClick={() => {
                      command.action()
                      onClose()
                    }}
                    className="w-full rounded-lg border border-transparent px-3 py-2 text-left font-mono text-sm text-slate-200 transition hover:border-accent-cyan/35 hover:bg-accent-cyan/10 hover:text-white"
                  >
                    {command.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
