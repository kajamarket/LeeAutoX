import { motion } from 'motion/react';
import { ArrowDownRight } from 'lucide-react';
import { HERO_STATS } from '../constants';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pb-20 pt-32 overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1750380328422-fbe02f196300?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Luxury vehicle"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Eyebrow */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-xs font-mono tracking-[0.3em] text-white/50 uppercase mb-6"
        >
          ONTARIO, CANADA — SERVING NIGERIA & AFRICA
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
          className="font-serif text-5xl md:text-7xl font-black leading-[0.95] tracking-tight text-white text-balance mb-8 max-w-3xl"
        >
          Your vehicle,<br />
          <span className="italic font-normal">sourced from North America.</span>
        </motion.h1>

        {/* Body */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="text-white/70 font-light text-base md:text-lg max-w-sm leading-relaxed mb-10"
        >
          LeeAutoX connects African buyers to premium vehicles directly from top auctions in the USA and Canada — with full shipping, containerization, and logistics handled end-to-end.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="flex flex-col sm:flex-row items-start gap-4"
        >
          <a
            href="#contact"
            className="px-7 py-3 bg-black text-white text-sm font-semibold border border-white hover:bg-white hover:text-black transition-colors cursor-pointer tracking-wide"
          >
            Get a Free Quote
          </a>
          <a
            href="#fleet"
            className="group flex items-center gap-3 text-sm font-medium cursor-pointer hover:opacity-70 transition-opacity text-white"
          >
            <span className="tracking-wide">View our fleet</span>
            <div className="w-8 h-8 border border-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
              <ArrowDownRight size={16} />
            </div>
          </a>
        </motion.div>
      </div>

      {/* Stats Strip */}
      <motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="absolute bottom-10 right-6 md:right-12 z-10 bg-black/60 backdrop-blur-sm border border-white/10 flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-white/10"
      >
        {HERO_STATS.map((stat) => (
          <div key={stat.label} className="px-5 py-4 text-center">
            <div className="font-serif text-2xl font-bold text-white leading-none mb-1">
              {stat.value}
            </div>
            <div className="font-mono text-[10px] tracking-[0.18em] text-white/40 uppercase">
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
