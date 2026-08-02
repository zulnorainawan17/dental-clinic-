import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDoc,
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
  BeforeAfterItem,
  TechEquipmentItem,
  AboutMilestoneItem,
  FAQItem,
  ContactMessage,
  SiteSettings
} from '../types';
import {
  INITIAL_SERVICES,
  INITIAL_DOCTORS,
  INITIAL_BEFORE_AFTER,
  INITIAL_TECH_EQUIPMENT,
  INITIAL_MILESTONES,
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
  beforeAfter: BeforeAfterItem[];
  technologies: TechEquipmentItem[];
  milestones: AboutMilestoneItem[];
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

  addBeforeAfterItem: (item: Omit<BeforeAfterItem, 'id'>) => void;
  updateBeforeAfterItem: (id: string, updated: Partial<BeforeAfterItem>) => void;
  deleteBeforeAfterItem: (id: string) => void;

  addTechnologyItem: (item: Omit<TechEquipmentItem, 'id'>) => void;
  updateTechnologyItem: (id: string, updated: Partial<TechEquipmentItem>) => void;
  deleteTechnologyItem: (id: string) => void;

  addMilestoneItem: (item: Omit<AboutMilestoneItem, 'id'>) => void;
  updateMilestoneItem: (id: string, updated: Partial<AboutMilestoneItem>) => void;
  deleteMilestoneItem: (id: string) => void;

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

  const [beforeAfter, setBeforeAfter] = useState<BeforeAfterItem[]>(() => {
    const saved = localStorage.getItem('auradent_beforeafter');
    return saved ? JSON.parse(saved) : INITIAL_BEFORE_AFTER;
  });

  const [technologies, setTechnologies] = useState<TechEquipmentItem[]>(() => {
    const saved = localStorage.getItem('auradent_technologies');
    return saved ? JSON.parse(saved) : INITIAL_TECH_EQUIPMENT;
  });

  const [milestones, setMilestones] = useState<AboutMilestoneItem[]>(() => {
    const saved = localStorage.getItem('auradent_milestones');
    return saved ? JSON.parse(saved) : INITIAL_MILESTONES;
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
    const seedCheckKey = 'auradent_db_seeded_v4';
    const isLocalSeeded = localStorage.getItem(seedCheckKey) === 'true';

    // Seed once if needed
    if (!isLocalSeeded) {
      getDoc(systemDocRef).then((systemSnap) => {
        if (!systemSnap.exists() || !systemSnap.data()?.seeded) {
          INITIAL_SERVICES.forEach(s => setDoc(doc(db, 'services', s.id), cleanForFirestore(s)).catch(console.error));
          INITIAL_DOCTORS.forEach(dItem => setDoc(doc(db, 'doctors', dItem.id), cleanForFirestore(dItem)).catch(console.error));
          INITIAL_APPOINTMENTS.forEach(a => setDoc(doc(db, 'appointments', a.id), cleanForFirestore(a)).catch(console.error));
          INITIAL_TESTIMONIALS.forEach(t => setDoc(doc(db, 'testimonials', t.id), cleanForFirestore(t)).catch(console.error));
          INITIAL_GALLERY.forEach(g => setDoc(doc(db, 'gallery', g.id), cleanForFirestore(g)).catch(console.error));
          INITIAL_BEFORE_AFTER.forEach(ba => setDoc(doc(db, 'beforeAfter', ba.id), cleanForFirestore(ba)).catch(console.error));
          INITIAL_TECH_EQUIPMENT.forEach(te => setDoc(doc(db, 'technologies', te.id), cleanForFirestore(te)).catch(console.error));
          INITIAL_MILESTONES.forEach(m => setDoc(doc(db, 'milestones', m.id), cleanForFirestore(m)).catch(console.error));
          INITIAL_MESSAGES.forEach(m => setDoc(doc(db, 'messages', m.id), cleanForFirestore(m)).catch(console.error));
          setDoc(doc(db, 'settings', 'config'), cleanForFirestore(INITIAL_SETTINGS)).catch(console.error);
          setDoc(systemDocRef, { seeded: true }).catch(console.error);
        }
        localStorage.setItem(seedCheckKey, 'true');
      }).catch(err => {
        console.warn('System seed check error:', err);
      });
    }

    // 1. Services Listener
    const unsubServices = onSnapshot(collection(db, 'services'), (snap) => {
      if (snap.empty) {
        INITIAL_SERVICES.forEach(s => setDoc(doc(db, 'services', s.id), cleanForFirestore(s)).catch(console.error));
        setServices(INITIAL_SERVICES);
        localStorage.setItem('auradent_services', JSON.stringify(INITIAL_SERVICES));
      } else {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Service));
        setServices(items);
        localStorage.setItem('auradent_services', JSON.stringify(items));
      }
    }, (err) => console.warn('Services snapshot error:', err));

    // 2. Doctors Listener
    const unsubDoctors = onSnapshot(collection(db, 'doctors'), (snap) => {
      if (snap.empty) {
        INITIAL_DOCTORS.forEach(dItem => setDoc(doc(db, 'doctors', dItem.id), cleanForFirestore(dItem)).catch(console.error));
        setDoctors(INITIAL_DOCTORS);
        localStorage.setItem('auradent_doctors', JSON.stringify(INITIAL_DOCTORS));
      } else {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Doctor));
        setDoctors(items);
        localStorage.setItem('auradent_doctors', JSON.stringify(items));
      }
    }, (err) => console.warn('Doctors snapshot error:', err));

    // 3. Appointments Listener
    const unsubApts = onSnapshot(collection(db, 'appointments'), (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Appointment));
      setAppointments(items);
      localStorage.setItem('auradent_appointments', JSON.stringify(items));
    }, (err) => console.warn('Appointments snapshot error:', err));

    // 4. Testimonials Listener
    const unsubTestimonials = onSnapshot(collection(db, 'testimonials'), (snap) => {
      if (snap.empty) {
        INITIAL_TESTIMONIALS.forEach(t => setDoc(doc(db, 'testimonials', t.id), cleanForFirestore(t)).catch(console.error));
        setTestimonials(INITIAL_TESTIMONIALS);
        localStorage.setItem('auradent_testimonials', JSON.stringify(INITIAL_TESTIMONIALS));
      } else {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial));
        setTestimonials(items);
        localStorage.setItem('auradent_testimonials', JSON.stringify(items));
      }
    }, (err) => console.warn('Testimonials snapshot error:', err));

    // 5. Gallery Listener
    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snap) => {
      if (snap.empty) {
        INITIAL_GALLERY.forEach(g => setDoc(doc(db, 'gallery', g.id), cleanForFirestore(g)).catch(console.error));
        setGallery(INITIAL_GALLERY);
        localStorage.setItem('auradent_gallery', JSON.stringify(INITIAL_GALLERY));
      } else {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem));
        setGallery(items);
        localStorage.setItem('auradent_gallery', JSON.stringify(items));
      }
    }, (err) => console.warn('Gallery snapshot error:', err));

    // 6. BeforeAfter Listener
    const unsubBeforeAfter = onSnapshot(collection(db, 'beforeAfter'), (snap) => {
      if (snap.empty) {
        INITIAL_BEFORE_AFTER.forEach(ba => setDoc(doc(db, 'beforeAfter', ba.id), cleanForFirestore(ba)).catch(console.error));
        setBeforeAfter(INITIAL_BEFORE_AFTER);
        localStorage.setItem('auradent_beforeafter', JSON.stringify(INITIAL_BEFORE_AFTER));
      } else {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as BeforeAfterItem));
        setBeforeAfter(items);
        localStorage.setItem('auradent_beforeafter', JSON.stringify(items));
      }
    }, (err) => console.warn('BeforeAfter snapshot error:', err));

    // 7. Technologies Listener
    const unsubTechnologies = onSnapshot(collection(db, 'technologies'), (snap) => {
      if (snap.empty) {
        INITIAL_TECH_EQUIPMENT.forEach(te => setDoc(doc(db, 'technologies', te.id), cleanForFirestore(te)).catch(console.error));
        setTechnologies(INITIAL_TECH_EQUIPMENT);
        localStorage.setItem('auradent_technologies', JSON.stringify(INITIAL_TECH_EQUIPMENT));
      } else {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as TechEquipmentItem));
        setTechnologies(items);
        localStorage.setItem('auradent_technologies', JSON.stringify(items));
      }
    }, (err) => console.warn('Technologies snapshot error:', err));

    // 8. Milestones Listener
    const unsubMilestones = onSnapshot(collection(db, 'milestones'), (snap) => {
      if (snap.empty) {
        INITIAL_MILESTONES.forEach(m => setDoc(doc(db, 'milestones', m.id), cleanForFirestore(m)).catch(console.error));
        setMilestones(INITIAL_MILESTONES);
        localStorage.setItem('auradent_milestones', JSON.stringify(INITIAL_MILESTONES));
      } else {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as AboutMilestoneItem));
        setMilestones(items);
        localStorage.setItem('auradent_milestones', JSON.stringify(items));
      }
    }, (err) => console.warn('Milestones snapshot error:', err));

    // 9. Messages Listener
    const unsubMessages = onSnapshot(collection(db, 'messages'), (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage));
      setMessages(items);
      localStorage.setItem('auradent_messages', JSON.stringify(items));
    }, (err) => console.warn('Messages snapshot error:', err));

    // 10. Settings Listener (Listens directly to settings/config)
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
      unsubServices();
      unsubDoctors();
      unsubApts();
      unsubTestimonials();
      unsubGallery();
      unsubBeforeAfter();
      unsubTechnologies();
      unsubMilestones();
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
    setAppointments(prev => {
      const next = [newApt, ...prev];
      localStorage.setItem('auradent_appointments', JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'appointments', newId), cleanForFirestore(newApt)).catch(console.error);
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => {
      const next = prev.map(a => a.id === id ? { ...a, status } : a);
      localStorage.setItem('auradent_appointments', JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'appointments', id), { status }, { merge: true }).catch(console.error);
  };

  const updateAppointment = (id: string, updated: Partial<Appointment>) => {
    setAppointments(prev => {
      const next = prev.map(a => a.id === id ? { ...a, ...updated } : a);
      localStorage.setItem('auradent_appointments', JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'appointments', id), cleanForFirestore(updated), { merge: true }).catch(console.error);
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => {
      const next = prev.filter(a => a.id !== id);
      localStorage.setItem('auradent_appointments', JSON.stringify(next));
      return next;
    });
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
    setDoctors(prev => {
      const next = [...prev, newDoc];
      localStorage.setItem('auradent_doctors', JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'doctors', newId), cleanForFirestore(newDoc)).catch(console.error);
  };

  const updateDoctor = (id: string, updated: Partial<Doctor>) => {
    setDoctors(prev => {
      const next = prev.map(d => d.id === id ? { ...d, ...updated } : d);
      localStorage.setItem('auradent_doctors', JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'doctors', id), cleanForFirestore(updated), { merge: true }).catch(console.error);
  };

  const deleteDoctor = (id: string) => {
    setDoctors(prev => {
      const next = prev.filter(d => d.id !== id);
      localStorage.setItem('auradent_doctors', JSON.stringify(next));
      return next;
    });
    deleteDoc(doc(db, 'doctors', id)).catch(console.error);
  };

  const addService = (servData: Omit<Service, 'id'>) => {
    const newId = 'serv-' + Date.now();
    const newServ: Service = {
      ...servData,
      id: newId
    };
    setServices(prev => {
      const next = [...prev, newServ];
      localStorage.setItem('auradent_services', JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'services', newId), cleanForFirestore(newServ)).catch(console.error);
  };

  const updateService = (id: string, updated: Partial<Service>) => {
    setServices(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...updated } : s);
      localStorage.setItem('auradent_services', JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'services', id), cleanForFirestore(updated), { merge: true }).catch(console.error);
  };

  const deleteService = (id: string) => {
    setServices(prev => {
      const next = prev.filter(s => s.id !== id);
      localStorage.setItem('auradent_services', JSON.stringify(next));
      return next;
    });
    deleteDoc(doc(db, 'services', id)).catch(console.error);
  };

  const addGalleryItem = (itemData: Omit<GalleryItem, 'id'>) => {
    const newId = 'gal-' + Date.now();
    const newItem: GalleryItem = { ...itemData, id: newId };
    setGallery(prev => {
      const next = [newItem, ...prev];
      localStorage.setItem('auradent_gallery', JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'gallery', newId), cleanForFirestore(newItem)).catch(console.error);
  };

  const updateGalleryItem = (id: string, updated: Partial<GalleryItem>) => {
    setGallery(prev => {
      const next = prev.map(g => g.id === id ? { ...g, ...updated } : g);
      localStorage.setItem('auradent_gallery', JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'gallery', id), cleanForFirestore(updated), { merge: true }).catch(console.error);
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => {
      const next = prev.filter(g => g.id !== id);
      localStorage.setItem('auradent_gallery', JSON.stringify(next));
      return next;
    });
    deleteDoc(doc(db, 'gallery', id)).catch(console.error);
  };

  // BEFORE & AFTER CRUD
  const addBeforeAfterItem = (itemData: Omit<BeforeAfterItem, 'id'>) => {
    const newId = 'ba-' + Date.now();
    const newItem: BeforeAfterItem = { ...itemData, id: newId };
    setBeforeAfter(prev => {
      const next = [newItem, ...prev];
      localStorage.setItem('auradent_beforeafter', JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'beforeAfter', newId), cleanForFirestore(newItem)).catch(console.error);
  };

  const updateBeforeAfterItem = (id: string, updated: Partial<BeforeAfterItem>) => {
    setBeforeAfter(prev => {
      const next = prev.map(item => item.id === id ? { ...item, ...updated } : item);
      localStorage.setItem('auradent_beforeafter', JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'beforeAfter', id), cleanForFirestore(updated), { merge: true }).catch(console.error);
  };

  const deleteBeforeAfterItem = (id: string) => {
    setBeforeAfter(prev => {
      const next = prev.filter(item => item.id !== id);
      localStorage.setItem('auradent_beforeafter', JSON.stringify(next));
      return next;
    });
    deleteDoc(doc(db, 'beforeAfter', id)).catch(console.error);
  };

  // TECHNOLOGY & EQUIPMENT CRUD
  const addTechnologyItem = (itemData: Omit<TechEquipmentItem, 'id'>) => {
    const newId = 'tech-' + Date.now();
    const newItem: TechEquipmentItem = { ...itemData, id: newId };
    setTechnologies(prev => {
      const next = [...prev, newItem];
      localStorage.setItem('auradent_technologies', JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'technologies', newId), cleanForFirestore(newItem)).catch(console.error);
  };

  const updateTechnologyItem = (id: string, updated: Partial<TechEquipmentItem>) => {
    setTechnologies(prev => {
      const next = prev.map(t => t.id === id ? { ...t, ...updated } : t);
      localStorage.setItem('auradent_technologies', JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'technologies', id), cleanForFirestore(updated), { merge: true }).catch(console.error);
  };

  const deleteTechnologyItem = (id: string) => {
    setTechnologies(prev => {
      const next = prev.filter(t => t.id !== id);
      localStorage.setItem('auradent_technologies', JSON.stringify(next));
      return next;
    });
    deleteDoc(doc(db, 'technologies', id)).catch(console.error);
  };

  // MILESTONE CRUD
  const addMilestoneItem = (itemData: Omit<AboutMilestoneItem, 'id'>) => {
    const newId = 'ms-' + Date.now();
    const newItem: AboutMilestoneItem = { ...itemData, id: newId };
    setMilestones(prev => {
      const next = [...prev, newItem];
      localStorage.setItem('auradent_milestones', JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'milestones', newId), cleanForFirestore(newItem)).catch(console.error);
  };

  const updateMilestoneItem = (id: string, updated: Partial<AboutMilestoneItem>) => {
    setMilestones(prev => {
      const next = prev.map(m => m.id === id ? { ...m, ...updated } : m);
      localStorage.setItem('auradent_milestones', JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'milestones', id), cleanForFirestore(updated), { merge: true }).catch(console.error);
  };

  const deleteMilestoneItem = (id: string) => {
    setMilestones(prev => {
      const next = prev.filter(m => m.id !== id);
      localStorage.setItem('auradent_milestones', JSON.stringify(next));
      return next;
    });
    deleteDoc(doc(db, 'milestones', id)).catch(console.error);
  };

  const addTestimonial = (itemData: Omit<Testimonial, 'id' | 'date'>) => {
    const newId = 'test-' + Date.now();
    const newTest: Testimonial = {
      ...itemData,
      id: newId,
      date: 'Just now'
    };
    setTestimonials(prev => {
      const next = [newTest, ...prev];
      localStorage.setItem('auradent_testimonials', JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'testimonials', newId), cleanForFirestore(newTest)).catch(console.error);
  };

  const updateTestimonial = (id: string, updated: Partial<Testimonial>) => {
    setTestimonials(prev => {
      const next = prev.map(t => t.id === id ? { ...t, ...updated } : t);
      localStorage.setItem('auradent_testimonials', JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'testimonials', id), cleanForFirestore(updated), { merge: true }).catch(console.error);
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => {
      const next = prev.filter(t => t.id !== id);
      localStorage.setItem('auradent_testimonials', JSON.stringify(next));
      return next;
    });
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
    setMessages(prev => {
      const next = [newMsg, ...prev];
      localStorage.setItem('auradent_messages', JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'messages', newId), cleanForFirestore(newMsg)).catch(console.error);
  };

  const markMessageRead = (id: string) => {
    setMessages(prev => {
      const next = prev.map(m => m.id === id ? { ...m, read: true } : m);
      localStorage.setItem('auradent_messages', JSON.stringify(next));
      return next;
    });
    setDoc(doc(db, 'messages', id), { read: true }, { merge: true }).catch(console.error);
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => {
      const next = prev.filter(m => m.id !== id);
      localStorage.setItem('auradent_messages', JSON.stringify(next));
      return next;
    });
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
    localStorage.removeItem('auradent_beforeafter');
    localStorage.removeItem('auradent_technologies');
    localStorage.removeItem('auradent_milestones');
    localStorage.removeItem('auradent_messages');
    localStorage.removeItem('auradent_settings');

    setServices(INITIAL_SERVICES);
    setDoctors(INITIAL_DOCTORS);
    setAppointments(INITIAL_APPOINTMENTS);
    setTestimonials(INITIAL_TESTIMONIALS);
    setGallery(INITIAL_GALLERY);
    setBeforeAfter(INITIAL_BEFORE_AFTER);
    setTechnologies(INITIAL_TECH_EQUIPMENT);
    setMilestones(INITIAL_MILESTONES);
    setMessages(INITIAL_MESSAGES);
    setSettings(INITIAL_SETTINGS);

    // Overwrite Firestore collections with initial defaults
    INITIAL_SERVICES.forEach(s => setDoc(doc(db, 'services', s.id), cleanForFirestore(s)));
    INITIAL_DOCTORS.forEach(dItem => setDoc(doc(db, 'doctors', dItem.id), cleanForFirestore(dItem)));
    INITIAL_APPOINTMENTS.forEach(a => setDoc(doc(db, 'appointments', a.id), cleanForFirestore(a)));
    INITIAL_TESTIMONIALS.forEach(t => setDoc(doc(db, 'testimonials', t.id), cleanForFirestore(t)));
    INITIAL_GALLERY.forEach(g => setDoc(doc(db, 'gallery', g.id), cleanForFirestore(g)));
    INITIAL_BEFORE_AFTER.forEach(ba => setDoc(doc(db, 'beforeAfter', ba.id), cleanForFirestore(ba)));
    INITIAL_TECH_EQUIPMENT.forEach(te => setDoc(doc(db, 'technologies', te.id), cleanForFirestore(te)));
    INITIAL_MILESTONES.forEach(m => setDoc(doc(db, 'milestones', m.id), cleanForFirestore(m)));
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
        beforeAfter,
        technologies,
        milestones,
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

        addBeforeAfterItem,
        updateBeforeAfterItem,
        deleteBeforeAfterItem,

        addTechnologyItem,
        updateTechnologyItem,
        deleteTechnologyItem,

        addMilestoneItem,
        updateMilestoneItem,
        deleteMilestoneItem,

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
