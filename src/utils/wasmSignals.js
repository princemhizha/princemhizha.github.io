const wasmBytes = new Uint8Array([
  0x00, 0x61, 0x73, 0x6d,
  0x01, 0x00, 0x00, 0x00,
  0x01, 0x09, 0x01, 0x60, 0x04, 0x7f, 0x7f, 0x7f, 0x7f, 0x01, 0x7f,
  0x03, 0x02, 0x01, 0x00,
  0x07, 0x08, 0x01, 0x04, 0x73, 0x75, 0x6d, 0x34, 0x00, 0x00,
  0x0a, 0x0f, 0x01, 0x0d, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6a, 0x20, 0x02, 0x6a, 0x20, 0x03, 0x6a, 0x0b,
])

let cachedRuntime = null

export async function loadSignalWasm() {
  if (cachedRuntime) return cachedRuntime

  const { instance } = await WebAssembly.instantiate(wasmBytes)
  cachedRuntime = {
    sum4: instance.exports.sum4,
  }

  return cachedRuntime
}

export function deriveAdaptiveSignature(runtime, {
  engagementBoost = 0,
  scrollVelocity = 0,
  focusMode = false,
  idle = false,
  sectionVisitCounts = {},
  viewedProjectsCount = 0,
  interactionCount = 0,
}) {
  const engagement = Math.round(engagementBoost * 100)
  const readingStability = Math.max(0, 100 - Math.round(scrollVelocity * 6) + (focusMode ? 12 : 0))
  const revisitSignal = Math.min(100, Object.values(sectionVisitCounts).reduce((total, value) => total + value, 0) * 8)
  const projectMemory = Math.min(100, viewedProjectsCount * 18 + Math.min(interactionCount, 24))

  const combined = runtime ? runtime.sum4(engagement, readingStability, revisitSignal, projectMemory) : engagement + readingStability + revisitSignal + projectMemory
  const adaptiveScore = Math.min(1, combined / 400)
  const layoutMode = idle ? 'reader' : readingStability > 72 ? 'reader' : engagement > 68 ? 'operator' : 'explorer'
  const motionScale = layoutMode === 'reader' ? 0.72 : layoutMode === 'operator' ? 1.08 : 0.92
  const lightingBias = layoutMode === 'operator' ? 0.08 : layoutMode === 'reader' ? -0.03 : 0.03

  const sectionPriority = Object.entries(sectionVisitCounts)
    .sort((left, right) => right[1] - left[1])
    .map(([key]) => key)

  return {
    adaptiveScore,
    layoutMode,
    motionScale,
    lightingBias,
    sectionPriority,
    wasmReady: Boolean(runtime),
  }
}