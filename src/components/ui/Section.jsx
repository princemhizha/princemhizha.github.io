import { motion } from 'framer-motion'
import Container from './Container'

function Section({ id, title, subtitle, children, reducedMotion = false }) {
  return (
    <motion.section
      id={id}
      className="relative py-20 sm:py-24"
      initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Divider with glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent"
      />

      {/* Atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-12 h-48 w-96 -translate-x-1/2 rounded-full bg-accent-cyan/8 blur-3xl"
      />

      <Container>
        {(title || subtitle) && (
          <motion.header
            className="mb-10 sm:mb-12"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {title && (
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white relative">
                <span className="relative inline-block">
                  {title}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 h-1 w-12 bg-gradient-to-r from-accent-cyan to-accent-teal rounded"
                  />
                </span>
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 max-w-2xl text-slate-300 font-light leading-relaxed">
                {subtitle}
              </p>
            )}
          </motion.header>
        )}
        {children}
      </Container>
    </motion.section>
  )
}

export default Section
