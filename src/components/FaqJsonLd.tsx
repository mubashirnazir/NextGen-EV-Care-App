import React from 'react';

export interface FaqItemSchema {
  question: string;
  answer: string;
}

export interface FaqJsonLdProps {
  faqs?: FaqItemSchema[];
  url?: string;
}

export const CANONICAL_FAQS: FaqItemSchema[] = [
  {
    question: "How does Next Gen EV Care's Door-to-Door Service work, and how fast can you arrive in Gujranwala?",
    answer: "Door-to-Door Service is our primary care model. When your electric scooty or e-bike experiences trouble, you do not need to hire a loader rickshaw to tow it. Contact us via WhatsApp (03217436463) or online. Our mobile EV care technician dispatches directly to your residence, office, or roadside location anywhere in Gujranwala (including Model Town, Cantt, DC Colony, Rahwali, Muhafiz Town, and surrounding GT Road areas). Equipped with portable digital oscilloscopes, battery load testers, and replacement sensors, we diagnose and fix 85% of issues directly on your driveway in 60 to 90 minutes."
  },
  {
    question: "Which repairs can be completed at my doorstep versus requiring the workshop?",
    answer: "Over 85% of common electric two-wheeler malfunctions can be resolved completely on your driveway in 60 to 90 minutes. This includes 150°C Honeywell hall effect sensor replacement, throttle jitter and wiring harness troubleshooting, brake fluid bleeding & brake pad changes, 12V DC-DC converter replacement, digital dashboard error diagnosis, battery cell delta testing, and routine 24-point maintenance. Only heavy bench repairs like pneumatic spot-welding battery packs or multi-FET SMD micro-soldering are brought to our Mughal Plaza facility."
  },
  {
    question: "Do you repair electric scooty/bike motors, and why do you NOT do rewinding?",
    answer: "Yes, we specialize in high-precision component-level motor repair without copper stator rewinding. Modern brushless DC (BLDC) hub motors are wound with heavy-gauge enameled copper on automated robotic factory lines, and the copper coils rarely burn. What actually fails are the small hall effect sensors, worn wheel bearings, or rusted rotor magnets. Rewinding by hand degrades factory motor efficiency and neodymium magnets. Instead, we replace hall sensors with 150°C automotive-grade Honeywell sensors, press in premium Japanese SKF sealed bearings, and dynamically balance the rotor — restoring 100% factory whisper-quiet performance for up to 70% less cost."
  },
  {
    question: "My electric scooter shudders, buzzes loudly, or locks the wheel when accelerating. What is wrong?",
    answer: "This is the classic hallmark of either a blown motor hall effect sensor or a shorted high-side MOSFET in your controller. When one of the three hall sensors fails, the controller loses precision tracking of the rotor magnetic poles, firing current into the wrong phase wire and causing severe motor shuddering and buzzing. If the rear wheel feels stiff and actively resists rolling even when pushed by hand, one of the controller's MOSFET transistors has shorted together, creating a permanent regenerative magnetic brake. Our mobile technician can test your phase lines with an oscilloscope at your doorstep in under 15 minutes."
  },
  {
    question: "Can a damaged or burnt motor controller be repaired instead of spending PKR 25,000+ on a replacement?",
    answer: "Yes! In over 90% of controller breakdowns, the main micro-controller chip (MCU) is perfectly intact, and only 1 to 3 power MOSFET transistors, a gate driver resistor, or a 5V buck regulator step-down chip have failed due to thermal overload. On our electronics test bench, we desolder damaged transistors, install genuine ultra-low-resistance MOSFETs, reinforce high-current copper busbars with silver solder, tune FOC sine-wave parameters, and re-seal the casing with 6.0 W/mK thermal paste — saving up to 75% compared to purchasing an imported Chinese controller."
  },
  {
    question: "What is included in an Electrification Diagnostic scan, and how does it detect phantom power drops?",
    answer: "Our computerized Electrification Diagnostic is a comprehensive audit of high-voltage and low-voltage systems. If your scooty display claims 80% charge but dies abruptly when climbing a flyover, we connect a multi-channel cell voltage logger and apply a dynamic 25A load to measure real-time voltage sag across every individual series cell group, identifying weak-cell delta mV. We also test 4-wire AC internal resistance (IR), map throttle voltage progression (0.8V to 4.2V), test 12V DC-DC converter output stability, and verify ground insulation integrity."
  },
  {
    question: "How do I protect my electric scooter's controller and motor during heavy monsoon rains in Punjab?",
    answer: "We apply a 3-step monsoon waterproofing protocol: (1) We relocate controllers mounted low beneath the footboard to a higher, sheltered under-seat cavity or seal them with conformal silicone coating; (2) We inspect motor axle O-rings and create a downward drip-loop curve on phase cables so water drains away from bearings; (3) We pack high-current Anderson and throttle plugs with waterproof dielectric silicone grease."
  },
  {
    question: "When will petrol-to-electric conversion kits (CD 70 / CG 125) be available?",
    answer: "Commercial conversion kits for Honda CD 70, Honda CG 125, and classic scooters are currently in active R&D Pilot Testing. Our engineering team is subjecting three pilot prototypes to extensive 10,000-km road durability, thermal stress, and flyover climb tests across GT Road in Gujranwala and Kamoke. Priority reservation waitlist is open via WhatsApp (03217436463) and will include documentation for legal registration with Punjab Excise & Taxation."
  }
];

export const FaqJsonLd: React.FC<FaqJsonLdProps> = ({
  faqs = CANONICAL_FAQS,
  url = 'https://www.nextgenevcare.com/#faq'
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': url,
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
};

export default FaqJsonLd;
