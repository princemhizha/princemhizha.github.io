import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const rafRef = useRef(null);
  const pendingEventRef = useRef(null);
  const trailIdRef = useRef(0);
  const mouseDownRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);
  const [prediction, setPrediction] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [velocity, setVelocity] = useState(0);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [cursorMode, setCursorMode] = useState('explore');
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
        const vx = event.clientX - previous.x;
        const vy = event.clientY - previous.y;
        const nextVelocity = Math.hypot(vx, vy);

        const target = document.elementFromPoint(event.clientX, event.clientY);
        const interactive = target?.matches('button, a, input, textarea, [role="button"], .interactive, [data-card-id]');
        const terminal = target?.closest('[data-terminal]');
        const draggable = target?.closest('[draggable="true"]');

        let nextX = event.clientX;
        let nextY = event.clientY;
        if (interactive && target) {
          const rect = target.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = cx - event.clientX;
          const dy = cy - event.clientY;
          const distance = Math.hypot(dx, dy);
          if (distance < 90) {
            const pull = (1 - distance / 90) * 0.24;
            nextX += dx * pull;
            nextY += dy * pull;
          }
        }

        previousRef.current = { x: nextX, y: nextY };

        setPosition({ x: nextX, y: nextY });
        setPrediction({ x: nextX + vx * 0.8, y: nextY + vy * 0.8 });
        setVelocity(nextVelocity);
        setIsVisible(true);
        setTrail((current) => [{ x: nextX, y: nextY, id: trailIdRef.current += 1 }, ...current].slice(0, 7));

        setIsHoveringInteractive(!!interactive);
        const dynamicScale = interactive ? 1.7 : 1 + Math.min(0.3, nextVelocity / 55);
        setScale(dynamicScale);

        if (terminal) {
          setCursorMode('terminal');
        } else if (draggable || (mouseDownRef.current && interactive)) {
          setCursorMode('drag');
        } else if (mouseDownRef.current) {
          setCursorMode('click');
        } else {
          setCursorMode('explore');
        }
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleDown = () => {
      mouseDownRef.current = true;
      setCursorMode('click');
    };

    const handleUp = () => {
      mouseDownRef.current = false;
      setCursorMode('explore');
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
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
        className="fixed pointer-events-none z-[9998] h-2.5 w-2.5 rounded-full border border-accent-cyan/55"
        style={{ left: prediction.x - 5, top: prediction.y - 5 }}
        animate={{ opacity: [0.45, 0.1, 0.45] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />

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

        <div className="pointer-events-none absolute left-1/2 top-[115%] -translate-x-1/2 rounded-md border border-accent-cyan/35 bg-black/65 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-accent-cyan/85">
          {cursorMode}
        </div>
      </motion.div>
    </>
  );
}
