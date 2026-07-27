import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { GalleryItem } from '../types';
import { Image, X, Maximize2 } from 'lucide-react';

export const Gallery: React.FC = () => {
  const { gallery } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'interior', label: 'Clinic Interior' },
    { id: 'technology', label: 'Technology Suite' },
    { id: 'smiles', label: 'Smile Gallery' },
    { id: 'lounge', label: 'VIP Lounge' },
  ];

  const filteredGallery = selectedCategory === 'all'
    ? gallery
    : gallery.filter(g => g.category === selectedCategory);

  return (
    <section id="gallery" className="py-24 relative bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-mono font-medium tracking-wider uppercase">
            <Image className="w-3.5 h-3.5" />
            <span>Clinic & Facility Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 dark:text-white tracking-tight">
            Immersive Clinic <span className="font-semibold text-sky-500">Gallery</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Explore our state-of-the-art diagnostic suites, calming relaxation lounges, and surgical theater environment.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'glass-panel text-slate-600 dark:text-slate-300 hover:text-sky-500'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              onClick={() => setLightboxItem(item)}
              className="group relative h-72 rounded-[32px] overflow-hidden cursor-pointer glass-panel glass-panel-hover shadow-md"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] font-mono tracking-wider uppercase text-sky-400">
                  {item.category}
                </span>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">{item.caption}</p>
                <div className="mt-3 flex items-center gap-1 text-xs text-sky-300 font-medium">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>View Fullsize</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl"
            >
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[70vh] overflow-hidden flex items-center justify-center bg-black">
                <img
                  src={lightboxItem.image}
                  alt={lightboxItem.title}
                  className="w-full h-full object-contain max-h-[70vh]"
                />
              </div>

              <div className="p-6 text-white space-y-1">
                <span className="text-xs font-mono text-sky-400 uppercase tracking-widest">
                  {lightboxItem.category}
                </span>
                <h3 className="text-xl font-bold">{lightboxItem.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{lightboxItem.caption}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
