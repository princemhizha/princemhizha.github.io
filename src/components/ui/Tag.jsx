import { motion, useReducedMotion } from 'framer-motion'

function Tag({ children }) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.span
      className="rounded-full border border-accent-cyan/40 bg-accent-cyan/8 px-3 py-1 text-xs font-semibold text-accent-cyan transition-all duration-200 font-mono uppercase tracking-wider hover:border-accent-cyan/70 hover:bg-accent-cyan/15 hover:shadow-neon"
      whileHover={reducedMotion ? {} : { y: -2, scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
    >
      {children}
    </motion.span>
  )
}

export default Tag
