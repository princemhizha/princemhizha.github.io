import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'

function Card({ children, className = '' }) {
  const reducedMotion = useReducedMotion()
  const [rotationX, setRotationX] = useState(0)
  const [rotationY, setRotationY] = useState(0)

  const handleMouseMove = (e) => {
    if (reducedMotion) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientY - rect.top - rect.height / 2) / 10
    const y = (e.clientX - rect.left - rect.width / 2) / 10

    setRotationX(x)
    setRotationY(-y)
  }

  const handleMouseLeave = () => {
    setRotationX(0)
    setRotationY(0)
  }

  return (
    <motion.div
      className="h-full perspective"
      style={{
        perspective: '1000px',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.article
        className={`group cyber-card relative h-full overflow-hidden p-6 ${className}`}
        whileHover={reducedMotion ? {} : { y: -8, scale: 1.02 }}
        animate={
          reducedMotion
            ? {}
            : {
                rotateX: rotationX,
                rotateY: rotationY,
              }
        }
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Glow gradient overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-accent-cyan/0 via-transparent to-accent-teal/0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        />

        {/* Corner glow effects */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-1/2 -right-1/2 w-full h-full rounded-full bg-accent-cyan/20 blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
        />

        <div className="relative z-10">{children}</div>
      </motion.article>
    </motion.div>
  )
}

export default Card
