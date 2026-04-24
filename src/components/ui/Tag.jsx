import { motion, useReducedMotion } from 'framer-motion'

function Tag({ children }) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.span
      className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent-soft transition-[border-color,box-shadow,transform] duration-200 hover:border-accent/60 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.28)]"
      whileHover={reducedMotion ? {} : { y: -1, scale: 1.025 }}
      transition={{ type: 'spring', stiffness: 320, damping: 20 }}
    >
      {children}
    </motion.span>
  )
}

export default Tag
