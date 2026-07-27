import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import {
  X,
  Lock,
  Calendar,
  UserCheck,
  Layers,
  Image,
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
  TrendingUp,
  DollarSign
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
    deleteAppointment,
    doctors,
    addDoctor,
    deleteDoctor,
    services,
    addService,
    deleteService,
    gallery,
    addGalleryItem,
    deleteGalleryItem,
    testimonials,
    addTestimonial,
    deleteTestimonial,
    messages,
    markMessageRead,
    deleteMessage,
    settings,
    updateSettings
  } = useApp();

  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'appointments' | 'doctors' | 'services' | 'gallery' | 'messages' | 'settings'
  >('appointments');

  // Form states for adding items
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('');
  const [newDocEducation, setNewDocEducation] = useState('');
  const [newDocBio, setNewDocBio] = useState('');
  const [newDocAvatar, setNewDocAvatar] = useState('');

  const [showAddService, setShowAddService] = useState(false);
  const [newServTitle, setNewServTitle] = useState('');
  const [newServCategory, setNewServCategory] = useState<'cosmetic' | 'orthodontics' | 'restorative' | 'surgical' | 'general'>('cosmetic');
  const [newServShortDesc, setNewServShortDesc] = useState('');
  const [newServPriceRange, setNewServPriceRange] = useState('');
  const [newServDuration, setNewServDuration] = useState('');
  const [newServImg, setNewServImg] = useState('');

  if (!isAdminOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passwordInput);
    if (!success) setAuthError(true);
    else setAuthError(false);
  };

  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName || !newDocTitle) return;

    addDoctor({
      name: newDocName,
      title: newDocTitle,
      specialty: newDocSpecialty || 'Cosmetic & Restorative Surgery',
      experienceYears: 10,
      education: newDocEducation || 'Dental Surgery Doctorate',
      bio: newDocBio || 'Dedicated specialist providing precision aesthetic procedures.',
      avatar: newDocAvatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      languages: ['English'],
      achievements: ['Certified Specialist']
    });

    setNewDocName('');
    setNewDocTitle('');
    setNewDocSpecialty('');
    setNewDocEducation('');
    setNewDocBio('');
    setNewDocAvatar('');
    setShowAddDoctor(false);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServTitle) return;

    addService({
      title: newServTitle,
      category: newServCategory,
      shortDesc: newServShortDesc || 'Advanced precision dental procedure.',
      fullDesc: newServShortDesc || 'Advanced precision dental procedure provided in our luxury suite.',
      iconName: 'Sparkles',
      priceRange: newServPriceRange || '$500 - $1,200',
      duration: newServDuration || '1 Hour',
      benefits: ['High durability', 'Minimal sensitivity', 'Natural translucency'],
      features: ['3D Scan Included'],
      image: newServImg || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800'
    });

    setNewServTitle('');
    setNewServShortDesc('');
    setNewServPriceRange('');
    setNewServDuration('');
    setNewServImg('');
    setShowAddService(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 min-h-[600px] flex flex-col"
        >
          {/* Header Bar */}
          <div className="p-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">AuraDent Executive Management Console</h2>
                <p className="text-xs text-slate-400 font-mono">Real-time Administration & Clinic Operations</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAdminAuthenticated && (
                <button
                  onClick={logoutAdmin}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1"
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
                  Enter administrative credentials to manage appointments, doctors, and clinic settings.
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
              {/* Sidebar Tabs */}
              <div className="w-full lg:w-64 bg-slate-50 dark:bg-slate-950/60 p-4 border-r border-slate-200 dark:border-slate-800 space-y-2 flex-shrink-0">
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center gap-3 transition-colors ${
                    activeTab === 'appointments'
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Appointments ({appointments.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('doctors')}
                  className={`w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center gap-3 transition-colors ${
                    activeTab === 'doctors'
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Specialist Doctors ({doctors.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('services')}
                  className={`w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center gap-3 transition-colors ${
                    activeTab === 'services'
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Treatments ({services.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center gap-3 transition-colors ${
                    activeTab === 'gallery'
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <Image className="w-4 h-4" />
                  <span>Gallery ({gallery.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('messages')}
                  className={`w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                    activeTab === 'messages'
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4" />
                    <span>Inbound Messages</span>
                  </div>
                  {messages.filter(m => !m.read).length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center gap-3 transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Clinic Settings</span>
                </button>
              </div>

              {/* Main Tab Content */}
              <div className="flex-1 p-6 overflow-y-auto max-h-[75vh]">
                {/* APPOINTMENTS TAB */}
                {activeTab === 'appointments' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Appointment Reservations
                      </h3>
                      <span className="text-xs font-mono bg-sky-500/10 text-sky-500 px-3 py-1 rounded-full">
                        Total Records: {appointments.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {appointments.length === 0 ? (
                        <p className="text-sm text-slate-500">No appointments logged yet.</p>
                      ) : (
                        appointments.map((apt) => (
                          <div
                            key={apt.id}
                            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-slate-900 dark:text-white">{apt.patientName}</span>
                                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                                  apt.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-500' :
                                  apt.status === 'pending' ? 'bg-amber-500/20 text-amber-500' :
                                  apt.status === 'completed' ? 'bg-sky-500/20 text-sky-500' : 'bg-rose-500/20 text-rose-500'
                                }`}>
                                  {apt.status}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {apt.serviceTitle} • Attending: <span className="text-sky-500">{apt.doctorName}</span>
                              </p>
                              <p className="text-xs font-mono text-slate-500">
                                Date: <strong className="text-slate-800 dark:text-slate-200">{apt.date}</strong> at <strong className="text-slate-800 dark:text-slate-200">{apt.timeSlot}</strong> | Phone: {apt.phone}
                              </p>
                            </div>

                            {/* Status controls */}
                            <div className="flex items-center gap-2">
                              {apt.status !== 'confirmed' && (
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white text-xs font-medium transition-colors"
                                >
                                  Confirm
                                </button>
                              )}
                              {apt.status !== 'completed' && (
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                                  className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-600 hover:bg-sky-500 hover:text-white text-xs font-medium transition-colors"
                                >
                                  Complete
                                </button>
                              )}
                              <button
                                onClick={() => deleteAppointment(apt.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                                title="Delete Appointment"
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

                {/* DOCTORS TAB */}
                {activeTab === 'doctors' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Doctor Roster</h3>
                      <button
                        onClick={() => setShowAddDoctor(!showAddDoctor)}
                        className="px-4 py-2 rounded-xl bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Specialist</span>
                      </button>
                    </div>

                    {showAddDoctor && (
                      <form onSubmit={handleCreateDoctor} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border space-y-3">
                        <h4 className="text-sm font-bold">Register New Doctor</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Full Name (e.g. Dr. Jane Doe)"
                            required
                            value={newDocName}
                            onChange={(e) => setNewDocName(e.target.value)}
                            className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Title (e.g. Chief Cosmetic Specialist)"
                            required
                            value={newDocTitle}
                            onChange={(e) => setNewDocTitle(e.target.value)}
                            className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Specialty"
                            value={newDocSpecialty}
                            onChange={(e) => setNewDocSpecialty(e.target.value)}
                            className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Education Alma Mater"
                            value={newDocEducation}
                            onChange={(e) => setNewDocEducation(e.target.value)}
                            className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Photo Image URL"
                          value={newDocAvatar}
                          onChange={(e) => setNewDocAvatar(e.target.value)}
                          className="w-full p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs"
                        />
                        <button type="submit" className="px-4 py-2 bg-sky-500 text-white rounded-xl text-xs font-semibold">
                          Save Doctor Profile
                        </button>
                      </form>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {doctors.map((d) => (
                        <div key={d.id} className="p-4 rounded-2xl border flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img src={d.avatar} alt={d.name} className="w-12 h-12 rounded-xl object-cover" />
                            <div>
                              <p className="font-bold text-sm">{d.name}</p>
                              <p className="text-xs text-sky-500">{d.title}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteDoctor(d.id)}
                            className="p-2 text-slate-400 hover:text-rose-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SERVICES TAB */}
                {activeTab === 'services' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Services Catalog</h3>
                      <button
                        onClick={() => setShowAddService(!showAddService)}
                        className="px-4 py-2 rounded-xl bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Service</span>
                      </button>
                    </div>

                    {showAddService && (
                      <form onSubmit={handleCreateService} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border space-y-3">
                        <h4 className="text-sm font-bold">Add Treatment Offering</h4>
                        <input
                          type="text"
                          placeholder="Service Title"
                          required
                          value={newServTitle}
                          onChange={(e) => setNewServTitle(e.target.value)}
                          className="w-full p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Price Range (e.g. $800 - $1,500)"
                            value={newServPriceRange}
                            onChange={(e) => setNewServPriceRange(e.target.value)}
                            className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Duration (e.g. 1 Visit)"
                            value={newServDuration}
                            onChange={(e) => setNewServDuration(e.target.value)}
                            className="p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs"
                          />
                        </div>
                        <button type="submit" className="px-4 py-2 bg-sky-500 text-white rounded-xl text-xs font-semibold">
                          Save Treatment
                        </button>
                      </form>
                    )}

                    <div className="space-y-3">
                      {services.map((s) => (
                        <div key={s.id} className="p-4 rounded-2xl border flex items-center justify-between">
                          <div>
                            <p className="font-bold text-sm">{s.title}</p>
                            <p className="text-xs text-slate-500">{s.priceRange} • {s.duration}</p>
                          </div>
                          <button onClick={() => deleteService(s.id)} className="p-2 text-slate-400 hover:text-rose-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* GALLERY TAB */}
                {activeTab === 'gallery' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Gallery Photos ({gallery.length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {gallery.map((g) => (
                        <div key={g.id} className="relative h-36 rounded-2xl overflow-hidden group">
                          <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
                          <button
                            onClick={() => deleteGalleryItem(g.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-500 text-white"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MESSAGES TAB */}
                {activeTab === 'messages' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Inbound Inquiries ({messages.length})</h3>
                    <div className="space-y-3">
                      {messages.map((m) => (
                        <div key={m.id} className="p-4 rounded-2xl border space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-sm">{m.name} ({m.email})</span>
                            <button onClick={() => deleteMessage(m.id)} className="text-slate-400 hover:text-rose-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-sky-500 font-semibold">{m.subject}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-300">{m.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SETTINGS TAB */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Clinic Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-mono font-semibold">Clinic Name</label>
                        <input
                          type="text"
                          value={settings.clinicName}
                          onChange={(e) => updateSettings({ clinicName: e.target.value })}
                          className="w-full p-3 rounded-xl border text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono font-semibold">Phone</label>
                        <input
                          type="text"
                          value={settings.phone}
                          onChange={(e) => updateSettings({ phone: e.target.value })}
                          className="w-full p-3 rounded-xl border text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono font-semibold">Address</label>
                        <input
                          type="text"
                          value={settings.address}
                          onChange={(e) => updateSettings({ address: e.target.value })}
                          className="w-full p-3 rounded-xl border text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
