import React, { useState } from 'react';
import { CustomerInquiry } from '../types';
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
  prefilledService = 'Battery Diagnostic & Balancing'
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
      newErrors.vehicleModel = 'Scooter or bike model is required (e.g., Ather 450X, Activa EV, Ola S1)';
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

  return (
    <div id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Title */}
      <div className="max-w-3xl mb-10">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
          <span>SCHEDULE SERVICE OR RETROFIT</span>
          <span aria-hidden="true">·</span>
          <span>Next Gen EV Care Workshop</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Book Workshop Diagnostic or Inquire Build
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
          Speak directly with our battery technicians and powertrain specialists. Same-day computerized diagnostic appointments available.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          
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
                    placeholder="e.g. Ramesh Kumar"
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
                    placeholder="+91 98765 43210"
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
                    placeholder="e.g. Ather 450X, Ola S1, Activa Conversion"
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
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Battery Diagnostic & Balancing">Battery Diagnostic & Cell Balancing</option>
                    <option value="Custom EV Conversion (Petrol to Electric)">Custom EV Conversion (Petrol to Electric)</option>
                    <option value="Custom Li-ion / LFP Battery Pack Build">Custom Li-ion / LFP Battery Pack Build</option>
                    <option value="Motor & Controller Repair (Hall Sensor / MOSFET)">Motor & Controller Repair (Hall Sensor / MOSFET)</option>
                    <option value="Charger Repair & Fast Charger Upgrade">Charger Repair & Fast Charger Upgrade</option>
                    <option value="General Periodic Maintenance & Waterproofing">General Periodic Maintenance & Waterproofing</option>
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
                  placeholder="e.g. Scooter shuts off when accelerating past 40 km/h, battery health shows 65%, or looking for a quote to convert my 2017 Activa to a 72V electric motor..."
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
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-100 dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Workshop Location & Hours
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Next Gen EV Care Workshop</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Plot 42, Green Energy Tech Corridor, Industrial Area Phase II, Bengaluru, Karnataka 560068
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Operating Hours</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Monday to Saturday: 9:00 AM – 7:30 PM
                  </p>
                  <p className="text-slate-500 text-xs">Sunday: Prior Appointment Only</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Direct Workshop Hotline</p>
                  <p className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                    +91 98765 43210 / +91 98450 11223
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Official Email</p>
                  <a
                    href="mailto:nextgenevcare@gmail.com"
                    className="text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 underline block mt-0.5 font-mono text-xs"
                  >
                    nextgenevcare@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Chat Action */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <a
                href="https://wa.me/919876543210?text=Hello%20Next%20Gen%20EV%20Care!%20I%20would%20like%20to%20inquire%20about%20electric%20scooter/bike%20service."
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <p className="font-semibold text-slate-900 dark:text-slate-200">Emergency Breakdown Pickup</p>
            <p>
              Stuck with an unresponsive scooter or battery cutoff? We operate a specialized hydraulic carrier van for secure doorstep pickup and drop across the metropolitan radius.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
