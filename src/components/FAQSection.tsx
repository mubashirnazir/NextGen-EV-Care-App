import React, { useState, useMemo } from 'react';
import { ActiveTab } from '../types';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Truck, 
  Wrench, 
  Microscope, 
  Sliders, 
  Clock, 
  MessageSquare, 
  ArrowRight,
  Phone,
  Sparkles,
  Layers
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'doorstep' | 'maintenance' | 'motor-controller' | 'diagnostics' | 'conversions';
  question: string;
  answer: string;
  keyPoints?: string[];
}

interface FAQSectionProps {
  setActiveTab?: (tab: ActiveTab) => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ setActiveTab }) => {
  const [faqCategory, setFaqCategory] = useState<'all' | 'doorstep' | 'maintenance' | 'motor-controller' | 'diagnostics' | 'conversions'>('all');
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqIds, setOpenFaqIds] = useState<string[]>([
    'faq-doorstep-1',
    'faq-motor-1',
    'faq-controller-1',
    'faq-conversions-1'
  ]);

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const faqList: FAQItem[] = [
    {
      id: 'faq-doorstep-1',
      category: 'doorstep',
      question: "How does Next Gen EV Care's Door-to-Door Service work, and how fast can you arrive?",
      answer: "Door-to-Door Service is our primary customer care model. When your electric bike or scooty experiences a breakdown, unusual vibration, or dead battery, you do not need to hire an expensive loader rickshaw to tow it. You simply contact us via WhatsApp (03217436463) or book an appointment online. Our mobile EV care technician dispatches directly to your residence, office, or roadside location anywhere in Gujranwala (including Model Town, Cantt, DC Colony, Rahwali, Muhafiz Town, and surrounding GT Road areas). Equipped with mobile digital testing instruments, replacement sensors, and tools, we diagnose and fix the vehicle right on your doorstep.",
      keyPoints: [
        'Zero towing hassle: We come to your home or office anywhere in Gujranwala',
        'Same-day rapid dispatch for urgent breakdowns across the city',
        'Mobile vans equipped with battery analyzers, digital oscilloscopes, and common parts'
      ]
    },
    {
      id: 'faq-doorstep-2',
      category: 'doorstep',
      question: 'Which repairs can be completed at my doorstep versus requiring the workshop?',
      answer: 'Over 85% of common electric two-wheeler malfunctions can be resolved completely on your driveway in 60 to 90 minutes. This includes hall effect sensor replacement, throttle jitter and wiring harness troubleshooting, brake fluid bleeding & brake pad changes, 12V DC-DC converter replacement, digital dashboard error diagnosis, battery cell delta testing, and routine 24-point maintenance. If an issue requires specialized laboratory bench micro-soldering (such as multi-FET SMD controller replacement or pneumatic spot-welding battery packs), our technician removes only the compact component or safely transports your vehicle to our Mughal Plaza facility and returns it fully tested.',
      keyPoints: [
        '85% of issues resolved right on your driveway in 60–90 minutes',
        'Transparent pricing: You watch the diagnostic and repair happen in real time',
        'Safe doorstep component pickup & drop-off for intensive bench repairs'
      ]
    },
    {
      id: 'faq-motor-1',
      category: 'motor-controller',
      question: 'Do you repair electric scooty/bike motors, and why do you NOT do rewinding?',
      answer: 'Yes, we specialize in high-precision component-level motor repair — explicitly without copper stator rewinding. Roadside mechanics frequently tell customers that a vibrating or locking motor is "burnt" and demand PKR 18,000+ for rewinding. In reality, modern brushless DC (BLDC) hub and mid-drive motors are wound with heavy-gauge enameled copper on automated robotic factory lines, and copper coils rarely ever burn! What actually fails are the small hall effect sensors (damaged by heat or moisture), worn wheel bearings, rusted rotor magnets, or pinched phase cables. Rewinding by hand degrades factory motor efficiency, introduces phase asymmetry, and damages internal neodymium magnets. Instead, we replace hall sensors with high-temperature automotive sensors, press in premium Japanese SKF sealed bearings, de-rust stators with marine waterproof coating, and dynamically balance the rotor — restoring 100% factory whisper-quiet performance for a fraction of the cost.',
      keyPoints: [
        'Strict component-level repair discipline: Factory copper coils rarely need rewinding',
        'Saves up to 70% in repair cost compared to rewinding or buying an imported motor',
        'Installed high-temperature automotive Honeywell hall sensors rated up to 150°C',
        'Japanese SKF low-friction sealed bearings pressed in for silent, effortless rolling'
      ]
    },
    {
      id: 'faq-motor-2',
      category: 'motor-controller',
      question: 'My electric scooter shudders, buzzes loudly, or locks the wheel when accelerating. What is wrong?',
      answer: "This is the classic hallmark of either a blown motor hall effect sensor or a shorted high-side MOSFET in your controller. When one of the three hall sensors fails, the controller loses precision tracking of the rotor magnetic poles, firing current into the wrong phase wire and causing severe motor shuddering, buzzing, and power cutouts. If the rear wheel feels stiff and actively resists rolling even when pushed by hand, one of the controller's MOSFET transistors has shorted together, creating a permanent regenerative magnetic brake. Our mobile technician can test your phase lines with an oscilloscope at your doorstep in under 15 minutes to pinpoint the exact failure.",
      keyPoints: [
        'Stiff wheel resistance indicates a shorted controller MOSFET',
        'Loud buzzing or stuttering upon throttle twist indicates a failed hall sensor',
        'Quick 15-minute diagnostic pinpoints the exact component needing replacement'
      ]
    },
    {
      id: 'faq-controller-1',
      category: 'motor-controller',
      question: 'Can a damaged or burnt motor controller be repaired instead of spending PKR 25,000+ on a replacement?',
      answer: 'Yes! Authorized dealerships and importers almost never repair controllers; they simply tell you to order a whole new unit from abroad costing PKR 15,000 to PKR 35,000 with weeks of waiting time. In over 90% of controller breakdowns, the main micro-controller chip (MCU) is perfectly intact, and only 1 to 3 power MOSFET transistors, a gate driver resistor, or a 5V buck regulator step-down chip have failed due to thermal overload or voltage spikes. On our electronics test bench, we desolder the damaged transistors, install genuine ultra-low-resistance MOSFETs (such as IRFB4110), reinforce the high-current copper power rails with silver solder, tune the FOC sine-wave parameters, and re-seal the casing with waterproof thermal paste.',
      keyPoints: [
        'Saves up to 75% compared to purchasing an imported Chinese controller',
        'Same-day or 24-hour turnaround on our micro-electronics test bench',
        'High-current copper busbars reinforced to prevent future summer heat burnouts',
        'Sine-wave FOC parameters tuned for progressive, silky smooth throttle response'
      ]
    },
    {
      id: 'faq-diagnostics-1',
      category: 'diagnostics',
      question: 'What is included in an Electrification Diagnostic scan, and how does it detect phantom power drops?',
      answer: "Our computerized Electrification Diagnostic is a comprehensive audit of your two-wheeler's high-voltage and low-voltage systems. If your scooty display claims 80% charge but dies abruptly when climbing a flyover on GT Road, standard multimeters will not find the fault. We connect a multi-channel cell voltage logger and apply a dynamic 25A load to measure real-time voltage sag across every individual series cell group, identifying cell imbalance (delta mV). We also test 4-wire AC internal resistance (IR), map throttle voltage progression (0.8V to 4.2V), inspect brake cut-off switches, test 12V DC-DC converter output stability, and verify ground insulation integrity to ensure zero stray electrical leakage.",
      keyPoints: [
        'Taps BMS balance leads under dynamic 25A load to detect hidden weak cell groups',
        'Measures milliohm AC internal resistance to catch battery thermal bottlenecks',
        'Comprehensive scan covers throttle, brake interlocks, controller, and wiring harness',
        'Detailed digital health report explaining State of Health (SOH) and State of Charge (SOC)'
      ]
    },
    {
      id: 'faq-maintenance-1',
      category: 'maintenance',
      question: "What is covered in Next Gen EV Care's 24-Point Full Service and Maintenance package?",
      answer: 'While electric scooters do not need motor oil or spark plugs, they endure intense thermal, mechanical, and electrical stresses on Pakistani roads. Our 24-Point Comprehensive Full Service covers: (1) Pressure bleeding and flushing hydraulic brake calipers with fresh DOT4 fluid; (2) Disc brake pad wear inspection and rotor trueing; (3) Steering stem head cone bearing adjustment; (4) Front fork and rear damper suspension greasing; (5) High-current terminal torque checks (tightening loose bolts prevents localized melting); (6) Battery pack SOH health and connector inspection; (7) Dielectric greasing of all wiring harness plugs; (8) Hub motor axle oil seal inspection and drip-loop verification; (9) Throttle linearity and regenerative brake switch calibration; (10) Road dyno safety test.',
      keyPoints: [
        'Complete 24-point electrical, mechanical, and safety inspection',
        'Hydraulic brake flush ensures instantaneous stopping power',
        'High-current terminal torquing stops loose plugs from melting under load',
        'Recommended every 5,000 km or twice a year to keep your EV running like new'
      ]
    },
    {
      id: 'faq-maintenance-2',
      category: 'maintenance',
      question: "How do I protect my electric scooter's controller and motor during heavy monsoon rains in Punjab?",
      answer: 'Monsoon rains in Gujranwala and central Punjab create deep standing water and flooded streets. While electric motors do not have air intakes, water entering the controller or motor axle bearings can cause severe short circuits. We apply a 3-step monsoon waterproofing protocol: (1) We relocate controllers that are mounted low beneath the footboard to a higher, sheltered under-seat cavity or seal them with conformal silicone coating; (2) We inspect motor axle O-rings and create a downward drip-loop curve on phase cables so water drains away from the bearings; (3) We pack high-current Anderson and throttle plugs with waterproof dielectric silicone grease. Never ride through floodwaters that exceed your rear wheel axle height.',
      keyPoints: [
        'Conformal silicone waterproofing applied to controller circuit boards',
        'Axle drip loops prevent water trickling along cables into the motor stator',
        'Dielectric silicone grease insulates electrical plugs against humidity and rainwater'
      ]
    },
    {
      id: 'faq-conversions-1',
      category: 'conversions',
      question: 'When will petrol-to-electric conversion kits (CD 70 / CG 125) be available? [Coming Soon]',
      answer: 'COMMERCIAL CONVERSIONS ARE COMING SOON! Our petrol-to-electric conversion kits for Honda CD 70, Honda CG 125, and classic scooters are currently in an active R&D Pilot Testing phase. Our engineering team is subjecting three pilot prototypes to extensive 10,000-km road durability, thermal stress, and flyover climb tests across GT Road in Gujranwala and Kamoke. We are refining laser-cut chassis mounting brackets, high-efficiency synchronous belt drives, dual hydraulic disc brakes, and PSQCA-compliant safety enclosures. We will open commercial customer bookings once road validation is 100% complete. In the meantime, you can join our Priority Waitlist via our Contact page or WhatsApp (03217436463) to be notified the moment commercial conversions go live.',
      keyPoints: [
        'PROJECT STATUS: COMING SOON — Undergoing rigorous 10,000-km road durability testing',
        'Custom CNC laser-cut mounting brackets engineered specifically for Honda CD 70 frame',
        'Priority Reservation Waitlist now open via WhatsApp (03217436463) and Contact form',
        'Will include complete documentation for legal registration with Punjab Excise & Taxation'
      ]
    }
  ];

  // Filtered FAQ items based on category and search query
  const filteredFaqs = useMemo(() => {
    return faqList.filter((item) => {
      const matchesCategory =
        faqCategory === 'all' || item.category === faqCategory;
      const query = faqSearch.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        (item.keyPoints && item.keyPoints.some((kp) => kp.toLowerCase().includes(query)));
      return matchesCategory && matchesSearch;
    });
  }, [faqCategory, faqSearch]);

  const handleExpandAll = () => {
    setOpenFaqIds(faqList.map((f) => f.id));
  };

  const handleCollapseAll = () => {
    setOpenFaqIds([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10 sm:space-y-12">
      
      {/* FAQ Header & Introduction */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            <span className="uppercase tracking-wider">FREQUENTLY ASKED QUESTIONS · TECHNICAL KNOWLEDGE CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions & Repair Guides
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Clear, transparent technical answers directly from our EV powertrain engineers in Gujranwala. Learn about our rapid doorstep response, component-level motor repairs (hall sensors & bearings — why we never rewind), controller fixes, battery testing, and upcoming conversion kits.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions (e.g. Doorstep, Motor, MOSFET)..."
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs"
          />
        </div>
      </div>

      {/* Filter Category Tabs & Accordion Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Category Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto max-w-full">
          <button
            onClick={() => setFaqCategory('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              faqCategory === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Questions ({faqList.length})
          </button>

          <button
            onClick={() => setFaqCategory('doorstep')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              faqCategory === 'doorstep'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Door-to-Door Service</span>
          </button>

          <button
            onClick={() => setFaqCategory('motor-controller')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              faqCategory === 'motor-controller'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-emerald-500" />
            <span>Motor & Controller (No Winding)</span>
          </button>

          <button
            onClick={() => setFaqCategory('diagnostics')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              faqCategory === 'diagnostics'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Microscope className="w-3.5 h-3.5 text-emerald-500" />
            <span>Electrification Diagnostics</span>
          </button>

          <button
            onClick={() => setFaqCategory('maintenance')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              faqCategory === 'maintenance'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-500" />
            <span>Full Maintenance</span>
          </button>

          <button
            onClick={() => setFaqCategory('conversions')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              faqCategory === 'conversions'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Conversions (Coming Soon)</span>
          </button>
        </div>

        {/* Expand / Collapse All */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto text-xs text-slate-500">
          <button
            onClick={handleExpandAll}
            className="hover:text-emerald-500 font-medium transition-colors"
          >
            Expand All
          </button>
          <span>·</span>
          <button
            onClick={handleCollapseAll}
            className="hover:text-emerald-500 font-medium transition-colors"
          >
            Collapse All
          </button>
        </div>

      </div>

      {/* FAQ Accordion List */}
      {filteredFaqs.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">No matching questions found</p>
          <p className="text-xs text-slate-500 mt-1">Try another search term or reset the category filter.</p>
          <button
            onClick={() => { setFaqCategory('all'); setFaqSearch(''); }}
            className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-200 shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 focus:outline-none hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="uppercase">
                        {faq.category === 'doorstep'
                          ? 'Door-to-Door Service (Main Focus)'
                          : faq.category === 'motor-controller'
                          ? 'Motor & Controller (No Winding)'
                          : faq.category === 'diagnostics'
                          ? 'Electrification Diagnostics'
                          : faq.category === 'maintenance'
                          ? 'Full Service & Maintenance'
                          : 'Upcoming Project (Coming Soon)'}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 mt-0.5 group-hover:text-emerald-500 transition-colors">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {/* Accordion Content */}
                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-4 animate-in fade-in duration-150">
                    <p className="leading-relaxed">
                      {faq.answer}
                    </p>

                    {faq.keyPoints && faq.keyPoints.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800/80 space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                          Key Workshop Insights:
                        </span>
                        <div className="space-y-1.5">
                          {faq.keyPoints.map((point, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Still Have Questions CTA Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Have a specific EV question or breakdown?</span>
          </div>
          <h4 className="text-lg sm:text-xl font-bold text-white">
            Our Master Technicians Are Ready Across Gujranwala
          </h4>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Whether your scooter is shuddering, the wheel is locked, or you need doorstep service in Model Town, Cantt, DC Colony, or Muhafiz Town, contact us immediately.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="https://wa.me/923217436463?text=Hello%20Next%20Gen%20EV%20Care!%20I%20have%20a%20question%20about%20electric%20scooter%20/%20bike%20service%20in%20Gujranwala."
            target="_blank"
            rel="noreferrer"
            className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp (03217436463)</span>
          </a>

          {setActiveTab ? (
            <button
              onClick={() => {
                setActiveTab('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <span>Book Doorstep Visit</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          ) : (
            <a
              href="#contact"
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <span>Book Doorstep Visit</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </a>
          )}
        </div>
      </div>

    </div>
  );
};
