import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const rafRef = useRef(null);
  const pendingEventRef = useRef(null);
  const trailIdRef = useRef(0);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);
  const [scale, setScale] = useState(1);
  const [velocity, setVelocity] = useState(0);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const previousRef = useRef({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      pendingEventRef.current = e;

      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const event = pendingEventRef.current;
        if (!event) return;

        const previous = previousRef.current;
        const nextVelocity = Math.hypot(event.clientX - previous.x, event.clientY - previous.y);
        previousRef.current = { x: event.clientX, y: event.clientY };

        setPosition({ x: event.clientX, y: event.clientY });
        setVelocity(nextVelocity);
        setIsVisible(true);
        setTrail((current) => [{ x: event.clientX, y: event.clientY, id: trailIdRef.current += 1 }, ...current].slice(0, 5));

        const element = document.elementFromPoint(event.clientX, event.clientY);
        const isInteractive = element?.matches('button, a, input, textarea, [role="button"], .interactive');
        setIsHoveringInteractive(!!isInteractive);
        setScale(isInteractive ? 1.65 : 1 + Math.min(0.25, nextVelocity / 60));
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
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
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          className="fixed pointer-events-none z-[9997] rounded-full bg-accent-cyan/30"
          style={{
            left: point.x,
            top: point.y,
            width: `${10 - index}px`,
            height: `${10 - index}px`,
            marginLeft: `${(-10 + index) / 2}px`,
            marginTop: `${(-10 + index) / 2}px`,
            filter: 'blur(0.5px)',
          }}
          animate={{ opacity: [0.36, 0], scale: [1, 0.55] }}
          transition={{ duration: 0.35 + index * 0.06, ease: 'easeOut' }}
        />
      ))}

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
          animate={{ scale, rotate: velocity * 0.3 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{
            boxShadow: `0 0 20px rgba(0, 229, 255, 0.6), inset 0 0 10px rgba(0, 229, 255, 0.3)`,
          }}
        />

        <motion.div
          className="absolute inset-[-10px] rounded-full border border-accent-cyan/20"
          animate={{ scale: 1 + Math.min(0.5, velocity / 80), opacity: isHoveringInteractive ? 0.85 : 0.4 }}
          transition={{ type: 'spring', stiffness: 240, damping: 22 }}
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
