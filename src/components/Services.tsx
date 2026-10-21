import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { SERVICES } from '../constants';
import { Service } from '../types';

export default function Services() {
  const [expandedId, setExpandedId] = useState<string | null>('01');

  const toggleService = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="services" className="px-6 md:px-12 py-24 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <span className="text-xs font-mono tracking-[0.3em] text-[#2B59FF] uppercase block mb-2">Expandable Services</span>
          <h2 className="font-serif text-5xl md:text-6xl font-bold leading-tight text-[#2B59FF]">
            What we offer
          </h2>
        </div>
        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed md:font-serif md:font-bold">
          End-to-end vehicle procurement and import services — click any service to expand or collapse details.
        </p>
      </div>

      <div className="flex flex-col border-t border-border">
        {SERVICES.map((service, index) => {
          const isExpanded = expandedId === service.id;
          return (
            <div
              key={service.id}
              className="border-b border-border transition-colors duration-300"
            >
              <button
                onClick={() => toggleService(service.id)}
                className="w-full py-8 flex items-center justify-between gap-6 text-left group cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-6 md:gap-10">
                  <span className="text-xs font-mono tracking-[0.2em] text-[#2B59FF] w-10 shrink-0">
                    {service.id}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold group-hover:text-[#2B59FF] transition-colors">
                    {service.title}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center shrink-0 group-hover:border-[#2B59FF] group-hover:text-[#2B59FF] transition-all">
                  {isExpanded ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden pb-8 pl-16 md:pl-20 pr-6"
                  >
                    <p className="text-muted-foreground text-base leading-relaxed max-w-3xl mb-4 font-light">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-mono text-[#2B59FF]">
                      <span className="flex items-center gap-1.5">✓ Professional End-to-End Handling</span>
                      <span className="flex items-center gap-1.5">✓ Transparent Inspection Reports</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
