import React from 'react';

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export interface JsonLdProps {
  customSchema?: Record<string, any>;
  breadcrumbs?: BreadcrumbItem[];
}

export const CANONICAL_BREADCRUMBS: BreadcrumbItem[] = [
  { name: 'Home', item: 'https://www.nextgenevcare.com/' },
  { name: 'Doorstep EV Services', item: 'https://www.nextgenevcare.com/#services' },
  { name: 'EV Savings & ROI Calculator', item: 'https://www.nextgenevcare.com/#calculator' },
  { name: 'Verified Case Studies & Repairs', item: 'https://www.nextgenevcare.com/#portfolio' },
  { name: 'Technical Knowledge Base', item: 'https://www.nextgenevcare.com/#blog' },
  { name: 'FAQ & Powertrain Guides', item: 'https://www.nextgenevcare.com/#faq' },
  { name: 'Book Doorstep Service', item: 'https://www.nextgenevcare.com/#contact' }
];

export const JsonLd: React.FC<JsonLdProps> = ({ customSchema, breadcrumbs = CANONICAL_BREADCRUMBS }) => {
  const breadcrumbListSchema = {
    '@type': 'BreadcrumbList',
    '@id': 'https://www.nextgenevcare.com/#breadcrumbs',
    'itemListElement': breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': crumb.name,
      'item': crumb.item
    }))
  };

  const defaultSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['AutoRepair', 'LocalBusiness'],
        '@id': 'https://www.nextgenevcare.com/#business',
        'name': 'Next Gen EV Care',
        'alternateName': 'Next Gen EV Care Gujranwala',
        'url': 'https://www.nextgenevcare.com',
        'logo': 'https://www.nextgenevcare.com/NextGen-EV-Care-for-Social-Media-on-call-Electric%20Scooty-services-gujranwala.png',
        'image': 'https://www.nextgenevcare.com/NextGen-EV-Care-for-Social-Media-on-call-Electric%20Scooty-services-gujranwala.png',
        'telephone': '+923217436463',
        'email': 'nextgenevcare@gmail.com',
        'priceRange': 'PKR 500 - PKR 25000',
        'currenciesAccepted': 'PKR',
        'paymentAccepted': 'Cash, Bank Transfer, EasyPaisa, JazzCash',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Mughal Plaza, Mughal Chok, Service Road Main Gate Muhafiz Town',
          'addressLocality': 'Gujranwala',
          'addressRegion': 'Punjab',
          'postalCode': '52250',
          'addressCountry': 'PK'
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': 32.1969,
          'longitude': 74.1895
        },
        'openingHoursSpecification': [
          {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday', 'Sunday'],
            'opens': '09:00',
            'closes': '20:00'
          },
          {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Friday'],
            'opens': '14:00',
            'closes': '20:00'
          }
        ],
        'areaServed': [
          { '@type': 'City', 'name': 'Gujranwala' },
          { '@type': 'AdministrativeArea', 'name': 'Model Town, Gujranwala' },
          { '@type': 'AdministrativeArea', 'name': 'DC Colony, Gujranwala' },
          { '@type': 'AdministrativeArea', 'name': 'Peoples Colony, Gujranwala' },
          { '@type': 'AdministrativeArea', 'name': 'Gujranwala Cantt' },
          { '@type': 'AdministrativeArea', 'name': 'Satellite Town, Gujranwala' },
          { '@type': 'AdministrativeArea', 'name': 'Wapda Town, Gujranwala' }
        ],
        'sameAs': [
          'https://www.facebook.com/nextgenevcare',
          'https://www.instagram.com/nextgenevcare',
          'https://www.tiktok.com/@nextgenevcare',
          'https://www.youtube.com/@nextgenevcare'
        ],
        'hasOfferCatalog': {
          '@type': 'OfferCatalog',
          'name': 'Electric Scooty & E-Bike Doorstep Repair Services',
          'itemListElement': [
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': 'Door-to-Door Electric Scooty Repair in Gujranwala',
                'description': 'Certified mobile technician van dispatched to your home or office with portable oscilloscopes and diagnostic meters. 85% of issues resolved right on your driveway.',
                'areaServed': 'Gujranwala',
                'serviceType': 'Mobile Automotive Repair'
              }
            },
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': 'Lithium Battery Servicing & Active Cell Balancing',
                'description': 'Dynamic load delta-V diagnostics, BMS re-flashing, cell balancing, and capacity restoration for LiFePO4, NMC, and Graphene packs.',
                'areaServed': 'Gujranwala',
                'serviceType': 'Battery Diagnostics & Reconditioning'
              }
            },
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': 'No-Winding Hub Motor & Hall Sensor Repair',
                'description': 'Automotive-grade 150°C Honeywell hall sensor installation, Japanese SKF sealed bearings replacement, and 100% original copper stator preservation.',
                'areaServed': 'Gujranwala',
                'serviceType': 'Electric Motor Repair'
              }
            },
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': 'BLDC Controller MOSFET Micro-Rework',
                'description': 'Component-level motherboard repair, shorted power MOSFET replacement, 6.0 W/mK thermal compound pasting, and PWM trace verification.',
                'areaServed': 'Gujranwala',
                'serviceType': 'Electronics Bench Rework'
              }
            }
          ]
        }
      },
      breadcrumbListSchema,
      {
        '@type': 'FAQPage',
        '@id': 'https://www.nextgenevcare.com/#faq',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'Do you offer door-to-door electric scooty repair in Gujranwala?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Yes! Next Gen EV Care operates mobile diagnostic service vans across Gujranwala (including DC Colony, Model Town, Cantt, Satellite Town, and Peoples Colony). 85% of repairs are completed directly on your driveway without towing.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Can electric scooty motor shuddering be fixed without motor rewinding?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Yes. 90% of motor shuddering, buzzing, and wheel lockups are caused by burnt hall sensors or worn bearings, not damaged copper windings. We install 150°C Honeywell sensors while keeping your factory copper windings intact, saving you over 70% compared to a new motor.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Which EV scooty and e-bike brands do you service?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'We service all major electric scooter and bike brands in Gujranwala including Yadea, Metro, Crown EV, United, Super Power, Road Prince, Evee, and converted EV models.'
            }
          }
        ]
      }
    ]
  };

  const schemaToRender = customSchema || defaultSchema;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaToRender)
      }}
    />
  );
};

export default JsonLd;
