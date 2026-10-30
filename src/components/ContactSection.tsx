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
  ArrowRight,
  Navigation,
  Compass,
  ExternalLink
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

  // Google Maps Platform Embed Configuration
  const mapsApiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;
  const workshopAddress = 'Mughal Plaza, Mughal Chok, Service Road Main Gate Muhafiz Town Gujranwala, Pakistan';
  const workshopQuery = encodeURIComponent(workshopAddress);
  const googleMapEmbedUrl = mapsApiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${workshopQuery}&zoom=15`
    : `https://maps.google.com/maps?q=${workshopQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${workshopQuery}`;

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
        <div id="contact-form" className="lg:col-span-7 liquid-glass-card p-6 sm:p-8 rounded-2xl shadow-xl scroll-mt-24 w-full min-w-0 max-w-full">
          
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto shadow-inner">
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
                  className="h-10 px-5 text-xs font-semibold text-slate-700 dark:text-slate-200 liquid-glass rounded-xl hover:text-emerald-500 transition-all"
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Rider Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Muhammad Usman"
                    className={`w-full h-11 px-4 text-xs sm:text-sm rounded-xl liquid-glass border ${
                      errors.name ? 'border-red-500' : 'border-white/80 dark:border-white/10'
                    } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-sm`}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.name}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0321 7436463"
                    className={`w-full h-11 px-4 text-xs sm:text-sm rounded-xl liquid-glass border ${
                      errors.phone ? 'border-red-500' : 'border-white/80 dark:border-white/10'
                    } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-sm`}
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className={`w-full h-11 px-4 text-xs sm:text-sm rounded-xl liquid-glass border ${
                      errors.email ? 'border-red-500' : 'border-white/80 dark:border-white/10'
                    } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-sm`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Scooter / Bike Model */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Electric Scooter / Bike Model *
                  </label>
                  <input
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="e.g. Honda CD 70 EV, Yadea T5, Metro E8S, United Revolt"
                    className={`w-full h-11 px-4 text-xs sm:text-sm rounded-xl liquid-glass border ${
                      errors.vehicleModel ? 'border-red-500' : 'border-white/80 dark:border-white/10'
                    } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-sm`}
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Service Required
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full h-11 min-w-0 max-w-full truncate px-3.5 text-xs sm:text-sm rounded-xl liquid-glass border border-white/80 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-sm"
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Preferred Appointment Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl liquid-glass border border-white/80 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Message / Symptoms */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Describe Symptoms or Project Scope *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Scooter shuts off when accelerating past 40 km/h, battery health shows 65%, or looking for a quote to convert my petrol Honda CD70/CG125 to 72V electric..."
                  className={`w-full p-4 text-xs sm:text-sm rounded-xl liquid-glass border ${
                    errors.message ? 'border-red-500' : 'border-white/80 dark:border-white/10'
                  } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-sm`}
                />
                {errors.message && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full h-11 px-5 text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-slate-950" />
                <span>Submit Appointment Request</span>
              </button>

            </form>
          )}

        </div>

        {/* Workshop Contact Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 w-full min-w-0 max-w-full">
          
          <div className="liquid-glass-card p-6 sm:p-7 rounded-2xl shadow-xl space-y-6 w-full min-w-0 max-w-full">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Workshop Location & Hours
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">Next Gen EV Care Workshop</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed break-words">
                    Mughal Plaza, Mughal Chok, Service Road Main Gate Muhafiz Town Gujranwala, Pakistan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">Operating Hours</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Saturday to Thursday: 9:00 AM – 8:00 PM
                  </p>
                  <p className="text-slate-500 text-xs">Friday: Prior Appointment Only</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">Direct WhatsApp</p>
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

            {/* Real Google Map Location Embed */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <Compass className="w-4 h-4 text-emerald-500" />
                  <span>Physical Hub Location</span>
                </div>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Get Directions</span>
                </a>
              </div>

              {/* Responsive Google Maps Container */}
              <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden border border-white/80 dark:border-white/10 bg-slate-950 shadow-inner group">
                <iframe
                  title="Next Gen EV Care Physical Hub Location - Mughal Plaza Gujranwala"
                  src={googleMapEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                <span className="truncate pr-2">📍 Opposite Main Gate Muhafiz Town</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${workshopQuery}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 shrink-0"
                >
                  <span>Open Full Map</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>

            {/* Direct WhatsApp Chat Action */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
              <a
                href="https://wa.me/923217436463?text=Hello%20Next%20Gen%20EV%20Care!%20I%20would%20like%20to%20inquire%20about%20electric%20scooter%20/%20bike%20service%20in%20Gujranwala."
                target="_blank"
                rel="noreferrer"
                className="w-full h-11 px-4 rounded-xl liquid-glass text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant Chat on WhatsApp (03217436463)</span>
              </a>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-5 rounded-2xl liquid-glass-subtle text-xs text-slate-600 dark:text-slate-400 space-y-1 w-full min-w-0 max-w-full">
            <p className="font-semibold text-slate-900 dark:text-slate-200">Emergency Breakdown Pickup</p>
            <p className="leading-relaxed">
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
