import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Star, GraduationCap, Calendar, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';

export const Doctors: React.FC = () => {
  const { doctors, openDoctorModal, openBooking } = useApp();

  return (
    <section id="doctors" className="py-24 relative bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-mono font-medium tracking-wider uppercase">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Board-Certified Specialists</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 dark:text-white tracking-tight">
            Our Master <span className="font-semibold text-sky-500">Surgeons & Clinicians</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Trained at Harvard, Columbia, and ETH Zürich with decades of combined clinical perfection.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative glass-panel glass-panel-hover rounded-[32px] p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Doctor Avatar */}
                <div className="relative h-64 rounded-2xl overflow-hidden">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Rating Tag */}
                  <div className="absolute top-3 left-3 glass-panel px-2.5 py-1 rounded-full text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{doctor.rating}</span>
                  </div>

                  {/* Availability Badge */}
                  <div className="absolute bottom-3 left-3 bg-emerald-500/90 text-white backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Available This Week
                  </div>
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">
                    {doctor.name}
                  </h3>
                  <p className="text-xs font-medium text-sky-600 dark:text-sky-400 mt-0.5">{doctor.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{doctor.bio}</p>
                </div>

                {/* Alma Mater */}
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-mono pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <GraduationCap className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
                  <span className="truncate">{doctor.education.split(',')[0]}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 mt-6 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => openDoctorModal(doctor)}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-sky-500 transition-colors flex items-center gap-1"
                >
                  <span>Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => openBooking({ doctorId: doctor.id })}
                  className="px-3.5 py-2 rounded-xl bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20 hover:bg-sky-600 transition-all flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
