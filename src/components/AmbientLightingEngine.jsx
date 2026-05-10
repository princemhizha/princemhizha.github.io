import { motion, useReducedMotion } from 'framer-motion'

const sectionLighting = {
  about: {
    colorA: 'rgba(0, 229, 255, 0.24)',
    colorB: 'rgba(2, 195, 154, 0.16)',
  },
  timeline: {
    colorA: 'rgba(0, 229, 255, 0.2)',
    colorB: 'rgba(124, 58, 237, 0.14)',
  },
  skills: {
    colorA: 'rgba(2, 195, 154, 0.26)',
    colorB: 'rgba(0, 229, 255, 0.14)',
  },
  projects: {
    colorA: 'rgba(2, 195, 154, 0.24)',
    colorB: 'rgba(0, 229, 255, 0.12)',
  },
  contact: {
    colorA: 'rgba(124, 58, 237, 0.24)',
    colorB: 'rgba(255, 77, 109, 0.11)',
  },
}

export default function AmbientLightingEngine({ activeSection = 'about', interactionBoost = 0, idle = false, hoverBeacon, focusMode = false, engineeringMode = false, adaptation }) {
  const reducedMotion = useReducedMotion()
  const lighting = sectionLighting[activeSection] ?? sectionLighting.about
  const opacity = idle ? 0.26 : 0.4 + interactionBoost * 0.25 + (engineeringMode ? 0.08 : 0) + (adaptation?.lightingBias ?? 0)

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[3]"
      animate={{ opacity }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          background: `radial-gradient(circle at ${Math.round((hoverBeacon?.x ?? 0.5) * 100)}% ${Math.round((hoverBeacon?.y ?? 0.5) * 100)}%, rgba(0,229,255,${0.16 * (hoverBeacon?.intensity ?? 0)}), transparent 22%)`,
        }}
        transition={{ duration: 0.24, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute -top-24 left-[8%] h-[28rem] w-[28rem] rounded-full blur-3xl"
        animate={
          reducedMotion
            ? {}
            : {
                x: [0, 22, -10, 0],
                y: [0, -18, 8, 0],
              }
        }
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: lighting.colorA }}
      />
      <motion.div
        className="absolute bottom-[8%] right-[6%] h-[24rem] w-[24rem] rounded-full blur-3xl"
        animate={
          reducedMotion
            ? {}
            : {
                x: [0, -18, 14, 0],
                y: [0, 10, -12, 0],
              }
        }
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: lighting.colorB }}
      />
      {focusMode && (
        <div className="absolute inset-x-[18%] top-[12%] h-[36rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_68%)] blur-3xl" />
      )}
    </motion.div>
  )
}
