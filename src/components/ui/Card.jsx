import { motion, useReducedMotion } from 'framer-motion'

function Card({ children, className = '' }) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.article
      className={`group glass-panel relative h-full overflow-hidden border-white/10 bg-white/[0.045] p-6 shadow-[0_12px_32px_rgba(6,14,36,0.42)] transition-[border-color,box-shadow,transform] duration-300 hover:border-accent/45 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.28),0_20px_42px_rgba(6,14,36,0.62)] ${className}`}
      whileHover={reducedMotion ? {} : { y: -6, scale: 1.012 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.15),transparent_45%),radial-gradient(circle_at_90%_100%,rgba(167,139,250,0.12),transparent_52%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative">{children}</div>
    </motion.article>
  )
}

export default Card
