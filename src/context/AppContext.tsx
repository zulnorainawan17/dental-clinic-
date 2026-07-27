import React, { createContext, useContext, useState, useEffect } from 'react';
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
  deleteAppointment: (id: string) => void;

  addDoctor: (doctor: Omit<Doctor, 'id' | 'rating' | 'reviewCount'>) => void;
  updateDoctor: (id: string, updated: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;

  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, updated: Partial<Service>) => void;
  deleteService: (id: string) => void;

  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;

  addTestimonial: (item: Omit<Testimonial, 'id' | 'date'>) => void;
  deleteTestimonial: (id: string) => void;

  addMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;

  updateSettings: (newSettings: Partial<SiteSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

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

  // Persistent Collections with LocalStorage fallbacks
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

  // Local storage sync effects
  useEffect(() => { localStorage.setItem('auradent_services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('auradent_doctors', JSON.stringify(doctors)); }, [doctors]);
  useEffect(() => { localStorage.setItem('auradent_appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('auradent_testimonials', JSON.stringify(testimonials)); }, [testimonials]);
  useEffect(() => { localStorage.setItem('auradent_gallery', JSON.stringify(gallery)); }, [gallery]);
  useEffect(() => { localStorage.setItem('auradent_messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('auradent_settings', JSON.stringify(settings)); }, [settings]);

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

  // CRUD Actions
  const addAppointment = (aptData: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    const newApt: Appointment = {
      ...aptData,
      id: 'apt-' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setAppointments(prev => [newApt, ...prev]);
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const addDoctor = (docData: Omit<Doctor, 'id' | 'rating' | 'reviewCount'>) => {
    const newDoc: Doctor = {
      ...docData,
      id: 'doc-' + Date.now(),
      rating: 5.0,
      reviewCount: 1
    };
    setDoctors(prev => [...prev, newDoc]);
  };

  const updateDoctor = (id: string, updated: Partial<Doctor>) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...updated } : d));
  };

  const deleteDoctor = (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
  };

  const addService = (servData: Omit<Service, 'id'>) => {
    const newServ: Service = {
      ...servData,
      id: 'serv-' + Date.now()
    };
    setServices(prev => [...prev, newServ]);
  };

  const updateService = (id: string, updated: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const addGalleryItem = (itemData: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = { ...itemData, id: 'gal-' + Date.now() };
    setGallery(prev => [newItem, ...prev]);
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
  };

  const addTestimonial = (itemData: Omit<Testimonial, 'id' | 'date'>) => {
    const newTest: Testimonial = {
      ...itemData,
      id: 'test-' + Date.now(),
      date: 'Just now'
    };
    setTestimonials(prev => [newTest, ...prev]);
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const addMessage = (msgData: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => {
    const newMsg: ContactMessage = {
      ...msgData,
      id: 'msg-' + Date.now(),
      createdAt: new Date().toISOString(),
      read: false
    };
    setMessages(prev => [newMsg, ...prev]);
  };

  const markMessageRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
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
        deleteAppointment,

        addDoctor,
        updateDoctor,
        deleteDoctor,

        addService,
        updateService,
        deleteService,

        addGalleryItem,
        deleteGalleryItem,

        addTestimonial,
        deleteTestimonial,

        addMessage,
        markMessageRead,
        deleteMessage,

        updateSettings
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
