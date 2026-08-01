import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { GalleryItem, Doctor, Service, Appointment, Testimonial } from '../types';
import {
  X,
  Lock,
  Calendar,
  UserCheck,
  Layers,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  LogOut,
  Edit,
  ShieldCheck,
  Upload,
  Link as LinkIcon,
  RotateCcw,
  Download,
  FileUp,
  Sparkles,
  Check,
  Eye,
  Star,
  AlertTriangle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    closeAdmin,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    appointments,
    updateAppointmentStatus,
    updateAppointment,
    deleteAppointment,
    doctors,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    services,
    addService,
    updateService,
    deleteService,
    gallery,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    messages,
    markMessageRead,
    deleteMessage,
    settings,
    updateSettings,
    resetDataToDefaults
  } = useApp();

  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'appointments' | 'doctors' | 'services' | 'gallery' | 'testimonials' | 'messages' | 'settings'
  >('appointments');

  // ==========================================
  // DELETE CONFIRMATION MODAL STATE
  // ==========================================
  const [deleteModalItem, setDeleteModalItem] = useState<{
    type: 'gallery' | 'appointment' | 'doctor' | 'service' | 'testimonial' | 'message';
    id: string;
    title: string;
  } | null>(null);

  // ==========================================
  // GALLERY EDIT / ADD STATES & FILE HANDLERS
  // ==========================================
  const [showAddGallery, setShowAddGallery] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [galTitle, setGalTitle] = useState('');
  const [galCategory, setGalCategory] = useState<'interior' | 'technology' | 'smiles' | 'lounge'>('interior');
  const [galCaption, setGalCaption] = useState('');
  const [galImage, setGalImage] = useState('');
  const [galInputMethod, setGalInputMethod] = useState<'url' | 'file'>('url');

  // ==========================================
  // DOCTOR EDIT / ADD STATES
  // ==========================================
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [docName, setDocName] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('');
  const [docEducation, setDocEducation] = useState('');
  const [docBio, setDocBio] = useState('');
  const [docAvatar, setDocAvatar] = useState('');

  // ==========================================
  // SERVICE EDIT / ADD STATES
  // ==========================================
  const [showAddService, setShowAddService] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [servTitle, setServTitle] = useState('');
  const [servCategory, setServCategory] = useState<'cosmetic' | 'orthodontics' | 'restorative' | 'surgical' | 'general'>('cosmetic');
  const [servShortDesc, setServShortDesc] = useState('');
  const [servPriceRange, setServPriceRange] = useState('');
  const [servDuration, setServDuration] = useState('');
  const [servImg, setServImg] = useState('');

  // ==========================================
  // APPOINTMENT EDIT STATE
  // ==========================================
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  const [aptPatientName, setAptPatientName] = useState('');
  const [aptPhone, setAptPhone] = useState('');
  const [aptDate, setAptDate] = useState('');
  const [aptTimeSlot, setAptTimeSlot] = useState('');
  const [aptStatus, setAptStatus] = useState<Appointment['status']>('pending');

  // ==========================================
  // TESTIMONIAL EDIT / ADD STATES
  // ==========================================
  const [showAddTestimonial, setShowAddTestimonial] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testName, setTestName] = useState('');
  const [testTreatment, setTestTreatment] = useState('');
  const [testQuote, setTestQuote] = useState('');
  const [testRating, setTestRating] = useState(5);
  const [testAvatar, setTestAvatar] = useState('');

  if (!isAdminOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passwordInput);
    if (!success) setAuthError(true);
    else setAuthError(false);
  };

  // Helper for FileReader convert image file -> base64 Data URL
  const processImageFile = (file: File, callback: (dataUrl: string) => void) => {
    if (file.size > 8 * 1024 * 1024) {
      alert('Selected file exceeds 8MB. Please upload a smaller image.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        callback(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // ==========================================
  // GALLERY SUBMISSION HANDLERS
  // ==========================================
  const openNewGalleryForm = () => {
    setEditingGallery(null);
    setGalTitle('');
    setGalCategory('interior');
    setGalCaption('');
    setGalImage('https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800');
    setShowAddGallery(true);
  };

  const openEditGalleryForm = (item: GalleryItem) => {
    setShowAddGallery(false);
    setEditingGallery(item);
    setGalTitle(item.title);
    setGalCategory(item.category);
    setGalCaption(item.caption);
    setGalImage(item.image);
  };

  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galTitle || !galImage) return;

    if (editingGallery) {
      updateGalleryItem(editingGallery.id, {
        title: galTitle,
        category: galCategory,
        caption: galCaption,
        image: galImage
      });
      setEditingGallery(null);
    } else {
      addGalleryItem({
        title: galTitle,
        category: galCategory,
        caption: galCaption || 'Clinic amenity and high-precision environment.',
        image: galImage
      });
      setShowAddGallery(false);
    }
  };

  // ==========================================
  // DOCTOR SUBMISSION HANDLERS
  // ==========================================
  const openNewDoctorForm = () => {
    setEditingDoctor(null);
    setDocName('');
    setDocTitle('');
    setDocSpecialty('Cosmetic Dentistry');
    setDocEducation('Doctor of Dental Surgery (DDS)');
    setDocBio('Experienced specialist dedicated to aesthetic excellence.');
    setDocAvatar('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600');
    setShowAddDoctor(true);
  };

  const openEditDoctorForm = (doc: Doctor) => {
    setShowAddDoctor(false);
    setEditingDoctor(doc);
    setDocName(doc.name);
    setDocTitle(doc.title);
    setDocSpecialty(doc.specialty);
    setDocEducation(doc.education);
    setDocBio(doc.bio);
    setDocAvatar(doc.avatar);
  };

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !docTitle) return;

    if (editingDoctor) {
      updateDoctor(editingDoctor.id, {
        name: docName,
        title: docTitle,
        specialty: docSpecialty,
        education: docEducation,
        bio: docBio,
        avatar: docAvatar
      });
      setEditingDoctor(null);
    } else {
      addDoctor({
        name: docName,
        title: docTitle,
        specialty: docSpecialty,
        experienceYears: 10,
        education: docEducation,
        bio: docBio,
        avatar: docAvatar,
        availableDays: ['Mon', 'Wed', 'Fri'],
        languages: ['English'],
        achievements: ['Certified Dental Surgeon']
      });
      setShowAddDoctor(false);
    }
  };

  // ==========================================
  // SERVICE SUBMISSION HANDLERS
  // ==========================================
  const openNewServiceForm = () => {
    setEditingService(null);
    setServTitle('');
    setServCategory('cosmetic');
    setServShortDesc('');
    setServPriceRange('$500 - $1,500');
    setServDuration('1 Visit');
    setServImg('https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800');
    setShowAddService(true);
  };

  const openEditServiceForm = (serv: Service) => {
    setShowAddService(false);
    setEditingService(serv);
    setServTitle(serv.title);
    setServCategory(serv.category);
    setServShortDesc(serv.shortDesc);
    setServPriceRange(serv.priceRange);
    setServDuration(serv.duration);
    setServImg(serv.image);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!servTitle) return;

    if (editingService) {
      updateService(editingService.id, {
        title: servTitle,
        category: servCategory,
        shortDesc: servShortDesc,
        priceRange: servPriceRange,
        duration: servDuration,
        image: servImg
      });
      setEditingService(null);
    } else {
      addService({
        title: servTitle,
        category: servCategory,
        shortDesc: servShortDesc || 'Advanced luxury dental care procedure.',
        fullDesc: servShortDesc || 'Advanced luxury dental care procedure provided in our modern suite.',
        iconName: 'Sparkles',
        priceRange: servPriceRange,
        duration: servDuration,
        benefits: ['High durability', 'Natural aesthetics', 'Guaranteed comfort'],
        features: ['3D Imaging included'],
        image: servImg
      });
      setShowAddService(false);
    }
  };

  // ==========================================
  // APPOINTMENT SUBMISSION HANDLERS
  // ==========================================
  const openEditAptForm = (apt: Appointment) => {
    setEditingApt(apt);
    setAptPatientName(apt.patientName);
    setAptPhone(apt.phone);
    setAptDate(apt.date);
    setAptTimeSlot(apt.timeSlot);
    setAptStatus(apt.status);
  };

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApt) return;

    updateAppointment(editingApt.id, {
      patientName: aptPatientName,
      phone: aptPhone,
      date: aptDate,
      timeSlot: aptTimeSlot,
      status: aptStatus
    });
    setEditingApt(null);
  };

  // ==========================================
  // TESTIMONIAL HANDLERS
  // ==========================================
  const openNewTestimonialForm = () => {
    setEditingTestimonial(null);
    setTestName('');
    setTestTreatment('Full Mouth Smile Makeover');
    setTestQuote('');
    setTestRating(5);
    setTestAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400');
    setShowAddTestimonial(true);
  };

  const openEditTestimonialForm = (t: Testimonial) => {
    setEditingTestimonial(t);
    setTestName(t.patientName || t.name || '');
    setTestTreatment(t.treatment || '');
    setTestQuote(t.comment || t.quote || '');
    setTestRating(t.rating);
    setTestAvatar(t.avatar);
    setShowAddTestimonial(false);
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTestimonial) {
      updateTestimonial(editingTestimonial.id, {
        patientName: testName,
        name: testName,
        patientTitle: 'Verified Patient',
        treatment: testTreatment,
        comment: testQuote,
        quote: testQuote,
        rating: testRating,
        avatar: testAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        verified: true,
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      });
      setEditingTestimonial(null);
    } else {
      addTestimonial({
        patientName: testName,
        name: testName,
        patientTitle: 'Verified Patient',
        treatment: testTreatment,
        comment: testQuote,
        quote: testQuote,
        rating: testRating,
        avatar: testAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        verified: true,
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      });
      setShowAddTestimonial(false);
    }
  };

  // ==========================================
  // CONFIRM DELETE HANDLER FOR ALL TYPES
  // ==========================================
  const handleConfirmDelete = () => {
    if (!deleteModalItem) return;
    const { type, id } = deleteModalItem;
    if (type === 'gallery') deleteGalleryItem(id);
    else if (type === 'appointment') deleteAppointment(id);
    else if (type === 'doctor') deleteDoctor(id);
    else if (type === 'service') deleteService(id);
    else if (type === 'testimonial') deleteTestimonial(id);
    else if (type === 'message') deleteMessage(id);
    setDeleteModalItem(null);
  };

  // ==========================================
  // DATABASE BACKUP & RESTORE
  // ==========================================
  const handleExportJSON = () => {
    const data = {
      services: JSON.parse(localStorage.getItem('auradent_services') || '[]'),
      doctors: JSON.parse(localStorage.getItem('auradent_doctors') || '[]'),
      appointments: JSON.parse(localStorage.getItem('auradent_appointments') || '[]'),
      testimonials: JSON.parse(localStorage.getItem('auradent_testimonials') || '[]'),
      gallery: JSON.parse(localStorage.getItem('auradent_gallery') || '[]'),
      messages: JSON.parse(localStorage.getItem('auradent_messages') || '[]'),
      settings: JSON.parse(localStorage.getItem('auradent_settings') || '{}')
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auradent_database_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-6xl glass-panel rounded-[36px] shadow-2xl overflow-hidden my-4 min-h-[620px] flex flex-col border border-white/60 dark:border-slate-800"
        >
          {/* Header Bar */}
          <div className="p-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">AuraDent Executive Management Console</h2>
                <p className="text-xs text-slate-400 font-mono">Full CRUD & Real-time Database Operations</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAdminAuthenticated && (
                <button
                  onClick={logoutAdmin}
                  className="px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Lock Admin</span>
                </button>
              )}

              <button
                onClick={closeAdmin}
                className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Authentication Screen */}
          {!isAdminAuthenticated ? (
            <div className="p-12 my-auto max-w-md mx-auto text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Admin Authentication</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enter administrative credentials to manage gallery, appointments, doctors, and clinic settings.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    placeholder="Enter admin password (e.g. admin123)"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-center font-mono text-slate-900 dark:text-white text-sm focus:outline-none focus:border-sky-500"
                  />
                  {authError && (
                    <p className="text-xs text-rose-500 font-mono mt-2">Invalid passcode. Try "admin123" or "auradent".</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs tracking-wider uppercase shadow-lg shadow-sky-500/25 transition-colors"
                >
                  Authorize Console Access
                </button>
              </form>
            </div>
          ) : (
            /* Dashboard Portal */
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Sidebar Navigation */}
              <div className="w-full lg:w-64 bg-slate-50/80 dark:bg-slate-950/60 p-4 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 space-y-2 flex-shrink-0">
                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`w-full p-3 rounded-2xl text-left text-xs font-bold flex items-center justify-between transition-all ${
                    activeTab === 'gallery'
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ImageIcon className="w-4 h-4" />
                    <span>Gallery Photos</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-white/20 text-white font-mono">{gallery.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`w-full p-3 rounded-2xl text-left text-xs font-bold flex items-center justify-between transition-all ${
                    activeTab === 'appointments'
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4" />
                    <span>Appointments</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono">{appointments.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab('doctors')}
                  className={`w-full p-3 rounded-2xl text-left text-xs font-bold flex items-center justify-between transition-all ${
                    activeTab === 'doctors'
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <UserCheck className="w-4 h-4" />
                    <span>Doctors Roster</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono">{doctors.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab('services')}
                  className={`w-full p-3 rounded-2xl text-left text-xs font-bold flex items-center justify-between transition-all ${
                    activeTab === 'services'
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4" />
                    <span>Services Catalog</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono">{services.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab('testimonials')}
                  className={`w-full p-3 rounded-2xl text-left text-xs font-bold flex items-center justify-between transition-all ${
                    activeTab === 'testimonials'
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span>Patient Reviews</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono">{testimonials.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab('messages')}
                  className={`w-full p-3 rounded-2xl text-left text-xs font-bold flex items-center justify-between transition-all ${
                    activeTab === 'messages'
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>Inbound Messages</span>
                  </div>
                  {messages.filter(m => !m.read).length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full p-3 rounded-2xl text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
                    activeTab === 'settings'
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Database & Settings</span>
                </button>
              </div>

              {/* Main Content Pane */}
              <div className="flex-1 p-6 overflow-y-auto max-h-[72vh]">
                {/* ========================================== */}
                {/* GALLERY TAB WITH IMAGE CHANGE (FILE / URL) */}
                {/* ========================================== */}
                {activeTab === 'gallery' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          Gallery Photo Management
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Upload new pictures via PNG/JPEG file upload or URL, edit captions, and manage clinic visuals.
                        </p>
                      </div>

                      <button
                        onClick={openNewGalleryForm}
                        className="px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/25"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Gallery Photo</span>
                      </button>
                    </div>

                    {/* Add / Edit Form Modal Box */}
                    {(showAddGallery || editingGallery) && (
                      <form onSubmit={handleSaveGallery} className="p-6 rounded-[28px] glass-panel border border-sky-400/30 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between border-b border-white/60 dark:border-slate-800 pb-3">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-sky-500" />
                            {editingGallery ? 'Edit & Change Gallery Picture' : 'Upload New Gallery Picture'}
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddGallery(false);
                              setEditingGallery(null);
                            }}
                            className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Photo Title</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. VIP Surgical Suite"
                              value={galTitle}
                              onChange={(e) => setGalTitle(e.target.value)}
                              className="w-full p-3 rounded-2xl border bg-white dark:bg-slate-900 text-xs font-semibold"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
                            <select
                              value={galCategory}
                              onChange={(e) => setGalCategory(e.target.value as any)}
                              className="w-full p-3 rounded-2xl border bg-white dark:bg-slate-900 text-xs font-semibold"
                            >
                              <option value="interior">Clinic Interior & Amenities</option>
                              <option value="technology">3D Dental Technology</option>
                              <option value="smiles">Smile Transformations</option>
                              <option value="lounge">VIP Patient Lounge</option>
                            </select>
                          </div>
                        </div>

                        {/* Image Upload / URL Selector Options */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              Picture Source (Change via PNG, JPEG File or URL)
                            </label>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setGalInputMethod('file')}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors ${
                                  galInputMethod === 'file' ? 'bg-sky-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                                }`}
                              >
                                <Upload className="w-3 h-3" /> PNG / JPEG File
                              </button>
                              <button
                                type="button"
                                onClick={() => setGalInputMethod('url')}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors ${
                                  galInputMethod === 'url' ? 'bg-sky-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                                }`}
                              >
                                <LinkIcon className="w-3 h-3" /> Image URL
                              </button>
                            </div>
                          </div>

                          {galInputMethod === 'file' ? (
                            <div className="p-4 rounded-2xl border-2 border-dashed border-sky-400/50 bg-sky-50/50 dark:bg-sky-950/20 text-center space-y-2">
                              <Upload className="w-6 h-6 text-sky-500 mx-auto" />
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                Click or drag PNG, JPEG, or WebP image to upload
                              </p>
                              <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) processImageFile(file, (dataUrl) => setGalImage(dataUrl));
                                }}
                                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sky-500 file:text-white hover:file:bg-sky-600 cursor-pointer"
                              />
                            </div>
                          ) : (
                            <input
                              type="url"
                              placeholder="https://images.unsplash.com/..."
                              value={galImage}
                              onChange={(e) => setGalImage(e.target.value)}
                              className="w-full p-3 rounded-2xl border bg-white dark:bg-slate-900 text-xs font-semibold"
                            />
                          )}

                          {/* Live Image Preview Thumbnail */}
                          {galImage && (
                            <div className="flex items-center gap-3 pt-2">
                              <img
                                src={galImage}
                                alt="Preview"
                                className="w-20 h-20 rounded-2xl object-cover border-2 border-sky-500 shadow-md"
                              />
                              <div className="text-xs">
                                <span className="font-bold text-emerald-500 flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" /> Image Selected & Ready
                                </span>
                                <p className="text-[11px] text-slate-500 truncate max-w-xs">{galImage.slice(0, 45)}...</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Caption / Description</label>
                          <input
                            type="text"
                            placeholder="Brief detail about this photo"
                            value={galCaption}
                            onChange={(e) => setGalCaption(e.target.value)}
                            className="w-full p-3 rounded-2xl border bg-white dark:bg-slate-900 text-xs"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddGallery(false);
                              setEditingGallery(null);
                            }}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-500 text-white shadow-lg shadow-sky-500/25 hover:bg-sky-600"
                          >
                            {editingGallery ? 'Update Picture' : 'Save Photo to Gallery'}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Gallery Items Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {gallery.map((g) => (
                        <div
                          key={g.id}
                          className="relative group glass-panel rounded-3xl overflow-hidden shadow-md flex flex-col justify-between"
                        >
                          <div className="relative h-44 overflow-hidden">
                            <img
                              src={g.image}
                              alt={g.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-3 left-3 bg-slate-950/80 text-white text-[10px] font-mono px-2.5 py-1 rounded-full uppercase tracking-wider">
                              {g.category}
                            </div>

                            {/* Action Buttons Overlay */}
                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                              <button
                                onClick={() => openEditGalleryForm(g)}
                                className="p-2 rounded-full bg-sky-500 hover:bg-sky-600 text-white shadow-md transition-transform active:scale-90"
                                title="Change Photo or Edit Info"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteModalItem({ type: 'gallery', id: g.id, title: g.title })}
                                className="p-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-md transition-transform active:scale-90"
                                title="Delete Photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="p-4 space-y-1">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{g.title}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{g.caption}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ========================================== */}
                {/* APPOINTMENTS TAB WITH FULL EDIT & ACTIONS */}
                {/* ========================================== */}
                {activeTab === 'appointments' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          Patient Appointments Log
                        </h3>
                        <p className="text-xs text-slate-500">Manage statuses, update times, and filter reservations.</p>
                      </div>
                      <span className="text-xs font-mono bg-sky-500/10 text-sky-500 px-3 py-1 rounded-full font-bold">
                        {appointments.length} Total Appointments
                      </span>
                    </div>

                    {/* Edit Appointment Form */}
                    {editingApt && (
                      <form onSubmit={handleSaveAppointment} className="p-5 rounded-3xl glass-panel border border-sky-500/40 space-y-3">
                        <h4 className="text-sm font-bold flex items-center justify-between">
                          <span>Modify Reservation for {editingApt.patientName}</span>
                          <button type="button" onClick={() => setEditingApt(null)} className="text-slate-400"><X className="w-4 h-4" /></button>
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={aptPatientName}
                            onChange={(e) => setAptPatientName(e.target.value)}
                            className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs font-semibold"
                            placeholder="Patient Name"
                          />
                          <input
                            type="text"
                            value={aptPhone}
                            onChange={(e) => setAptPhone(e.target.value)}
                            className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs font-semibold"
                            placeholder="Phone Number"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="date"
                            value={aptDate}
                            onChange={(e) => setAptDate(e.target.value)}
                            className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs font-semibold"
                          />
                          <input
                            type="text"
                            value={aptTimeSlot}
                            onChange={(e) => setAptTimeSlot(e.target.value)}
                            className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs font-semibold"
                            placeholder="Time Slot"
                          />
                          <select
                            value={aptStatus}
                            onChange={(e) => setAptStatus(e.target.value as any)}
                            className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs font-semibold"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                        <button type="submit" className="px-4 py-2 bg-sky-500 text-white rounded-xl text-xs font-bold">
                          Save Appointment Changes
                        </button>
                      </form>
                    )}

                    <div className="space-y-3">
                      {appointments.length === 0 ? (
                        <p className="text-sm text-slate-500">No appointments recorded.</p>
                      ) : (
                        appointments.map((apt) => (
                          <div
                            key={apt.id}
                            className="p-4 rounded-3xl glass-panel border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-slate-900 dark:text-white">{apt.patientName}</span>
                                <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold ${
                                  apt.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-500' :
                                  apt.status === 'pending' ? 'bg-amber-500/20 text-amber-500' :
                                  apt.status === 'completed' ? 'bg-sky-500/20 text-sky-500' : 'bg-rose-500/20 text-rose-500'
                                }`}>
                                  {apt.status}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {apt.serviceTitle} • Attending Specialist: <strong className="text-sky-500">{apt.doctorName}</strong>
                              </p>
                              <p className="text-xs font-mono text-slate-500">
                                Date: <strong className="text-slate-800 dark:text-slate-200">{apt.date}</strong> at <strong className="text-slate-800 dark:text-slate-200">{apt.timeSlot}</strong> | Phone: {apt.phone}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditAptForm(apt)}
                                className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-sky-500 hover:text-white text-xs transition-colors"
                                title="Edit Reservation"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              {apt.status !== 'confirmed' && (
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white text-xs font-bold transition-colors"
                                >
                                  Confirm
                                </button>
                              )}
                              <button
                                onClick={() => setDeleteModalItem({ type: 'appointment', id: apt.id, title: `Appointment for ${apt.patientName}` })}
                                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* ========================================== */}
                {/* DOCTORS TAB WITH AVATAR FILE UPLOAD / EDIT */}
                {/* ========================================== */}
                {activeTab === 'doctors' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Doctor Roster CRUD</h3>
                        <p className="text-xs text-slate-500">Add, edit bios, or change specialist profile pictures.</p>
                      </div>

                      <button
                        onClick={openNewDoctorForm}
                        className="px-4 py-2.5 rounded-2xl bg-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/25"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Doctor</span>
                      </button>
                    </div>

                    {(showAddDoctor || editingDoctor) && (
                      <form onSubmit={handleSaveDoctor} className="p-6 rounded-3xl glass-panel border border-sky-400/30 space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                          <h4 className="text-sm font-bold">{editingDoctor ? 'Edit Doctor Details' : 'Register Specialist Doctor'}</h4>
                          <button type="button" onClick={() => { setShowAddDoctor(false); setEditingDoctor(null); }} className="text-slate-400"><X className="w-4 h-4" /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Full Name (e.g. Dr. Jane Doe)"
                            required
                            value={docName}
                            onChange={(e) => setDocName(e.target.value)}
                            className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs font-semibold"
                          />
                          <input
                            type="text"
                            placeholder="Title (e.g. Chief Cosmetic Surgeon)"
                            required
                            value={docTitle}
                            onChange={(e) => setDocTitle(e.target.value)}
                            className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs font-semibold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Specialty"
                            value={docSpecialty}
                            onChange={(e) => setDocSpecialty(e.target.value)}
                            className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Alma Mater / Education"
                            value={docEducation}
                            onChange={(e) => setDocEducation(e.target.value)}
                            className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs"
                          />
                        </div>

                        {/* Avatar Image Input (File / URL) */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold">Profile Photo (Upload PNG/JPEG or enter URL)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Avatar Image URL"
                              value={docAvatar}
                              onChange={(e) => setDocAvatar(e.target.value)}
                              className="flex-1 p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs"
                            />
                            <label className="px-3 py-2 bg-slate-200 dark:bg-slate-800 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1">
                              <Upload className="w-3.5 h-3.5" /> File
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) processImageFile(f, setDocAvatar);
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => { setShowAddDoctor(false); setEditingDoctor(null); }} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800">Cancel</button>
                          <button type="submit" className="px-5 py-2 bg-sky-500 text-white rounded-xl text-xs font-bold">Save Doctor</button>
                        </div>
                      </form>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {doctors.map((d) => (
                        <div key={d.id} className="p-4 rounded-3xl glass-panel border flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img src={d.avatar} alt={d.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-sky-500/40" />
                            <div>
                              <p className="font-bold text-sm text-slate-900 dark:text-white">{d.name}</p>
                              <p className="text-xs text-sky-500 font-semibold">{d.title}</p>
                              <p className="text-[11px] text-slate-500">{d.specialty}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button onClick={() => openEditDoctorForm(d)} className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-sky-500 hover:text-white text-xs transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteModalItem({ type: 'doctor', id: d.id, title: d.name })} className="p-2 rounded-xl text-slate-400 hover:text-rose-500 transition-colors" title="Delete Doctor">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ========================================== */}
                {/* SERVICES TAB WITH IMAGE FILE UPLOAD / EDIT */}
                {/* ========================================== */}
                {activeTab === 'services' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Services & Treatments</h3>
                        <p className="text-xs text-slate-500">Manage treatment offerings, prices, and cover photos.</p>
                      </div>

                      <button
                        onClick={openNewServiceForm}
                        className="px-4 py-2.5 rounded-2xl bg-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/25"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Service</span>
                      </button>
                    </div>

                    {(showAddService || editingService) && (
                      <form onSubmit={handleSaveService} className="p-6 rounded-3xl glass-panel border border-sky-400/30 space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                          <h4 className="text-sm font-bold">{editingService ? 'Edit Service' : 'Add New Service'}</h4>
                          <button type="button" onClick={() => { setShowAddService(false); setEditingService(null); }} className="text-slate-400"><X className="w-4 h-4" /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Treatment Title"
                            required
                            value={servTitle}
                            onChange={(e) => setServTitle(e.target.value)}
                            className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs font-semibold"
                          />
                          <select
                            value={servCategory}
                            onChange={(e) => setServCategory(e.target.value as any)}
                            className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs font-semibold"
                          >
                            <option value="cosmetic">Cosmetic</option>
                            <option value="orthodontics">Orthodontics</option>
                            <option value="restorative">Restorative</option>
                            <option value="surgical">Surgical</option>
                            <option value="general">General Dentistry</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Price Range (e.g. $800 - $1,500)"
                            value={servPriceRange}
                            onChange={(e) => setServPriceRange(e.target.value)}
                            className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Duration (e.g. 1 Visit)"
                            value={servDuration}
                            onChange={(e) => setServDuration(e.target.value)}
                            className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold">Cover Photo (URL or File Upload)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Image URL"
                              value={servImg}
                              onChange={(e) => setServImg(e.target.value)}
                              className="flex-1 p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs"
                            />
                            <label className="px-3 py-2 bg-slate-200 dark:bg-slate-800 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1">
                              <Upload className="w-3.5 h-3.5" /> File
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) processImageFile(f, setServImg);
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => { setShowAddService(false); setEditingService(null); }} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-xl text-xs font-bold">Cancel</button>
                          <button type="submit" className="px-5 py-2 bg-sky-500 text-white rounded-xl text-xs font-bold">Save Treatment</button>
                        </div>
                      </form>
                    )}

                    <div className="space-y-3">
                      {services.map((s) => (
                        <div key={s.id} className="p-4 rounded-3xl glass-panel border flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <img src={s.image} alt={s.title} className="w-16 h-12 rounded-xl object-cover border" />
                            <div>
                              <p className="font-bold text-sm text-slate-900 dark:text-white">{s.title}</p>
                              <p className="text-xs text-slate-500">{s.priceRange} • {s.duration} • <span className="uppercase font-mono text-[10px] text-sky-500">{s.category}</span></p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button onClick={() => openEditServiceForm(s)} className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-sky-500 hover:text-white transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteModalItem({ type: 'service', id: s.id, title: s.title })} className="p-2 text-slate-400 hover:text-rose-500 transition-colors" title="Delete Service">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ========================================== */}
                {/* PATIENT TESTIMONIALS / REVIEWS TAB */}
                {/* ========================================== */}
                {activeTab === 'testimonials' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Patient Reviews & Testimonials</h3>
                        <p className="text-xs text-slate-500">Manage patient reviews, star ratings, and treatment tags.</p>
                      </div>

                      <button
                        onClick={openNewTestimonialForm}
                        className="px-4 py-2.5 rounded-2xl bg-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/25"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Review</span>
                      </button>
                    </div>

                    {(showAddTestimonial || editingTestimonial) && (
                      <form onSubmit={handleSaveTestimonial} className="p-6 rounded-3xl glass-panel border border-sky-400/30 space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                          <h4 className="text-sm font-bold">{editingTestimonial ? 'Edit Patient Review' : 'Create Patient Testimonial'}</h4>
                          <button type="button" onClick={() => { setShowAddTestimonial(false); setEditingTestimonial(null); }} className="text-slate-400"><X className="w-4 h-4" /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Patient Name"
                            required
                            value={testName}
                            onChange={(e) => setTestName(e.target.value)}
                            className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs font-semibold"
                          />
                          <input
                            type="text"
                            placeholder="Treatment / Procedure"
                            value={testTreatment}
                            onChange={(e) => setTestTreatment(e.target.value)}
                            className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs font-semibold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-500">Rating (1 to 5 Stars)</label>
                            <select
                              value={testRating}
                              onChange={(e) => setTestRating(Number(e.target.value))}
                              className="w-full p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs font-semibold"
                            >
                              <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
                              <option value={4}>4 Stars ⭐⭐⭐⭐</option>
                              <option value={3}>3 Stars ⭐⭐⭐</option>
                              <option value={2}>2 Stars ⭐⭐</option>
                              <option value={1}>1 Star ⭐</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-500">Avatar Image (File or URL)</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Avatar URL"
                                value={testAvatar}
                                onChange={(e) => setTestAvatar(e.target.value)}
                                className="flex-1 p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs"
                              />
                              <label className="px-3 py-2 bg-slate-200 dark:bg-slate-800 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1">
                                <Upload className="w-3.5 h-3.5" /> File
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) processImageFile(f, setTestAvatar);
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500">Patient Quote / Review Text</label>
                          <textarea
                            rows={3}
                            required
                            placeholder="Enter the patient review quote..."
                            value={testQuote}
                            onChange={(e) => setTestQuote(e.target.value)}
                            className="w-full p-3 rounded-2xl border bg-white dark:bg-slate-900 text-xs"
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => { setShowAddTestimonial(false); setEditingTestimonial(null); }} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-xl text-xs font-bold">Cancel</button>
                          <button type="submit" className="px-5 py-2 bg-sky-500 text-white rounded-xl text-xs font-bold">Save Review</button>
                        </div>
                      </form>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {testimonials.map((t) => (
                        <div key={t.id} className="p-4 rounded-3xl glass-panel border flex flex-col justify-between space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img src={t.avatar} alt={t.patientName || t.name} className="w-10 h-10 rounded-full object-cover border-2 border-amber-400" />
                              <div>
                                <h4 className="font-bold text-xs text-slate-900 dark:text-white">{t.patientName || t.name}</h4>
                                <span className="text-[10px] text-sky-500 font-medium">{t.treatment}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              {Array.from({ length: t.rating }).map((_, idx) => (
                                <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-slate-100/60 dark:bg-slate-900/40 p-3 rounded-2xl">
                            "{t.comment || t.quote}"
                          </p>

                          <div className="flex justify-end items-center gap-1.5 pt-1 border-t border-slate-200 dark:border-slate-800">
                            <button onClick={() => openEditTestimonialForm(t)} className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-sky-500 hover:text-white transition-colors" title="Edit Review">
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setDeleteModalItem({ type: 'testimonial', id: t.id, title: `Review by ${t.patientName || t.name}` })} className="p-2 rounded-xl text-slate-400 hover:text-rose-500 transition-colors" title="Delete Review">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ========================================== */}
                {/* MESSAGES TAB */}
                {/* ========================================== */}
                {activeTab === 'messages' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Inbound Patient Inquiries</h3>
                    <div className="space-y-3">
                      {messages.map((m) => (
                        <div key={m.id} className="p-4 rounded-3xl glass-panel border space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">{m.name} ({m.email} | {m.phone})</span>
                            <button onClick={() => setDeleteModalItem({ type: 'message', id: m.id, title: `Message from ${m.name}` })} className="text-slate-400 hover:text-rose-500 transition-colors" title="Delete Message">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-sky-500 font-semibold">{m.subject}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-slate-900/40 p-3 rounded-2xl">{m.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ========================================== */}
                {/* DATABASE BACKUP & SETTINGS TAB */}
                {/* ========================================== */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Clinic Settings & Database Management</h3>

                    <div className="space-y-4 p-6 glass-panel rounded-3xl">
                      <h4 className="text-sm font-bold text-sky-500 uppercase tracking-wider">Clinic Metadata</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Clinic Name</label>
                          <input
                            type="text"
                            value={settings.clinicName}
                            onChange={(e) => updateSettings({ clinicName: e.target.value })}
                            className="w-full p-3 rounded-2xl border bg-white dark:bg-slate-900 text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone</label>
                          <input
                            type="text"
                            value={settings.phone}
                            onChange={(e) => updateSettings({ phone: e.target.value })}
                            className="w-full p-3 rounded-2xl border bg-white dark:bg-slate-900 text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Address</label>
                          <input
                            type="text"
                            value={settings.address}
                            onChange={(e) => updateSettings({ address: e.target.value })}
                            className="w-full p-3 rounded-2xl border bg-white dark:bg-slate-900 text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email</label>
                          <input
                            type="text"
                            value={settings.email}
                            onChange={(e) => updateSettings({ email: e.target.value })}
                            className="w-full p-3 rounded-2xl border bg-white dark:bg-slate-900 text-xs font-semibold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Database Controls */}
                    <div className="p-6 glass-panel rounded-3xl space-y-4">
                      <h4 className="text-sm font-bold text-sky-500 uppercase tracking-wider">Database Operations & Persistence</h4>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={handleExportJSON}
                          className="px-4 py-2.5 rounded-2xl bg-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-md hover:bg-sky-600"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export Backup JSON</span>
                        </button>

                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to reset all database records to initial defaults?')) {
                              resetDataToDefaults();
                              alert('Database successfully reset to initial defaults.');
                            }
                          }}
                          className="px-4 py-2.5 rounded-2xl bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-md hover:bg-rose-600"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Reset Database to Defaults</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-slate-900 text-white p-6 rounded-3xl border border-rose-500/30 shadow-2xl max-w-md w-full space-y-4"
          >
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Confirm Record Deletion</h3>
                <p className="text-[10px] text-rose-400 font-mono uppercase tracking-wider">Permanent Firestore Action</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800">
              Are you sure you want to delete <strong className="text-white">"{deleteModalItem.title}"</strong>? This item will be permanently deleted from Firebase Firestore.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteModalItem(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-xs font-bold text-white shadow-lg shadow-rose-500/30 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete Record</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
