import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const sectionHue = {
  about: 0.53,
  timeline: 0.56,
  skills: 0.45,
  projects: 0.49,
  contact: 0.76,
}

const vertexShader = `
uniform float u_time;
uniform vec2 u_pointer;
uniform float u_energy;
uniform float u_focus;
uniform float u_hover;
attribute float a_seed;

varying float v_alpha;

void main() {
  vec3 transformed = position;
  float pointerDistance = distance(transformed.xy, vec2(u_pointer.x, u_pointer.y));
  float hoverLift = exp(-pointerDistance * (1.8 + u_hover * 0.6)) * (1.2 + u_energy * 2.4);

  transformed.z += sin(u_time * 0.8 + a_seed * 12.0) * 0.16;
  transformed.x += sin(u_time * 0.24 + a_seed * 21.0) * 0.05 + hoverLift * 0.08;
  transformed.y += cos(u_time * 0.18 + a_seed * 17.0) * 0.05 + hoverLift * 0.06;

  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  gl_PointSize = (2.5 + u_energy * 4.0 + hoverLift * 3.0 + u_focus * 2.0) * (120.0 / -mvPosition.z);
  v_alpha = 0.24 + hoverLift * 0.8 + u_focus * 0.1;
}
`

const fragmentShader = `
uniform float u_hue;
uniform float u_engineering;
varying float v_alpha;

vec3 hsb2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  rgb = rgb * rgb * (3.0 - 2.0 * rgb);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() {
  vec2 centered = gl_PointCoord - 0.5;
  float distanceToCenter = length(centered);
  float alpha = smoothstep(0.5, 0.0, distanceToCenter) * v_alpha;
  vec3 color = hsb2rgb(vec3(u_hue + distanceToCenter * 0.08, 0.72 - u_engineering * 0.1, 1.0));
  gl_FragColor = vec4(color, alpha);
}
`

export default function GpuFieldLayer({
  reducedMotion = false,
  quality = 'balanced',
  activeSection = 'about',
  interactionBoost = 0,
  hoverBeacon,
  scrollVelocity = 0,
  focusMode = false,
  engineeringMode = false,
  adaptiveScore = 0,
  frequencies = [],
}) {
  const mountRef = useRef(null)

  useEffect(() => {
    if (reducedMotion) return undefined

    const mount = mountRef.current
    if (!mount) return undefined

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: quality === 'cinematic', powerPreference: 'high-performance' })
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 12)
    camera.position.z = 4.4

    const pointCount = quality === 'cinematic' ? 1200 : quality === 'balanced' ? 820 : 480
    const positions = new Float32Array(pointCount * 3)
    const seeds = new Float32Array(pointCount)

    for (let index = 0; index < pointCount; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 5.6
      positions[index * 3 + 1] = (Math.random() - 0.5) * 3.6
      positions[index * 3 + 2] = (Math.random() - 0.5) * 1.5
      seeds[index] = Math.random()
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('a_seed', new THREE.BufferAttribute(seeds, 1))

    const uniforms = {
      u_time: { value: 0 },
      u_pointer: { value: new THREE.Vector2(0, 0) },
      u_energy: { value: 0.2 },
      u_focus: { value: 0 },
      u_hover: { value: 0 },
      u_hue: { value: sectionHue[activeSection] ?? sectionHue.about },
      u_engineering: { value: engineeringMode ? 1 : 0 },
    }

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    mount.innerHTML = ''
    mount.appendChild(renderer.domElement)

    const resize = () => {
      const { clientWidth, clientHeight } = mount
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality === 'cinematic' ? 1.25 : 1))
      renderer.setSize(clientWidth, clientHeight, false)
      camera.aspect = clientWidth / Math.max(clientHeight, 1)
      camera.updateProjectionMatrix()
    }

    const movePointer = (event) => {
      uniforms.u_pointer.value.set((event.clientX / window.innerWidth - 0.5) * 5.5, -(event.clientY / window.innerHeight - 0.5) * 3.5)
    }

    const clock = new THREE.Clock()

    const render = () => {
      const elapsed = clock.getElapsedTime()
      const harmonic = frequencies.length ? frequencies[Math.floor(elapsed * 6) % frequencies.length] : 0.5
      uniforms.u_time.value = elapsed
      uniforms.u_energy.value = 0.2 + interactionBoost * 0.8 + adaptiveScore * 0.5 + Math.min(scrollVelocity / 80, 0.22) + harmonic * 0.25
      uniforms.u_focus.value = focusMode ? 1 : 0
      uniforms.u_hover.value = hoverBeacon?.intensity ?? 0
      uniforms.u_hue.value = sectionHue[activeSection] ?? sectionHue.about
      uniforms.u_engineering.value = engineeringMode ? 1 : 0

      points.rotation.z = elapsed * 0.035
      points.rotation.x = Math.sin(elapsed * 0.18) * 0.08
      renderer.render(scene, camera)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', movePointer, { passive: true })
    renderer.setAnimationLoop(render)

    return () => {
      renderer.setAnimationLoop(null)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', movePointer)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [activeSection, adaptiveScore, engineeringMode, focusMode, frequencies, hoverBeacon?.intensity, interactionBoost, quality, reducedMotion, scrollVelocity])

  return <div ref={mountRef} className="pointer-events-none fixed inset-0 z-[1] opacity-65" aria-hidden="true" />
}