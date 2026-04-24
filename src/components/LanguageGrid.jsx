import { motion, useReducedMotion } from 'framer-motion'

const technologies = [
  { name: 'JavaScript', badge: 'JS', level: 'Advanced' },
  { name: 'TypeScript', badge: 'TS', level: 'Advanced' },
  { name: 'React', badge: 'RE', level: 'Advanced' },
  { name: 'Tailwind CSS', badge: 'TW', level: 'Advanced' },
  { name: 'Node.js', badge: 'ND', level: 'Proficient' },
  { name: 'Python', badge: 'PY', level: 'Proficient' },
  { name: 'Java', badge: 'JV', level: 'Proficient' },
  { name: 'C', badge: 'CC', level: 'Working' },
  { name: 'MongoDB', badge: 'MG', level: 'Proficient' },
  { name: 'Firebase', badge: 'FB', level: 'Proficient' },
  { name: 'Arduino', badge: 'AR', level: 'Working' },
  { name: 'Figma', badge: 'FG', level: 'Advanced' },
  { name: 'Framer Motion', badge: 'FM', level: 'Proficient' },
  { name: 'Git', badge: 'GT', level: 'Proficient' },
  { name: 'UI Systems', badge: 'UI', level: 'Working' },
  { name: 'Accessibility', badge: 'AX', level: 'Advanced' },
  { name: 'Data Visualization', badge: 'DV', level: 'Working' },
]

const tierStyles = {
  Advanced: 'border-accent/30 bg-accent/10 text-accent-soft',
  Proficient: 'border-violet-400/30 bg-violet-400/10 text-violet-200',
  Working: 'border-white/15 bg-white/5 text-slate-300',
}

function LanguageGrid() {
  const reducedMotion = useReducedMotion()

  return (
    <section aria-labelledby="languages-tools-heading" className="mt-10 sm:mt-12">
      <div className="mb-5 sm:mb-6">
        <h3
          id="languages-tools-heading"
          className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl"
        >
          Languages & Tools
        </h3>
        <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
          A compact view of the technologies and systems I use to move product ideas into reliable,
          production-ready experiences.
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {technologies.map((tech, index) => (
          <motion.li
            key={tech.name}
            className="list-none"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.32, delay: index * 0.035 }}
          >
            <motion.article
              tabIndex={0}
              className="group glass-panel flex h-full min-h-[132px] flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-4 outline-none transition-[border-color,box-shadow,transform] duration-200 focus-visible:border-accent/60 focus-visible:shadow-neon sm:min-h-[144px]"
              whileHover={reducedMotion ? {} : { y: -4, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-950/50 text-sm font-semibold tracking-[0.18em] text-accent-soft shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors duration-200 group-hover:border-accent/40 group-hover:bg-accent/10 group-focus-visible:border-accent/40 group-focus-visible:bg-accent/10">
                  {tech.badge}
                </div>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${tierStyles[tech.level]}`}
                >
                  {tech.level}
                </span>
              </div>

              <div className="mt-5">
                <h4 className="text-sm font-semibold text-white sm:text-base">{tech.name}</h4>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                  Language / Tooling
                </p>
              </div>
            </motion.article>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

export default LanguageGrid
