import { useEffect, useMemo, useRef } from 'react'

function buildGrid(width, height, cellSize) {
  const cols = Math.max(6, Math.ceil(width / cellSize))
  const rows = Math.max(4, Math.ceil(height / cellSize))
  return { cols, rows, values: new Float32Array(cols * rows) }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

export default function NeuralInteractionGraph({
  reducedMotion = false,
  interactionTrail = [],
  activeSection = 'about',
  interactionBoost = 0,
  engineeringMode = false,
  hoverBeacon,
  readingFlow = 0,
  navigationPattern = [],
  frequencies = [],
}) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const gridRef = useRef(null)

  const hue = useMemo(() => {
    if (activeSection === 'skills') return 162
    if (activeSection === 'projects') return 184
    if (activeSection === 'contact') return 264
    if (activeSection === 'timeline') return 198
    return 190
  }, [activeSection])

  useEffect(() => {
    if (reducedMotion) return undefined

    const canvas = canvasRef.current
    if (!canvas) return undefined

    const context = canvas.getContext('2d')
    if (!context) return undefined

    let width = 0
    let height = 0
    const dpr = Math.min(window.devicePixelRatio || 1, engineeringMode ? 1.1 : 1)
    let tick = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      gridRef.current = buildGrid(width, height, 56)
    }

    const updateDensity = () => {
      const grid = gridRef.current
      if (!grid) return

      for (let i = 0; i < grid.values.length; i += 1) {
        grid.values[i] *= 0.95
      }

      const samples = interactionTrail.slice(-48)
      samples.forEach((point) => {
        const col = Math.floor(clamp(point.x, 0, 0.9999) * grid.cols)
        const row = Math.floor(clamp(point.y, 0, 0.9999) * grid.rows)
        const idx = row * grid.cols + col
        grid.values[idx] = clamp(grid.values[idx] + 0.33, 0, 1.2)
      })
    }

    const drawDensity = () => {
      const grid = gridRef.current
      if (!grid) return

      const cellW = width / grid.cols
      const cellH = height / grid.rows
      for (let row = 0; row < grid.rows; row += 1) {
        for (let col = 0; col < grid.cols; col += 1) {
          const value = grid.values[row * grid.cols + col]
          if (value < 0.06) continue

          context.fillStyle = `hsla(${hue + value * 22}, 100%, 60%, ${Math.min(0.2, value * 0.22)})`
          context.fillRect(col * cellW, row * cellH, cellW, cellH)
        }
      }
    }

    const drawTrails = () => {
      const samples = interactionTrail.slice(-40)
      if (samples.length < 2) return

      for (let i = 1; i < samples.length; i += 1) {
        const left = samples[i - 1]
        const right = samples[i]
        const alpha = i / samples.length
        const mod = frequencies[i % Math.max(1, frequencies.length)] ?? 0.5

        context.strokeStyle = `hsla(${hue + mod * 18}, 100%, ${56 + mod * 24}%, ${0.08 + alpha * 0.24})`
        context.lineWidth = 0.8 + alpha * 1.6
        context.beginPath()
        context.moveTo(left.x * width, left.y * height)
        context.lineTo(right.x * width, right.y * height)
        context.stroke()
      }
    }

    const drawNavigationConnections = () => {
      if (navigationPattern.length < 2) return

      const spacing = width / (navigationPattern.length + 1)
      navigationPattern.forEach((section, index) => {
        const x = spacing * (index + 1)
        const y = 56 + ((index % 2) * 18)
        const nextX = spacing * (index + 2)
        const nextY = 56 + (((index + 1) % 2) * 18)

        context.fillStyle = `hsla(${hue}, 100%, 74%, 0.55)`
        context.beginPath()
        context.arc(x, y, 2, 0, Math.PI * 2)
        context.fill()

        context.fillStyle = 'rgba(180, 235, 255, 0.6)'
        context.font = '10px JetBrains Mono'
        context.fillText(section.slice(0, 3).toUpperCase(), x - 12, y - 8)

        if (index < navigationPattern.length - 1) {
          context.strokeStyle = `hsla(${hue + 12}, 100%, 72%, 0.26)`
          context.lineWidth = 1
          context.beginPath()
          context.moveTo(x, y)
          context.lineTo(nextX, nextY)
          context.stroke()
        }
      })
    }

    const draw = () => {
      tick += 1
      context.clearRect(0, 0, width, height)

      updateDensity()
      drawDensity()
      drawTrails()
      drawNavigationConnections()

      if (hoverBeacon?.intensity) {
        const beaconX = hoverBeacon.x * width
        const beaconY = hoverBeacon.y * height
        const pulse = (Math.sin(tick * 0.06) + 1) * 0.5
        const radius = 30 + pulse * 28 + hoverBeacon.intensity * 40

        const beaconGradient = context.createRadialGradient(beaconX, beaconY, 0, beaconX, beaconY, radius)
        beaconGradient.addColorStop(0, `hsla(${hue}, 100%, 70%, ${0.22 + interactionBoost * 0.2})`)
        beaconGradient.addColorStop(1, 'rgba(0,0,0,0)')
        context.fillStyle = beaconGradient
        context.fillRect(beaconX - radius, beaconY - radius, radius * 2, radius * 2)
      }

      const readingText = `READING FLOW ${Math.round(readingFlow * 100)}%`
      context.fillStyle = 'rgba(190, 245, 255, 0.54)'
      context.font = '11px JetBrains Mono'
      context.fillText(readingText, 18, height - 20)

      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [engineeringMode, frequencies, hoverBeacon, hue, interactionBoost, interactionTrail, navigationPattern, readingFlow, reducedMotion])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[6] opacity-55"
      style={{ mixBlendMode: engineeringMode ? 'screen' : 'soft-light' }}
      aria-hidden="true"
    />
  )
}
