import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { WHY_CHOOSE_LABELS } from '../constants';

export default function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="why-us" className="relative bg-black text-white px-6 md:px-12 py-24 overflow-hidden">
      {/* Background Graffiti - Sophisticated Typography Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-[0.03]">
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
            <div key={i} className="w-[1px] h-32 bg-white" />
          ))}
        </div>
        <div className="absolute bottom-[20%] right-[20%] grid grid-cols-4 gap-4 opacity-50">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-white" />
          ))}
        </div>
        <div className="absolute top-[40%] left-[5%] text-[10vw] font-light leading-none rotate-[-10deg]">
          ++++++
        </div>
        <div className="absolute top-[60%] right-[10%] text-[8vw] font-light leading-none rotate-[20deg] border-t border-white pt-2">
          001//X
        </div>
        <div className="absolute bottom-[10%] left-[45%] w-40 h-40 border border-white/40 rounded-full rotate-[30deg]" />
      </div>

      <motion.h2
        ref={ref}
        initial={{ y: 20, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="font-serif text-4xl md:text-5xl font-bold text-center mb-16 text-white"
      >
        Why Choose Us
      </motion.h2>

      <div className="relative mx-auto max-w-2xl select-none">
        {/* Glow */}
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 80%)' 
          }}
        />

        {/* Car Image */}
        <motion.img
          initial={{ scale: 0.9, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
          src="https://hercules-cdn.com/file_siaP29l0QmGIt1LzZaBx46SG"
          alt="Silver supercar top view"
          className="relative z-10 w-full object-contain"
        />

        {/* Floating Chips - Desktop */}
        <div className="hidden md:block">
          <Chip
            text={WHY_CHOOSE_LABELS[0]}
            className="top-[14%] right-[4%]"
            delay={0.5}
            inView={inView}
          />
          <Chip
            text={WHY_CHOOSE_LABELS[1]}
            className="top-[36%] left-[2%]"
            delay={0.6}
            inView={inView}
          />
          <Chip
            text={WHY_CHOOSE_LABELS[2]}
            className="bottom-[24%] right-[4%]"
            delay={0.7}
            inView={inView}
          />
          <Chip
            text={WHY_CHOOSE_LABELS[3]}
            className="bottom-[12%] left-[2%]"
            delay={0.8}
            inView={inView}
          />
        </div>

        {/* Mobile Grid */}
        <div className="mt-10 grid grid-cols-2 gap-3 md:hidden">
          {WHY_CHOOSE_LABELS.map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-center"
            >
              <span className="text-white font-bold text-xs tracking-wide">
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Chip({ text, className, delay, inView }: { text: string; className: string; delay: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ delay, duration: 0.45, ease: 'easeOut' }}
      className={`absolute z-20 bg-[#1a1a1a] border border-white/10 rounded-xl px-5 py-3 shadow-2xl ${className}`}
    >
      <span className="text-white font-bold text-sm tracking-wide whitespace-nowrap">
        {text}
      </span>
    </motion.div>
  );
}
