import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

function makeColumn(width, height, depth) {
  return {
    x: Math.random() * width,
    y: Math.random() * (height + 240) - 180,
    speed: (0.35 + Math.random() * 0.95) * depth,
    drift: (Math.random() - 0.5) * 0.22 * depth,
    alpha: 0.08 + Math.random() * 0.28,
    size: 11 + Math.round(Math.random() * 4),
    depth,
    chars: Array.from({ length: 14 + Math.floor(Math.random() * 10) }, () => (Math.random() > 0.5 ? '0' : '1')),
    glitchUntil: 0,
    dissolveAt: performance.now() + 3000 + Math.random() * 5200,
  }
}

export default function BinaryStream({
  scrollVelocity = 0,
  focusMode = false,
  interactionBoost = 0,
  pointer = { x: 0.5, y: 0.5 },
  onLoad,
}) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const stateRef = useRef({ columns: [], particles: [], width: 0, height: 0, frame: 0 })
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let dpr = window.devicePixelRatio || 1

    const rebuild = () => {
      const rect = canvas.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const depthLayers = [0.75, 1, 1.28]
      const columns = depthLayers.flatMap((depth) => {
        const count = Math.max(8, Math.round((width / 80) * depth))
        return Array.from({ length: count }, () => makeColumn(width, height, depth))
      })

      stateRef.current = {
        ...stateRef.current,
        width,
        height,
        columns,
      }
    }

    rebuild()

    const render = () => {
      const state = stateRef.current
      const { width, height } = state
      state.frame += 1
      const now = performance.now()

      const activityGain = Math.min(1, interactionBoost * 0.7 + Math.min(1, scrollVelocity / 18) * 0.3)
      const fade = 0.07 - activityGain * 0.02
      ctx.fillStyle = `rgba(2, 5, 11, ${Math.max(0.03, fade)})`
      ctx.fillRect(0, 0, width, height)

      state.columns.forEach((column, index) => {
        const pointerDx = pointer.x * width - column.x
        const influence = Math.max(0, 1 - Math.abs(pointerDx) / 220)
        const localSpeed = column.speed + scrollVelocity * 0.018 + influence * 0.22
        column.y += localSpeed
        column.x += column.drift + (index % 2 === 0 ? 1 : -1) * 0.03 * influence

        if (column.y > height + 180 || column.x < -80 || column.x > width + 80) {
          const next = makeColumn(width, height, column.depth)
          next.y = -140
          Object.assign(column, next)
        }

        if (now > column.dissolveAt && Math.random() > 0.88) {
          const anchorY = column.y + column.chars.length * 7
          for (let i = 0; i < 4; i += 1) {
            state.particles.push({
              x: column.x,
              y: anchorY,
              vx: (Math.random() - 0.5) * 0.8,
              vy: -0.45 - Math.random() * 0.45,
              ttl: 28 + Math.random() * 18,
            })
          }
          column.dissolveAt = now + 3200 + Math.random() * 4200
        }

        if (Math.random() > 0.995) {
          column.glitchUntil = now + 100 + Math.random() * 150
        }

        const glitching = now < column.glitchUntil
        const baseAlpha = column.alpha + (focusMode ? 0.06 : 0) + activityGain * 0.07
        const flicker = Math.sin(state.frame * 0.09 + index * 0.7) * 0.11
        const glyphAlpha = Math.max(0.08, Math.min(0.92, baseAlpha + flicker))

        ctx.font = `${column.size}px JetBrains Mono, monospace`
        ctx.textAlign = 'center'
        ctx.fillStyle = glitching ? 'rgba(133, 255, 242, 0.95)' : `rgba(0, 229, 255, ${glyphAlpha * 0.85})`

        for (let i = 0; i < column.chars.length; i += 1) {
          if (Math.random() > 0.986) {
            column.chars[i] = Math.random() > 0.5 ? '0' : '1'
          }
          const charY = column.y + i * (column.size + 3)
          if (charY > -24 && charY < height + 24) {
            const char = glitching && Math.random() > 0.72 ? (Math.random() > 0.5 ? '1' : '0') : column.chars[i]
            ctx.fillText(char, column.x, charY)
          }
        }
      })

      state.particles = state.particles.filter((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.ttl -= 1
        ctx.fillStyle = `rgba(0, 229, 255, ${Math.max(0, particle.ttl / 40)})`
        ctx.fillRect(particle.x, particle.y, 1.8, 1.8)
        return particle.ttl > 0
      })

      if (onLoad) {
        const binaryLoad = Math.min(1, (state.columns.length + state.particles.length * 0.5) / 90)
        onLoad(binaryLoad)
      }

      animationRef.current = requestAnimationFrame(render)
    }

    render()

    const onResize = () => {
      dpr = window.devicePixelRatio || 1
      rebuild()
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [focusMode, interactionBoost, onLoad, pointer.x, pointer.y, reducedMotion, scrollVelocity])

  return (
    <canvas
      ref={canvasRef}
      className="binary-matrix fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  )
}
