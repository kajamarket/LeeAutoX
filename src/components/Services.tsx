import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { SERVICES } from '../constants';
import { Service } from '../types';

export default function Services() {
  return (
    <section id="services" className="px-6 md:px-12 py-24 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <h2 className="font-serif text-5xl md:text-6xl font-bold leading-tight text-[#2B59FF]">
          What we offer
        </h2>
        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed md:font-serif md:font-bold">
          End-to-end vehicle procurement and import services — from auction floor to your driveway in Africa.
        </p>
      </div>

      <div className="flex flex-col">
        {SERVICES.map((service, index) => (
          <ServiceRow key={service.id} service={service} index={index} />
        ))}
      </div>
    </section>
  );
}

interface ServiceRowProps {
  service: Service;
  index: number;
}

const ServiceRow: React.FC<ServiceRowProps> = ({ service, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 40, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group border-b border-border py-10 flex flex-col md:flex-row md:items-center gap-6 cursor-default hover:bg-foreground hover:text-background transition-colors duration-300 px-0 md:px-4 -mx-0 md:-mx-4"
    >
      <span className="text-xs font-mono tracking-[0.2em] text-[#2B59FF] group-hover:text-white w-10 shrink-0">
        {service.id}
      </span>
      <h3 className="text-2xl md:text-3xl font-serif font-bold w-full md:w-72 shrink-0">
        {service.title}
      </h3>
      <p className="text-muted-foreground group-hover:text-background/70 text-sm leading-relaxed flex-1">
        {service.description}
      </p>
      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[#2B59FF]">
        <ArrowUpRight size={20} />
      </div>
    </motion.div>
  );
}
