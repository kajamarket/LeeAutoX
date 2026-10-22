import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { WHY_CHOOSE_LABELS } from '../constants';
import { useTheme } from '../context/ThemeContext';
import { CheckCircle2 } from 'lucide-react';

export default function WhyChooseUs() {
  const { theme } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="why-us" className={`relative transition-colors duration-500 px-6 md:px-12 py-24 overflow-hidden ${
      theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      {/* Background Graffiti - Sophisticated Typography Layer */}
      <div className={`absolute inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-[0.03] transition-colors duration-500 ${
        theme === 'dark' ? 'text-white' : 'text-black'
      }`}>
        <div className="absolute -top-10 -left-20 text-[20vw] font-black leading-none tracking-tighter rotate-[-15deg] whitespace-nowrap">
          LOGISTICS
        </div>
        <div className="absolute top-1/2 -right-40 text-[18vw] font-serif font-bold leading-none rotate-[12deg] whitespace-nowrap">
          PREMIUM
        </div>
        <div className="absolute -bottom-20 -left-10 text-[25vw] font-black leading-none tracking-tighter rotate-[-5deg] whitespace-nowrap">
          DIRECT
        </div>

        {/* Random Pattern Accents */}
        <div className="absolute top-[10%] left-[30%] rotate-[45deg] flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`w-[1px] h-32 transition-colors duration-500 ${theme === 'dark' ? 'bg-white' : 'bg-black'}`} />
          ))}
        </div>
        <div className="absolute bottom-[20%] right-[20%] grid grid-cols-4 gap-4 opacity-50">
          {[...Array(16)].map((_, i) => (
            <div key={i} className={`w-1 h-1 rounded-full transition-colors duration-500 ${theme === 'dark' ? 'bg-white' : 'bg-black'}`} />
          ))}
        </div>
        <div className="absolute top-[40%] left-[5%] text-[10vw] font-light leading-none rotate-[-10deg]">
          ++++++
        </div>
        <div className={`absolute top-[60%] right-[10%] text-[8vw] font-light leading-none rotate-[20deg] border-t pt-2 transition-colors duration-500 ${
          theme === 'dark' ? 'border-white' : 'border-black'
        }`}>
          001//X
        </div>
        <div className={`absolute bottom-[10%] left-[45%] w-40 h-40 border rounded-full rotate-[30deg] transition-colors duration-500 ${
          theme === 'dark' ? 'border-white/40' : 'border-black/40'
        }`} />
      </div>

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto text-center mb-16">
        {/* Eyebrow Label with Animated Letter Spacing */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, letterSpacing: '0.25em' }}
          animate={inView ? { opacity: 1, letterSpacing: '0.15em' } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#2B59FF] mb-4"
        >
          <span>Why choose us</span>
        </motion.div>

        {/* Primary Headline with Blur-to-Sharp and Scale Reveal */}
        <motion.h2
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98, filter: 'blur(12px)', y: 10 }}
          animate={inView ? { opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className={`font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-6 tracking-tight ${
            theme === 'dark' 
              ? 'text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.06)]' 
              : 'text-slate-950 drop-shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
          }`}
        >
          Delivered to Customers Like You.
        </motion.h2>

        {/* Supporting Text with Smooth Upward Stagger */}
        <motion.p
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.18, duration: 0.7, ease: 'easeOut' }}
          className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-6 font-light ${
            theme === 'dark' ? 'text-white/70' : 'text-slate-600'
          }`}
        >
          Every car we ship is inspected, tracked and documented. Here's what customers say. Browse our recent verified delivery timeline.
        </motion.p>

        {/* Counter Label Badge */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.96 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ delay: 0.28, duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2B59FF]/30 bg-[#2B59FF]/10 backdrop-blur-md text-[#2B59FF] text-xs font-mono font-bold tracking-wide shadow-xs"
        >
          <span className="w-2 h-2 rounded-full bg-[#2B59FF] animate-pulse" />
          <span>More than 30 Vehicles delivered so far</span>
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-2xl select-none">
        {/* Radial Glow */}
        <div 
          className="absolute inset-0 z-0 transition-opacity duration-500 pointer-events-none"
          style={{ 
            background: theme === 'dark' 
              ? 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 80%)'
              : 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(43,89,255,0.05) 0%, transparent 80%)'
          }}
        />

        {/* Car Image with Smooth Scale Reveal */}
        <motion.img
          initial={shouldReduceMotion ? { opacity: 1 } : { scale: 0.95, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.85, ease: 'easeOut' }}
          src="https://hercules-cdn.com/file_siaP29l0QmGIt1LzZaBx46SG"
          alt="Silver supercar top view"
          className="relative z-10 w-full object-contain drop-shadow-2xl"
        />

        {/* Floating Chips - Desktop */}
        <div className="hidden md:block">
          <Chip
            text={WHY_CHOOSE_LABELS[0]}
            className="top-[14%] right-[2%]"
            delay={0.45}
            inView={inView}
            theme={theme}
            shouldReduceMotion={shouldReduceMotion}
          />
          <Chip
            text={WHY_CHOOSE_LABELS[1]}
            className="top-[36%] left-[0%]"
            delay={0.55}
            inView={inView}
            theme={theme}
            shouldReduceMotion={shouldReduceMotion}
          />
          <Chip
            text={WHY_CHOOSE_LABELS[2]}
            className="bottom-[24%] right-[2%]"
            delay={0.65}
            inView={inView}
            theme={theme}
            shouldReduceMotion={shouldReduceMotion}
          />
          <Chip
            text={WHY_CHOOSE_LABELS[3]}
            className="bottom-[10%] left-[0%]"
            delay={0.75}
            inView={inView}
            theme={theme}
            shouldReduceMotion={shouldReduceMotion}
          />
        </div>

        {/* Mobile Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
          {WHY_CHOOSE_LABELS.map((label, i) => (
            <motion.div
              key={label}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35 + i * 0.08, duration: 0.5 }}
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              className={`border rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-sm transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-zinc-900/80 border-white/10 text-white backdrop-blur-md' 
                  : 'bg-white/90 border-slate-200 text-slate-900 backdrop-blur-md'
              }`}
            >
              <CheckCircle2 size={15} className="text-[#2B59FF] shrink-0" />
              <span className="font-semibold text-xs tracking-tight">
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Chip({ 
  text, 
  className, 
  delay, 
  inView, 
  theme,
  shouldReduceMotion 
}: { 
  text: string; 
  className: string; 
  delay: number; 
  inView: boolean; 
  theme: string;
  shouldReduceMotion: boolean | null;
}) {
  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { scale: 0.9, opacity: 0, y: 8 }}
      animate={inView ? { scale: 1, opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -2 }}
      className={`absolute z-20 border rounded-2xl px-5 py-3 shadow-xl backdrop-blur-xl transition-all duration-300 flex items-center gap-2.5 cursor-default ${className} ${
        theme === 'dark' 
          ? 'bg-zinc-950/80 border-white/15 text-white shadow-black/60' 
          : 'bg-white/85 border-slate-200/80 text-slate-950 shadow-slate-300/40'
      }`}
    >
      <CheckCircle2 size={16} className="text-[#2B59FF] shrink-0" />
      <span className="font-semibold text-xs sm:text-sm tracking-tight whitespace-nowrap">
        {text}
      </span>
    </motion.div>
  );
}
