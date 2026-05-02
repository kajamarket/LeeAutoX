import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { TESTIMONIALS } from '../constants';

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const next = () => setActive((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setActive((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section id="testimonials" className="relative px-6 md:px-12 py-24 bg-foreground text-background overflow-hidden">
      {/* Background Graffiti - Sophisticated Typography Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-[0.03]">
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
            <div key={i} className="w-[1px] h-32 bg-background" />
          ))}
        </div>
        <div className="absolute bottom-[20%] right-[20%] grid grid-cols-4 gap-4 opacity-50">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-background" />
          ))}
        </div>
        <div className="absolute top-[40%] left-[5%] text-[10vw] font-light leading-none rotate-[-10deg]">
          ++++++
        </div>
        <div className="absolute top-[60%] right-[10%] text-[8vw] font-light leading-none rotate-[20deg] border-t border-background pt-2">
          002//X
        </div>
        <div className="absolute bottom-[10%] left-[45%] w-40 h-40 border border-background/40 rounded-full rotate-[30deg]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <Quote size={32} className="mx-auto mb-10 opacity-30" />

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
              <p className="font-serif text-2xl md:text-4xl font-bold leading-snug mb-10">
                "{TESTIMONIALS[active].quote}"
              </p>
              
              <div className="flex flex-col items-center gap-1 mb-12">
                <span className="font-medium text-sm">{TESTIMONIALS[active].author}</span>
                <span className="text-xs text-background/50 tracking-wide">
                  {TESTIMONIALS[active].role}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            className="w-10 h-10 border border-background/30 flex items-center justify-center hover:bg-background hover:text-foreground transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  active === i ? 'bg-background scale-125' : 'bg-background/30'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 border border-background/30 flex items-center justify-center hover:bg-background hover:text-foreground transition-colors cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
