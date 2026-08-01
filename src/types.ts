export type ThemeMode = 'light' | 'dark';

export interface Service {
  id: string;
  title: string;
  category: 'cosmetic' | 'orthodontics' | 'restorative' | 'surgical' | 'general';
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  priceRange: string;
  duration: string;
  benefits: string[];
  features: string[];
  popular?: boolean;
  image: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  experienceYears: number;
  education: string;
  bio: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  availableDays: string[];
  languages: string[];
  achievements: string[];
  socials?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  email: string;
  serviceId: string;
  serviceTitle: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface BeforeAfterItem {
  id: string;
  title: string;
  category: string;
  beforeImg: string;
  afterImg: string;
  description: string;
  duration: string;
  doctorName: string;
}

export interface Testimonial {
  id: string;
  patientName: string;
  patientTitle?: string;
  name?: string;
  quote?: string;
  avatar: string;
  rating: number;
  comment: string;
  treatment: string;
  date?: string;
  verified?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'interior' | 'technology' | 'smiles' | 'lounge';
  image: string;
  caption: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'booking' | 'insurance' | 'treatments';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface SiteSettings {
  clinicName: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  address: string;
  city: string;
  openingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  announcement: string;
}
