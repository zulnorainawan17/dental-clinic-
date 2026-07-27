import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { INITIAL_BEFORE_AFTER } from '../data/initialData';
import { Sparkles, SlidersHorizontal, Check, UserCheck, Clock } from 'lucide-react';

export const BeforeAfter: React.FC = () => {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeItem = INITIAL_BEFORE_AFTER[activeItemIndex];

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <section id="before-after" className="py-24 relative bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-mono font-medium tracking-wider uppercase">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Interactive Transformations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 dark:text-white tracking-tight">
            Before & After <span className="font-semibold text-sky-500">Gallery</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal">
            Drag the interactive slider below to reveal real patient smile transformations created by our master ceramicists and surgeons.
          </p>
        </div>

        {/* Case Switcher Tabs */}
        <div className="flex flex-wrap justify-center gap-3">
          {INITIAL_BEFORE_AFTER.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveItemIndex(idx);
                setSliderPosition(50);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeItemIndex === idx
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 scale-105'
                  : 'glass-panel text-slate-600 dark:text-slate-300 hover:text-sky-500'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Interactive Comparison Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Slider Frame */}
          <div className="lg:col-span-8">
            <div
              ref={containerRef}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-[32px] overflow-hidden select-none cursor-ew-resize glass-panel shadow-2xl"
            >
              {/* After Image (Full Base) */}
              <img
                src={activeItem.afterImg}
                alt="After treatment"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute top-4 right-4 z-10 px-3.5 py-1.5 rounded-full glass-panel text-slate-900 dark:text-white font-mono text-xs font-bold tracking-wider uppercase">
                After Transformation
              </div>

              {/* Before Image (Clipped Top Layer) */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={activeItem.beforeImg}
                  alt="Before treatment"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
                />
                <div className="absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full glass-panel text-slate-900 dark:text-white font-mono text-xs font-bold tracking-wider uppercase">
                  Initial State
                </div>
              </div>

              {/* Slider Line & Drag Handle */}
              <div
                className="absolute inset-y-0 z-20 w-1 bg-white shadow-2xl pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-slate-900 shadow-2xl border-2 border-sky-400 flex items-center justify-center pointer-events-auto">
                  <SlidersHorizontal className="w-5 h-5 text-sky-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Details Breakdown Panel */}
          <div className="lg:col-span-4 space-y-6 glass-panel p-8 rounded-[32px]">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                {activeItem.category}
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {activeItem.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                {activeItem.description}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Treatment Timeline</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{activeItem.duration}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Attending Specialist</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{activeItem.doctorName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
