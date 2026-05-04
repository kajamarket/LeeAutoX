import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { TESTIMONIALS } from '../constants';
import { useTheme } from '../context/ThemeContext';

export default function Testimonials() {
  const { theme } = useTheme();
  const [active, setActive] = useState(0);

  const next = () => setActive((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setActive((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section id="testimonials" className={`relative transition-colors duration-500 px-6 md:px-12 py-24 overflow-hidden ${
      theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      {/* Background Graffiti - Sophisticated Typography Layer */}
      <div className={`absolute inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-[0.03] transition-colors duration-500 ${
        theme === 'dark' ? 'text-white' : 'text-black'
      }`}>
        <div className="absolute -top-10 -left-20 text-[20vw] font-black leading-none tracking-tighter rotate-[-15deg] whitespace-nowrap">
          TRUSTED
        </div>
        <div className="absolute top-1/2 -right-40 text-[18vw] font-serif font-bold leading-none rotate-[12deg] whitespace-nowrap">
          SERVICE
        </div>
        <div className="absolute -bottom-20 -left-10 text-[25vw] font-black leading-none tracking-tighter rotate-[-5deg] whitespace-nowrap">
          DELIVERY
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
          002//X
        </div>
        <div className={`absolute bottom-[10%] left-[45%] w-40 h-40 border rounded-full rotate-[30deg] transition-colors duration-500 ${
          theme === 'dark' ? 'border-white/40' : 'border-black/40'
        }`} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <Quote size={32} className={`mx-auto mb-10 opacity-60 transition-colors duration-500 text-[#2B59FF]`} />

        <div className="min-h-[200px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <p className={`font-serif text-2xl md:text-4xl font-bold leading-snug mb-10 transition-colors duration-500 ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                "{TESTIMONIALS[active].quote}"
              </p>
              
              <div className="flex flex-col items-center gap-1 mb-12">
                <span className={`font-medium text-sm transition-colors duration-500 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>{TESTIMONIALS[active].author}</span>
                <span className={`text-xs tracking-wide transition-colors duration-500 ${
                  theme === 'dark' ? 'text-white/50' : 'text-black/50'
                }`}>
                  {TESTIMONIALS[active].role}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            className={`w-10 h-10 border flex items-center justify-center transition-all cursor-pointer ${
              theme === 'dark' 
                ? 'border-white/30 text-white hover:bg-white hover:text-black' 
                : 'border-black/30 text-black hover:bg-black hover:text-white'
            }`}
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  active === i 
                    ? (theme === 'dark' ? 'bg-white scale-125' : 'bg-black scale-125') 
                    : (theme === 'dark' ? 'bg-white/30' : 'bg-black/30')
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className={`w-10 h-10 border flex items-center justify-center transition-all cursor-pointer ${
              theme === 'dark' 
                ? 'border-white/30 text-white hover:bg-white hover:text-black' 
                : 'border-black/30 text-black hover:bg-black hover:text-white'
            }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
