import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { AppProvider } from './context/AppContext';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { BeforeAfter } from './components/BeforeAfter';
import { AboutTimeline } from './components/AboutTimeline';
import { Doctors } from './components/Doctors';
import { Testimonials } from './components/Testimonials';
import { Gallery } from './components/Gallery';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { DoctorDetailModal } from './components/DoctorDetailModal';
import { AdminDashboard } from './components/AdminDashboard';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  // Lenis Smooth Scroll Engine
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Intersection Observer for Scroll Active Indicator
  useEffect(() => {
    const sectionIds = ['hero', 'services', 'before-after', 'about', 'doctors', 'testimonials', 'gallery', 'contact'];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 250;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[radial-gradient(ellipse_at_top_right,#0f172a_0%,#020617_55%,#0b1120_100%)] text-slate-900 dark:text-slate-100 font-sans selection:bg-sky-500 selection:text-white transition-colors duration-300 relative overflow-x-hidden">
      {/* Background Decorative Ambient Blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-sky-200/50 dark:bg-sky-500/10 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-1/3 left-0 w-[450px] h-[450px] bg-indigo-100/60 dark:bg-indigo-600/10 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none z-0" />

      {/* Preloader */}
      {isLoading && <Preloader onFinish={() => setIsLoading(false)} />}

      {/* Custom Spotlight Cursor */}
      <CustomCursor />

      {/* Header Navbar */}
      <Navbar activeSection={activeSection} />

      {/* Main Content Sections */}
      <main className="relative">
        <Hero />
        <Services />
        <BeforeAfter />
        <AboutTimeline />
        <Doctors />
        <Testimonials />
        <Gallery />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <BookingModal />
      <ServiceDetailModal />
      <DoctorDetailModal />
      <AdminDashboard />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
