import { motion } from 'motion/react';
import { ArrowDownRight } from 'lucide-react';
import { HERO_STATS } from '../constants';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pb-20 pt-3 md:pt-32 overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1750380328422-fbe02f196300?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Luxury vehicle"
          className="w-full h-full object-cover"
        />

        {/* Refined Geometric Motif */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          {/* Top Right Concentration */}
          <div className="absolute top-0 right-0 w-full h-full md:w-2/3 md:h-1/2">
            {/* Gear Assembly Aspect 1 */}
            <svg className="absolute top-[10%] right-[15%] w-64 h-64 text-white/[0.03] rotate-[15deg]" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.2" />
              {[...Array(12)].map((_, i) => (
                <line
                  key={i}
                  x1="50" y1="15" x2="50" y2="22"
                  transform={`rotate(${i * 30} 50 50)`}
                  stroke="currentColor" strokeWidth="1"
                />
              ))}
            </svg>

            {/* Precision Contours */}
            <svg className="absolute top-[5%] right-[-5%] w-[80%] h-full text-white/[0.05]" viewBox="0 0 400 400">
              <path d="M400,50 Q300,60 200,150 T0,200" fill="none" stroke="url(#line-grad)" strokeWidth="0.5" />
              <path d="M400,80 Q320,95 240,180 T20,240" fill="none" stroke="url(#line-grad)" strokeWidth="0.3" />
              <defs>
                <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="50%" stopColor="white" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Headlight Silhouettes */}
            <div className="absolute top-[15%] right-[25%] w-48 h-12 rotate-[-10deg]">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent rounded-full blur-[2px] border border-white/[0.05]" />
              <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-white/[0.1] shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
            </div>
          </div>

          {/* Scattered Elements */}
          <div className="absolute bottom-[20%] left-[5%] w-32 h-32 text-white/[0.02]">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="0.2" className="rotate-45 transform-gpu" />
              <circle cx="50" cy="50" r="1" fill="currentColor" />
            </svg>
          </div>
        </div>
        
        {/* Animated Headlights */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Left Headlight */}
          <motion.div
            animate={{
              opacity: [0, 0.4, 1, 0.8, 1, 0.2, 0],
              scale: [1, 1.05, 1.1, 1.05, 1.1, 1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              times: [0, 0.1, 0.15, 0.5, 0.85, 0.95, 1],
              ease: "easeInOut",
            }}
            className="absolute top-[48.5%] left-[58%] w-12 h-4 bg-cyan-200/40 rounded-full blur-xl shadow-[0_0_50px_20px_rgba(255,255,255,0.6)]"
          />
          <motion.div
            animate={{
              opacity: [0, 0.1, 0.5, 0.4, 0.5, 0.1, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              times: [0, 0.1, 0.15, 0.5, 0.85, 0.95, 1],
            }}
            className="absolute top-[48.2%] left-[57.5%] w-16 h-6 bg-white/20 rounded-full blur-2xl"
          />

          {/* Right Headlight */}
          <motion.div
            animate={{
              opacity: [0, 0.4, 1, 0.8, 1, 0.2, 0],
              scale: [1, 1.05, 1.1, 1.05, 1.1, 1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              times: [0, 0.1, 0.15, 0.5, 0.85, 0.95, 1],
              ease: "easeInOut",
            }}
            className="absolute top-[51.5%] left-[82.5%] w-10 h-3 bg-cyan-200/40 rounded-full blur-xl shadow-[0_0_40px_15px_rgba(255,255,255,0.5)]"
          />
          <motion.div
            animate={{
              opacity: [0, 0.1, 0.5, 0.4, 0.5, 0.1, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              times: [0, 0.1, 0.15, 0.5, 0.85, 0.95, 1],
            }}
            className="absolute top-[51.2%] left-[82%] w-14 h-5 bg-white/20 rounded-full blur-2xl"
          />
        </div>

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
          BUY — BID — EXPORT
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
          className="hidden md:block text-white/70 font-light text-base md:text-lg max-w-sm leading-relaxed mb-10"
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
            <span className="tracking-wide">Available Vehicles</span>
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
        className="absolute bottom-5 right-6 md:right-12 z-10 bg-black/60 backdrop-blur-sm border border-white/10 flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-white/10"
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
