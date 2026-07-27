import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle2, Calendar, Clock, DollarSign, ShieldCheck, Sparkles } from 'lucide-react';

export const ServiceDetailModal: React.FC = () => {
  const { selectedService, closeServiceModal, openBooking } = useApp();

  if (!selectedService) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl glass-panel rounded-[36px] shadow-2xl overflow-hidden my-8"
        >
          {/* Header Image with Overlay */}
          <div className="relative h-56 sm:h-64 overflow-hidden">
            <img
              src={selectedService.image}
              alt={selectedService.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Close Button */}
            <button
              onClick={closeServiceModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title Badge */}
            <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">
              <span className="px-3 py-1 rounded-full bg-sky-500/80 backdrop-blur-md text-[11px] font-mono tracking-wider uppercase font-semibold text-white">
                {selectedService.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                {selectedService.title}
              </h2>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedService.fullDesc}
            </p>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Estimated Cost</p>
                  <p className="text-sm font-semibold font-mono text-slate-900 dark:text-white">{selectedService.priceRange}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Treatment Duration</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedService.duration}</p>
                </div>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-500" />
                Clinical Advantages
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedService.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                onClick={closeServiceModal}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>

              <button
                onClick={() => {
                  const sId = selectedService.id;
                  closeServiceModal();
                  openBooking({ serviceId: sId });
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-xs font-semibold shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Appointment for This Treatment</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
