import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Check if hovering over interactive element
      const element = document.elementFromPoint(e.clientX, e.clientY);
      const isInteractive = element?.matches(
        'button, a, input, textarea, [role="button"], .interactive'
      );
      setIsHoveringInteractive(!!isInteractive);
      setScale(isInteractive ? 1.5 : 1);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Hide default cursor */}
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Custom cursor glow ring */}
      <motion.div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: position.x,
          top: position.y,
          width: '24px',
          height: '24px',
          marginLeft: '-12px',
          marginTop: '-12px',
        }}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-accent-cyan/60"
          animate={{ scale }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{
            boxShadow: `0 0 20px rgba(0, 229, 255, 0.6), inset 0 0 10px rgba(0, 229, 255, 0.3)`,
          }}
        />

        {/* Center dot */}
        <div
          className="absolute top-1/2 left-1/2 w-1 h-1 bg-accent-cyan rounded-full"
          style={{
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 10px rgba(0, 229, 255, 0.8)',
          }}
        />

        {/* Expanding pulse on hover */}
        {isHoveringInteractive && (
          <motion.div
            className="absolute inset-0 rounded-full border border-accent-cyan/40"
            animate={{ scale: [1, 1.8], opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            style={{
              boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)',
            }}
          />
        )}
      </motion.div>
    </>
  );
}
