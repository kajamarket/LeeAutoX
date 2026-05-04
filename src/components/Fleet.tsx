import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { FLEET } from '../constants';
import { FleetItem } from '../types';

export default function Fleet() {
  return (
    <section id="fleet" className="px-6 md:px-12 py-24 bg-muted/40">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <h2 className="font-serif text-5xl md:text-6xl font-bold leading-tight text-[#2B59FF]">
            What we source
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs leading-relaxed md:font-serif md:font-bold">
            From luxury sedans to heavy-duty commercial vehicles — we source it all and ship it straight to you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          {FLEET.map((item, index) => (
            <FleetCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FleetCardProps {
  item: FleetItem;
  index: number;
}

const FleetCard: React.FC<FleetCardProps> = ({ item, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ delay: index * 0.1, duration: 0.7, ease: 'easeOut' }}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden aspect-[4/3] bg-muted mb-4">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-300" />
        <div className="absolute top-4 right-4 w-9 h-9 bg-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#2B59FF] shadow-lg">
          <ArrowUpRight size={16} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl font-bold">{item.title}</h3>
          <p className="text-xs text-muted-foreground tracking-wide mt-0.5">{item.category}</p>
        </div>
        <span className="font-mono text-xs text-[#2B59FF] font-bold">{item.label}</span>
      </div>
    </motion.div>
  );
};

