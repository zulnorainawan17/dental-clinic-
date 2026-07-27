import React from 'react';
import { motion } from 'motion/react';
import { ToothCanvas } from './3d/ToothCanvas';
import { useApp } from '../context/AppContext';
import { Calendar, ArrowRight, ShieldCheck, Star, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  const { openBooking } = useApp();

  const handleScrollToServices = () => {
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-16 flex flex-col justify-between overflow-hidden">
      {/* Background Mesh Blobs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-sky-400/20 dark:bg-sky-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Headline Column */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 space-y-8 text-center lg:text-left z-10"
        >
          {/* Rating Badge - Frosted Glass */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/60 dark:border-slate-800 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              4.98 Patient Rating
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-xs font-mono text-sky-600 dark:text-sky-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Standard of Dental Luxury
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
              Creating <span className="hero-gradient font-extrabold">Beautiful</span> <br className="hidden sm:inline" />
              Healthy Smiles
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl font-light leading-relaxed mx-auto lg:mx-0">
              Experience world-class cosmetic dentistry paired with the most advanced clinical technology. Your journey to a perfect smile begins in ultimate comfort.
            </p>
          </div>

          {/* Key Value Bullets */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
              <span>3D AI Scan Simulation</span>
            </div>
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
              <span>Pain-Free Laser Tech</span>
            </div>
            <div className="flex items-center gap-2 justify-center lg:justify-start col-span-2 sm:col-span-1">
              <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
              <span>Lifetime Implant Warranty</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={() => openBooking()}
              className="w-full sm:w-auto relative group overflow-hidden px-8 py-4 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm tracking-wide shadow-2xl shadow-sky-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleScrollToServices}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel font-bold text-slate-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-800 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-sky-500" />
              <span>Explore Services</span>
            </button>
          </div>
        </motion.div>

        {/* Right 3D Interactive Model Column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="lg:col-span-5 relative flex items-center justify-center"
        >
          <div className="relative w-full max-w-md aspect-square glass-panel rounded-[36px] p-4 shadow-2xl relative">
            <div className="shimmer" />

            {/* Top Right Floating Badge */}
            <div className="absolute top-4 right-4 z-20 glass-panel px-3.5 py-1.5 rounded-full shadow-md text-[11px] font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-sky-500" />
              <span>Swiss Dental Engineering</span>
            </div>

            {/* 3D Tooth Canvas Container */}
            <ToothCanvas />

            {/* Floating Online Specialists Card */}
            <div className="absolute -bottom-6 -left-6 z-20 p-4 glass-panel rounded-3xl shadow-xl hidden sm:block border border-white/80 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=120" alt="Specialist" className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-900 object-cover" />
                  <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=120" alt="Specialist" className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-900 object-cover" />
                  <img src="https://images.unsplash.com/photo-1594824813566-88855ce78961?auto=format&fit=crop&q=80&w=120" alt="Specialist" className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-900 object-cover" />
                </div>
                <div className="text-xs font-bold">
                  <div className="text-sky-600 dark:text-sky-400">+12 Specialists</div>
                  <div className="text-slate-500 dark:text-slate-400 font-normal">Available today</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Ticker Footer Bar */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-200/50 dark:border-slate-800/50 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-3xl font-bold font-sans text-slate-900 dark:text-white">15,000+</p>
            <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Smiles Transformed</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold font-sans text-sky-600 dark:text-sky-400">99.4%</p>
            <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Clinical Success Rate</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold font-sans text-slate-900 dark:text-white">24</p>
            <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Specialist Doctors</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold font-sans text-sky-600 dark:text-sky-400">4.98</p>
            <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Patient Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
};
