import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { PROCESS_STEPS, PROCESS_STATS } from '../constants';
import { ProcessStep } from '../types';

export default function Process() {
  return (
    <section id="process" className="px-6 md:px-12 py-24 max-w-7xl mx-auto">
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-16 text-[#2B59FF]"
      >
        How it works
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
        {PROCESS_STEPS.map((step, index) => (
          <ProcessStepCard key={step.id} step={step} index={index} />
        ))}
      </div>

      <div className="mt-24 border-t border-border pt-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        {PROCESS_STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="font-serif text-5xl font-bold text-[#2B59FF]">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-2 tracking-wide">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

interface ProcessStepCardProps {
  step: ProcessStep;
  index: number;
}

const ProcessStepCard: React.FC<ProcessStepCardProps> = ({ step, index }) => {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.6 }}
      className="border-t border-border pt-8 pr-8 pb-8 flex flex-col gap-4"
    >
      <span className="font-mono text-xs tracking-[0.25em] text-[#2B59FF] font-bold">
        {step.id}
      </span>
      <h3 className="font-serif text-2xl font-bold">{step.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {step.description}
      </p>
    </motion.div>
  );
}
