import { useEffect, useRef } from 'react'

const labels = ['AUTH', 'KYC', 'AI', 'RISK', 'OPS', 'SYNC', 'API', 'NODE', 'LOG']

export default function DataStreamLayer({ reducedMotion = false, throughput = 0.2, quality = 'cinematic', density = 1 }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (reducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const qualityScale = quality === 'cinematic' ? 1 : quality === 'balanced' ? 0.88 : 0.72
    const dpr = Math.min(window.devicePixelRatio || 1, qualityScale)
    let width = 0
    let height = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const streamCount = Math.max(8, Math.round(22 * density))
    const streams = Array.from({ length: streamCount }, (_, idx) => ({
      y: 40 + idx * 38,
      x: Math.random() * window.innerWidth,
      speed: 0.8 + Math.random() * 1.3,
      len: 90 + Math.random() * 180,
      label: labels[idx % labels.length],
    }))

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.font = '10px JetBrains Mono'

      streams.forEach((stream, idx) => {
        stream.x += stream.speed + throughput * 2.4
        if (stream.x - stream.len > width + 40) stream.x = -200

        const y = stream.y + Math.sin((stream.x + idx * 20) * 0.01) * 4
        const gradient = ctx.createLinearGradient(stream.x - stream.len, y, stream.x, y)
        gradient.addColorStop(0, 'rgba(0,229,255,0)')
        gradient.addColorStop(0.6, 'rgba(0,229,255,0.2)')
        gradient.addColorStop(1, 'rgba(2,195,154,0.45)')

        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(stream.x - stream.len, y)
        ctx.lineTo(stream.x, y)
        ctx.stroke()

        if (idx % 3 === 0) {
          ctx.fillStyle = 'rgba(0,229,255,0.42)'
          ctx.fillText(stream.label, stream.x - 40, y - 6)
        }

        ctx.fillStyle = 'rgba(0,229,255,0.9)'
        ctx.beginPath()
        ctx.arc(stream.x, y, 1.8, 0, Math.PI * 2)
        ctx.fill()
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [density, quality, reducedMotion, throughput])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[1] opacity-45" aria-hidden="true" />
}
