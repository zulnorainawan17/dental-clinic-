import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowUp, ShieldCheck, Heart, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-8 border-t border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-900">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-light tracking-wider uppercase font-sans">
                Dr. Haniya <span className="font-bold text-sky-400">Dental Clinic</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Swiss precision aesthetic dentistry and full-mouth rehabilitation in Manhattan. Accredited center for computer-guided implants and digital smile design.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>ISO 9001 Dental Healthcare Certification</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#services" className="hover:text-sky-400 transition-colors">Services & Pricing</a></li>
              <li><a href="#before-after" className="hover:text-sky-400 transition-colors">Before & After</a></li>
              <li><a href="#about" className="hover:text-sky-400 transition-colors">Clinic History & Tech</a></li>
              <li><a href="#doctors" className="hover:text-sky-400 transition-colors">Specialist Doctors</a></li>
              <li><a href="#testimonials" className="hover:text-sky-400 transition-colors">Patient Reviews</a></li>
              <li><a href="#gallery" className="hover:text-sky-400 transition-colors">Facility Gallery</a></li>
            </ul>
          </div>

          {/* Treatments */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">Key Treatments</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Porcelain Veneers</li>
              <li>Swiss Bio-Implants</li>
              <li>Laser Diamond Whitening</li>
              <li>Clear Orthodontics</li>
              <li>Guided Biofilm Spa</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">Smile Journal</h4>
            <p className="text-xs text-slate-400">Receive quarterly aesthetic dentistry updates and health insights.</p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
              />
              <button className="w-full py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                <span>Subscribe</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} {settings.clinicName}. All Rights Reserved.</p>

          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Concierge Service</span>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-sky-400 hover:border-sky-500 transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
