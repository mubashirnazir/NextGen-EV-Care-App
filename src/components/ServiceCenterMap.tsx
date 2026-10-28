import React, { useState } from 'react';
import { 
  MapPin, 
  Truck, 
  Wrench, 
  BatteryCharging, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Phone, 
  MessageSquare, 
  Navigation, 
  Crosshair, 
  CheckCircle2, 
  ChevronRight,
  ExternalLink,
  Info,
  Compass
} from 'lucide-react';

export interface ServiceLocation {
  id: string;
  name: string;
  type: 'headquarters' | 'mobile-van' | 'station' | 'expressway';
  typeLabel: string;
  zone: string;
  address: string;
  landmark: string;
  coords: { x: number; y: number }; // 0 to 100 percentage
  timing: string;
  phone: string;
  leadTech: string;
  eta: string;
  status: 'Open' | 'Dispatched' | 'Active';
  capabilities: string[];
  isHeadquarters?: boolean;
}

interface ServiceCenterMapProps {
  onSelectLocationForBooking?: (location: ServiceLocation) => void;
}

export const ServiceCenterMap: React.FC<ServiceCenterMapProps> = ({
  onSelectLocationForBooking
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>('loc-hq');
  const [filterType, setFilterType] = useState<'all' | 'headquarters' | 'mobile-van' | 'station'>('all');
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);

  const locations: ServiceLocation[] = [
    {
      id: 'loc-hq',
      name: 'Mughal Plaza Central Tech Lab (Main Workshop HQ)',
      type: 'headquarters',
      typeLabel: 'Central Workshop & Bench Lab',
      zone: 'Muhafiz Town / Service Road',
      address: 'Mughal Plaza, Mughal Chok, Service Road Main gate Muhafiz Town Gujranwala',
      landmark: 'Main Gate Muhafiz Town, Opposite Service Road',
      coords: { x: 52, y: 48 },
      timing: 'Mon–Sat: 9:00 AM – 8:00 PM (Sun Prior Appointment)',
      phone: '03217436463',
      leadTech: 'Engr. Hamza Mughal (Powertrain Lead)',
      eta: 'Instant Walk-in & Diagnostics',
      status: 'Open',
      isHeadquarters: true,
      capabilities: [
        'Component-Level BLDC Motor Repair (Hall Sensors & SKF Bearings)',
        'SMD Controller & Inverter MOSFET Rebuilding Bench',
        'Computerized High-Voltage Battery Diagnostic & Active Balancing',
        '24-Point Comprehensive Preventive Maintenance Lift',
        'Lithium-Ion / LiFePO4 Spot-Welding & Smart BMS Calibration'
      ]
    },
    {
      id: 'loc-model-town',
      name: 'Model Town & City Core Doorstep Mobile Unit',
      type: 'mobile-van',
      typeLabel: 'Rapid Doorstep Response Van',
      zone: 'Model Town, Trust Plaza, Civil Lines',
      address: 'Dispatched from Mughal Plaza to all Model Town sectors',
      landmark: 'Covering Model Town A, B, C & Commissioner Road',
      coords: { x: 36, y: 64 },
      timing: 'Daily: 9:30 AM – 7:30 PM',
      phone: '03217436463',
      leadTech: 'Zubair Akram (Field Diagnostic Specialist)',
      eta: '25 – 45 min doorstep arrival',
      status: 'Dispatched',
      capabilities: [
        'Driveway Electronic Throttle & Wiring Harness Repair',
        'Brake Fluid Pressure Bleed & Ceramic Pad Replacement',
        'Digital Hall Effect Sensor Scope Testing on the spot',
        '12V DC-DC Converter and Relay System Replacement'
      ]
    },
    {
      id: 'loc-cantt',
      name: 'Cantt & DC Colony Fast Support Station',
      type: 'station',
      typeLabel: 'Mobile Support Post',
      zone: 'Gujranwala Cantt & DC Colony',
      address: 'Near Cantt Commercial Plaza, GT Road corridor',
      landmark: 'Near DC Colony Main Gate & Garrison Park',
      coords: { x: 44, y: 26 },
      timing: 'Daily: 10:00 AM – 7:00 PM',
      phone: '03217436463',
      leadTech: 'Usman Tariq (High-Voltage Tech)',
      eta: '30 – 50 min doorstep arrival',
      status: 'Active',
      capabilities: [
        'Battery Delta Voltage Sag Analysis under load',
        'Wheel Bearing Noise Diagnosis & Replacement',
        'Controller Overheating & Thermal Paste Resealing',
        'Emergency roadside power cutoff recovery'
      ]
    },
    {
      id: 'loc-rahwali',
      name: 'Rahwali & GT Road North Hub',
      type: 'station',
      typeLabel: 'Northern Corridor Dispatch',
      zone: 'Rahwali, Cantt Railway, GT Road North',
      address: 'Main GT Road Junction, Rahwali Gujranwala',
      landmark: 'Near Rahwali Sugar Mills bypass cut',
      coords: { x: 74, y: 18 },
      timing: 'Mon–Sat: 10:00 AM – 8:00 PM',
      phone: '03217436463',
      leadTech: 'Rashid Mehmood (Electrical Diagnostics)',
      eta: '35 – 55 min doorstep arrival',
      status: 'Active',
      capabilities: [
        'Commuter Scooty Emergency Stoppage Assistance',
        'Phase Wire Melt & Anderson Connector Replacement',
        'Smart BMS Firmware & Bluetooth Reset',
        'Tire & Disc Brake Mechanical Trueing'
      ]
    },
    {
      id: 'loc-satellite',
      name: 'Satellite Town & Peoples Colony Doorstep Van',
      type: 'mobile-van',
      typeLabel: 'Western Sector Dispatch Van',
      zone: 'Satellite Town, Peoples Colony, Pasrur Road',
      address: 'Civic Center & Satellite Town Market link',
      landmark: 'Near Poly Tech College & Peoples Colony Circle',
      coords: { x: 26, y: 44 },
      timing: 'Daily: 10:00 AM – 7:00 PM',
      phone: '03217436463',
      leadTech: 'Bilal Hassan (Mobile EV Mechanic)',
      eta: '25 – 40 min doorstep arrival',
      status: 'Dispatched',
      capabilities: [
        'Door-to-door full 24-point electrical and mechanical tune-up',
        'Vibrating rear wheel magnetic stator de-rusting & lubrication',
        'Digital odometer error code readout (E-01 to E-07)',
        'Monsoon waterproof silicone potting for vulnerable controllers'
      ]
    },
    {
      id: 'loc-kamoke',
      name: 'Kamoke & GT Road South Rapid Unit',
      type: 'expressway',
      typeLabel: 'Southern Highway Response Hub',
      zone: 'GT Road South, Kamoke & Kangniwala',
      address: 'Service Road South, GT Road corridor',
      landmark: 'Near Kangniwala Flyover & bypass',
      coords: { x: 60, y: 84 },
      timing: 'Mon–Sat: 10:00 AM – 7:30 PM',
      phone: '03217436463',
      leadTech: 'Naveed Sadiq (Recovery & Towing Lead)',
      eta: '35 – 50 min arrival',
      status: 'Active',
      capabilities: [
        'Hydraulic lift carrier van for dead scooter transport to Mughal Plaza',
        'Roadside throttle cut-off switch bypass',
        'High-current fuse and breaker replacement',
        'Emergency battery pack testing'
      ]
    }
  ];

  const filteredLocations = locations.filter((loc) => {
    if (filterType === 'all') return true;
    if (filterType === 'headquarters') return loc.type === 'headquarters';
    if (filterType === 'mobile-van') return loc.type === 'mobile-van';
    if (filterType === 'station') return loc.type === 'station' || loc.type === 'expressway';
    return true;
  });

  const selectedLocation = locations.find((l) => l.id === selectedLocationId) || locations[0];

  const handleSelect = (id: string) => {
    setSelectedLocationId(id);
  };

  const handleBookLocation = (loc: ServiceLocation) => {
    if (onSelectLocationForBooking) {
      onSelectLocationForBooking(loc);
    } else {
      // Scroll to form if no callback
      const formEl = document.getElementById('contact');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="space-y-6 pt-4 w-full min-w-0 max-w-full overflow-hidden">
      {/* Header of Map Component */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5">
            <Navigation className="w-4 h-4 text-emerald-500" />
            <span className="uppercase tracking-wider">GUJRANWALA SERVICE CENTERS & DOORSTEP NETWORK</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Interactive Service Center & Mobile Care Map
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Explore our central bench workshop at Mughal Plaza and our active mobile rapid care vans serving every neighborhood in Gujranwala.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="w-full md:w-auto max-w-full flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto min-w-0">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              filterType === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Centers ({locations.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('headquarters')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1 ${
              filterType === 'headquarters'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Main Lab (HQ)</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('mobile-van')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1 ${
              filterType === 'mobile-van'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-blue-500" />
            <span>Mobile Vans</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('station')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1 ${
              filterType === 'station'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BatteryCharging className="w-3.5 h-3.5 text-amber-500" />
            <span>Stations</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map Visualization (Left) + Selected Location Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full min-w-0">
        
        {/* Left Column: Icon-Based Map Visualizer (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-5 shadow-sm space-y-4 w-full min-w-0 max-w-full">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">Live Coverage Grid: Gujranwala</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 shrink-0">Tap icons to inspect</span>
          </div>

          {/* Interactive Schematic Canvas */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner select-none">
            
            {/* Background Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Stylized Metropolitan Transit Corridors (SVG Highways) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gtRoadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#059669" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#047857" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Highway Corridor: Grand Trunk (GT) Road Diagonal */}
              <line x1="82" y1="10" x2="52" y2="48" stroke="url(#gtRoadGrad)" strokeWidth="1.2" strokeDasharray="2,1" />
              <line x1="52" y1="48" x2="40" y2="72" stroke="url(#gtRoadGrad)" strokeWidth="1.2" strokeDasharray="2,1" />
              <line x1="40" y1="72" x2="60" y2="88" stroke="url(#gtRoadGrad)" strokeWidth="1.2" strokeDasharray="2,1" />

              {/* Sialkot Bypass & Northern Expressway Arc */}
              <path d="M 18,30 Q 50,15 88,18" fill="none" stroke="url(#ringGrad)" strokeWidth="0.8" strokeDasharray="1.5,1.5" />

              {/* Cantt & Model Town Link Avenue */}
              <path d="M 44,26 Q 52,48 36,64" fill="none" stroke="#64748b" strokeWidth="0.6" strokeDasharray="1,1" opacity="0.6" />

              {/* Satellite Town - Mughal Plaza East-West Corridor */}
              <line x1="26" y1="44" x2="52" y2="48" stroke="#64748b" strokeWidth="0.6" strokeDasharray="1,1" opacity="0.6" />

              {/* Metropolitan Boundary Ring */}
              <circle cx="50" cy="50" r="42" fill="none" stroke="#10b981" strokeWidth="0.3" strokeDasharray="3,3" opacity="0.25" />
            </svg>

            {/* Geographical Regional Labels */}
            <div className="absolute top-3 left-4 text-[9px] font-mono tracking-widest text-slate-500 uppercase pointer-events-none">
              North Cantt Sector
            </div>
            <div className="absolute bottom-3 left-4 text-[9px] font-mono tracking-widest text-slate-500 uppercase pointer-events-none">
              Model Town · Civil Lines
            </div>
            <div className="absolute top-3 right-4 text-[9px] font-mono tracking-widest text-emerald-500/70 uppercase pointer-events-none">
              GT Road N-5 · Rahwali
            </div>
            <div className="absolute bottom-3 right-4 text-[9px] font-mono tracking-widest text-slate-500 uppercase pointer-events-none">
              Kamoke Expressway
            </div>

            {/* Map Interactive Pins */}
            {filteredLocations.map((loc) => {
              const isSelected = loc.id === selectedLocationId;
              const isHovered = loc.id === hoveredLocationId;
              const isHQ = loc.isHeadquarters;

              return (
                <div
                  key={loc.id}
                  style={{ left: `${loc.coords.x}%`, top: `${loc.coords.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                  onClick={() => handleSelect(loc.id)}
                  onMouseEnter={() => setHoveredLocationId(loc.id)}
                  onMouseLeave={() => setHoveredLocationId(null)}
                >
                  {/* Outer Pulsing Aura */}
                  {isSelected && (
                    <span className="absolute -inset-2.5 rounded-full bg-emerald-500/25 animate-ping pointer-events-none" />
                  )}

                  {/* Pin Body with Icon */}
                  <div className={`relative flex items-center justify-center transition-all duration-200 ${
                    isHQ
                      ? 'w-10 h-10 sm:w-11 sm:h-11 rounded-2xl shadow-lg ring-2 ring-emerald-400 bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 font-bold scale-105'
                      : isSelected
                      ? 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl shadow-md ring-2 ring-emerald-400 bg-slate-900 text-emerald-400'
                      : loc.type === 'mobile-van'
                      ? 'w-8 h-8 rounded-lg bg-blue-500/90 text-white shadow hover:scale-110'
                      : 'w-8 h-8 rounded-lg bg-amber-500/90 text-slate-950 shadow hover:scale-110'
                  }`}>
                    {isHQ ? (
                      <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 fill-slate-950/20" />
                    ) : loc.type === 'mobile-van' ? (
                      <Truck className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    ) : (
                      <BatteryCharging className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    )}

                    {/* Small badge if HQ */}
                    {isHQ && (
                      <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded bg-slate-950 text-emerald-300 text-[8px] font-mono border border-emerald-400">
                        HQ
                      </span>
                    )}
                  </div>

                  {/* Pin Label Tooltip */}
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap pointer-events-none transition-all shadow-md max-w-[130px] sm:max-w-[180px] truncate ${
                    isSelected
                      ? 'bg-emerald-400 text-slate-950 font-bold opacity-100 z-30'
                      : isHovered
                      ? 'bg-slate-800 text-white opacity-100 z-20'
                      : 'opacity-0 group-hover:opacity-100 bg-slate-900 text-slate-200'
                  }`}>
                    {loc.name.split('(')[0].trim()}
                  </div>
                </div>
              );
            })}

            {/* Map Key / Legend at Bottom Left of Map */}
            <div className="absolute bottom-2 left-2 p-2 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-800/80 text-[10px] text-slate-300 space-y-1 hidden sm:block">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-400 text-[11px] mb-1">
                <Compass className="w-3.5 h-3.5" />
                <span>Map Legend</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-400 flex items-center justify-center text-slate-950 text-[8px] font-bold">★</span>
                <span>Main Tech Lab (HQ)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-500 flex items-center justify-center text-white text-[8px]">🚚</span>
                <span>Mobile Doorstep Van</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500 flex items-center justify-center text-slate-950 text-[8px]">⚡</span>
                <span>Diagnostic Post</span>
              </div>
            </div>

          </div>

          {/* Quick Hub Navigation Pills */}
          <div className="w-full max-w-full min-w-0 flex items-center gap-2 overflow-x-auto pb-1 pt-1">
            <span className="text-[11px] text-slate-500 font-semibold shrink-0">Quick View:</span>
            {locations.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleSelect(loc.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 ${
                  loc.id === selectedLocationId
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {loc.isHeadquarters && <span className="text-[9px] text-emerald-500">★</span>}
                <span>{loc.zone.split(',')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Location Detail Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-5 w-full min-w-0 max-w-full">
          
          {/* Card Header & Badge */}
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center justify-between gap-2">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                selectedLocation.isHeadquarters
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : selectedLocation.type === 'mobile-van'
                  ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
              }`}>
                {selectedLocation.typeLabel}
              </span>

              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{selectedLocation.status}</span>
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {selectedLocation.name}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{selectedLocation.zone}</span>
            </p>
          </div>

          {/* Location Specifics */}
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px] uppercase tracking-wider">
                Physical Address / Staging Landmark
              </span>
              <p className="text-slate-900 dark:text-slate-100 font-medium leading-relaxed">
                {selectedLocation.address}
              </p>
              <p className="text-[11px] text-slate-500">
                Landmark: {selectedLocation.landmark}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block">Typical Arrival:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                  {selectedLocation.eta}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block">Lead Specialist:</span>
                <span className="font-semibold text-slate-900 dark:text-white truncate block">
                  {selectedLocation.leadTech.split('(')[0]}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs">
              <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{selectedLocation.timing}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs">
              <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedLocation.phone}</span>
            </div>
          </div>

          {/* Capabilities Checklist */}
          <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-emerald-500" />
              <span>Available Services & Diagnostic Gear:</span>
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
              {selectedLocation.capabilities.map((cap, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-tight">{cap}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Call to Actions for this specific location */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => handleBookLocation(selectedLocation)}
              className="w-full py-2.5 px-4 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Book Appointment For This Zone</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${selectedLocation.phone}`}
                className="py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>Call Center</span>
              </a>

              <a
                href={`https://wa.me/923217436463?text=Hello%20Next%20Gen%20EV%20Care!%20I%20am%20inquirying%20about%20service%20near%20${encodeURIComponent(selectedLocation.name)}.`}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
