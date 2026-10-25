import { PortfolioItem, BlogPost, CustomerInquiry } from '../types';

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'port-1',
    title: '72V 42Ah High-Range Retrofit for Honda Activa Conversion',
    category: 'conversions',
    vehicleModel: 'Honda Activa 5G (Custom EV Retrofit)',
    description: 'Complete powertrain overhaul replacing the 110cc internal combustion engine with a high-torque 3.2kW BLDC mid-drive motor, CNC motor mounting brackets, and a custom 72V 42Ah NMC battery pack engineered to fit under the seat while preserving the lower luggage space.',
    technicalSpecs: {
      voltage: '72V Nominal (84V Peak)',
      capacity: '42Ah (3.02 kWh)',
      motor: '3.2kW Mid-Drive BLDC (140 Nm wheel torque)',
      rangeGain: '125 km real-world urban range',
      bms: 'Smart ANT BMS with Bluetooth telemetry'
    },
    status: 'Completed',
    metrics: {
      label: 'True City Range',
      value: '125 km'
    },
    image: '/src/assets/images/custom_ev_conversion_1792957575143.jpg',
    completedDate: 'October 2026',
    clientFeedback: '"The Activa rides smoother than ever. Zero vibrations, instant throttle response, and 120km on a single overnight charge has saved me ₹4,500 every single month."',
    highlights: [
      'Dual disc braking upgrade with electronic regenerative braking system',
      'Aircraft-grade 6061 aluminium battery enclosure with internal silicone damping',
      'Custom IP67 wiring harness with automotive Deutsch connectors',
      '0-50 km/h acceleration reduced to 4.2 seconds'
    ]
  },
  {
    id: 'port-2',
    title: 'Custom 60V 35Ah LFP Battery Pack with Active Balancing',
    category: 'battery',
    vehicleModel: 'Ather 450X & Universal 60V Scooters',
    description: 'Designed and assembled a 20S Grade-A Lithium Iron Phosphate (LiFePO4) battery pack engineered for exceptional thermal stability in high-ambient summer conditions. Integrated a 5A active inductive cell balancer to guarantee less than 5mV cell variance across 3,000 charge cycles.',
    technicalSpecs: {
      voltage: '64V Nominal (73V Cut-off)',
      capacity: '35Ah (2.24 kWh)',
      bms: '100A Continuous Smart BMS with Daly CAN-bus integration',
      rangeGain: '+35% lifespan over stock NMC'
    },
    status: 'Completed',
    metrics: {
      label: 'Cycle Life Expectancy',
      value: '3,000+ Cycles'
    },
    image: '/src/assets/images/ev_battery_pack_tech_1792957574705.jpg',
    completedDate: 'September 2026',
    clientFeedback: '"Our commercial delivery fleet had constant heat cutoffs during hot afternoons. Next Gen EV Care re-engineered our packs with active balancing and we haven’t had a single breakdown in 4 months."',
    highlights: [
      'Pure nickel 0.2mm strip spot-welded with pneumatic micro-arc welder',
      'Dual NTC temperature sensors mounted directly to center cell cores',
      'Flame-retardant G10 epoxy insulation between parallel cell banks',
      'Thermal runaway resistant chemistry suitable for up to 55°C operating temps'
    ]
  },
  {
    id: 'port-3',
    title: 'High-Torque Hub Motor & Phase Inverter Fault Diagnostics',
    category: 'diagnostics',
    vehicleModel: 'Ola S1 Pro & High-Speed Electric Scooters',
    description: 'Customer experienced severe motor shuddering, erratic acceleration cutouts, and error codes during uphill climbs. Utilized 4-channel digital oscilloscope to pinpoint a burnt hall sensor in phase B and MOSFET gate breakdown inside the motor controller.',
    technicalSpecs: {
      voltage: '72V High-Frequency Controller',
      capacity: 'Diagnostics & Component Level Repair',
      motor: '5.5kW Peak Hub Motor Rewound & Sensor Calibrated',
      bms: 'Phase current balanced within 0.8%'
    },
    status: 'Completed',
    metrics: {
      label: 'Diagnostics Turnaround',
      value: '18 Hours'
    },
    image: '/src/assets/images/ev_diagnostics_motor_1792957576018.jpg',
    completedDate: 'August 2026',
    clientFeedback: '"Authorized service centers told me I needed a whole new motor assembly costing ₹28,000. Next Gen EV Care diagnosed the faulty hall sensors and restored it to factory smooth performance at a fraction of the cost."',
    highlights: [
      'Replaced factory hall sensors with high-temperature Honeywell automotive sensors',
      'Applied vacuum-pressure varnish impregnation on stator coils for improved thermal conduction',
      'Re-soldered high-current MOSFET array with silver-bearing lead-free alloy',
      'Dynamometer load test performed at full continuous 80A current'
    ]
  },
  {
    id: 'port-4',
    title: 'Vintage Bajaj Chetak Electric Restomod Conversion',
    category: 'conversions',
    vehicleModel: 'Bajaj Chetak 1998 Classic Chassis',
    description: 'A nostalgic heritage restoration converted to whisper-quiet electric propulsion. Retained the iconic pressed-steel body, mechanical hand gear look, and retro dashboard while concealing a 48V 32Ah removable battery under the side cowl and a 2.0kW rear hub motor.',
    technicalSpecs: {
      voltage: '48V Nominal',
      capacity: '32Ah (1.53 kWh)',
      motor: '2.0kW High-Efficiency Waterproof BLDC Hub Motor',
      rangeGain: '75 km cruising range'
    },
    status: 'Completed',
    metrics: {
      label: 'Cruising Range',
      value: '75 km'
    },
    image: '/src/assets/images/hero_ev_workshop_1792957574841.jpg',
    completedDate: 'July 2026',
    clientFeedback: '"It turns heads everywhere! The classic vintage Chetak silhouette with modern silent electric torque is pure magic."',
    highlights: [
      'Preserved authentic vintage speedometer with custom calibrated pulse sensor',
      'Quick-release lockable side-cowl battery bay for easy apartment charging',
      'Full LED conversion for retro headlights and indicator lamps',
      'Regenerative braking with automatic brake light engagement'
    ]
  },
  {
    id: 'port-5',
    title: 'Fleet Battery Cell Grading & Health Restoration',
    category: 'battery',
    vehicleModel: 'Multi-Brand Delivery Scooters (Hero Electric / Okinawa)',
    description: 'Processed 85 aged battery packs showing severe range degradation. Disassembled, isolated cells, tested individual internal resistance (IR) via 4-wire AC milliohm meter, graded capacity, and re-grouped matched cells into high-performance rejuvenated packs.',
    technicalSpecs: {
      voltage: '48V / 60V Packs',
      capacity: 'Reconditioned 24Ah - 30Ah',
      bms: 'Upgraded with waterproof IP67 hardware BMS'
    },
    status: 'Completed',
    metrics: {
      label: 'Capacity Recovery',
      value: '+92% SOH'
    },
    image: '/src/assets/images/ev_battery_pack_tech_1792957574705.jpg',
    completedDate: 'June 2026',
    clientFeedback: '"We saved over 60% compared to purchasing new battery packs. The rejuvenated batteries perform like new with zero range drop."',
    highlights: [
      'Comprehensive cell sorting: <2% capacity variance per parallel group',
      'Eliminated high internal resistance bottleneck cells causing premature BMS low-voltage cutoffs',
      'Upgraded heavy-duty silicone discharge leads with Anderson SB50 connectors',
      'Supplied complete 6-month commercial cycle warranty'
    ]
  },
  {
    id: 'port-6',
    title: 'Controller Firmware Remapping & Throttle Linearity Fix',
    category: 'diagnostics',
    vehicleModel: 'Hero Electric Optima & Custom 60V Scooters',
    description: 'Fixed dangerous jerky throttle response and sudden cutoffs. Reprogrammed FOC (Field Oriented Control) parameters, calibrated throttle deadbands, and tuned regenerative braking curves for progressive, seamless deceleration.',
    technicalSpecs: {
      voltage: '60V Sine-Wave Controller',
      capacity: '28Ah (1.68 kWh)',
      motor: '1.5kW BLDC Motor',
      rangeGain: '+12% range via optimized flux-weakening'
    },
    status: 'Completed',
    metrics: {
      label: 'Efficiency Boost',
      value: '+12% Wh/km'
    },
    image: '/src/assets/images/ev_diagnostics_motor_1792957576018.jpg',
    completedDate: 'May 2026',
    clientFeedback: '"The throttle was previously snappy and felt unsafe in tight traffic. After Next Gen EV Care tuned the controller curve, it rides buttery smooth."',
    highlights: [
      'Adjusted phase current ramp rate to eliminate front wheel spin on wet tarmac',
      'Fine-tuned low-speed torque delivery for effortless parking and incline starts',
      'Thermal foldback protection configured at 75°C to avoid sudden power loss',
      'Waterproof potting applied to controller wiring harness'
    ]
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Diagnosing Cell Imbalance & State of Health (SOH) in 2-Wheeler Lithium Packs',
    slug: 'diagnosing-cell-imbalance-soh-lithium-packs',
    category: 'battery-tech',
    excerpt: 'Learn why your EV scooter display might claim 80% charge but dies abruptly after 5 kilometers. A deep dive into series cell delta voltage, BMS cutoffs, and active balancing methods.',
    content: [
      'One of the most frequent complaints electric scooter riders bring to our workshop is the "Phantom Range Drop": the dashboard shows 70% or 80% battery capacity remaining, but under moderate acceleration or on a small incline, the vehicle suddenly cuts off completely.',
      'In 95% of cases, the lithium cells themselves are not uniformly degraded. Instead, a single series cell group (e.g., group 7 in a 16S pack) has developed higher internal resistance or lower capacity. When current is drawn, this weak group hits the BMS low-voltage cutoff threshold (typically 2.8V to 3.0V for NMC chemistry) long before the remaining 15 groups do.',
      'To diagnose this properly, never rely purely on total pack voltage measured with a basic multimeter. You must tap into the BMS balance lead connector with a calibrated multi-channel cell logger or smart BMS Bluetooth interface under an active discharge load (at least 15A to 25A).',
      'A healthy battery pack should exhibit no more than 15mV to 25mV of delta between the highest and lowest cell group at rest, and no more than 80mV delta under sustained acceleration. If your delta exceeds 150mV, your BMS will repeatedly trip into emergency protection mode.',
      'Solution Protocol: For mild imbalance (<100mV), an active cell balancer left connected over a 24-hour cycle can restore equilibrium. However, if individual cell internal resistance exceeds 25 milliohms compared to the pack average of 14 milliohms, that cell group must be isolated, graded, and replaced with identical capacity and batch-matched cells.'
    ],
    readTime: '6 min read',
    publishedAt: 'October 18, 2026',
    author: {
      name: 'Rohan Sharma',
      role: 'Master EV Powertrain Specialist'
    },
    tags: ['Battery Tech', 'BMS', 'Lithium Ion', 'Diagnostics'],
    featured: true,
    image: '/src/assets/images/ev_battery_pack_tech_1792957574705.jpg'
  },
  {
    id: 'blog-2',
    title: 'Why Electric Scooters Shudder & Jerk: Hall Sensors vs Controller Phase Failure',
    slug: 'why-ev-scooters-shudder-hall-sensors-vs-phase-failure',
    category: 'diagnostics',
    excerpt: 'Is your electric bike hesitating from a dead stop or making a grinding buzzing sound from the rear wheel? Here is the exact oscilloscope diagnostic method to isolate the issue.',
    content: [
      'When an electric scooter motor vibrates violently, makes a buzzing resonance at low RPM, or refuses to roll without a manual kick-start, technicians often jump to conclusions and propose an expensive whole-motor replacement.',
      'In reality, the Brushless DC (BLDC) motor stator is almost always intact. The culprit is nearly always one of two things: a blown hall effect sensor on the stator PCB, or a blown low-side MOSFET transistor inside the electronic speed controller.',
      'Step 1: The Phase Resistance Test. Disconnect the three heavy phase wires (typically Yellow, Green, Blue) from the controller. Spin the wheel by hand. If it spins freely, the stator is not shorted. Next, touch two phase wires together while spinning; you should feel distinct magnetic cogging resistance. Repeat across all pairs (Y-G, G-B, B-Y). Equal resistance confirms the windings are balanced.',
      'Step 2: Testing Hall Effect Sensors. Supply 5V DC to the red and black hall power wires. Connect your digital multimeter between the black ground and each signal wire (Yellow, Green, Blue) one at a time. Slowly rotate the rear wheel by hand. You should observe a crisp toggle between 0V (low) and ~4.8V (high) every few degrees of rotation. If any phase stays locked at 0V or 5V, that specific hall sensor has suffered electrostatic or thermal failure.',
      'At Next Gen EV Care, we replace standard OEM hall sensors with automotive-grade Honeywell sensors rated up to 150°C, and seal the stator harness with high-temperature epoxy to prevent moisture ingress.'
    ],
    readTime: '5 min read',
    publishedAt: 'September 28, 2026',
    author: {
      name: 'Aditya Patel',
      role: 'Senior EV Diagnostics Engineer'
    },
    tags: ['BLDC Motors', 'Hall Sensors', 'Diagnostics', 'Controllers'],
    featured: true,
    image: '/src/assets/images/ev_diagnostics_motor_1792957576018.jpg'
  },
  {
    id: 'blog-3',
    title: 'Monsoon EV Care: Waterproofing Controllers, Throttle Pots & High-Voltage Connectors',
    slug: 'monsoon-ev-care-waterproofing-controllers-connectors',
    category: 'maintenance',
    excerpt: 'Water ingress is the #1 killer of electric 2-wheelers during rainy seasons. Follow our workshop checklist to waterproof key connections and avoid expensive controller burnouts.',
    content: [
      'Unlike internal combustion engines with air intake filters and exhaust pipes, electric two-wheelers do not run on combustion air. However, standing rainwater containing road salts and debris is an aggressive conductor that destroys sensitive electronic controllers and battery management systems.',
      'Key Vulnerability 1: The Throttle Hall Potentiometer. Rainwater runs down the handlebar grip straight into the throttle assembly housing. When water bridges the 5V power and signal pins, it can cause the scooter to surge unintentionally or register an accelerator error cutoff.',
      'Key Vulnerability 2: Non-Waterproof Controller Phase Connectors. Many budget electric scooters use standard nylon bullet connectors for motor phase lines. Under 40A to 60A current draw, these connectors get warm; during heavy rain, thermal contraction draws moisture inside, causing electrolysis and melted plastic.',
      'Our Workshop Waterproofing Checklist:',
      '1. Replace all chassis connectors with IP67 rated Deutsch DT or Superseal waterproof connectors.',
      '2. Apply conformal silicone coating (MG Chemicals 422B) across all exposed controller and BMS circuit boards.',
      '3. Pack dielectric grease inside high-current battery Anderson connectors to displace oxygen and moisture.',
      '4. Inspect the motor hub axle seal: ensure the drip-loop curve is present on the phase harness so droplets roll off rather than traveling into the axle bearings.'
    ],
    readTime: '4 min read',
    publishedAt: 'August 14, 2026',
    author: {
      name: 'Rohan Sharma',
      role: 'Master EV Powertrain Specialist'
    },
    tags: ['Maintenance', 'Waterproofing', 'Monsoon Care', 'Safety'],
    featured: false,
    image: '/src/assets/images/hero_ev_workshop_1792957574841.jpg'
  },
  {
    id: 'blog-4',
    title: 'LFP vs NMC Chemistries for 2-Wheelers: Thermal Realities in Tropical Climates',
    slug: 'lfp-vs-nmc-chemistries-for-two-wheelers-tropical-climates',
    category: 'battery-tech',
    excerpt: 'Comparing Lithium Iron Phosphate (LiFePO4) against Nickel Manganese Cobalt (NMC). Which chemistry is safer, longer-lasting, and best suited for intense summer heatwaves?',
    content: [
      'When retrofitting or replacing an electric scooter battery pack, riders frequently ask whether they should opt for high-density NMC or ultra-durable LFP.',
      'Gravimetric Energy Density: NMC holds a clear lead here, delivering approximately 200–240 Wh/kg versus 130–160 Wh/kg for LFP. This means an NMC pack is roughly 35% lighter and more compact for the same driving range—critical if your scooter has limited under-seat storage space.',
      'Thermal Runaway Onset: Here, LFP is the indisputable champion. NMC begins exothermic thermal decomposition at approximately 210°C, releasing free oxygen that accelerates internal combustion. In contrast, LFP has an exceptionally stable olivine phosphate molecular structure that does not break down until beyond 270°C, and will not self-oxygenate.',
      'Cycle Lifespan: High-quality NMC cells offer 800 to 1,200 full charge-discharge cycles before dropping to 80% capacity (roughly 3 to 4 years of daily commuting). Prismatic LFP cells routinely achieve 2,500 to 3,500+ cycles (8 to 10+ years of daily use).',
      'Our Recommendation: If your electric scooter travels heavy commercial distances (delivery fleets, daily 50km+ commutes) in hot climates, LFP is the ultimate investment in safety and total cost of ownership. If your vehicle requires maximum speed and range with strict space limits, high-grade NMC with active temperature monitoring is the ideal choice.'
    ],
    readTime: '7 min read',
    publishedAt: 'July 10, 2026',
    author: {
      name: 'Dr. Sameer Khan',
      role: 'Battery Materials & Electrochemistry Consultant'
    },
    tags: ['LFP', 'NMC', 'Battery Chemistry', 'Thermal Safety'],
    featured: false,
    image: '/src/assets/images/ev_battery_pack_tech_1792957574705.jpg'
  },
  {
    id: 'blog-5',
    title: 'Converting an IC Engine Scooter into a Highway-Legal Electric Vehicle',
    slug: 'converting-ic-engine-scooter-highway-legal-ev',
    category: 'retrofitting',
    excerpt: 'An engineer breakdown of converting a petrol 110cc scooter into a high-torque electric commuter: structural bracing, motor alignment, swingarm design, and RTO certification guidelines.',
    content: [
      'Converting an older petrol scooter into an electric vehicle is one of the most rewarding mechanical and ecological transformations you can undertake. However, simply bolting an electric motor where the petrol engine once sat leads to poor handling and structural failure if not engineered systematically.',
      'Weight Distribution & Center of Gravity: An empty 110cc engine and transmission assembly weighs around 28–32 kg mounted low on the rear swingarm. When substituting this with a 20 kg lithium battery pack, you must position the battery low between the rider footboard and main chassis spine to preserve neutral cornering dynamics.',
      'Mid-Drive vs Hub Motor for Conversions: For scooters with small 10-inch or 12-inch wheels, a direct-drive hub motor simplifies the conversion by eliminating chains, belts, and gearbox maintenance. However, unsprung wheel mass increases. If high torque for steep flyovers is desired, a mid-drive motor with a synchronous timing belt gives superior gear reduction and hill-climbing thrust.',
      'Braking & Regenerative Integration: Electric motors deliver instant peak torque at 0 RPM. Factory drum brakes on older scooters are inadequate. Always upgrade the front fork to hydraulic disc brakes and wire the brake light switch to trigger electronic regenerative braking on the controller to reclaim 8% to 12% of braking energy.'
    ],
    readTime: '8 min read',
    publishedAt: 'June 22, 2026',
    author: {
      name: 'Rohan Sharma',
      role: 'Master EV Powertrain Specialist'
    },
    tags: ['Retrofitting', 'EV Conversion', 'Engineering', 'Custom Builds'],
    featured: false,
    image: '/src/assets/images/custom_ev_conversion_1792957575143.jpg'
  }
];

export const INITIAL_INQUIRIES: CustomerInquiry[] = [
  {
    id: 'inq-1',
    name: 'Vikram Joshi',
    phone: '+91 98201 45890',
    email: 'vikram.joshi@example.com',
    vehicleModel: 'Honda Activa 4G (2018)',
    serviceType: 'Custom EV Conversion',
    message: 'Looking to convert my petrol Activa to electric with at least 80km range for daily office commute. Please share estimate and turnaround timeline.',
    preferredDate: '2026-11-02',
    submittedAt: '2026-10-24 14:30',
    status: 'New'
  },
  {
    id: 'inq-2',
    name: 'Pooja Nair',
    phone: '+91 99345 88210',
    email: 'pnair.tech@example.com',
    vehicleModel: 'Ather 450X (Gen 3)',
    serviceType: 'Battery Diagnostic & Balancing',
    message: 'Vehicle cuts off suddenly at 25% battery when accelerating up my apartment ramp. Need complete battery SOH test and cell balancing.',
    preferredDate: '2026-10-28',
    submittedAt: '2026-10-25 09:15',
    status: 'Scheduled'
  }
];
