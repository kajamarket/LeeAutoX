import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { WHY_CHOOSE_LABELS } from '../constants';
import { useTheme } from '../context/ThemeContext';

export default function WhyChooseUs() {
  const { theme } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

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

      <motion.h2
        ref={ref}
        initial={{ y: 20, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className={`font-serif text-4xl md:text-5xl font-bold text-center mb-16 transition-colors duration-500 ${
          theme === 'dark' ? 'text-white' : 'text-black'
        }`}
      >
        Why Choose Us
      </motion.h2>

      <div className="relative mx-auto max-w-2xl select-none">
        {/* Glow */}
        <div 
          className="absolute inset-0 z-0 transition-opacity duration-500"
          style={{ 
            background: theme === 'dark' 
              ? 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 80%)'
              : 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0.04) 0%, transparent 80%)'
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
            theme={theme}
          />
          <Chip
            text={WHY_CHOOSE_LABELS[1]}
            className="top-[36%] left-[2%]"
            delay={0.6}
            inView={inView}
            theme={theme}
          />
          <Chip
            text={WHY_CHOOSE_LABELS[2]}
            className="bottom-[24%] right-[4%]"
            delay={0.7}
            inView={inView}
            theme={theme}
          />
          <Chip
            text={WHY_CHOOSE_LABELS[3]}
            className="bottom-[12%] left-[2%]"
            delay={0.8}
            inView={inView}
            theme={theme}
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
              className={`border rounded-xl px-4 py-3 text-center transition-colors duration-500 ${
                theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-[#f5f5f5] border-black/10'
              }`}
            >
              <span className={`font-bold text-xs tracking-wide transition-colors duration-500 ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Chip({ text, className, delay, inView, theme }: { text: string; className: string; delay: number; inView: boolean; theme: string }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ delay, duration: 0.45, ease: 'easeOut' }}
      className={`absolute z-20 border rounded-xl px-5 py-3 shadow-2xl transition-colors duration-500 ${className} ${
        theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-[#f5f5f5] border-black/10'
      }`}
    >
      <span className={`font-bold text-sm tracking-wide whitespace-nowrap transition-colors duration-500 ${
        theme === 'dark' ? 'text-white' : 'text-black'
      }`}>
        {text}
      </span>
    </motion.div>
  );
}
