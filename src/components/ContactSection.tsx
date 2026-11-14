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
  MessageSquare,
  Navigation,
  Compass,
  ExternalLink
} from 'lucide-react';

const GUJRANWALA_AREAS = [
  'Satellite Town',
  'Civil Lines',
  'Peoples Colony',
  'Model Town',
  'DC Colony',
  'Garden Town',
  'Shalimar Town',
  'Sui Gas Road',
  'Quaid E Azam Town',
  'Fizaia Housing',
  'Khiali',
  'Wapda Town',
  'Canal View',
  'Muhafiz Town',
  'Other Gujranwala Area',
] as const;

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
  const [streetAddress, setStreetAddress] = useState('');
  const [area, setArea] = useState<string>('Satellite Town');
  const [serviceType, setServiceType] = useState(prefilledService);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('Flexible / Anytime');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [submittedSummary, setSubmittedSummary] = useState<{
    name: string;
    phone: string;
    vehicleModel: string;
    address: string;
    areaLabel: string;
    mapsUrl: string;
    serviceType: string;
    schedule: string;
    message: string;
  } | null>(null);

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

    if (!streetAddress.trim()) {
      newErrors.streetAddress = 'Street address or house/landmark details are required';
    }

    if (!message.trim() || message.trim().length < 10) {
      newErrors.message = 'Please provide at least 10 characters describing the issue or inquiry';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildGoogleMapsLocationUrl = (selectedArea: string, addressText: string) => {
    const queryTarget =
      selectedArea === 'Other Gujranwala Area'
        ? `${addressText.trim() ? `${addressText.trim()} ` : ''}Gujranwala`
        : `${selectedArea} Gujranwala`;
    const encodedQuery = encodeURIComponent(queryTarget).replace(/%20/g, '+');
    return `https://maps.google.com/?q=${encodedQuery}`;
  };

  const buildWhatsAppBookingUrl = (details: {
    id: string;
    name: string;
    phone: string;
    vehicleModel: string;
    serviceType: string;
    schedule: string;
    address: string;
    areaLabel: string;
    mapsUrl: string;
    message: string;
  }) => {
    const lines = [
      `Appointment`,
      `• Name: ${details.name}`,
      `• Mobile: ${details.phone}`,
      `• Model: ${details.vehicleModel}`,
      `• Service: ${details.serviceType}`,
      `• Schedule: ${details.schedule} (#${details.id})`,
      `• Address: ${details.address}`,
      `• Area: ${details.areaLabel}`,
      `• Fault: ${details.message}`,
      ``,
      `View Google Map Location:`,
      details.mapsUrl,
    ];
    return `https://wa.me/923217436463?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const triggerWhatsAppRedirect = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const generatedId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 16);
    const scheduleLabel = preferredDate
      ? `${preferredDate} (${preferredTime})`
      : `Earliest Available (${preferredTime})`;

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanVehicle = vehicleModel.trim();
    const cleanStreetAddress = streetAddress.trim();
    const cleanMessage = message.trim();

    const formattedArea =
      area === 'Other Gujranwala Area' ? 'Gujranwala' : `${area}, Gujranwala`;
    const formattedAddress =
      area === 'Other Gujranwala Area' ||
      cleanStreetAddress.toLowerCase().includes(area.toLowerCase())
        ? cleanStreetAddress
        : `${cleanStreetAddress}, ${area}`;
    const mapsUrl = buildGoogleMapsLocationUrl(area, cleanStreetAddress);

    const newInquiry: CustomerInquiry = {
      id: generatedId,
      name: cleanName,
      phone: cleanPhone,
      email: email.trim() || 'No email provided',
      vehicleModel: cleanVehicle,
      serviceType,
      message: `${cleanMessage}\n\n[Address: ${formattedAddress} | Area: ${formattedArea} | Map: ${mapsUrl}]`,
      preferredDate: scheduleLabel,
      submittedAt: formattedDate,
      status: 'New'
    };

    const generatedWhatsappUrl = buildWhatsAppBookingUrl({
      id: generatedId,
      name: cleanName,
      phone: cleanPhone,
      vehicleModel: cleanVehicle,
      serviceType,
      schedule: scheduleLabel,
      address: formattedAddress,
      areaLabel: formattedArea,
      mapsUrl,
      message: cleanMessage,
    });

    onAddInquiry(newInquiry);
    setTicketId(generatedId);
    setWhatsappUrl(generatedWhatsappUrl);
    setSubmittedSummary({
      name: cleanName,
      phone: cleanPhone,
      vehicleModel: cleanVehicle,
      address: formattedAddress,
      areaLabel: formattedArea,
      mapsUrl,
      serviceType,
      schedule: scheduleLabel,
      message: cleanMessage,
    });
    setIsSubmitted(true);

    // Trigger instant WhatsApp redirect via anchor click within user submit gesture
    triggerWhatsAppRedirect(generatedWhatsappUrl);

    // Reset Form fields cleanly
    setName('');
    setPhone('');
    setEmail('');
    setVehicleModel('');
    setStreetAddress('');
    setArea('Satellite Town');
    setMessage('');
    setPreferredDate('');
    setPreferredTime('Flexible / Anytime');
    setErrors({});
  };

  const handleSelectLocationForBooking = (loc: ServiceLocation) => {
    const matchedArea = GUJRANWALA_AREAS.find(
      (z) =>
        loc.zone.toLowerCase().includes(z.toLowerCase()) ||
        loc.name.toLowerCase().includes(z.toLowerCase())
    );
    if (matchedArea) {
      setArea(matchedArea);
    }

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
        <div
          id="contact-form"
          className="lg:col-span-7 backdrop-blur-xl bg-white/75 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 rounded-2xl shadow-xl scroll-mt-24 w-full min-w-0 max-w-full"
        >
          {isSubmitted ? (
            <div className="py-6 space-y-6 animate-in fade-in" aria-live="polite">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Appointment Ready!
                  </h3>
                  <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    Reference Ticket: #{ticketId}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    Opening WhatsApp to send your details to Next Gen EV Care...
                  </p>
                </div>
              </div>

              {submittedSummary && (
                <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500 dark:text-slate-400">Customer:</span>
                    <span className="font-semibold text-slate-900 dark:text-white text-right">{submittedSummary.name} · {submittedSummary.phone}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500 dark:text-slate-400">Scooter / Bike:</span>
                    <span className="font-semibold text-slate-900 dark:text-white text-right">{submittedSummary.vehicleModel}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500 dark:text-slate-400">Address:</span>
                    <span className="font-semibold text-slate-900 dark:text-white text-right">{submittedSummary.address}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500 dark:text-slate-400">Area:</span>
                    <a
                      href={submittedSummary.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 text-right"
                    >
                      <span>{submittedSummary.areaLabel}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500 dark:text-slate-400">Service:</span>
                    <span className="font-semibold text-slate-900 dark:text-white text-right truncate max-w-[240px]">{submittedSummary.serviceType}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500 dark:text-slate-400">Date & Time:</span>
                    <span className="font-mono text-slate-900 dark:text-white text-right">{submittedSummary.schedule}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
                <a
                  href={whatsappUrl || 'https://wa.me/923217436463'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>Click here if WhatsApp doesn&apos;t open automatically</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setSubmittedSummary(null);
                    setWhatsappUrl('');
                  }}
                  className="h-12 px-5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:border-emerald-500/50 transition-all cursor-pointer whitespace-nowrap"
                >
                  Submit Another Request
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
                {/* Street / House Details */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Street / House Details *
                  </label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="e.g., House #12, Main Boulevard"
                    className={`w-full h-11 px-4 text-xs sm:text-sm rounded-xl liquid-glass border ${
                      errors.streetAddress ? 'border-red-500' : 'border-white/80 dark:border-white/10'
                    } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-sm`}
                  />
                  {errors.streetAddress && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.streetAddress}
                    </p>
                  )}
                </div>

                {/* Gujranwala Area Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Gujranwala Area *
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full h-11 px-3.5 text-xs sm:text-sm rounded-xl liquid-glass border border-white/80 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-sm"
                  >
                    {GUJRANWALA_AREAS.map((zone) => (
                      <option key={zone} value={zone} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        {zone}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Service Category */}
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Service Required
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full h-11 min-w-0 max-w-full truncate px-3.5 text-xs sm:text-sm rounded-xl liquid-glass border border-white/80 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-sm"
                  >
                    <option value="Door-to-Door Home / Office Service (Main Focus)">Door-to-Door Doorstep Service</option>
                    <option value="Electrification Diagnostic & Computer Scan">Computer Scan & Diagnostics</option>
                    <option value="Motor Repair (Hall Sensors, Bearings - No Winding)">Motor Repair (Hall Sensors)</option>
                    <option value="Controller Repair (MOSFETs, Throttle, Power Cutoff)">Controller Repair (MOSFETs)</option>
                    <option value="Full Service & Maintenance (24-Point Comprehensive Check)">Full 24-Point Service</option>
                    <option value="Battery Diagnostic & Cell Balancing">Battery Health & Cell Balancing</option>
                    <option value="Petrol-to-EV Conversion (Coming Soon - Priority Waitlist)">Petrol-to-EV Conversion</option>
                  </select>
                </div>

                {/* Preferred Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl liquid-glass border border-white/80 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-sm"
                  />
                </div>

                {/* Preferred Time Slot */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Preferred Time
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full h-11 px-3.5 text-xs sm:text-sm rounded-xl liquid-glass border border-white/80 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-sm"
                  >
                    <option value="Flexible / Anytime">Flexible / Anytime</option>
                    <option value="Morning (9:00 AM - 12:00 PM)">Morning (9 AM - 12 PM)</option>
                    <option value="Afternoon (12:00 PM - 4:00 PM)">Afternoon (12 PM - 4 PM)</option>
                    <option value="Evening (4:00 PM - 8:00 PM)">Evening (4 PM - 8 PM)</option>
                  </select>
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
                className="w-full h-12 px-5 text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-slate-950" />
                <span>Book & Send via WhatsApp</span>
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
