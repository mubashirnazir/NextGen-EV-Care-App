import { PortfolioItem, BlogPost, CustomerInquiry } from '../types';

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'port-doorstep-1',
    title: 'Emergency Door-to-Door Motor Diagnostic & Hall Sensor Repair',
    category: 'doorstep',
    vehicleModel: 'Metro E8S Electric Scooter (Gujranwala Cantt Doorstep Visit)',
    description: 'Client was stranded at home when their scooter began vibrating violently and refused to accelerate. Our mobile service van dispatched directly to their residence with portable oscilloscope and diagnostic bench. Diagnosed burnt Phase-A hall sensor on the spot, replaced with high-temperature automotive sensor, tested motor phasing, and restored the vehicle on their driveway in under 90 minutes.',
    technicalSpecs: {
      voltage: '72V Nominal System',
      capacity: 'Doorstep Mobile Service',
      motor: 'Component-Level Sensor Repair (Zero Rewinding)',
      rangeGain: 'Full Restored Acceleration',
      bms: 'Phase sync verified at 120° angle'
    },
    status: 'Completed',
    metrics: {
      label: 'Doorstep Turnaround',
      value: '90 Minutes'
    },
    image: '/src/assets/images/ev_diagnostics_motor_1792957576018.jpg',
    completedDate: 'October 2026',
    clientFeedback: '"Next Gen EV Care\'s door-to-door service is incredible! I didn\'t have to arrange a loader rickshaw to tow my scooty to a mechanic. The technician arrived right at my home in Gujranwala Cantt and fixed the motor sensor right on my driveway."',
    highlights: [
      'Rapid doorstep dispatch across Gujranwala and surrounding areas',
      'Portable 4-channel oscilloscope and mobile soldering station',
      'Installed high-temperature Honeywell automotive hall sensors (rated to 150°C)',
      'No towing required, saving client PKR 3,500 in transport costs'
    ]
  },
  {
    id: 'port-motor-1',
    title: 'BLDC Hub Motor Component Overhaul: Hall Sensors & High-Speed SKF Bearings (No Winding)',
    category: 'motor-controller',
    vehicleModel: 'Yadea T5 Electric Scooty',
    description: 'Motor produced a harsh grinding sound and severe low-RPM stuttering. Previous roadside mechanics wrongly insisted the motor was burnt and required rewinding. Our diagnostic confirmed the copper stator coils were in pristine factory condition. We overhauled the mechanical and electronic components: pressed out rusted bearings, pressed in Japanese SKF sealed bearings, replaced the hall sensor PCB, applied marine waterproof varnish, and sealed axle oil seals.',
    technicalSpecs: {
      voltage: '60V High-Efficiency BLDC',
      capacity: 'Stator Windings Intact (Factory Spec)',
      motor: '2.2kW Hub Motor Component Rebuild',
      rangeGain: 'Whisper-quiet smooth rolling',
      bms: 'Stator insulation resistance >200 Megaohms'
    },
    status: 'Completed',
    metrics: {
      label: 'Client Savings',
      value: '72% vs Rewinding'
    },
    image: '/src/assets/images/ev_diagnostics_motor_1792957576018.jpg',
    completedDate: 'October 2026',
    clientFeedback: '"Other mechanics told me I had to rewind the motor for PKR 18,000 or buy a new motor for PKR 45,000. Next Gen EV Care showed me the windings were 100% fine, replaced the bearings and sensors for a fraction of that price, and it runs quieter than the day I bought it."',
    highlights: [
      'Strict component-level repair discipline: no destructive copper rewinding',
      'Japanese SKF low-friction sealed bearings for zero rolling resistance',
      'Stator de-rusted and treated with high-dielectric waterproof coating',
      'Dynamic balance and hall timing synchronization verified on bench'
    ]
  },
  {
    id: 'port-controller-1',
    title: '72V Sine-Wave FOC Controller Repair: Blown MOSFETs & Throttle Logic Rebuild',
    category: 'motor-controller',
    vehicleModel: 'Crown EV Electric Scooty & Road Prince E-Bikes',
    description: 'Vehicle suffered sudden complete power loss and wheel lockup caused by shorted controller high-side FETs. Instead of replacing the costly imported controller unit, our micro-electronics bench isolated three shorted 100V 120A MOSFET transistors, replaced the failed gate driver resistor network, and re-potted the aluminum casing with heat-conductive silicone.',
    technicalSpecs: {
      voltage: '72V Sine-Wave FOC',
      capacity: 'Component Micro-Rework',
      motor: 'Smooth vector field control restored',
      rangeGain: 'Zero low-speed throttle lag',
      bms: 'Thermal cutoff calibrated to 75°C'
    },
    status: 'Completed',
    metrics: {
      label: 'Repair Turnaround',
      value: 'Same Day'
    },
    image: '/src/assets/images/hero_ev_workshop_1792957574841.jpg',
    completedDate: 'September 2026',
    clientFeedback: '"The dealership wanted me to wait 3 weeks for an imported controller from China. Next Gen EV Care repaired my original controller on the same day. Throttle response is silky smooth!"',
    highlights: [
      'Replaced blown transistors with ultra-low RDS(on) IRFB4110 MOSFETs',
      'Copper busbars reinforced with 1.5mm silver-copper trace overlays',
      'Oscilloscope verification of PWM gate drive waveforms under load',
      '100% waterproof conformal coating reapplied against humidity'
    ]
  },
  {
    id: 'port-diag-1',
    title: 'Electrification Diagnostic Scan & Battery Pack SOH Recovery',
    category: 'diagnostics',
    vehicleModel: 'Road Prince E-Go Fleet & United Scooters',
    description: 'Vehicle dashboard showed 75% battery, but power cut out abruptly whenever accelerating uphill or carrying a passenger. Connected our computerized battery analyzer and tapped the BMS balance harness. Identified a 240mV cell delta caused by group #7 imbalance. Performed active inductive cell balancing, restored cell group capacity, and calibrated BMS over-current trip points.',
    technicalSpecs: {
      voltage: '60V / 72V Lithium Packs',
      capacity: 'Impedance & Delta Testing',
      motor: 'Throttle curve voltage mapped (0.8V to 4.2V)',
      rangeGain: '+35 km recovered range',
      bms: 'Cell delta reduced from 240mV to 12mV'
    },
    status: 'Completed',
    metrics: {
      label: 'SOH Restored',
      value: '94% SOH'
    },
    image: '/src/assets/images/ev_battery_pack_tech_1792957574705.jpg',
    completedDate: 'September 2026',
    clientFeedback: '"My electric scooty was cutting off on flyovers even with 70% charge showing. Their diagnostic found the exact weak cell in minutes, balanced the pack, and now I get my full original range."',
    highlights: [
      'Multi-channel computerized cell voltage logger under 25A dynamic load',
      '4-wire AC internal resistance (IR) milliohm measurement',
      'Active inductive cell balancing without opening sealed cells',
      'Ground fault and chassis electrical leak isolation'
    ]
  },
  {
    id: 'port-maint-1',
    title: '24-Point Comprehensive Full Service & Monsoon Waterproofing',
    category: 'maintenance',
    vehicleModel: 'United Revolt & Yadea T5 Commuters',
    description: 'Complete seasonal preventive maintenance package. Flushed and pressure-bled front and rear hydraulic DOT4 brake systems, replaced worn ceramic brake pads, greased steering head cone bearings, torqued all swingarm and chassis fasteners to factory spec, and applied dielectric silicone grease to all high-current connectors to ensure 100% reliability during Punjab monsoon rains.',
    technicalSpecs: {
      voltage: 'Multi-Voltage Inspection',
      capacity: '24-Point Health Audit',
      motor: 'Axle seals inspected & drip-loops verified',
      rangeGain: 'Optimized rolling resistance',
      bms: 'Terminal torques certified'
    },
    status: 'Completed',
    metrics: {
      label: 'Safety Checklist',
      value: '24 Points'
    },
    image: '/src/assets/images/hero_ev_workshop_1792957574841.jpg',
    completedDate: 'August 2026',
    clientFeedback: '"Routine maintenance at Next Gen EV Care makes the bike feel brand new. The hydraulic brakes bite crisp, the suspension doesn\'t squeak, and they waterproofed everything before the rains."',
    highlights: [
      'Full hydraulic brake flush with moisture-free DOT4 fluid',
      'High-current Anderson plugs treated with dielectric silicone grease',
      'Steering stem and swingarm pivot bushings greased with lithium grease',
      'Tire tread depth, pressure, and wheel rim runout aligned'
    ]
  },
  {
    id: 'port-conv-1',
    title: 'Honda CD 70 72V Highway Commuter Conversion (R&D Pilot Prototype)',
    category: 'conversions',
    vehicleModel: 'Honda CD 70 Chassis (Prototype #03 - Gujranwala)',
    description: 'INTERNAL R&D BENCHMARK — Commercial conversion kits are COMING SOON! Our engineering team is currently conducting exhaustive 10,000-km reliability and thermal stress tests on this CD 70 prototype featuring a 3.0kW mid-drive BLDC motor and a 72V 35Ah LFP pack. Commercial customer conversion bookings will launch following PSQCA certification.',
    technicalSpecs: {
      voltage: '72V Nominal (R&D Prototype)',
      capacity: '35Ah LiFePO4 (2.52 kWh)',
      motor: '3.0kW Mid-Drive BLDC Motor',
      rangeGain: '110 km target range (In Testing)',
      bms: 'Smart ANT BMS with Bluetooth telemetry'
    },
    status: 'Coming Soon',
    isComingSoon: true,
    metrics: {
      label: 'Project Status',
      value: 'Coming Soon'
    },
    image: '/src/assets/images/custom_ev_conversion_1792957575143.jpg',
    completedDate: 'Launching Q1 2027',
    clientFeedback: '"[R&D Pilot Notice] This vehicle is our engineering benchmark undergoing road durability testing on GT Road. Commercial customer conversion bookings will open soon."',
    highlights: [
      'COMING SOON: R&D pilot undergoing 10,000 km reliability road testing',
      'Custom laser-cut chassis mounting brackets engineered for CD 70 frame',
      'Dual hydraulic disc brake integration with regenerative braking',
      'Priority reservation waitlist now open for interested riders'
    ]
  },
  {
    id: 'port-conv-2',
    title: 'Vintage Vespa 150 Classic Restomod (R&D Benchmark)',
    category: 'conversions',
    vehicleModel: 'Vintage Vespa 150 Classic Chassis',
    description: 'INTERNAL R&D BENCHMARK — Commercial kits are COMING SOON! An engineering showcase exploring the preservation of classic two-stroke steel chassis retrofitted with a silent 60V electric powertrain. Pre-orders and waitlist registration will be announced soon.',
    technicalSpecs: {
      voltage: '60V Nominal (Prototype)',
      capacity: '32Ah Removable Battery',
      motor: '2.2kW Waterproof Hub Motor',
      rangeGain: '85 km target range'
    },
    status: 'Coming Soon',
    isComingSoon: true,
    metrics: {
      label: 'Project Status',
      value: 'Coming Soon'
    },
    image: '/src/assets/images/custom_ev_conversion_1792957575143.jpg',
    completedDate: 'Launching Q1 2027',
    clientFeedback: '"[R&D Pilot Notice] Vintage conversion kits are currently in final development. Join our newsletter to receive notification when commercial orders open."',
    highlights: [
      'COMING SOON: Heritage chassis electrification in pilot development',
      'Removable battery module engineered for convenient indoor charging',
      'Classic speedometer retained with electronic digital pulse sender',
      'Waitlist inquiries accepted via Contact section'
    ]
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Door-to-Door EV Care: How Mobile Technicians Fix 85% of Electric Scooty Breakdowns on Your Doorstep',
    slug: 'door-to-door-ev-care-doorstep-service-gujranwala',
    category: 'maintenance',
    excerpt: 'No more hiring costly loader rickshaws to haul your broken electric scooter. Discover how Next Gen EV Care brings computerized diagnostics, hall sensor replacements, and full servicing right to your doorstep.',
    content: [
      'When your petrol bike breaks down, you can usually push it a few blocks to the nearest roadside mechanic. But when an electric scooter suffers a motor hall sensor failure, controller fault, or flat battery, the rear wheel often resists rolling, and roadside mechanics lack the high-voltage diagnostic tools to touch it.',
      'Hiring a loader rickshaw or pickup to transport a broken EV scooter across Gujranwala or along GT Road costs between PKR 2,500 and PKR 4,500 before repair costs even begin. That is why Next Gen EV Care pioneered specialized Door-to-Door Doorstep Services across Gujranwala, Model Town, Cantt, DC Colony, Rahwali, Muhafiz Town, and surrounding districts.',
      'What Mobile Service Vans Carry: Our mobile technicians travel in dedicated service vans equipped with 4-channel digital oscilloscopes, calibrated multi-chemistry battery analyzers, portable precision soldering irons, pressure brake bleeders, and inventory of common components (Honeywell hall effect sensors, 100V low-RDS MOSFETs, throttle assemblies, Daly smart BMS units, and 12V DC-DC converters).',
      'What Can Be Fixed on Your Driveway: Up to 85% of electric two-wheeler malfunctions do not require heavy workshop lifts. Hall sensor replacements, throttle jitter debugging, wiring harness short-circuit tracing, brake fluid bleeding, battery delta audits, and full 24-point routine maintenance are completed on-site in 60 to 90 minutes.',
      'For complex micro-soldering bench rebuilds or battery cell replacement spot welding, our technician removes only the component or arranges secure vehicle pickup, delivering it back fully calibrated and tested.'
    ],
    readTime: '6 min read',
    publishedAt: 'October 24, 2026',
    author: {
      name: 'Engr. Hamza Mughal',
      role: 'Master EV Powertrain Specialist'
    },
    tags: ['Door-to-Door', 'Doorstep Service', 'Maintenance', 'Gujranwala EV Care'],
    featured: true,
    image: '/src/assets/images/hero_ev_workshop_1792957574841.jpg'
  },
  {
    id: 'blog-2',
    title: 'Why Electric Scooty Motors Need Hall Sensor & Bearing Repair — NOT Costly Stator Rewinding',
    slug: 'why-ev-motors-need-hall-sensor-bearing-repair-not-rewinding',
    category: 'diagnostics',
    excerpt: 'Does your electric scooty motor buzz, shudder violently, or lock up? Local mechanics will tell you to rewind the motor for PKR 18,000+. Here is why copper windings almost never burn, and how component repair saves you thousands.',
    content: [
      'One of the most persistent myths in the two-wheeler repair market is that whenever a motor makes a buzzing sound, shakes upon throttle twist, or resists turning, "the motor is burnt and needs copper rewinding."',
      'At Next Gen EV Care, our diagnostic philosophy is grounded in engineering science: modern brushless DC (BLDC) hub motors are wound with heavy-gauge enameled copper on automated robotic winding lines and vacuum-impregnated with high-temperature epoxy. In over 95% of motor breakdowns, the copper windings are in pristine condition!',
      'What Actually Fails? (1) Burnt Hall Effect Sensors: High ambient heat (Punjab summer 45°C+) and heavy phase currents cause the fragile miniature hall effect sensors inside the stator to fail. When one sensor fails, the controller loses rotor position tracking, causing violent shuddering; (2) Worn or Seized Bearings: Dust and rainwater degrade factory budget bearings, creating grinding noises and rotor rubbing; (3) Axle Cable Pinching: Phase wires can wear against the axle shaft, causing intermittent short circuits.',
      'Why We Do NOT Do Rewinding: Rewinding a BLDC hub motor by hand disrupts the tight slot fill factor, alters the phase back-EMF symmetry, increases electrical resistance, and damages the neodymium permanent magnets during stator heating. Furthermore, rewinding costs PKR 15,000 to PKR 20,000 and takes days.',
      'Our Component-Level Repair Solution: We disassemble the hub motor, test stator windings with an insulation mega-ohmmeter, replace the entire hall sensor array with high-temperature automotive Honeywell sensors (rated to 150°C), press in Japanese SKF sealed bearings, de-rust and apply marine waterproof varnish to the stator, and dynamically align the rotor. The repair takes just a few hours and saves riders over 70% in cost.'
    ],
    readTime: '7 min read',
    publishedAt: 'October 14, 2026',
    author: {
      name: 'Usman Tariq',
      role: 'Senior EV Diagnostics Technician'
    },
    tags: ['Motor Repair', 'No Winding', 'Hall Sensors', 'BLDC Hub Motor'],
    featured: true,
    image: '/src/assets/images/ev_diagnostics_motor_1792957576018.jpg'
  },
  {
    id: 'blog-3',
    title: 'Controller Repair: Diagnosing Blown MOSFETs, 5V Regulator Dropouts & Throttle Jitter',
    slug: 'controller-repair-diagnosing-blown-mosfets-throttle-jitter',
    category: 'diagnostics',
    excerpt: 'Dealerships charge up to PKR 35,000 for a replacement motor controller. Learn how we repair shorted high-power transistors, gate drivers, and throttle logic on our electronics test bench.',
    content: [
      'The motor controller is the brain of your electric scooter, modulating battery DC power into three-phase alternating pulses through high-frequency switching. When a controller fails, dealerships routinely refuse to inspect it, insisting on an expensive imported replacement.',
      'Common Failure Mode 1: High-Side MOSFET Short. When climbing a steep flyover or carrying excessive load in summer, thermal stress or high inductive back-voltage spikes can punch through the silicon die of a MOSFET transistor. The phase wire shorts directly to the battery rail, causing the motor to lock up or brake aggressively even when pushed by hand.',
      'Common Failure Mode 2: 5V Buck Regulator Dropout. The internal buck converter that steps down 72V/60V battery power to 5V DC for the throttle and hall sensors blows due to voltage spikes. As a result, the throttle is dead and the dashboard shows an error code.',
      'Bench Repair Protocol: We open the controller casing, inspect circuit traces under a stereo microscope, and desolder shorted transistors. We upgrade the phase power stage with genuine low-resistance IRFB4110 or N-channel trench MOSFETs, reinforce heavy copper traces with silver-bearing solder, replace blown gate resistors, and test phase gate waveforms with an oscilloscope under full 50A load.'
    ],
    readTime: '6 min read',
    publishedAt: 'September 20, 2026',
    author: {
      name: 'Engr. Hamza Mughal',
      role: 'Master EV Powertrain Specialist'
    },
    tags: ['Controller Repair', 'MOSFETs', 'Electronics Bench', 'FOC Inverters'],
    featured: false,
    image: '/src/assets/images/hero_ev_workshop_1792957574841.jpg'
  },
  {
    id: 'blog-4',
    title: 'Diagnosing Cell Imbalance & State of Health (SOH) in 2-Wheeler Lithium Packs',
    slug: 'diagnosing-cell-imbalance-soh-lithium-packs',
    category: 'battery-tech',
    excerpt: 'Learn why your electric scooty display claims 75% battery but shuts down abruptly when accelerating on flyovers. A technical deep dive into series cell delta, BMS cutoffs, and active balancing.',
    content: [
      'One of the most frequent complaints electric scooter riders in Pakistan bring to our Gujranwala workshop is the "Phantom Range Drop": the digital dashboard shows 70% or 80% battery capacity remaining, but under moderate acceleration or climbing a flyover, the vehicle suddenly cuts off completely.',
      'In over 95% of cases, the lithium cells themselves are not entirely dead. Instead, a single series cell group (e.g., group 8 in a 16S 60V pack) has developed higher internal resistance. When current is drawn, this weak group hits the BMS low-voltage cutoff threshold long before the remaining 15 groups do.',
      'To diagnose this properly, never rely purely on total pack voltage measured with a basic multimeter. You must tap into the BMS balance lead connector with a calibrated multi-channel cell logger under an active load test of at least 15A to 25A.',
      'A healthy battery pack should exhibit no more than 15mV to 25mV of delta between the highest and lowest cell group at rest, and no more than 80mV delta under sustained acceleration. If your delta exceeds 150mV, your BMS will repeatedly trip into emergency protection mode.',
      'Solution Protocol: For mild imbalance (<100mV), an active cell balancer left connected over a 24-hour cycle can restore equilibrium without replacing cells.'
    ],
    readTime: '6 min read',
    publishedAt: 'August 28, 2026',
    author: {
      name: 'Muhammad Bilal',
      role: 'Senior Battery Systems Engineer'
    },
    tags: ['Battery Tech', 'BMS', 'Lithium Ion', 'Diagnostics'],
    featured: false,
    image: '/src/assets/images/ev_battery_pack_tech_1792957574705.jpg'
  },
  {
    id: 'blog-5',
    title: 'Petrol-to-Electric Conversions (CD 70 / CG 125): Sneak Peek at Our Upcoming R&D Pilot Project',
    slug: 'petrol-to-electric-conversions-upcoming-rd-pilot-project',
    category: 'retrofitting',
    excerpt: 'Conversions are officially coming soon! Here is an exclusive behind-the-scenes look at our ongoing R&D pilot road-testing Honda CD 70 conversions across GT Road, chassis reinforcement, and PSQCA compliance.',
    content: [
      'With petrol prices fluctuating above PKR 275 per litre in Pakistan, thousands of daily commuters have asked when Next Gen EV Care will commercially offer petrol-to-electric conversions for Honda CD 70 and CG 125 motorcycles.',
      'Our Commitment to Safety: Converting a petrol motorcycle to electric is not simply bolting an imported motor and a loose battery box onto an old frame. High-torque electric mid-drives place sudden rotational torsion on swingarm pivots, and heavy battery packs alter the bike\'s center of gravity.',
      'Project Status: COMING SOON! We are actively putting three R&D pilot prototypes through a grueling 10,000-kilometer durability testing program across Gujranwala, Kamoke, and GT Road. We are refining CNC laser-cut frame reinforcement brackets, high-efficiency synchronous belt drives, dual hydraulic disc brakes, and tamper-proof IP67 aluminum battery enclosures.',
      'Registration & Compliance: We are also working with relevant engineering bodies and regulatory authorities so that when commercial orders officially launch, our customers will receive certified conversion documentation for smooth registration with the Punjab Excise & Taxation Department.',
      'How to Reserve Your Spot: While commercial conversions are coming soon, you can register for our Priority Waitlist via our Contact page or WhatsApp (03217436463) to be notified the day booking goes live.'
    ],
    readTime: '5 min read',
    publishedAt: 'August 10, 2026',
    author: {
      name: 'Engr. Hamza Mughal',
      role: 'Master EV Powertrain Specialist'
    },
    tags: ['EV Conversion', 'Coming Soon', 'Honda CD 70', 'R&D Pilot'],
    featured: false,
    image: '/src/assets/images/custom_ev_conversion_1792957575143.jpg'
  }
];

export const INITIAL_INQUIRIES: CustomerInquiry[] = [
  {
    id: 'inq-1',
    name: 'Muhammad Zeeshan',
    phone: '0300 6489123',
    email: 'zeeshan.ev@gmail.com',
    vehicleModel: 'Metro E8S Electric Scooter',
    serviceType: 'Door-to-Door Home / Office Service (Main Focus)',
    message: 'My electric scooty started vibrating loudly and stopped rolling on GT Road near Gujranwala Cantt. Need urgent door-to-door doorstep service to check motor sensors at my home.',
    preferredDate: '2026-10-26',
    submittedAt: '2026-10-25 11:20',
    status: 'Scheduled'
  },
  {
    id: 'inq-2',
    name: 'Ali Raza Mughal',
    phone: '0321 7436463',
    email: 'aliraza.tech@gmail.com',
    vehicleModel: 'Yadea T5 Electric Scooty',
    serviceType: 'Motor Repair (Hall Sensors, Bearings - No Winding)',
    message: 'Motor makes grinding noise and wheel feels stiff. A local mechanic said I need rewinding, but I know Next Gen EV Care repairs bearings and hall sensors without rewinding. Please inspect.',
    preferredDate: '2026-10-27',
    submittedAt: '2026-10-25 09:15',
    status: 'New'
  },
  {
    id: 'inq-3',
    name: 'Kamran Ashraf',
    phone: '0333 4567890',
    email: 'kamran.guj@gmail.com',
    vehicleModel: 'Crown EV Electric Scooty',
    serviceType: 'Controller Repair (MOSFETs, Throttle, Power Cutoff)',
    message: 'Scooter shut off suddenly and rear wheel is locked up. Dealership asked PKR 25,000 for replacement controller. Want you to inspect and repair the blown MOSFETs.',
    preferredDate: '2026-10-28',
    submittedAt: '2026-10-24 16:45',
    status: 'Contacted'
  }
];
