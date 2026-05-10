import { AnimatePresence, motion } from 'framer-motion'

export default function ProjectPreviewModal({ project, open, onClose, reducedMotion = false }) {
  return (
    <AnimatePresence>
      {open && project && (
        <motion.div
          className="fixed inset-0 z-[130] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-[#02050a]/82 backdrop-blur-md"
            onClick={onClose}
            aria-label="Close project preview"
          />

          <motion.article
            className="project-modal-shell relative w-full max-w-3xl overflow-hidden rounded-2xl border border-accent-cyan/40 bg-[#070c13]/92 p-5 sm:p-7"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 18, scale: reducedMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : 12, scale: reducedMotion ? 1 : 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,229,255,0.12),transparent_48%)]" />

            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="terminal-label">IMMERSIVE PROJECT PREVIEW</p>
                  <h3 className="mt-2 font-display text-2xl text-white">{project.title}</h3>
                </div>
                <button
                  type="button"
                  className="rounded-lg border border-accent-cyan/40 px-3 py-1.5 font-mono text-xs text-accent-cyan/80 transition hover:border-accent-cyan hover:text-accent-cyan"
                  onClick={onClose}
                >
                  CLOSE
                </button>
              </div>

              <p className="text-sm text-slate-200">{project.summary}</p>
              <p className="mt-2 text-sm text-slate-300">{project.scope}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-accent-cyan/25 bg-black/35 p-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent-cyan/70">STATUS</p>
                  <p className="mt-2 text-sm text-slate-100">Operational</p>
                </div>
                <div className="rounded-xl border border-accent-cyan/25 bg-black/35 p-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent-cyan/70">MODE</p>
                  <p className="mt-2 text-sm text-slate-100">Experience Systems</p>
                </div>
                <div className="rounded-xl border border-accent-cyan/25 bg-black/35 p-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent-cyan/70">RUNTIME</p>
                  <p className="mt-2 text-sm text-slate-100">Stable</p>
                </div>
              </div>

              <ul className="mt-5 space-y-2 text-sm text-slate-200">
                {project.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-accent-cyan/80" aria-hidden="true" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.stack.map((stack) => (
                  <span
                    key={stack}
                    className="rounded-full border border-accent-cyan/45 bg-accent-cyan/8 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-cyan"
                  >
                    {stack}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
