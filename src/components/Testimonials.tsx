import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2, MessageSquare } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const { testimonials } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const activeTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-24 relative bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-mono font-medium tracking-wider uppercase">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Patient Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 dark:text-white tracking-tight">
            Stories of Restored <span className="font-semibold text-sky-500">Confidence</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Read verified feedback from patients who entrusted their smiles to our medical suite.
          </p>
        </div>

        {/* Carousel Card */}
        {activeTestimonial && (
          <div className="relative max-w-4xl mx-auto glass-panel rounded-[36px] p-8 sm:p-12 shadow-2xl overflow-hidden">
            <Quote className="absolute -top-4 -right-4 w-32 h-32 text-sky-500/10 pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 relative z-10"
              >
                {/* Rating & Verified */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(activeTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400" />
                    ))}
                  </div>

                  {activeTestimonial.verified && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Patient
                    </span>
                  )}
                </div>

                {/* Comment */}
                <p className="text-lg sm:text-2xl font-light text-slate-800 dark:text-slate-100 leading-relaxed italic">
                  "{activeTestimonial.comment}"
                </p>

                {/* Patient Profile */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <img
                      src={activeTestimonial.avatar}
                      alt={activeTestimonial.patientName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-sky-400/30"
                    />
                    <div>
                      <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                        {activeTestimonial.patientName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {activeTestimonial.patientTitle} • <span className="text-sky-500 font-medium">{activeTestimonial.treatment}</span>
                      </p>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevTestimonial}
                      className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-500 hover:text-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-500 hover:text-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};
