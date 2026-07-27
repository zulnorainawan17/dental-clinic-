import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { X, Star, Award, GraduationCap, Globe, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const DoctorDetailModal: React.FC = () => {
  const { selectedDoctor, closeDoctorModal, openBooking } = useApp();

  if (!selectedDoctor) return null;

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
          {/* Header Banner */}
          <div className="relative p-6 sm:p-8 bg-gradient-to-r from-sky-900 via-slate-900 to-slate-950 text-white flex flex-col sm:flex-row items-center gap-6">
            {/* Close Button */}
            <button
              onClick={closeDoctorModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedDoctor.avatar}
              alt={selectedDoctor.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-sky-400/40 shadow-xl flex-shrink-0"
            />

            <div className="space-y-2 text-center sm:text-left">
              <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-[11px] font-mono tracking-wider uppercase border border-sky-400/30">
                {selectedDoctor.title}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold">{selectedDoctor.name}</h2>
              <p className="text-xs sm:text-sm text-sky-200/80 font-medium">{selectedDoctor.specialty}</p>

              <div className="flex items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-slate-300 font-mono">
                <span className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {selectedDoctor.rating} ({selectedDoctor.reviewCount} reviews)
                </span>
                <span>•</span>
                <span>{selectedDoctor.experienceYears}+ Yrs Experience</span>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-semibold uppercase text-slate-400 tracking-wider">Biography</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedDoctor.bio}
              </p>
            </div>

            {/* Education & Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-medium text-xs">
                  <GraduationCap className="w-4 h-4" />
                  <span>Education & Alma Mater</span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold">{selectedDoctor.education}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-medium text-xs">
                  <Globe className="w-4 h-4" />
                  <span>Languages Spoken</span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold">{selectedDoctor.languages.join(', ')}</p>
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-sky-500" />
                Accreditation & Awards
              </h3>
              <div className="space-y-2">
                {selectedDoctor.achievements.map((ach, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    <span>{ach}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                onClick={closeDoctorModal}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>

              <button
                onClick={() => {
                  const dId = selectedDoctor.id;
                  closeDoctorModal();
                  openBooking({ doctorId: dId });
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-xs font-semibold shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Consultation with {selectedDoctor.name.split(',')[0]}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
