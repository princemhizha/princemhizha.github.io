import { useEffect, useRef } from 'react'

export default function WorkerFieldLayer({
  reducedMotion = false,
  quality = 'balanced',
  interactionBoost = 0,
  activeSection = 'about',
  runtimeMode = 'standard',
  hoverBeacon,
  onTelemetry,
}) {
  const canvasRef = useRef(null)
  const workerRef = useRef(null)
  const fallbackRaf = useRef(null)
  const hoverRef = useRef(hoverBeacon)
  const interactionRef = useRef(interactionBoost)

  useEffect(() => {
    hoverRef.current = hoverBeacon
    interactionRef.current = interactionBoost
  }, [hoverBeacon, interactionBoost])

  useEffect(() => {
    if (reducedMotion) return undefined

    const canvas = canvasRef.current
    if (!canvas) return undefined

    const worker = new Worker(new URL('../workers/runtimeWorker.js', import.meta.url), { type: 'module' })
    workerRef.current = worker

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const width = Math.max(1, Math.floor(rect.width))
      const height = Math.max(1, Math.floor(rect.height))

      if (workerRef.current) {
        workerRef.current.postMessage({ type: 'resize', payload: { width, height } })
      }
    }

    let useOffscreen = typeof canvas.transferControlToOffscreen === 'function' && !import.meta.env.DEV
    let transferredCanvas = false

    if (useOffscreen) {
      try {
        const rect = canvas.getBoundingClientRect()
        const offscreen = canvas.transferControlToOffscreen()
        worker.postMessage(
          {
            type: 'init',
            payload: {
              canvas: offscreen,
              width: Math.max(1, Math.floor(rect.width)),
              height: Math.max(1, Math.floor(rect.height)),
              quality,
            },
          },
          [offscreen],
        )
      } catch {
        transferredCanvas = true
        useOffscreen = false
      }
    }

    if (!useOffscreen) {
      let ctx = null
      if (!transferredCanvas) {
        try {
          ctx = canvas.getContext('2d')
        } catch {
          ctx = null
        }
      }
      let localTick = 0
      const drawFallback = () => {
        if (!ctx) return
        const rect = canvas.getBoundingClientRect()
        canvas.width = Math.max(1, Math.floor(rect.width))
        canvas.height = Math.max(1, Math.floor(rect.height))
        localTick += 1

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const currentHover = hoverRef.current
        const currentInteraction = interactionRef.current

        const gradient = ctx.createRadialGradient(
          canvas.width * (currentHover?.x ?? 0.5),
          canvas.height * (currentHover?.y ?? 0.5),
          0,
          canvas.width * 0.5,
          canvas.height * 0.5,
          Math.max(canvas.width, canvas.height) * 0.66,
        )
        gradient.addColorStop(0, `rgba(0, 229, 255, ${0.08 + currentInteraction * 0.15})`)
        gradient.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const lines = 16
        for (let i = 0; i < lines; i += 1) {
          const y = (i / lines) * canvas.height
          const wave = Math.sin(localTick * 0.03 + i * 0.8) * (5 + currentInteraction * 8)
          ctx.strokeStyle = `rgba(2, 195, 154, ${0.08 + (i % 5) * 0.01})`
          ctx.beginPath()
          ctx.moveTo(0, y + wave)
          ctx.lineTo(canvas.width, y - wave)
          ctx.stroke()
        }

        fallbackRaf.current = requestAnimationFrame(drawFallback)
      }

      worker.postMessage({
        type: 'init',
        payload: {
          width: Math.max(1, Math.floor(canvas.getBoundingClientRect().width)),
          height: Math.max(1, Math.floor(canvas.getBoundingClientRect().height)),
          quality,
        },
      })
      if (ctx) drawFallback()
    }

    worker.onmessage = (event) => {
      if (event.data?.type === 'telemetry' && onTelemetry) {
        onTelemetry(event.data.payload)
      }
    }

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      if (fallbackRaf.current) cancelAnimationFrame(fallbackRaf.current)
      if (workerRef.current) {
        workerRef.current.postMessage({ type: 'dispose' })
        workerRef.current.terminate()
        workerRef.current = null
      }
    }
  }, [onTelemetry, quality, reducedMotion])

  useEffect(() => {
    if (!workerRef.current) return
    workerRef.current.postMessage({
      type: 'state',
      payload: {
        pointer: { x: hoverBeacon?.x ?? 0.5, y: hoverBeacon?.y ?? 0.5 },
        interactionBoost,
        section: activeSection,
        mode: runtimeMode,
        hoverHeat: hoverBeacon?.intensity ?? 0,
      },
    })
  }, [activeSection, hoverBeacon, interactionBoost, runtimeMode])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[0] opacity-70"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  )
}
