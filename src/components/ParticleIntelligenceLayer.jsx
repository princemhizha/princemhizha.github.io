import { useEffect, useRef } from 'react'

export default function ParticleIntelligenceLayer({
  reducedMotion = false,
  activeSection = 'about',
  interactionBoost = 0,
  hoverBeacon,
  scrollVelocity = 0,
  focusMode = false,
  engineeringMode = false,
  quality = 'balanced',
  frequencies = [],
}) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const pointerRef = useRef({ x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 })

  useEffect(() => {
    if (reducedMotion) return undefined

    const canvas = canvasRef.current
    if (!canvas) return undefined

    const context = canvas.getContext('2d')
    if (!context) return undefined

    const density = quality === 'cinematic' ? 1 : quality === 'balanced' ? 0.8 : 0.55
    const dpr = Math.min(window.devicePixelRatio || 1, quality === 'cinematic' ? 1 : 0.85)
    let width = 0
    let height = 0
    let frame = 0

    const sectionHue = {
      about: 190,
      timeline: 198,
      skills: 164,
      projects: 180,
      contact: 268,
    }

    const particleCount = Math.round((quality === 'cinematic' ? 72 : 52) * density)
    const particles = Array.from({ length: particleCount }, (_, index) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: 1.1 + Math.random() * 1.5,
      orbit: index / particleCount,
    }))

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const handleMove = (event) => {
      pointerRef.current = { x: event.clientX, y: event.clientY }
    }

    const draw = () => {
      frame += 1
      const hue = sectionHue[activeSection] ?? 190
      const harmonic = frequencies.length ? frequencies[Math.floor(frame * 0.05) % frequencies.length] : 0.5
      const pointer = pointerRef.current
      const hoverTarget = hoverBeacon?.intensity
        ? { x: hoverBeacon.x * width, y: hoverBeacon.y * height }
        : pointer

      context.clearRect(0, 0, width, height)

      particles.forEach((particle, index) => {
        const toTargetX = hoverTarget.x - particle.x
        const toTargetY = hoverTarget.y - particle.y
        const distance = Math.hypot(toTargetX, toTargetY)
        const attraction = distance < 240 ? (1 - distance / 240) * (0.018 + interactionBoost * 0.02) : 0
        const velocityBias = scrollVelocity * 0.004 * (index % 2 === 0 ? 1 : -1)
        const orbital = engineeringMode ? Math.sin(frame * 0.01 + particle.orbit * Math.PI * 8) * (0.12 + harmonic * 0.14) : 0

        particle.vx += toTargetX * attraction * 0.01 + velocityBias
        particle.vy += toTargetY * attraction * 0.01 + orbital
        particle.vx *= 0.94
        particle.vy *= 0.94
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < -40) particle.x = width + 40
        if (particle.x > width + 40) particle.x = -40
        if (particle.y < -40) particle.y = height + 40
        if (particle.y > height + 40) particle.y = -40

        const alpha = 0.16 + interactionBoost * 0.18 + (focusMode ? 0.06 : 0) + harmonic * 0.08
        context.fillStyle = `hsla(${hue + harmonic * 18}, 100%, 72%, ${alpha})`
        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius + (distance < 120 ? 0.6 : 0) + harmonic * 0.7, 0, Math.PI * 2)
        context.fill()
      })

      for (let index = 0; index < particles.length; index += 6) {
        const particle = particles[index]
        const neighbor = particles[(index + 11) % particles.length]
        const distance = Math.hypot(particle.x - neighbor.x, particle.y - neighbor.y)

        if (distance > 180) continue

        context.strokeStyle = `hsla(${hue}, 100%, 70%, ${0.04 + (engineeringMode ? 0.05 : 0)})`
        context.lineWidth = focusMode ? 0.9 : 0.6
        context.beginPath()
        context.moveTo(particle.x, particle.y)
        context.lineTo(neighbor.x, neighbor.y)
        context.stroke()
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', handleMove, { passive: true })

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handleMove)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [activeSection, engineeringMode, focusMode, hoverBeacon, interactionBoost, quality, reducedMotion, scrollVelocity])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[2] opacity-55"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  )
}