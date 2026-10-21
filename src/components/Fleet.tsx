import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ChevronDown, Plus, Minus } from 'lucide-react';
import { FLEET } from '../constants';
import { FleetItem } from '../types';

export default function Fleet() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="fleet" className="px-6 md:px-12 py-24 bg-muted/40">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono tracking-[0.3em] text-[#2B59FF] uppercase block mb-2">Expandable Categories</span>
            <h2 className="font-serif text-5xl md:text-6xl font-bold leading-tight text-[#2B59FF]">
              What we source
            </h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-xs leading-relaxed md:font-serif md:font-bold">
            From luxury sedans to heavy-duty commercial vehicles — click any category to expand or collapse details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {FLEET.map((item, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <motion.div
                key={item.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="border border-border bg-background/50 overflow-hidden shadow-sm"
              >
                <div 
                  onClick={() => toggleItem(index)}
                  className="relative overflow-hidden aspect-[16/9] bg-muted cursor-pointer group"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-300" />
                  <div className="absolute top-4 right-4 w-9 h-9 bg-background flex items-center justify-center text-[#2B59FF] shadow-lg">
                    {isExpanded ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <span className="font-mono text-xs uppercase tracking-widest bg-black/60 px-2.5 py-1 backdrop-blur-sm">{item.label}</span>
                    <span className="font-mono text-xs text-white/80">{item.category}</span>
                  </div>
                </div>

                <div className="p-6">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full flex items-center justify-between text-left cursor-pointer focus:outline-none"
                  >
                    <h3 className="font-serif text-2xl font-bold">{item.title}</h3>
                    <div className="text-[#2B59FF]">
                      <ChevronDown size={20} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden mt-4 pt-4 border-t border-border"
                      >
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                          We handle direct auction bidding, thorough pre-purchase inspections, container securing, marine insurance, and port clearance for all {item.title.toLowerCase()} listings sourced from USA and Canadian markets.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-[#2B59FF] font-bold">Category: {item.category}</span>
                          <a
                            href="/inventory"
                            className="text-xs font-mono uppercase tracking-widest text-[#2B59FF] underline underline-offset-4 hover:opacity-80"
                          >
                            View Inventory →
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
