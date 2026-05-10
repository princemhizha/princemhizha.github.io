/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cyberpunk dark backgrounds
        bg: {
          DEFAULT: '#05070A',
          elevated: '#0B0F14',
          muted: '#121821',
          panel: '#1A2230',
        },
        // Cyberpunk accent palette
        accent: {
          DEFAULT: '#00E5FF', // Electric Cyan
          cyan: '#00E5FF',
          teal: '#02C39A',    // Neon Teal
          violet: '#7C3AED',
          infrared: '#FF4D6D', // Infrared Red
        },
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 229, 255, 0.08)',
        neon: '0 0 20px rgba(0, 229, 255, 0.4), inset 0 0 20px rgba(0, 229, 255, 0.1)',
        'neon-teal': '0 0 20px rgba(2, 195, 154, 0.3), inset 0 0 20px rgba(2, 195, 154, 0.08)',
        'glow-cyan': '0 0 40px rgba(0, 229, 255, 0.5), 0 0 80px rgba(0, 229, 255, 0.25)',
        'glow-violet': '0 0 40px rgba(124, 58, 237, 0.4), 0 0 80px rgba(124, 58, 237, 0.2)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Chakra Petch', 'Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at top right, rgba(0, 229, 255, 0.12), transparent 55%)',
        'cyber-gradient': 'linear-gradient(135deg, rgba(0, 229, 255, 0.1) 0%, rgba(2, 195, 154, 0.05) 50%, rgba(124, 58, 237, 0.08) 100%)',
      },
      fontSize: {
        'hero': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display': ['3.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
    },
  },
  plugins: [],
}

