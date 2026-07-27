import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Download
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const {
    isBookingOpen,
    closeBooking,
    bookingPreselect,
    services,
    doctors,
    addAppointment
  } = useApp();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  const [patientName, setPatientName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const [createdAppointment, setCreatedAppointment] = useState<any>(null);

  useEffect(() => {
    if (isBookingOpen) {
      if (bookingPreselect.serviceId) setSelectedServiceId(bookingPreselect.serviceId);
      else if (services.length > 0 && !selectedServiceId) setSelectedServiceId(services[0].id);

      if (bookingPreselect.doctorId) setSelectedDoctorId(bookingPreselect.doctorId);
      else if (doctors.length > 0 && !selectedDoctorId) setSelectedDoctorId(doctors[0].id);

      // Default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(tomorrow.toISOString().split('T')[0]);
      setSelectedTimeSlot('10:00 AM');
    }
  }, [isBookingOpen, bookingPreselect, services, doctors]);

  if (!isBookingOpen) return null;

  const availableTimeSlots = [
    '09:00 AM', '10:00 AM', '11:15 AM', '01:30 PM', '03:00 PM', '04:30 PM'
  ];

  const handleNext = () => {
    if (step === 1) {
      if (!selectedServiceId || !selectedDoctorId) return;
      setStep(2);
    } else if (step === 2) {
      if (!selectedDate || !selectedTimeSlot) return;
      setStep(3);
    } else if (step === 3) {
      if (!patientName || !phone || !email) return;

      const s = services.find(serv => serv.id === selectedServiceId);
      const d = doctors.find(doc => doc.id === selectedDoctorId);

      const newApt = addAppointment({
        patientName,
        phone,
        email,
        serviceId: selectedServiceId,
        serviceTitle: s ? s.title : 'General Consultation',
        doctorId: selectedDoctorId,
        doctorName: d ? d.name : 'Attending Specialist',
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        message
      });

      setCreatedAppointment(newApt);
      setStep(4);

      // Trigger Celebration Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleReset = () => {
    setStep(1);
    setCreatedAppointment(null);
    closeBooking();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl glass-panel rounded-[36px] shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Reserve VIP Appointment</h2>
                <p className="text-xs text-slate-400 font-mono">Step {step} of 4 • AuraDent Suite</p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5">
            <div
              className="bg-gradient-to-r from-sky-500 to-indigo-500 h-1.5 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          {/* Step 1: Treatment & Doctor Selection */}
          {step === 1 && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-mono font-semibold uppercase text-slate-400 tracking-wider">
                  1. Select Clinical Service
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                  {services.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setSelectedServiceId(s.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        selectedServiceId === s.id
                          ? 'border-sky-500 bg-sky-500/10 text-slate-900 dark:text-white font-semibold'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <p className="text-xs font-bold">{s.title}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-1">{s.priceRange}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-mono font-semibold uppercase text-slate-400 tracking-wider">
                  2. Select Specialist Doctor
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
                  {doctors.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => setSelectedDoctorId(d.id)}
                      className={`p-3 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                        selectedDoctorId === d.id
                          ? 'border-sky-500 bg-sky-500/10 text-slate-900 dark:text-white font-semibold'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <img src={d.avatar} alt={d.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold">{d.name}</p>
                        <p className="text-[10px] text-sky-500">{d.title.split('&')[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!selectedServiceId || !selectedDoctorId}
                  className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2"
                >
                  <span>Continue to Date & Time</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === 2 && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-mono font-semibold uppercase text-slate-400 tracking-wider">
                  Select Appointment Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-mono font-semibold uppercase text-slate-400 tracking-wider">
                  Select Preferred Time Slot
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {availableTimeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-3 rounded-2xl border text-xs font-mono transition-all ${
                        selectedTimeSlot === slot
                          ? 'border-sky-500 bg-sky-500 text-white font-bold'
                          : 'border-slate-200 dark:border-slate-800 hover:border-sky-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={!selectedDate || !selectedTimeSlot}
                  className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2"
                >
                  <span>Patient Information</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Patient Information Form */}
          {step === 3 && (
            <div className="p-6 sm:p-8 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold uppercase text-slate-400">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Victoria Sterling"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-semibold uppercase text-slate-400">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-semibold uppercase text-slate-400">Email Address *</label>
                  <input
                    type="email"
                    placeholder="victoria@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold uppercase text-slate-400">Special Notes or Questions</label>
                <textarea
                  rows={2}
                  placeholder="Mention any dental sensitivities or preferences..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={!patientName || !phone || !email}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 disabled:opacity-50 text-white text-xs font-bold tracking-wide shadow-lg shadow-sky-500/25 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Confirm Reservation</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation Ticket */}
          {step === 4 && createdAppointment && (
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Reservation Confirmed!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your VIP appointment request has been transmitted to our patient concierge team.
                </p>
              </div>

              {/* Ticket Card */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-left space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3">
                  <span className="text-xs font-mono text-slate-400">Ticket Ref</span>
                  <span className="text-xs font-mono font-bold text-sky-500">{createdAppointment.id}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-slate-400">Patient</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{createdAppointment.patientName}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Service</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{createdAppointment.serviceTitle}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Attending Specialist</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{createdAppointment.doctorName}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Date & Time</p>
                    <p className="font-semibold text-sky-500">{createdAppointment.date} at {createdAppointment.timeSlot}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs tracking-wider uppercase shadow-lg"
              >
                Return to Website
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
