let canvas = null
let ctx = null
let width = 0
let height = 0
let running = false
let renderTimer = null
let telemetryTimer = null
let tick = 0

const state = {
  quality: 'balanced',
  pointer: { x: 0.5, y: 0.5 },
  interactionBoost: 0,
  section: 'about',
  mode: 'standard',
  sessionAgeMs: 0,
  hoverHeat: 0,
}

const themePalette = {
  standard: [190, 172, 264],
  productivity: [186, 162, 210],
  showcase: [193, 176, 282],
  night: [200, 214, 268],
}

let particles = []
let streams = []
let frequencies = [0.4, 0.5, 0.6, 0.45, 0.35]
let binaryLoad = 0
let frameCounter = 0
let lastTelemetry = Date.now()

function qualityScale() {
  if (state.quality === 'cinematic') return 1
  if (state.quality === 'balanced') return 0.8
  return 0.58
}

function buildSystems() {
  const density = qualityScale()
  const particleCount = Math.max(40, Math.floor(180 * density))
  const streamCount = Math.max(8, Math.floor(24 * density))

  particles = Array.from({ length: particleCount }, (_, index) => ({
    x: Math.random() * Math.max(width, 1),
    y: Math.random() * Math.max(height, 1),
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    mass: 0.4 + Math.random() * 1.2,
    inertia: 0.92 + Math.random() * 0.03,
    charge: index % 2 === 0 ? 1 : -1,
  }))

  streams = Array.from({ length: streamCount }, (_, index) => ({
    x: Math.random() * Math.max(width, 1),
    y: ((index + 1) / (streamCount + 1)) * Math.max(height, 1),
    speed: 0.8 + Math.random() * 1.6,
    packet: Math.floor(Math.random() * 0xffff),
  }))
}

function setSize(nextWidth, nextHeight) {
  width = Math.max(1, Math.floor(nextWidth))
  height = Math.max(1, Math.floor(nextHeight))
  if (canvas) {
    canvas.width = width
    canvas.height = height
  }
  buildSystems()
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function updateSimulation() {
  tick += 1
  state.sessionAgeMs += 16

  const pointerX = state.pointer.x * width
  const pointerY = state.pointer.y * height
  const energy = 0.2 + state.interactionBoost * 0.8

  particles.forEach((particle, index) => {
    const dx = pointerX - particle.x
    const dy = pointerY - particle.y
    const distance = Math.hypot(dx, dy) + 0.0001

    const cursorField = clamp(220 / distance, 0, 2.2)
    const resistance = state.mode === 'productivity' ? 0.9 : 0.95
    const inertiaBoost = state.mode === 'showcase' ? 1.16 : 1

    const collisionNeighbor = particles[(index + 7) % particles.length]
    const ndx = collisionNeighbor.x - particle.x
    const ndy = collisionNeighbor.y - particle.y
    const nDist = Math.hypot(ndx, ndy) + 0.0001
    const repel = nDist < 18 ? (18 - nDist) * 0.015 : 0

    particle.vx += (dx / distance) * 0.035 * cursorField * particle.charge
    particle.vy += (dy / distance) * 0.035 * cursorField
    particle.vx -= (ndx / nDist) * repel
    particle.vy -= (ndy / nDist) * repel

    particle.vx *= particle.inertia * resistance
    particle.vy *= particle.inertia * resistance
    particle.vx += Math.sin(tick * 0.009 + index) * 0.009 * energy
    particle.vy += Math.cos(tick * 0.007 + index * 0.8) * 0.008 * energy

    particle.x += particle.vx * inertiaBoost
    particle.y += particle.vy * inertiaBoost

    if (particle.x < -20) particle.x = width + 20
    if (particle.x > width + 20) particle.x = -20
    if (particle.y < -20) particle.y = height + 20
    if (particle.y > height + 20) particle.y = -20
  })

  streams.forEach((stream, index) => {
    stream.x += stream.speed + energy * 2.8
    if (stream.x > width + 80) {
      stream.x = -160
      stream.packet = (stream.packet * 9301 + 49297 + index * 17) % 233280
    }
  })

  frequencies = frequencies.map((frequency, index) => {
    const wave = Math.sin(tick * (0.013 + index * 0.0019) + index * 2.4)
    const harmonic = Math.cos(tick * (0.008 + index * 0.0014) + state.interactionBoost * 3)
    return clamp(0.5 + wave * 0.28 + harmonic * 0.22 + energy * 0.18, 0, 1)
  })

  binaryLoad = Math.round(particles.reduce((acc, particle) => acc + Math.abs(particle.vx) + Math.abs(particle.vy), 0))
}

function draw() {
  if (!ctx || !width || !height) return

  const palette = themePalette[state.mode] ?? themePalette.standard
  const [hueA, hueB, hueC] = palette
  const alphaBase = 0.05 + state.interactionBoost * 0.08

  ctx.clearRect(0, 0, width, height)

  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, `hsla(${hueA}, 100%, 52%, ${alphaBase})`)
  gradient.addColorStop(0.55, `hsla(${hueB}, 100%, 50%, ${alphaBase * 0.9})`)
  gradient.addColorStop(1, `hsla(${hueC}, 100%, 66%, ${alphaBase * 0.8})`)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  particles.forEach((particle, index) => {
    const intensity = frequencies[index % frequencies.length]
    ctx.beginPath()
    ctx.fillStyle = `hsla(${hueA + intensity * 12}, 100%, ${58 + intensity * 18}%, ${0.14 + intensity * 0.2})`
    ctx.arc(particle.x, particle.y, 0.8 + intensity * 1.8, 0, Math.PI * 2)
    ctx.fill()
  })

  streams.forEach((stream, index) => {
    const mod = frequencies[index % frequencies.length]
    const length = 80 + mod * 120
    const y = stream.y + Math.sin((stream.x + tick + index * 8) * 0.015) * 6

    const lineGradient = ctx.createLinearGradient(stream.x - length, y, stream.x + 4, y)
    lineGradient.addColorStop(0, 'rgba(0,0,0,0)')
    lineGradient.addColorStop(0.7, `hsla(${hueA}, 100%, 56%, ${0.16 + mod * 0.24})`)
    lineGradient.addColorStop(1, `hsla(${hueB}, 100%, 62%, ${0.24 + mod * 0.3})`)

    ctx.strokeStyle = lineGradient
    ctx.lineWidth = 1.2 + mod * 0.8
    ctx.beginPath()
    ctx.moveTo(stream.x - length, y)
    ctx.lineTo(stream.x, y)
    ctx.stroke()

    if (index % 3 === 0) {
      const packetBits = (stream.packet >>> 0).toString(2).padStart(16, '0')
      ctx.fillStyle = `hsla(${hueC}, 100%, 68%, ${0.24 + mod * 0.35})`
      ctx.font = '10px JetBrains Mono'
      ctx.fillText(packetBits.slice(0, 8), stream.x - 48, y - 8)
    }
  })

  const pointerX = state.pointer.x * width
  const pointerY = state.pointer.y * height
  const halo = ctx.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, 190)
  halo.addColorStop(0, `hsla(${hueA}, 100%, 64%, ${0.16 + state.hoverHeat * 0.2})`)
  halo.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = halo
  ctx.fillRect(pointerX - 220, pointerY - 220, 440, 440)
}

function deriveTheme() {
  const hour = new Date().getHours()
  const isNight = hour < 6 || hour >= 19
  const longSession = state.sessionAgeMs > 210000

  if (state.mode === 'showcase') return 'showcase'
  if (state.mode === 'productivity') return 'productivity'
  if (isNight || longSession) return 'night'
  if (state.interactionBoost > 0.65) return 'cinematic'
  return 'standard'
}

function derivePredictions() {
  if (state.pointer.y < 0.26) return ['timeline', 'skills']
  if (state.pointer.y > 0.72) return ['projects', 'contact']
  if (state.section === 'about') return ['timeline', 'skills']
  if (state.section === 'projects') return ['contact', 'skills']
  return ['about', 'projects']
}

function postTelemetry() {
  const now = Date.now()
  frameCounter += 1
  const elapsed = Math.max(1, now - lastTelemetry)

  const computedFps = Math.round((frameCounter * 1000) / elapsed)
  if (elapsed > 1000) {
    frameCounter = 0
    lastTelemetry = now
  }

  const particleEnergy = particles.slice(0, 60).reduce((acc, p) => acc + Math.abs(p.vx) + Math.abs(p.vy), 0)

  self.postMessage({
    type: 'telemetry',
    payload: {
      fps: computedFps,
      workerLoad: clamp(binaryLoad / 380, 0, 1),
      binaryLoad,
      particleEnergy,
      frequencies,
      predictedSections: derivePredictions(),
      dynamicTheme: deriveTheme(),
      packetRate: streams.length,
      particles: particles.length,
      sessionAgeMs: state.sessionAgeMs,
    },
  })
}

function startLoops() {
  if (running) return
  running = true

  renderTimer = setInterval(() => {
    updateSimulation()
    draw()
  }, 16)

  telemetryTimer = setInterval(() => {
    postTelemetry()
  }, 240)
}

function stopLoops() {
  running = false
  if (renderTimer) clearInterval(renderTimer)
  if (telemetryTimer) clearInterval(telemetryTimer)
  renderTimer = null
  telemetryTimer = null
}

self.onmessage = (event) => {
  const { type, payload } = event.data || {}

  if (type === 'init') {
    state.quality = payload.quality ?? 'balanced'
    setSize(payload.width ?? 1, payload.height ?? 1)

    if (payload.canvas) {
      canvas = payload.canvas
      ctx = canvas.getContext('2d', { alpha: true })
    }

    startLoops()
    return
  }

  if (type === 'resize') {
    setSize(payload.width, payload.height)
    return
  }

  if (type === 'state') {
    state.pointer = payload.pointer ?? state.pointer
    state.interactionBoost = payload.interactionBoost ?? state.interactionBoost
    state.section = payload.section ?? state.section
    state.mode = payload.mode ?? state.mode
    state.hoverHeat = payload.hoverHeat ?? state.hoverHeat
    return
  }

  if (type === 'pause') {
    stopLoops()
    return
  }

  if (type === 'resume') {
    startLoops()
    return
  }

  if (type === 'dispose') {
    stopLoops()
    canvas = null
    ctx = null
  }
}
