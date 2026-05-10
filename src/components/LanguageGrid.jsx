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
  Advanced: 'border-accent-cyan/50 bg-accent-cyan/15 text-accent-cyan shadow-neon',
  Proficient: 'border-accent-teal/40 bg-accent-teal/10 text-accent-teal',
  Working: 'border-accent-violet/30 bg-accent-violet/8 text-accent-violet',
}

function LanguageGrid() {
  const reducedMotion = useReducedMotion()

  return (
    <section aria-labelledby="languages-tools-heading" className="mt-12 sm:mt-14">
      <div className="mb-8 sm:mb-10">
        <h3
          id="languages-tools-heading"
          className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white"
        >
          Languages & Tools
        </h3>
        <p className="mt-3 max-w-2xl text-slate-300 font-light leading-relaxed">
          A tactical overview of the technologies and systems I use to move product ideas into reliable,
          production-ready experiences.
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {technologies.map((tech, index) => (
          <motion.li
            key={tech.name}
            className="list-none"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, delay: index * 0.03 }}
          >
            <motion.article
              tabIndex={0}
              className="group cyber-card relative flex h-full min-h-[140px] flex-col justify-between rounded-xl p-4 outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan sm:min-h-[156px]"
              whileHover={reducedMotion ? {} : { y: -6, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              <div className="flex items-start justify-between gap-3">
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-accent-cyan/40 bg-gradient-to-br from-accent-cyan/20 to-accent-teal/10 text-xs font-bold tracking-widest text-accent-cyan font-mono"
                  whileHover={reducedMotion ? {} : { scale: 1.1, rotateZ: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {tech.badge}
                </motion.div>
                <motion.span
                  className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wider font-mono transition-all ${tierStyles[tech.level]}`}
                  whileHover={reducedMotion ? {} : { scale: 1.08 }}
                >
                  {tech.level}
                </motion.span>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-semibold text-white sm:text-base">{tech.name}</h4>
                <p className="mt-1.5 text-xs uppercase tracking-widest text-accent-cyan/50 font-mono">
                  Tech Stack
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
