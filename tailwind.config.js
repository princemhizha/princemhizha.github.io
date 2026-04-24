/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#090f1f',
          elevated: '#101936',
          muted: '#162243',
        },
        accent: {
          DEFAULT: '#22d3ee',
          soft: '#67e8f9',
          secondary: '#a78bfa',
        },
      },
      boxShadow: {
        glass: '0 8px 30px rgba(4, 10, 28, 0.35)',
        neon: '0 0 0 1px rgba(34, 211, 238, 0.35), 0 10px 24px rgba(34, 211, 238, 0.16)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      fontFamily: {
        sans: ['Manrope', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Manrope', 'Segoe UI', 'sans-serif'],
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at top right, rgba(34, 211, 238, 0.18), transparent 55%)',
      },
    },
  },
  plugins: [],
}

