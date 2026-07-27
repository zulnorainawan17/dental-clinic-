import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface PreloaderProps {
  onFinish: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsDone(true);
            setTimeout(onFinish, 600);
          }, 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 12) + 4;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(16px)', scale: 1.05 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white select-none overflow-hidden"
        >
          {/* Subtle luxury ambient radial glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Logo & Symbol */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-4 mb-8"
          >
            <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-400 via-sky-600 to-navy-900 p-[1px] shadow-2xl shadow-sky-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center relative overflow-hidden">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-transparent"
                />
                <Sparkles className="w-9 h-9 text-sky-400" />
              </div>
            </div>

            <div className="text-center space-y-1">
              <h1 className="text-2xl font-light tracking-[0.2em] uppercase text-slate-100 font-sans">
                Aura<span className="font-semibold text-sky-400">Dent</span>
              </h1>
              <p className="text-xs font-mono text-sky-300/60 uppercase tracking-widest flex items-center gap-1.5 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                Precision Dental Suite
              </p>
            </div>
          </motion.div>

          {/* Circular SVG Progress Loader */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-slate-800"
                strokeWidth="3"
                fill="transparent"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-sky-400"
                strokeWidth="3.5"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * Math.min(progress, 100)) / 100}
                strokeLinecap="round"
                fill="transparent"
                transition={{ ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-mono font-medium text-sky-300">
                {Math.min(progress, 100)}%
              </span>
            </div>
          </div>

          {/* Luxury Loading Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center font-sans text-xs tracking-widest uppercase text-slate-400"
          >
            Sculpting Perfection • Precision Healthcare
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
