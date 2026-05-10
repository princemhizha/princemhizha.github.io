import { useEffect, useRef } from 'react';

export default function BinaryStream({ scrollVelocity = 0, focusMode = false }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const binaryColumnsRef = useRef([]);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    // Set canvas size with pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Initialize binary columns
    const columnCount = Math.ceil(width / 40);
    binaryColumnsRef.current = Array.from({ length: columnCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 2 - height,
      speed: 0.5 + Math.random() * 1.5,
      drift: (Math.random() - 0.5) * 0.32,
      chars: Array.from({ length: 20 }, () => (Math.random() > 0.5 ? '0' : '1')),
      opacity: Math.random() * 0.3 + 0.1,
      offset: Math.random() * 50,
    }));

    let frameCount = 0;

    const drawBinary = () => {
      frameCount++;

      // Clear with fade effect
      ctx.fillStyle = 'rgba(5, 7, 10, 0.05)';
      ctx.fillRect(0, 0, width, height);

      const columns = binaryColumnsRef.current;

      columns.forEach((col, idx) => {
        // Update position
        col.y += col.speed;
        col.x += col.drift + scrollVelocity * 0.02 * (idx % 2 === 0 ? 1 : -1);
        if (col.y > height + 100) {
          col.y = -100;
          col.chars = Array.from({ length: 20 }, () => (Math.random() > 0.5 ? '0' : '1'));
          col.opacity = Math.random() * 0.3 + 0.1;
          col.x = Math.random() * width;
        }

        // Soft flicker
        const flicker = Math.sin(frameCount * 0.1 + idx) * 0.15;
        const alpha = Math.max(0.05, col.opacity + flicker + (focusMode ? 0.06 : 0));

        // Draw binary characters
        ctx.font = '14px "JetBrains Mono"';
        ctx.fillStyle = `rgba(0, 229, 255, ${alpha * 0.6})`;
        ctx.textAlign = 'center';

        col.chars.forEach((char, i) => {
          const charY = col.y + i * 18;
          if (charY > -20 && charY < height + 20) {
            ctx.fillText(char, col.x, charY);
          }
        });

        // Occasional bright character
        if (Math.random() > 0.98) {
          ctx.fillStyle = `rgba(0, 229, 255, 0.9)`;
          const randomIdx = Math.floor(Math.random() * col.chars.length);
          const randomY = col.y + randomIdx * 18;
          ctx.fillText(col.chars[randomIdx], col.x, randomY);
        }
      });

      animationRef.current = requestAnimationFrame(drawBinary);
    };

    drawBinary();

    const handleResize = () => {
      const newRect = canvas.getBoundingClientRect();
      canvas.width = newRect.width * dpr;
      canvas.height = newRect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [focusMode, prefersReducedMotion, scrollVelocity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-40"
      style={{
        zIndex: 0,
        mixBlendMode: 'screen',
      }}
    />
  );
}
