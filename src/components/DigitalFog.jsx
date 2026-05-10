import { useEffect, useRef } from 'react'

const densityMap = {
  about: 0.9,
  timeline: 0.95,
  skills: 1,
  projects: 1.08,
  contact: 1.12,
}

export default function DigitalFog({ activeSection = 'about', interactionBoost = 0, reducedMotion = false, quality = 'cinematic', density = 1 }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const pointerRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (reducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const qualityScale = quality === 'cinematic' ? 1 : quality === 'balanced' ? 0.88 : 0.72
    const dpr = Math.min(window.devicePixelRatio || 1, qualityScale)
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const density = densityMap[activeSection] ?? 1
    const particleCount = Math.max(12, Math.floor(24 * densityMap[activeSection] * density))

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2,
      radius: 100 + Math.random() * 170,
      opacity: Math.random() * 0.15 + 0.05,
      color: Math.random() > 0.5 ? '#00E5FF' : '#02C39A',
    }))

    const onMove = (event) => {
      pointerRef.current = { x: event.clientX, y: event.clientY }
    }

    let frameCount = 0

    const animate = () => {
      frameCount += 1

      ctx.fillStyle = 'rgba(5, 7, 10, 0.02)'
      ctx.fillRect(0, 0, width, height)

      const pointer = pointerRef.current

      particles.forEach((particle) => {
        const pointerDx = pointer.x - particle.x
        const pointerDy = pointer.y - particle.y
        const pointerDist = Math.hypot(pointerDx, pointerDy)
        const displace = pointerDist < 180 ? (1 - pointerDist / 180) * (0.28 + interactionBoost * 0.22) : 0

        particle.x += particle.vx - pointerDx * displace * 0.01
        particle.y += particle.vy - pointerDy * displace * 0.01

        if (particle.x < -particle.radius) particle.x = width + particle.radius;
        if (particle.x > width + particle.radius) particle.x = -particle.radius;
        if (particle.y < -particle.radius) particle.y = height + particle.radius;
        if (particle.y > height + particle.radius) particle.y = -particle.radius;

        const pulse = Math.sin(frameCount * 0.005 + particle.x * 0.01) * 0.1;
        const alpha = Math.max(0, particle.opacity + pulse + interactionBoost * 0.08)

        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius
        )

        gradient.addColorStop(0, `rgba(0, 229, 255, ${alpha * 0.42})`)
        gradient.addColorStop(0.45, `rgba(2, 195, 154, ${alpha * 0.18})`)
        gradient.addColorStop(1, 'rgba(0, 229, 255, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      const newRect = canvas.getBoundingClientRect()
      canvas.width = newRect.width * dpr
      canvas.height = newRect.height * dpr
      ctx.scale(dpr, dpr)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', onMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [activeSection, density, interactionBoost, quality, reducedMotion])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-60"
      style={{
        zIndex: 1,
        mixBlendMode: 'screen',
      }}
    />
  )
}
