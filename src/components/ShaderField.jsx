import { useEffect, useRef } from 'react'

const vertexShaderSource = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const fragmentShaderSource = `
precision highp float;

varying vec2 v_uv;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;
uniform vec2 u_velocity;
uniform float u_interaction;
uniform float u_quality;
uniform vec4 u_ripples[4];

mat2 rotate2d(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) +
    (c - a) * u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amplitude = 0.55;
  for (int i = 0; i < 5; i += 1) {
    sum += amplitude * noise(p);
    p = rotate2d(0.45) * p * 2.04 + vec2(3.2, 1.7);
    amplitude *= 0.52;
  }
  return sum;
}

float rippleField(vec2 uv) {
  float total = 0.0;
  for (int i = 0; i < 4; i += 1) {
    vec4 ripple = u_ripples[i];
    if (ripple.z < 0.0) {
      continue;
    }

    float age = max(0.0, u_time - ripple.z);
    vec2 delta = uv - ripple.xy;
    float distanceToRipple = length(delta);
    float ring = sin(distanceToRipple * 42.0 - age * 7.4);
    float attenuation = exp(-distanceToRipple * 10.0 - age * 1.5);
    total += ring * attenuation * ripple.w;
  }

  return total;
}

void main() {
  vec2 uv = v_uv;
  vec2 aspect = vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);
  vec2 centered = (uv - 0.5) * aspect;
  vec2 pointer = (u_pointer - 0.5) * aspect;
  vec2 velocity = u_velocity * 0.09;

  float velocityStrength = clamp(length(velocity) * 5.0, 0.0, 1.4);
  float ripple = rippleField(uv);
  float pointerDistance = length(centered - pointer);
  float pointerGlow = exp(-pointerDistance * (5.2 - min(velocityStrength * 1.6, 2.4)));

  vec2 domain = centered * (2.8 + u_quality * 0.8);
  domain += velocity * 0.6;

  vec2 warp = vec2(
    fbm(domain + vec2(0.0, u_time * 0.12)),
    fbm(domain + vec2(4.2, -u_time * 0.1))
  );

  vec2 warped = domain + (warp - 0.5) * (0.6 + u_interaction * 0.4);
  float fluid = fbm(warped + ripple * 0.18);
  float subNoise = fbm(warped * 1.9 - velocity * 1.8 + vec2(3.0, 2.0));
  float energyWave = sin((warped.y + fluid * 0.18 + ripple * 0.12) * 24.0 - u_time * 2.4 + velocity.x * 18.0);

  float digitalBand = smoothstep(0.985, 1.0, sin((uv.y + fluid * 0.035 - u_time * 0.04) * 160.0));
  float circuit = smoothstep(0.88, 1.0, sin((uv.x + warp.x * 0.03 + u_time * 0.05) * 92.0));
  float turbulence = fluid * 0.75 + subNoise * 0.45 + energyWave * 0.18 + ripple * 0.55;

  vec3 deep = vec3(0.012, 0.03, 0.05);
  vec3 cyan = vec3(0.0, 0.9, 1.0);
  vec3 teal = vec3(0.02, 0.76, 0.61);
  vec3 violet = vec3(0.42, 0.26, 0.88);

  vec3 color = deep;
  color += cyan * (0.16 + fluid * 0.22 + pointerGlow * 0.35);
  color += teal * (0.1 + subNoise * 0.2 + max(energyWave, 0.0) * 0.18);
  color += violet * (0.05 + ripple * 0.14 + velocityStrength * 0.12);
  color += mix(cyan, teal, 0.5 + 0.5 * sin(u_time + uv.x * 8.0)) * (digitalBand * 0.28 + circuit * 0.08);
  color += vec3(0.03, 0.05, 0.07) * smoothstep(0.95, 0.2, pointerDistance);

  float vignette = smoothstep(1.28, 0.16, length(centered));
  color *= vignette;

  float alpha = 0.32 + clamp(turbulence * 0.16 + pointerGlow * 0.18 + digitalBand * 0.08, 0.0, 0.42);
  gl_FragColor = vec4(color, alpha);
}
`

const rippleSlots = 4

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(message || 'WebGL shader compilation failed.')
  }

  return shader
}

function createProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
  if (!vertexShader || !fragmentShader) return null

  const program = gl.createProgram()
  if (!program) return null

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    throw new Error(message || 'WebGL program link failed.')
  }

  return program
}

export default function ShaderField({ reducedMotion = false, interactionBoost = 0, quality = 'cinematic' }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const pointerRef = useRef({ x: 0.5, y: 0.5, vx: 0, vy: 0 })
  const rippleRef = useRef(Array.from({ length: rippleSlots }, () => ({ x: 0.5, y: 0.5, time: -1, strength: 0 })))
  const interactionRef = useRef(interactionBoost)

  useEffect(() => {
    interactionRef.current = interactionBoost
  }, [interactionBoost])

  useEffect(() => {
    if (reducedMotion) return undefined

    const canvas = canvasRef.current
    if (!canvas) return undefined

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: quality === 'cinematic' ? 'high-performance' : 'default',
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
    })

    if (!gl) return undefined

    let program

    try {
      program = createProgram(gl, vertexShaderSource, fragmentShaderSource)
    } catch (error) {
      console.error(error)
      return undefined
    }

    if (!program) return undefined

    const qualityValue = quality === 'cinematic' ? 1 : quality === 'balanced' ? 0.78 : 0.56
    const pixelRatioCap = quality === 'cinematic' ? 1.35 : quality === 'balanced' ? 1 : 0.72
    const positionLocation = gl.getAttribLocation(program, 'a_position')
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
    const timeLocation = gl.getUniformLocation(program, 'u_time')
    const pointerLocation = gl.getUniformLocation(program, 'u_pointer')
    const velocityLocation = gl.getUniformLocation(program, 'u_velocity')
    const interactionLocation = gl.getUniformLocation(program, 'u_interaction')
    const qualityLocation = gl.getUniformLocation(program, 'u_quality')
    const rippleLocation = gl.getUniformLocation(program, 'u_ripples[0]')

    const positionBuffer = gl.createBuffer()
    if (!positionBuffer) return undefined

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )

    let width = 0
    let height = 0
    let frameStep = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, pixelRatioCap)
      width = Math.max(1, Math.floor(rect.width * devicePixelRatio))
      height = Math.max(1, Math.floor(rect.height * devicePixelRatio))

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }

      gl.viewport(0, 0, width, height)
    }

    const updatePointer = (event) => {
      const previous = pointerRef.current
      const nextX = clamp(event.clientX / Math.max(window.innerWidth, 1), 0, 1)
      const nextY = 1 - clamp(event.clientY / Math.max(window.innerHeight, 1), 0, 1)

      pointerRef.current = {
        x: nextX,
        y: nextY,
        vx: nextX - previous.x,
        vy: nextY - previous.y,
      }
    }

    const emitRipple = (event) => {
      const timestamp = performance.now() * 0.001
      rippleRef.current.unshift({
        x: clamp(event.clientX / Math.max(window.innerWidth, 1), 0, 1),
        y: 1 - clamp(event.clientY / Math.max(window.innerHeight, 1), 0, 1),
        time: timestamp,
        strength: 1,
      })

      rippleRef.current = rippleRef.current.slice(0, rippleSlots)
    }

    const draw = (now) => {
      frameStep = requestAnimationFrame(draw)

      const seconds = now * 0.001
      const pointer = pointerRef.current
      const rippleData = new Float32Array(rippleSlots * 4)

      rippleRef.current.forEach((ripple, index) => {
        rippleData[index * 4] = ripple.x
        rippleData[index * 4 + 1] = ripple.y
        rippleData[index * 4 + 2] = ripple.time
        rippleData[index * 4 + 3] = ripple.strength
      })

      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

      gl.uniform2f(resolutionLocation, width, height)
      gl.uniform1f(timeLocation, seconds)
      gl.uniform2f(pointerLocation, pointer.x, pointer.y)
      gl.uniform2f(velocityLocation, pointer.vx, pointer.vy)
      gl.uniform1f(interactionLocation, interactionRef.current)
      gl.uniform1f(qualityLocation, qualityValue)
      gl.uniform4fv(rippleLocation, rippleData)

      gl.drawArrays(gl.TRIANGLES, 0, 6)

      pointerRef.current = {
        ...pointerRef.current,
        vx: pointerRef.current.vx * 0.88,
        vy: pointerRef.current.vy * 0.88,
      }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', updatePointer, { passive: true })
    window.addEventListener('pointerdown', emitRipple)
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', updatePointer)
      window.removeEventListener('pointerdown', emitRipple)

      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (frameStep) cancelAnimationFrame(frameStep)

      gl.deleteBuffer(positionBuffer)
      gl.deleteProgram(program)
    }
  }, [quality, reducedMotion])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[0] opacity-65"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  )
}
