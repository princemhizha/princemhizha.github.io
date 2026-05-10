import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'

function Button({ href, children, variant = 'primary', className = '' }) {
  const reducedMotion = useReducedMotion()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e) => {
    if (reducedMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const base =
    'inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg relative overflow-hidden'

  const styles = {
    primary:
      'bg-gradient-to-r from-accent-cyan to-accent-teal text-slate-950 font-bold shadow-neon-cyan hover:shadow-glow-cyan',
    ghost:
      'border border-accent-cyan/40 bg-black/20 text-accent-cyan hover:border-accent-cyan/80 hover:bg-accent-cyan/10 hover:shadow-neon',
  }

  return (
    <motion.a
      href={href}
      className={`${base} ${styles[variant]} ${className}`}
      whileHover={reducedMotion ? {} : { y: -3, scale: 1.03 }}
      whileTap={reducedMotion ? {} : { y: -1, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !reducedMotion && setIsHovering(true)}
      onMouseLeave={() => !reducedMotion && setIsHovering(false)}
    >
      {/* Glow effect that follows cursor */}
      {isHovering && !reducedMotion && (
        <motion.div
          className="absolute pointer-events-none rounded-full bg-accent-cyan/20 blur-2xl"
          style={{
            width: '100px',
            height: '100px',
            left: mousePosition.x - 50,
            top: mousePosition.y - 50,
            mixBlendMode: 'screen',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.a>
  )
}

export default Button
