import { useEffect, useRef, useState } from 'react'

export default function TelemetryHud({
  activeSection,
  interactionCount,
  nodeCount,
  throughput,
  idle,
  quality = 'balanced',
  engineeringMode = false,
  focusMode = false,
  viewedProjects = 0,
  aiMode = 'explorer',
  wasmReady = false,
  workerLoad = 0,
  dynamicTheme = 'standard',
  packetRate = 0,
  predictedSections = [],
  particles,
  binaryLoad = 0,
  onClose,
}) {
  const [fps, setFps] = useState(0)
  const [latency, setLatency] = useState(0)
  const [particleCount, setParticleCount] = useState(0)
  const [memory, setMemory] = useState(0)
  const rafRef = useRef()
  const lastFrame = useRef(performance.now())
  const frameTimes = useRef([])

  useEffect(() => {
    function loop() {
      const now = performance.now()
      const delta = now - lastFrame.current
      lastFrame.current = now
      frameTimes.current.push(delta)
      if (frameTimes.current.length > 32) frameTimes.current.shift()
      const avg = frameTimes.current.reduce((a, b) => a + b, 0) / frameTimes.current.length
      setFps(Math.round(1000 / avg))
      setLatency(Math.round(avg))
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    // Try to get GPU particle count from window if available
    if (typeof particles === 'number' && particles > 0) setParticleCount(particles)
    else if (window.__gpuParticleCount) setParticleCount(window.__gpuParticleCount)
    else setParticleCount(nodeCount)
    // Memory usage (approximate)
    if (performance && performance.memory) {
      setMemory(Math.round(performance.memory.usedJSHeapSize / 1024 / 1024))
    }
  }, [nodeCount, particles])

  return (
    <aside className={`fixed left-4 top-4 z-[60] w-72 rounded-xl border border-accent-cyan/30 bg-black/80 p-4 font-mono text-xs shadow-neon backdrop-blur-lg ${engineeringMode ? 'ring-2 ring-accent-cyan/60' : ''}`}>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-bold tracking-widest text-accent-cyan">SYSTEM HUD</span>
        <div className="flex items-center gap-2">
          <span className="text-accent-cyan/60">{quality.toUpperCase()}</span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-accent-cyan/40 px-1.5 py-0.5 text-[10px] text-accent-cyan/80 transition hover:bg-accent-cyan/10"
              aria-label="Close System HUD"
            >
              X
            </button>
          )}
        </div>
      </div>
      <div className="space-y-1 text-accent-cyan/80">
        <p>Section: <span className="text-white">{activeSection}</span></p>
        <p>Nodes: <span className="text-white">{nodeCount}</span></p>
        <p>Particles: <span className="text-white">{particleCount}</span></p>
        <p>FPS: <span className="text-white">{fps}</span></p>
        <p>Latency: <span className="text-white">{latency} ms</span></p>
        <p>Memory: <span className="text-white">{memory} MB</span></p>
        <p>Throughput: <span className="text-white">{Math.round(throughput * 100)}%</span></p>
        <p>Interactions: <span className="text-white">{interactionCount}</span></p>
        <p>Focus: <span className="text-white">{focusMode ? 'LOCKED' : 'FREE'}</span></p>
        <p>Mode: <span className="text-white">{engineeringMode ? 'ENGINEERING' : 'RUNTIME'}</span></p>
        <p>AI: <span className="text-white">{aiMode.toUpperCase()}</span></p>
        <p>WASM: <span className="text-white">{wasmReady ? 'ONLINE' : 'FALLBACK'}</span></p>
        <p>Worker: <span className="text-white">{Math.round(workerLoad * 100)}%</span></p>
        <p>Packets: <span className="text-white">{packetRate}/s</span></p>
        <p>Binary Load: <span className="text-white">{binaryLoad}</span></p>
        <p>Theme: <span className="text-white">{dynamicTheme.toUpperCase()}</span></p>
        <p>Predict: <span className="text-white">{predictedSections.join(' > ') || 'N/A'}</span></p>
        <p>Render: <span className="text-white">{idle ? 'LOW POWER' : 'ACTIVE'}</span></p>
      </div>
    </aside>
  )
}
