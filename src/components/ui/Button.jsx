import { motion, useReducedMotion } from 'framer-motion'

function Button({ href, children, variant = 'primary', className = '' }) {
  const reducedMotion = useReducedMotion()

  const base =
    'inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-bg'

  const styles = {
    primary:
      'bg-gradient-to-r from-accent to-cyan-300 text-slate-950 shadow-neon hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.45),0_16px_30px_rgba(34,211,238,0.2)]',
    ghost:
      'border border-white/20 bg-white/5 text-slate-100 hover:border-accent/70 hover:bg-white/10 hover:shadow-neon',
  }

  return (
    <motion.a
      href={href}
      className={`${base} ${styles[variant]} ${className}`}
      whileHover={reducedMotion ? {} : { y: -2, scale: 1.02 }}
      whileTap={reducedMotion ? {} : { y: 0, scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 280, damping: 20 }}
    >
      {children}
    </motion.a>
  )
}

export default Button
