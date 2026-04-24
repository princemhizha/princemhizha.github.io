import { motion } from 'framer-motion'
import Container from './Container'

function Section({ id, title, subtitle, children, reducedMotion = false }) {
  return (
    <motion.section
      id={id}
      className="relative py-16 sm:py-20"
      initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-8 h-40 w-[42rem] -translate-x-1/2 rounded-full bg-cyan-300/6 blur-3xl"
      />
      <Container>
        {(title || subtitle) && (
          <header className="mb-8 sm:mb-10">
            {title && (
              <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {title}
              </h2>
            )}
            {subtitle && <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">{subtitle}</p>}
          </header>
        )}
        {children}
      </Container>
    </motion.section>
  )
}

export default Section
