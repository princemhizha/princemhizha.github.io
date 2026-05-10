import { motion, useReducedMotion } from 'framer-motion'

const hints = [
  'Press Ctrl+K for command palette',
  'Inspect projects for system logs',
  'Hover cards to trace signal routes',
]

export default function AIAssistantOrb({ onOpenCommand, interactionBoost = 0, engineeringMode = false, focusMode = false }) {
  const reducedMotion = useReducedMotion()
  const hint = engineeringMode
    ? 'Engineering interface active. Press Ctrl+Shift+E to disengage.'
    : focusMode
      ? 'Focus field engaged. Motion is biasing toward reading clarity.'
      : hints[Math.min(hints.length - 1, Math.floor(interactionBoost * 3))]

  return (
    <motion.button
      type="button"
      onClick={onOpenCommand}
      className="group fixed bottom-5 right-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full border border-accent-cyan/45 bg-black/55 text-accent-cyan shadow-neon backdrop-blur-xl"
      animate={
        reducedMotion
          ? {}
          : {
              y: [0, -5, 0],
              scale: engineeringMode ? [1, 1.05, 1] : 1,
              boxShadow: [
                '0 0 18px rgba(0,229,255,0.35)',
                '0 0 28px rgba(0,229,255,0.55)',
                '0 0 18px rgba(0,229,255,0.35)',
              ],
            }
      }
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      aria-label="Open AI command palette"
    >
      <span className="h-2.5 w-2.5 rounded-full bg-accent-cyan shadow-[0_0_12px_rgba(0,229,255,0.9)]" />
      <span className="pointer-events-none absolute bottom-full right-0 mb-2 w-56 translate-y-2 rounded-lg border border-accent-cyan/35 bg-black/70 px-2.5 py-2 text-left text-[11px] font-mono text-slate-200 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        AI Node: {hint}
      </span>
    </motion.button>
  )
}
