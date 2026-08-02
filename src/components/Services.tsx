import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Service } from '../types';
import {
  Sparkles,
  Sun,
  ShieldCheck,
  Smile,
  Zap,
  Droplets,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';

export const Services: React.FC = () => {
  const { services, openServiceModal, openBooking } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'cosmetic', label: 'Cosmetic Dentistry' },
    { id: 'orthodontics', label: 'Orthodontics' },
    { id: 'restorative', label: 'Restorative' },
    { id: 'surgical', label: 'Implants & Surgery' },
    { id: 'general', label: 'Dental Spa & Hygiene' },
  ];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Sun': return <Sun className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'AlignHorizontalCenter': return <Smile className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      case 'Droplets': return <Droplets className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section id="services" className="py-24 relative bg-slate-100/60 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-mono font-semibold tracking-wider uppercase border border-sky-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>World-Class Clinical Offerings</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 dark:text-white tracking-tight">
            Precision Dental <span className="font-semibold text-sky-500">Treatments</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal">
            Every procedure is crafted with microscope-assisted accuracy, bio-compatible materials, and Swiss aesthetic perfection.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 scale-105'
                  : 'glass-panel text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/90 dark:border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative glass-panel glass-panel-hover rounded-[32px] p-6 flex flex-col justify-between overflow-hidden"
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-sky-500 text-[10px] font-mono tracking-wider font-bold text-white shadow-md">
                  Most Requested
                </div>
              )}

              <div className="space-y-5">
                {/* Image Preview & Icon */}
                <div className="relative h-44 rounded-2xl overflow-hidden mb-4">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <div className="absolute bottom-3 left-3 p-2.5 rounded-xl glass-panel text-sky-500 dark:text-sky-400 shadow-md">
                    {getIcon(service.iconName)}
                  </div>
                </div>

                {/* Title & Short Desc */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {service.shortDesc}
                  </p>
                </div>

                {/* Quick Info Tags */}
                <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sky-500" />
                    {service.duration}
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{service.priceRange}</span>
                </div>

                {/* Benefits Bullet Points */}
                <div className="space-y-1.5 pt-1">
                  {service.benefits.slice(0, 3).map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Action Buttons */}
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => openServiceModal(service)}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-sky-500 transition-colors flex items-center gap-1"
                >
                  <span>Learn Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => openBooking({ serviceId: service.id })}
                  className="px-4 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500 text-sky-600 dark:text-sky-400 hover:text-white text-xs font-semibold transition-all duration-200 flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Now</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
