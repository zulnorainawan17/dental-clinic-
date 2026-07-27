import { Service, Doctor, BeforeAfterItem, Testimonial, GalleryItem, FAQItem, SiteSettings, Appointment, ContactMessage } from '../types';

export const INITIAL_SETTINGS: SiteSettings = {
  clinicName: 'AuraDent Luxury Dental Suite',
  phone: '+1 (800) 740-AURA',
  emergencyPhone: '+1 (800) 911-DENT',
  email: 'concierge@auradent.com',
  address: '740 Park Avenue, Medical Tower Suite 1200',
  city: 'New York, NY 10021',
  openingHours: {
    weekdays: '08:00 AM - 07:00 PM',
    saturday: '09:00 AM - 04:00 PM',
    sunday: 'By VIP Reservation Only'
  },
  announcement: '✨ Spring Smile Design Month: Complimentary 3D Digital Scan with Every Consultation'
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'cosmetic-veneers',
    title: 'Precision Porcelain Veneers',
    category: 'cosmetic',
    shortDesc: 'Ultra-thin handcrafted ceramic laminates for flawless smile geometry, shape, and brilliance.',
    fullDesc: 'Our Master Ceramicists sculpt bespoke porcelain veneers using 3D intraoral optical scanning. Each ultra-thin shell mimics the natural translucency, micro-texture, and light refraction of pristine natural enamel.',
    iconName: 'Sparkles',
    priceRange: '$1,200 - $2,500 / tooth',
    duration: '2 - 3 Visits',
    benefits: ['Stain-resistant porcelain', 'Custom shade calibration', 'Minimal enamel reduction', '15+ year durability'],
    features: ['AI Digital Smile Design Preview', 'Hand-finished Swiss Ceramic', 'Microscope-assisted prep', 'Complimentary touch-ups'],
    popular: true,
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'laser-whitening',
    title: 'Laser Diamond Whitening',
    category: 'cosmetic',
    shortDesc: 'Cold-laser tooth whitening system achieving up to 8 shades brighter in a single 45-minute luxury session.',
    fullDesc: 'Utilizing specialized cold diode lasers paired with bio-compatible hydrogen peroxide gel, our whitening suite removes deep intrinsic discoloration without sensitivity.',
    iconName: 'Sun',
    priceRange: '$650 - $900',
    duration: '45 Minutes',
    benefits: ['Up to 8 shades brighter', 'Zero enamel heat damage', 'Desensitizing mineral mask', 'Instant results'],
    features: ['Personalized shade gel matrix', 'Laser energy beam calibration', 'Take-home booster kit included'],
    popular: true,
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'swiss-implants',
    title: 'Swiss Bio-Titanium Implants',
    category: 'surgical',
    shortDesc: 'Permanent implant restorations using 3D CBCT guided surgical accuracy and Straumann titan alloy.',
    fullDesc: 'Restore lost teeth with lifelong durability. We utilize 3D computer-guided surgical templates to place Swiss titanium implant roots with sub-millimeter precision.',
    iconName: 'ShieldCheck',
    priceRange: '$2,800 - $4,500 / implant',
    duration: '3 - 6 Months',
    benefits: ['Restores 100% chewing force', 'Preserves facial bone structure', 'Feels identical to natural teeth', 'Lifetime warranty'],
    features: ['Guided 3D CBCT Surgical Scan', 'Custom Zirconia Abutment', 'Sedation Dentistry Option'],
    popular: true,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'invisalign-ortho',
    title: '3D Clear Orthodontics',
    category: 'orthodontics',
    shortDesc: 'Invisible, custom-molded aligners engineered with SmartTrack technology for effortless alignment.',
    fullDesc: 'Straighten your teeth discreetly without metal brackets. Using digital impression mapping, we craft a series of crystal-clear aligners that gently migrate teeth into optimal harmony.',
    iconName: 'AlignHorizontalCenter',
    priceRange: '$3,500 - $6,500',
    duration: '6 - 18 Months',
    benefits: ['Nearly invisible aesthetic', 'Removable for dining & brushing', 'Fewer clinic check-ups', 'Predictable AI outcome'],
    features: ['3D ClinCheck Treatment Simulation', 'Accelerated tooth movement option', 'Retention aligners included'],
    popular: true,
    image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'painless-rootcanal',
    title: 'Microscopic Endodontics',
    category: 'restorative',
    shortDesc: 'High-magnification root canal therapy designed to save natural teeth completely pain-free.',
    fullDesc: 'Using surgical operating microscopes with 25x magnification and 3D ultrasonic cleaning, we gently sterilize and seal infected root canals while preserving maximum tooth structure.',
    iconName: 'Zap',
    priceRange: '$1,100 - $1,800',
    duration: '1 - 2 Visits',
    benefits: ['Painless single-session procedure', 'Preserves original root foundation', 'Prevents extraction need', 'Fast recovery'],
    features: ['Zeiss Surgical Microscope optics', '3D Bioceramic root sealing', 'Relaxing Nitrous option'],
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'spa-hygiene',
    title: 'Guided Biofilm Dental Spa',
    category: 'general',
    shortDesc: 'Gentle air-flow polishing and ultrasonic bio-cleaning that revitalizes gums and leaves teeth silky polished.',
    fullDesc: 'Transform routine cleaning into a soothing spa experience. Our Swiss Airflow technology uses warm water and erythritol micro-powder to eliminate plaque and biofilm without scraping.',
    iconName: 'Droplets',
    priceRange: '$250 - $400',
    duration: '45 Minutes',
    benefits: ['Zero scraping pain', 'Safely cleans implant surfaces', 'Removes coffee & wine stains', 'Promotes healthy gums'],
    features: ['Warmed water temperature control', 'Enamel fluoride coating', 'Periodontal health report'],
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800'
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'dr-vance',
    name: 'Dr. Elena Vance, DDS',
    title: 'Founder & Chief Cosmetic Dentist',
    specialty: 'Aesthetic Smile Design & Porcelain Artistry',
    experienceYears: 16,
    education: 'Harvard School of Dental Medicine, Harvard University',
    bio: 'Dr. Elena Vance is a world-renowned pioneer in minimally invasive aesthetic dentistry. Having trained under master ceramicists in Geneva and Los Angeles, she merges clinical precision with artistic harmony.',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
    rating: 4.99,
    reviewCount: 420,
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    languages: ['English', 'French', 'German'],
    achievements: ['AACD Accredited Fellow', 'Top Cosmetic Surgeon NY 2024', 'Author of "The Geometry of Smiles"'],
    socials: { linkedin: '#', instagram: '#' }
  },
  {
    id: 'dr-thorne',
    name: 'Dr. Marcus Thorne, DMD, PhD',
    title: 'Director of Implantology & Oral Surgery',
    specialty: 'Swiss Bio-Implants & 3D Bone Reconstruction',
    experienceYears: 18,
    education: 'ETH Zürich & University of Pennsylvania Dental Medicine',
    bio: 'Dr. Thorne specializes in complex full-mouth implant rehabilitations and computer-guided bone grafting. He serves as an international lecturer for advanced Straumann implant systems.',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    rating: 4.98,
    reviewCount: 380,
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    languages: ['English', 'German', 'Italian'],
    achievements: ['Diplomate ICOI', 'Published 30+ Research Papers', 'Swiss Surgical Excellence Award'],
    socials: { linkedin: '#', twitter: '#' }
  },
  {
    id: 'dr-chen',
    name: 'Dr. Sophia Chen, DDS, MS',
    title: 'Senior Specialist in Clear Orthodontics',
    specialty: 'Digital Invisalign & Facial Symmetry Orthodontics',
    experienceYears: 12,
    education: 'Columbia University College of Dental Medicine',
    bio: 'Dr. Sophia Chen combines advanced 3D biomechanics with facial proportions modeling. Her holistic approach ensures aligner treatments enhance overall jaw profile and airway breathing.',
    avatar: 'https://images.unsplash.com/photo-1594824813566-7885a3977348?auto=format&fit=crop&q=80&w=600',
    rating: 4.97,
    reviewCount: 310,
    availableDays: ['Tuesday', 'Wednesday', 'Saturday'],
    languages: ['English', 'Mandarin'],
    achievements: ['Invisalign VIP Diamond Plus Provider', 'AAO Excellence Award', 'Columbia Faculty Lecturer'],
    socials: { instagram: '#' }
  },
  {
    id: 'dr-aris',
    name: 'Dr. Aris Vance, DDS',
    title: 'Microscopic Endodontist & Restorative Specialist',
    specialty: 'Surgical Root Preservation & Laser Care',
    experienceYears: 10,
    education: 'NYU College of Dentistry',
    bio: 'Dr. Aris specializes in microscopic endodontic procedures, preserving teeth that would otherwise require extraction through gentle, ultra-magnified laser endodontic protocols.',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600',
    rating: 4.96,
    reviewCount: 245,
    availableDays: ['Monday', 'Thursday', 'Friday', 'Saturday'],
    languages: ['English', 'Spanish'],
    achievements: ['AAE Certified Specialist', 'Microscope Surgery Innovations Award'],
    socials: { linkedin: '#' }
  }
];

export const INITIAL_BEFORE_AFTER: BeforeAfterItem[] = [
  {
    id: 'ba-1',
    title: 'Full Porcelain Smile Transformation',
    category: 'Veneers & Whitening',
    beforeImg: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
    afterImg: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
    description: '10 Handcrafted Swiss porcelain veneers combined with laser contouring for complete symmetry and luminosity.',
    duration: '2 Weeks (2 Sessions)',
    doctorName: 'Dr. Elena Vance'
  },
  {
    id: 'ba-2',
    title: '3D Clear Aligner Orthodontic Correction',
    category: 'Orthodontics',
    beforeImg: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800',
    afterImg: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
    description: 'Corrected severe crowded anterior bite using 14 months of custom SmartTrack clear aligners.',
    duration: '14 Months',
    doctorName: 'Dr. Sophia Chen'
  },
  {
    id: 'ba-3',
    title: 'Single-Day Bio-Titanium Implant Restoration',
    category: 'Implants',
    beforeImg: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
    afterImg: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80&w=800',
    description: 'Guided CBCT implant placement with immediate zirconia crown load following traumatic tooth loss.',
    duration: '1 Day Surgical Load',
    doctorName: 'Dr. Marcus Thorne'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    patientName: 'Victoria Sterling',
    patientTitle: 'Fashion Executive',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    comment: 'AuraDent is unlike any medical facility I have visited worldwide. The attention to detail, quiet luxury environment, and Dr. Vance’s porcelain artistry gave me complete confidence on camera.',
    treatment: 'Porcelain Veneers & Laser Whitening',
    date: '2 weeks ago',
    verified: true
  },
  {
    id: 'test-2',
    patientName: 'Alexander Hayes',
    patientTitle: 'Venture Capitalist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    comment: 'I was nervous about dental implants after an old sports injury. Dr. Thorne used 3D computer navigation and I felt zero pain. Truly world-class precision technology.',
    treatment: 'Swiss Bio-Titanium Implant',
    date: '1 month ago',
    verified: true
  },
  {
    id: 'test-3',
    patientName: 'Camille Laurent',
    patientTitle: 'Architect & Interior Designer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    comment: 'The interior architecture of the clinic itself calms your senses immediately. The Guided Biofilm hygiene spa left my teeth cleaner than ever before without any discomfort.',
    treatment: 'Guided Biofilm Dental Spa',
    date: '3 weeks ago',
    verified: true
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'VIP Consultation Suite',
    category: 'interior',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200',
    caption: 'Private serene consultation room fitted with 4K digital diagnostic displays.'
  },
  {
    id: 'gal-2',
    title: '3D CBCT Intraoral Scanner',
    category: 'technology',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200',
    caption: 'Sub-millimeter 3D optical surface scanner capturing 6,000 frames per second.'
  },
  {
    id: 'gal-3',
    title: 'Natural Smile Artistry',
    category: 'smiles',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200',
    caption: 'Bespoke hand-crafted Swiss ceramic veneers fitted with precision translucency.'
  },
  {
    id: 'gal-4',
    title: 'Aesthetic Recovery Lounge',
    category: 'lounge',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200',
    caption: 'Private soothing relaxation lounge featuring acoustic isolation and refreshment concierge.'
  }
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do Porcelain Veneers differ from standard dental crowns?',
    answer: 'Veneers are ultra-thin (0.2mm - 0.5mm) custom porcelain shells bonded only to the front surface of teeth, preserving almost all of your natural enamel structure. Crowns, by comparison, encase the entire tooth.',
    category: 'treatments'
  },
  {
    id: 'faq-2',
    question: 'Is the appointment booking process immediate and guaranteed?',
    answer: 'Yes! When you reserve via our VIP digital booking engine, our patient concierge team immediately reserves your doctor and dedicated surgical suite.',
    category: 'booking'
  },
  {
    id: 'faq-3',
    question: 'Do you offer dental sedation or painless options for anxious patients?',
    answer: 'Absolutely. We provide computer-assisted painless local anesthesia, micro-laser treatment options, nitrous oxide relaxation, and IV conscious sedation supervised by board-certified anesthesiologists.',
    category: 'general'
  },
  {
    id: 'faq-4',
    question: 'Do you accept international or out-of-network insurance reimbursement?',
    answer: 'We provide itemized ADA claim forms and concierge reimbursement filing for all major international private insurance plans.',
    category: 'insurance'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    patientName: 'Eleanor Vance',
    phone: '+1 (555) 234-5678',
    email: 'eleanor.vance@example.com',
    serviceId: 'cosmetic-veneers',
    serviceTitle: 'Precision Porcelain Veneers',
    doctorId: 'dr-vance',
    doctorName: 'Dr. Elena Vance, DDS',
    date: '2026-08-05',
    timeSlot: '10:00 AM',
    message: 'Interested in digital smile preview for upper 8 veneers.',
    status: 'confirmed',
    createdAt: '2026-07-26T14:30:00Z'
  },
  {
    id: 'apt-102',
    patientName: 'Harrison Forde',
    phone: '+1 (555) 987-6543',
    email: 'harrison.f@example.com',
    serviceId: 'swiss-implants',
    serviceTitle: 'Swiss Bio-Titanium Implants',
    doctorId: 'dr-thorne',
    doctorName: 'Dr. Marcus Thorne, DMD, PhD',
    date: '2026-08-06',
    timeSlot: '02:00 PM',
    message: 'Consultation for molar implant replacement.',
    status: 'pending',
    createdAt: '2026-07-27T09:15:00Z'
  }
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Sophia Martinez',
    email: 'sophia.m@example.com',
    phone: '+1 (555) 444-3322',
    subject: 'Emergency Weekend VIP Appointment Request',
    message: 'Hello, I chipped my front tooth while traveling and would like to reserve a VIP consultation with Dr. Vance.',
    createdAt: '2026-07-27T08:00:00Z',
    read: false
  }
];
