import { useEffect, useRef } from 'react'

export default function NeuralNetworkLayer({ reducedMotion = false, activeSection = 'about', interactionBoost = 0, quality = 'cinematic', density = 1, frequencies = [] }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const pointerRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (reducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const qualityScale = quality === 'cinematic' ? 1 : quality === 'balanced' ? 0.84 : 0.66
    const dpr = Math.min(window.devicePixelRatio || 1, qualityScale)
    let width = 0
    let height = 0
    let t = 0

    const sectionHue = {
      about: 190,
      timeline: 196,
      skills: 166,
      projects: 182,
      contact: 265,
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onMove = (event) => {
      pointerRef.current = { x: event.clientX, y: event.clientY }
    }

    const nodeCount = Math.round(Math.min(52, Math.max(20, Math.floor(window.innerWidth / 28))) * density)
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      pulse: Math.random() * Math.PI * 2,
    }))

    const draw = () => {
      t += 0.01
      ctx.clearRect(0, 0, width, height)

      const hue = sectionHue[activeSection] ?? 190
      const frequencyPulse = frequencies.length ? frequencies[Math.floor((t * 12) % frequencies.length)] : 0.5
      const pointer = pointerRef.current

      nodes.forEach((node) => {
        node.x += node.vx + Math.sin(t + node.pulse) * 0.02
        node.y += node.vy + Math.cos(t + node.pulse) * 0.02

        if (node.x < -30) node.x = width + 30
        if (node.x > width + 30) node.x = -30
        if (node.y < -30) node.y = height + 30
        if (node.y > height + 30) node.y = -30
      })

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distance = Math.hypot(dx, dy)
          if (distance > 170) continue

          const proximity = Math.max(0, 1 - distance / 170)
          const pointerDist = Math.hypot((a.x + b.x) * 0.5 - pointer.x, (a.y + b.y) * 0.5 - pointer.y)
          const pointerBoost = pointerDist < 220 ? (1 - pointerDist / 220) * 0.14 : 0
          const alpha = 0.03 + proximity * 0.08 + interactionBoost * 0.02 + pointerBoost + frequencyPulse * 0.03

          ctx.beginPath()
          ctx.lineWidth = 1
          ctx.strokeStyle = `hsla(${hue}, 95%, 68%, ${alpha})`
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()

          if ((i + j) % 24 === Math.floor((t * 24) % 24)) {
            const signalT = (Math.sin(t * 2.4 + i) + 1) * 0.5
            const sx = a.x + (b.x - a.x) * signalT
            const sy = a.y + (b.y - a.y) * signalT
            ctx.fillStyle = `hsla(${hue + frequencyPulse * 14}, 100%, 72%, ${0.42 + frequencyPulse * 0.2})`
            ctx.beginPath()
            ctx.arc(sx, sy, 1.6, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      nodes.forEach((node) => {
        const pointerDist = Math.hypot(node.x - pointer.x, node.y - pointer.y)
        const lift = pointerDist < 180 ? (1 - pointerDist / 180) * 0.25 : 0
        const pulse = (Math.sin(t * 1.8 + node.pulse) + 1) * 0.5
        const radius = 1.2 + pulse * 1.1 + lift + frequencyPulse * 0.8

        ctx.fillStyle = `hsla(${hue}, 96%, 74%, ${0.34 + pulse * 0.2 + lift})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
        ctx.fill()
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove, { passive: true })
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [activeSection, density, interactionBoost, quality, reducedMotion])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[2] opacity-55" aria-hidden="true" />
}
