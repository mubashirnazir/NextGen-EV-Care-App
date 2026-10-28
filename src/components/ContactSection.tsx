import React, { useState } from 'react';
import { CustomerInquiry } from '../types';
import { ServiceCenterMap, ServiceLocation } from './ServiceCenterMap';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  MessageSquare,
  Zap,
  ArrowRight
} from 'lucide-react';

interface ContactSectionProps {
  onAddInquiry: (inquiry: CustomerInquiry) => void;
  prefilledVehicle?: string;
  prefilledService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onAddInquiry,
  prefilledVehicle = '',
  prefilledService = 'Door-to-Door Home / Office Service (Main Focus)'
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleModel, setVehicleModel] = useState(prefilledVehicle);
  const [serviceType, setServiceType] = useState(prefilledService);
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+ -]{8,16}$/.test(phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!vehicleModel.trim()) {
      newErrors.vehicleModel = 'Scooter or bike model is required (e.g., Honda CD 70 EV, Yadea T5, Metro E8S)';
    }

    if (!message.trim() || message.trim().length < 10) {
      newErrors.message = 'Please provide at least 10 characters describing the issue or inquiry';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const generatedId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 16);

    const newInquiry: CustomerInquiry = {
      id: generatedId,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || 'No email provided',
      vehicleModel: vehicleModel.trim(),
      serviceType,
      message: message.trim(),
      preferredDate: preferredDate || 'Flexible / Earliest Available',
      submittedAt: formattedDate,
      status: 'New'
    };

    onAddInquiry(newInquiry);
    setTicketId(generatedId);
    setIsSubmitted(true);

    // Reset Form
    setName('');
    setPhone('');
    setEmail('');
    setVehicleModel('');
    setMessage('');
    setPreferredDate('');
    setErrors({});
  };

  const handleSelectLocationForBooking = (loc: ServiceLocation) => {
    setServiceType(
      loc.isHeadquarters
        ? 'Electrification Diagnostic & Computer Scan'
        : 'Door-to-Door Home / Office Service (Main Focus)'
    );
    setMessage((prev) => {
      const locTag = `[Service Hub Requested: ${loc.name} (${loc.zone})]`;
      if (prev.includes('[Service Hub Requested:')) {
        return prev.replace(/\[Service Hub Requested:[^\]]+\]/, locTag);
      }
      return prev ? `${locTag}\n${prev}` : `${locTag}\nI would like to request appointment / technician support for this zone.`;
    });

    const formElement = document.getElementById('contact-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12 sm:space-y-16 w-full max-w-full overflow-hidden">
      
      {/* Title */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
          <span>DOOR-TO-DOOR & WORKSHOP CARE</span>
          <span aria-hidden="true">·</span>
          <span>Next Gen EV Care</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Book Door-to-Door Service or Workshop Diagnostic
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
          Request a mobile technician visit to your home or office anywhere in Gujranwala, or schedule component-level diagnostics at our Mughal Plaza facility.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full min-w-0">
        
        {/* Contact Form (7 Cols) */}
        <div id="contact-form" className="lg:col-span-7 bg-white dark:bg-slate-900 p-4 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-24 w-full min-w-0 max-w-full">
          
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Appointment Request Logged
                </h3>
                <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  Reference Ticket: #{ticketId}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto pt-2 leading-relaxed">
                  Thank you! Our master technician has received your inquiry. We will contact you via WhatsApp / Phone within 2 operating hours with a time slot.
                </p>
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Rider Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Muhammad Usman"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border ${
                      errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-800'
                    } text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500`}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.name}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0321 7436463"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border ${
                      errors.phone ? 'border-red-500' : 'border-slate-300 dark:border-slate-800'
                    } text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500`}
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border ${
                      errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-800'
                    } text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Scooter / Bike Model */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Electric Scooter / Bike Model *
                  </label>
                  <input
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="e.g. Honda CD 70 EV, Yadea T5, Metro E8S, United Revolt"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border ${
                      errors.vehicleModel ? 'border-red-500' : 'border-slate-300 dark:border-slate-800'
                    } text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500`}
                  />
                  {errors.vehicleModel && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.vehicleModel}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Service Category */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Service Required
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full min-w-0 max-w-full truncate px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Door-to-Door Home / Office Service (Main Focus)">🏠 Door-to-Door Doorstep Service (Main Focus)</option>
                    <option value="Electrification Diagnostic & Computer Scan">⚡ Electrification Diagnostic & Computer Scan</option>
                    <option value="Motor Repair (Hall Sensors, Bearings - No Winding)">⚙️ Motor Repair (Hall Sensors, Bearings - No Winding)</option>
                    <option value="Controller Repair (MOSFETs, Throttle, Power Cutoff)">🔌 Controller Repair (MOSFETs, Gate Driver, Throttle Jitter)</option>
                    <option value="Full Service & Maintenance (24-Point Comprehensive Check)">🔧 Full Service & Maintenance (24-Point Check)</option>
                    <option value="Battery Diagnostic & Cell Balancing">🔋 Battery Health Diagnostic & Cell Balancing</option>
                    <option value="Petrol-to-EV Conversion (Coming Soon - Priority Waitlist)">🚀 Petrol-to-EV Conversion (Coming Soon - Priority Waitlist)</option>
                  </select>
                </div>

                {/* Preferred Date */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Preferred Appointment Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Message / Symptoms */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Describe Symptoms or Project Scope *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Scooter shuts off when accelerating past 40 km/h, battery health shows 65%, or looking for a quote to convert my petrol Honda CD70/CG125 to 72V electric..."
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border ${
                    errors.message ? 'border-red-500' : 'border-slate-300 dark:border-slate-800'
                  } text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500`}
                />
                {errors.message && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-5 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-slate-950" />
                <span>Submit Appointment Request</span>
              </button>

            </form>
          )}

        </div>

        {/* Workshop Contact Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 w-full min-w-0 max-w-full">
          
          <div className="bg-slate-100 dark:bg-slate-900 p-4 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 w-full min-w-0 max-w-full">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Workshop Location & Hours
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">Next Gen EV Care Workshop</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed break-words">
                    Mughal Plaza, Mughal Chok, Service Road Main gate Muhafiz Town Gujranwala, Pakistan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">Operating Hours</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Monday to Saturday: 9:00 AM – 8:00 PM
                  </p>
                  <p className="text-slate-500 text-xs">Sunday: Prior Appointment Only</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">Direct Workshop & WhatsApp</p>
                  <p className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-base mt-0.5">
                    03217436463
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">International: +92 321 7436463</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">Official Email</p>
                  <a
                    href="mailto:nextgenevcare@gmail.com"
                    className="text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 underline block mt-0.5 font-mono text-xs break-all"
                  >
                    nextgenevcare@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Chat Action */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <a
                href="https://wa.me/923217436463?text=Hello%20Next%20Gen%20EV%20Care!%20I%20would%20like%20to%20inquire%20about%20electric%20scooter%20/%20bike%20service%20in%20Gujranwala."
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant Chat on WhatsApp (03217436463)</span>
              </a>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1 w-full min-w-0 max-w-full">
            <p className="font-semibold text-slate-900 dark:text-slate-200">Emergency Breakdown Pickup</p>
            <p>
              Stuck with an unresponsive scooter or battery cutoff? We operate a specialized hydraulic carrier van for secure doorstep pickup and drop across the metropolitan radius.
            </p>
          </div>

        </div>

      </div>

      {/* Visual Map Component Showing Service Center Locations Using Icon-Based Visualization */}
      <div className="pt-8 sm:pt-10 border-t border-slate-200 dark:border-slate-800 w-full min-w-0 max-w-full overflow-hidden">
        <ServiceCenterMap onSelectLocationForBooking={handleSelectLocationForBooking} />
      </div>

    </div>
  );
};
