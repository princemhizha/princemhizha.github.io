import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'

function Card({ children, className = '', dataCardId = undefined }) {
  const reducedMotion = useReducedMotion()
  const [rotationX, setRotationX] = useState(0)
  const [rotationY, setRotationY] = useState(0)
  const [reflection, setReflection] = useState({ x: 50, y: 50 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (reducedMotion) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientY - rect.top - rect.height / 2) / 10
    const y = (e.clientX - rect.left - rect.width / 2) / 10
    const rx = ((e.clientX - rect.left) / rect.width) * 100
    const ry = ((e.clientY - rect.top) / rect.height) * 100

    setRotationX(x)
    setRotationY(-y)
    setReflection({ x: rx, y: ry })

    window.dispatchEvent(
      new CustomEvent('card-energy', {
        detail: {
          x: (rect.left + rect.width * 0.5) / window.innerWidth,
          y: (rect.top + rect.height * 0.5) / window.innerHeight,
          intensity: 0.55 + Math.min(0.45, Math.abs(x + y) * 0.015),
          radius: 0.22,
          id: dataCardId,
        },
      }),
    )
  }

  const handleMouseLeave = () => {
    setRotationX(0)
    setRotationY(0)
    setHovered(false)
    window.dispatchEvent(new Event('card-energy-end'))
  }

  return (
    <motion.div
      className="h-full perspective"
      style={{
        perspective: '1000px',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovered(true)}
    >
      <motion.article
        data-card-id={dataCardId}
        className={`group cyber-card energy-border relative h-full overflow-hidden p-6 transition duration-300 ${hovered ? 'ring-1 ring-accent-cyan/40' : ''} ${className}`}
        whileHover={reducedMotion ? {} : { y: -8, scale: 1.02, z: 24 }}
        animate={
          reducedMotion
            ? {}
            : {
                rotateX: rotationX,
                rotateY: rotationY,
                boxShadow: hovered
                  ? '0 28px 80px rgba(0, 229, 255, 0.18), inset 0 0 32px rgba(0, 229, 255, 0.08)'
                  : '0 18px 48px rgba(0, 0, 0, 0.18), inset 0 0 18px rgba(0, 229, 255, 0.04)',
              }
        }
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at ${reflection.x}% ${reflection.y}%, rgba(255,255,255,0.2), rgba(0,229,255,0.12) 24%, rgba(0,0,0,0) 58%)`,
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.18)_46%,transparent_70%)] opacity-0 transition duration-500 group-hover:translate-x-[120%] group-hover:opacity-100"
        />

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
