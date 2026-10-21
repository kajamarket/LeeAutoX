import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { SERVICES } from '../constants';
import { Service } from '../types';

export default function Services() {
  const [isSectionOpen, setIsSectionOpen] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>('01');

  const toggleService = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="services" className="px-6 md:px-12 py-24 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-6">
        <div>
          <h2 className="font-serif text-5xl md:text-6xl font-bold leading-tight text-[#2B59FF]">
            What we offer
          </h2>
        </div>
        <div className="shrink-0">
          <button
            onClick={() => setIsSectionOpen(!isSectionOpen)}
            aria-expanded={isSectionOpen}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#2B59FF]/30 hover:border-[#2B59FF] bg-[#2B59FF]/10 hover:bg-[#2B59FF]/20 text-[#2B59FF] text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <span>{isSectionOpen ? 'Collapse Section' : 'Expand Section'}</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${isSectionOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isSectionOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-muted-foreground text-sm max-w-xl leading-relaxed md:font-serif md:font-bold mb-12">
              End-to-end vehicle procurement and import services — click any service to expand or collapse details.
            </p>

            <div className="flex flex-col border-t border-border">
              {SERVICES.map((service) => {
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
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
