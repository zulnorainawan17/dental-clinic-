import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Award, Cpu, Sparkles, Microchip, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AboutTimeline: React.FC = () => {
  const [activeTechTab, setActiveTechTab] = useState(0);

  const timelineMilestones = [
    { year: '2012', title: 'Clinic Founded', desc: 'Established in Manhattan with a mission to combine Swiss dental precision and luxury patient care.' },
    { year: '2016', title: '3D CBCT Imaging', desc: 'Integrated sub-millimeter 3D intraoral imaging and guided surgical templates.' },
    { year: '2020', title: 'Diode Laser Suite', desc: 'Introduced cold laser teeth whitening and painless periodontal soft tissue therapies.' },
    { year: '2026', title: 'AI Smile Simulation', desc: 'Launched real-time AI optical scanning and instant 3D smile design previews.' }
  ];

  const techEquipment = [
    {
      title: 'Sub-Millimeter 3D CBCT Scanner',
      subtitle: 'Low-radiation 3D jaw bone & anatomical mapping',
      desc: 'Captures full 360-degree high-definition volumetric bone density and root trajectory in under 8 seconds.',
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
      specs: ['0.08mm Resolution', '90% Lower Radiation', 'Instant 3D Mesh Output']
    },
    {
      title: 'Zeiss Surgical Operating Microscope',
      subtitle: '25x Optical Magnification for Precision Endodontics',
      desc: 'Enables root canal treatments and micro-restorations to save original teeth with extreme accuracy.',
      image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80&w=800',
      specs: ['25x Optical Zoom', 'Coaxial LED Illumination', 'Micro-laser Integration']
    },
    {
      title: 'Intraoral AI Digital Scanner',
      subtitle: 'No messy physical impressions required',
      desc: 'Glides smoothly over teeth taking 6,000 digital surface photographs per second to construct a flawless 3D model.',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
      specs: ['100% Powder-Free', 'Real-Time Shade Matching', 'Instant Aligner Preview']
    }
  ];

  return (
    <section id="about" className="py-24 relative bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-mono font-medium tracking-wider uppercase">
            <Cpu className="w-3.5 h-3.5" />
            <span>Pioneering Swiss Innovation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 dark:text-white tracking-tight">
            Advanced Medical <span className="font-semibold text-sky-500">Technology</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            We invest continuously in top-tier medical hardware and AI diagnostics to make every treatment gentle, swift, and lasting.
          </p>
        </div>

        {/* Timeline Milestones */}
        <div className="space-y-8">
          <h3 className="text-center font-mono text-xs uppercase tracking-widest text-slate-400">Our Evolution Timeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {timelineMilestones.map((m, idx) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative glass-panel glass-panel-hover p-6 rounded-[28px]"
              >
                <span className="text-2xl font-bold font-mono text-sky-500">{m.year}</span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">{m.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Equipment Showcase Tabs */}
        <div className="glass-panel rounded-[36px] p-6 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/60 dark:border-slate-800 pb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Equipment & Tech Suite</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Select hardware to inspect clinical capabilities</p>
            </div>

            <div className="flex gap-2">
              {techEquipment.map((eq, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTechTab(i)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    activeTechTab === i
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'glass-panel text-slate-600 dark:text-slate-300 hover:text-sky-500'
                  }`}
                >
                  Tech {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono font-semibold uppercase text-sky-500 tracking-wider">
                {techEquipment[activeTechTab].subtitle}
              </span>
              <h4 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
                {techEquipment[activeTechTab].title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {techEquipment[activeTechTab].desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {techEquipment[activeTechTab].specs.map((spec, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <img
                src={techEquipment[activeTechTab].image}
                alt={techEquipment[activeTechTab].title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
