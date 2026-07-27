import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only activate on desktop devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.closest('button') ||
          target.closest('a') ||
          target.classList.contains('clickable'))
      ) {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Small Precision Dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-sky-500 dark:bg-sky-400 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: position.x - 6,
          y: position.y - 6,
          scale: isPointer ? 1.8 : 1
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.2 }}
      />
      {/* Soft Ambient Spotlight Halo */}
      <motion.div
        className="fixed top-0 left-0 w-36 h-36 bg-sky-400/15 dark:bg-sky-500/10 rounded-full pointer-events-none z-[9998] blur-xl"
        animate={{
          x: position.x - 72,
          y: position.y - 72,
          scale: isPointer ? 1.4 : 1
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 180, mass: 0.5 }}
      />
    </>
  );
};
