import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  ThemeMode,
  Service,
  Doctor,
  Appointment,
  Testimonial,
  GalleryItem,
  FAQItem,
  ContactMessage,
  SiteSettings
} from '../types';
import {
  INITIAL_SERVICES,
  INITIAL_DOCTORS,
  INITIAL_BEFORE_AFTER,
  INITIAL_TESTIMONIALS,
  INITIAL_GALLERY,
  INITIAL_FAQS,
  INITIAL_SETTINGS,
  INITIAL_APPOINTMENTS,
  INITIAL_MESSAGES
} from '../data/initialData';

interface AppContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  
  // Data Collections
  services: Service[];
  doctors: Doctor[];
  appointments: Appointment[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  faqs: FAQItem[];
  messages: ContactMessage[];
  settings: SiteSettings;

  // Modal Controllers
  isBookingOpen: boolean;
  openBooking: (preselect?: { serviceId?: string; doctorId?: string }) => void;
  closeBooking: () => void;
  bookingPreselect: { serviceId?: string; doctorId?: string };

  selectedDoctor: Doctor | null;
  openDoctorModal: (doc: Doctor) => void;
  closeDoctorModal: () => void;

  selectedService: Service | null;
  openServiceModal: (service: Service) => void;
  closeServiceModal: () => void;

  isAdminOpen: boolean;
  openAdmin: () => void;
  closeAdmin: () => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;

  // CRUD Actions
  addAppointment: (apt: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  updateAppointment: (id: string, updated: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;

  addDoctor: (doctor: Omit<Doctor, 'id' | 'rating' | 'reviewCount'>) => void;
  updateDoctor: (id: string, updated: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;

  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, updated: Partial<Service>) => void;
  deleteService: (id: string) => void;

  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  updateGalleryItem: (id: string, updated: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;

  addTestimonial: (item: Omit<Testimonial, 'id' | 'date'>) => void;
  updateTestimonial: (id: string, updated: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;

  addMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;

  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  resetDataToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function cleanForFirestore<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;
  const result: any = Array.isArray(obj) ? [] : {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val !== undefined) {
      if (val !== null && typeof val === 'object' && !(val instanceof Date)) {
        result[key] = cleanForFirestore(val);
      } else {
        result[key] = val;
      }
    }
  }
  return result;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('auradent_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('auradent_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Persistent Collections with Firestore Real-time Sync & Local Fallback
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('auradent_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('auradent_doctors');
    return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('auradent_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('auradent_testimonials');
    return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('auradent_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const [faqs] = useState<FAQItem[]>(INITIAL_FAQS);

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('auradent_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('auradent_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Firestore Real-Time Subscriptions & System Seed Guard
  useEffect(() => {
    const systemDocRef = doc(db, 'settings', 'system');

    // 0. Seed status listener (runs once per database lifetime)
    const unsubSystem = onSnapshot(systemDocRef, (systemSnap) => {
      if (!systemSnap.exists() || !systemSnap.data()?.seeded) {
        INITIAL_SERVICES.forEach(s => setDoc(doc(db, 'services', s.id), cleanForFirestore(s)).catch(console.error));
        INITIAL_DOCTORS.forEach(dItem => setDoc(doc(db, 'doctors', dItem.id), cleanForFirestore(dItem)).catch(console.error));
        INITIAL_APPOINTMENTS.forEach(a => setDoc(doc(db, 'appointments', a.id), cleanForFirestore(a)).catch(console.error));
        INITIAL_TESTIMONIALS.forEach(t => setDoc(doc(db, 'testimonials', t.id), cleanForFirestore(t)).catch(console.error));
        INITIAL_GALLERY.forEach(g => setDoc(doc(db, 'gallery', g.id), cleanForFirestore(g)).catch(console.error));
        INITIAL_MESSAGES.forEach(m => setDoc(doc(db, 'messages', m.id), cleanForFirestore(m)).catch(console.error));
        setDoc(doc(db, 'settings', 'config'), cleanForFirestore(INITIAL_SETTINGS)).catch(console.error);
        setDoc(systemDocRef, { seeded: true }).catch(console.error);
      }
    }, (err) => console.warn('System seed snapshot error:', err));

    // 1. Services Listener
    const unsubServices = onSnapshot(collection(db, 'services'), (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Service));
      setServices(items);
      localStorage.setItem('auradent_services', JSON.stringify(items));
    }, (err) => console.warn('Services snapshot error:', err));

    // 2. Doctors Listener
    const unsubDoctors = onSnapshot(collection(db, 'doctors'), (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Doctor));
      setDoctors(items);
      localStorage.setItem('auradent_doctors', JSON.stringify(items));
    }, (err) => console.warn('Doctors snapshot error:', err));

    // 3. Appointments Listener
    const unsubApts = onSnapshot(collection(db, 'appointments'), (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Appointment));
      setAppointments(items);
      localStorage.setItem('auradent_appointments', JSON.stringify(items));
    }, (err) => console.warn('Appointments snapshot error:', err));

    // 4. Testimonials Listener
    const unsubTestimonials = onSnapshot(collection(db, 'testimonials'), (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial));
      setTestimonials(items);
      localStorage.setItem('auradent_testimonials', JSON.stringify(items));
    }, (err) => console.warn('Testimonials snapshot error:', err));

    // 5. Gallery Listener
    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem));
      setGallery(items);
      localStorage.setItem('auradent_gallery', JSON.stringify(items));
    }, (err) => console.warn('Gallery snapshot error:', err));

    // 6. Messages Listener
    const unsubMessages = onSnapshot(collection(db, 'messages'), (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage));
      setMessages(items);
      localStorage.setItem('auradent_messages', JSON.stringify(items));
    }, (err) => console.warn('Messages snapshot error:', err));

    // 7. Settings Listener (Listens directly to settings/config)
    const unsubSettings = onSnapshot(doc(db, 'settings', 'config'), (snap) => {
      if (snap.exists()) {
        const docData = snap.data() as SiteSettings;
        setSettings(docData);
        localStorage.setItem('auradent_settings', JSON.stringify(docData));
      } else {
        setDoc(doc(db, 'settings', 'config'), cleanForFirestore(INITIAL_SETTINGS)).catch(console.error);
      }
    }, (err) => console.warn('Settings snapshot error:', err));

    return () => {
      unsubSystem();
      unsubServices();
      unsubDoctors();
      unsubApts();
      unsubTestimonials();
      unsubGallery();
      unsubMessages();
      unsubSettings();
    };
  }, []);

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPreselect, setBookingPreselect] = useState<{ serviceId?: string; doctorId?: string }>({});

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('auradent_admin_auth') === 'true';
  });

  const openBooking = (preselect?: { serviceId?: string; doctorId?: string }) => {
    if (preselect) setBookingPreselect(preselect);
    else setBookingPreselect({});
    setIsBookingOpen(true);
  };
  const closeBooking = () => setIsBookingOpen(false);

  const openDoctorModal = (doc: Doctor) => setSelectedDoctor(doc);
  const closeDoctorModal = () => setSelectedDoctor(null);

  const openServiceModal = (s: Service) => setSelectedService(s);
  const closeServiceModal = () => setSelectedService(null);

  const openAdmin = () => setIsAdminOpen(true);
  const closeAdmin = () => setIsAdminOpen(false);

  const loginAdmin = (password: string) => {
    if (password === 'admin123' || password === 'auradent') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('auradent_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('auradent_admin_auth');
  };

  // CRUD Actions bound to Firestore Database
  const addAppointment = (aptData: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    const newId = 'apt-' + Date.now();
    const newApt: Appointment = {
      ...aptData,
      id: newId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setAppointments(prev => [newApt, ...prev]);
    setDoc(doc(db, 'appointments', newId), cleanForFirestore(newApt)).catch(console.error);
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    setDoc(doc(db, 'appointments', id), { status }, { merge: true }).catch(console.error);
  };

  const updateAppointment = (id: string, updated: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
    setDoc(doc(db, 'appointments', id), cleanForFirestore(updated), { merge: true }).catch(console.error);
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    deleteDoc(doc(db, 'appointments', id)).catch(console.error);
  };

  const addDoctor = (docData: Omit<Doctor, 'id' | 'rating' | 'reviewCount'>) => {
    const newId = 'doc-' + Date.now();
    const newDoc: Doctor = {
      ...docData,
      id: newId,
      rating: 5.0,
      reviewCount: 1
    };
    setDoctors(prev => [...prev, newDoc]);
    setDoc(doc(db, 'doctors', newId), cleanForFirestore(newDoc)).catch(console.error);
  };

  const updateDoctor = (id: string, updated: Partial<Doctor>) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...updated } : d));
    setDoc(doc(db, 'doctors', id), cleanForFirestore(updated), { merge: true }).catch(console.error);
  };

  const deleteDoctor = (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
    deleteDoc(doc(db, 'doctors', id)).catch(console.error);
  };

  const addService = (servData: Omit<Service, 'id'>) => {
    const newId = 'serv-' + Date.now();
    const newServ: Service = {
      ...servData,
      id: newId
    };
    setServices(prev => [...prev, newServ]);
    setDoc(doc(db, 'services', newId), cleanForFirestore(newServ)).catch(console.error);
  };

  const updateService = (id: string, updated: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    setDoc(doc(db, 'services', id), cleanForFirestore(updated), { merge: true }).catch(console.error);
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    deleteDoc(doc(db, 'services', id)).catch(console.error);
  };

  const addGalleryItem = (itemData: Omit<GalleryItem, 'id'>) => {
    const newId = 'gal-' + Date.now();
    const newItem: GalleryItem = { ...itemData, id: newId };
    setGallery(prev => [newItem, ...prev]);
    setDoc(doc(db, 'gallery', newId), cleanForFirestore(newItem)).catch(console.error);
  };

  const updateGalleryItem = (id: string, updated: Partial<GalleryItem>) => {
    setGallery(prev => prev.map(g => g.id === id ? { ...g, ...updated } : g));
    setDoc(doc(db, 'gallery', id), cleanForFirestore(updated), { merge: true }).catch(console.error);
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
    deleteDoc(doc(db, 'gallery', id)).catch(console.error);
  };

  const addTestimonial = (itemData: Omit<Testimonial, 'id' | 'date'>) => {
    const newId = 'test-' + Date.now();
    const newTest: Testimonial = {
      ...itemData,
      id: newId,
      date: 'Just now'
    };
    setTestimonials(prev => [newTest, ...prev]);
    setDoc(doc(db, 'testimonials', newId), cleanForFirestore(newTest)).catch(console.error);
  };

  const updateTestimonial = (id: string, updated: Partial<Testimonial>) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
    setDoc(doc(db, 'testimonials', id), cleanForFirestore(updated), { merge: true }).catch(console.error);
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    deleteDoc(doc(db, 'testimonials', id)).catch(console.error);
  };

  const addMessage = (msgData: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => {
    const newId = 'msg-' + Date.now();
    const newMsg: ContactMessage = {
      ...msgData,
      id: newId,
      createdAt: new Date().toISOString(),
      read: false
    };
    setMessages(prev => [newMsg, ...prev]);
    setDoc(doc(db, 'messages', newId), cleanForFirestore(newMsg)).catch(console.error);
  };

  const markMessageRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    setDoc(doc(db, 'messages', id), { read: true }, { merge: true }).catch(console.error);
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    deleteDoc(doc(db, 'messages', id)).catch(console.error);
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    setDoc(doc(db, 'settings', 'config'), cleanForFirestore({ ...settings, ...newSettings }), { merge: true }).catch(console.error);
  };

  const resetDataToDefaults = () => {
    localStorage.removeItem('auradent_services');
    localStorage.removeItem('auradent_doctors');
    localStorage.removeItem('auradent_appointments');
    localStorage.removeItem('auradent_testimonials');
    localStorage.removeItem('auradent_gallery');
    localStorage.removeItem('auradent_messages');
    localStorage.removeItem('auradent_settings');

    setServices(INITIAL_SERVICES);
    setDoctors(INITIAL_DOCTORS);
    setAppointments(INITIAL_APPOINTMENTS);
    setTestimonials(INITIAL_TESTIMONIALS);
    setGallery(INITIAL_GALLERY);
    setMessages(INITIAL_MESSAGES);
    setSettings(INITIAL_SETTINGS);

    // Overwrite Firestore collections with initial defaults
    INITIAL_SERVICES.forEach(s => setDoc(doc(db, 'services', s.id), cleanForFirestore(s)));
    INITIAL_DOCTORS.forEach(dItem => setDoc(doc(db, 'doctors', dItem.id), cleanForFirestore(dItem)));
    INITIAL_APPOINTMENTS.forEach(a => setDoc(doc(db, 'appointments', a.id), cleanForFirestore(a)));
    INITIAL_TESTIMONIALS.forEach(t => setDoc(doc(db, 'testimonials', t.id), cleanForFirestore(t)));
    INITIAL_GALLERY.forEach(g => setDoc(doc(db, 'gallery', g.id), cleanForFirestore(g)));
    INITIAL_MESSAGES.forEach(m => setDoc(doc(db, 'messages', m.id), cleanForFirestore(m)));
    setDoc(doc(db, 'settings', 'config'), cleanForFirestore(INITIAL_SETTINGS));
    setDoc(doc(db, 'settings', 'system'), { seeded: true });
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        services,
        doctors,
        appointments,
        testimonials,
        gallery,
        faqs,
        messages,
        settings,

        isBookingOpen,
        openBooking,
        closeBooking,
        bookingPreselect,

        selectedDoctor,
        openDoctorModal,
        closeDoctorModal,

        selectedService,
        openServiceModal,
        closeServiceModal,

        isAdminOpen,
        openAdmin,
        closeAdmin,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,

        addAppointment,
        updateAppointmentStatus,
        updateAppointment,
        deleteAppointment,

        addDoctor,
        updateDoctor,
        deleteDoctor,

        addService,
        updateService,
        deleteService,

        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,

        addTestimonial,
        updateTestimonial,
        deleteTestimonial,

        addMessage,
        markMessageRead,
        deleteMessage,

        updateSettings,
        resetDataToDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
