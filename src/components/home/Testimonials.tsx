import React from 'react';
import { Star, ShieldCheck, MapPin, CheckCircle, Truck, Clock } from 'lucide-react';

interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  scootyModel: string;
  repairType: string;
  comment: string;
  rating: number;
  date: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't-1',
    name: 'Mian Tariq Javed',
    location: 'DC Colony, Gujranwala',
    scootyModel: 'Yadea E8S Pro',
    repairType: 'Driveway Hall Sensor Replacement',
    comment: 'My Yadea suddenly started stuttering and wouldn’t move. Other local mechanics asked me to replace the entire motor for Rs. 28,000. Next Gen EV Care technician reached my home in DC Colony within 45 minutes, replaced the burnt Honeywell sensors without unwinding the copper, and had it running perfectly for a fraction of the cost.',
    rating: 5,
    date: 'March 2026'
  },
  {
    id: 't-2',
    name: 'Dr. Ayesha Imran',
    location: 'Model Town, Gujranwala',
    scootyModel: 'Metro Lyon (Graphene 72V)',
    repairType: 'Lithium Cell Balancing & Range Restoration',
    comment: 'Range had dropped from 70km to barely 30km before dying unexpectedly. Their technician brought calibrated diagnostic meters, balanced the weak cell drift, and gave me back full 68km per charge. Honest, professional, and zero workshop visits required.',
    rating: 5,
    date: 'February 2026'
  },
  {
    id: 't-3',
    name: 'Khurram Shehzad',
    location: 'Satellite Town, Gujranwala',
    scootyModel: 'Crown Electric Scooty',
    repairType: 'Controller MOSFET Micro-Rework',
    comment: 'The scooty had completely shut down with wheel resistance. Next Gen EV Care diagnosed a shorted 12-FET MOSFET bank on their mobile workbench, replaced the transistor with high-grade thermal paste, and tested everything with an oscilloscope. Top tier technical skill in Gujranwala.',
    rating: 5,
    date: 'January 2026'
  }
];

export const HomeTestimonials: React.FC = () => {
  return (
    <section className="space-y-10" aria-labelledby="testimonials-heading">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
            <span className="uppercase tracking-widest text-[11px] font-bold">VERIFIED REPAIR LOGS · GUJRANWALA</span>
          </div>
          <h2 id="testimonials-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Trusted by Daily EV Riders Across Gujranwala
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed max-w-2xl">
            Real feedback from riders in DC Colony, Model Town, Cantt, Satellite Town, and Peoples Colony who rely on our prompt doorstep service.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <span>4.9 / 5.0 (280+ Reviews)</span>
        </div>
      </div>

      {/* 3 Testimonials in Frosted Liquid Glass */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((review) => (
          <div
            key={review.id}
            className="p-6 rounded-2xl liquid-glass-card flex flex-col justify-between space-y-4 h-full"
          >
            <div className="space-y-3">
              {/* Stars & Verified Doorstep Badge */}
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified Doorstep</span>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "{review.comment}"
              </p>
            </div>

            {/* Author & Locality Footer */}
            <div className="pt-4 border-t border-slate-200/50 dark:border-white/10 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {review.name}
                </p>
                <span className="text-[10px] text-slate-400 font-mono">{review.date}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-500" />
                  {review.location}
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {review.scootyModel}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Doorstep Guarantees Strip */}
      <div className="p-4 sm:p-5 rounded-2xl liquid-glass-subtle grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Zero Towing Fees</p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">We come directly to your home or office</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">30-Day Repair Guarantee</p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">Guaranteed parts and certified workmanship</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">45-Minute Dispatch</p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">Prompt arrival across Gujranwala sectors</p>
          </div>
        </div>
      </div>
    </section>
  );
};
