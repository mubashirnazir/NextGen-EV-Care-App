import React from 'react';
import { ShieldCheck, X, FileText, Lock, Eye, HardDrive } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl my-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200/90 dark:border-slate-800/90 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Privacy Policy & Telemetry Protection
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          
          <div className="space-y-1">
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
              Last Updated: October 2026 · Next Gen EV Care
            </p>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              1. Our Privacy Commitment to Electric Vehicle Owners
            </h3>
            <p>
              Next Gen EV Care ("we", "our", or "the workshop") respects your confidentiality and rights regarding personal contact details and technical telemetry recorded during diagnostics, battery health analysis, and custom vehicle conversions.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-500" />
              <span>2. Technical Diagnostics & Vehicle Data Collected</span>
            </h4>
            <p>
              When your electric bike or scooty is inspected at our facility or through our client-side calculators, we evaluate:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-500 dark:text-slate-400">
              <li>Battery Management System (BMS) serial numbers, firmware revision, and cell voltage deltas.</li>
              <li>Calculated State of Health (SOH), cumulative charge-discharge cycle counts, and internal resistance (IR) readings.</li>
              <li>Motor controller phase logs and fault codes.</li>
              <li>Contact phone and email strictly used for service updates and collection reminders.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              <span>3. How We Store & Safeguard Data</span>
            </h4>
            <p>
              Inquiry submissions and diagnostic histories are maintained strictly within encrypted internal records. We do not sell, license, or transmit your contact information, vehicle registration data, or battery serial keys to third-party telematics aggregators.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-500" />
              <span>4. Client-Side Calculators & Local State</span>
            </h4>
            <p>
              Our EV Range & Battery Health Calculator executes 100% locally in your client web browser. Calculations and slider configurations do not transmit background telemetry to external tracking platforms.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white">
              5. Contacting the Compliance Officer
            </h4>
            <p>
              If you have any questions regarding how your vehicle logs or service records are managed, please contact our data administrator at <a href="mailto:nextgenevcare@gmail.com" className="text-emerald-500 underline font-mono">nextgenevcare@gmail.com</a>.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-950">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
          >
            I Understand & Agree
          </button>
        </div>

      </div>
    </div>
  );
};
