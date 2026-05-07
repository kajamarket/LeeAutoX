import React from 'react';
import { motion } from 'motion/react';
import { PROCESS_STEPS, PROCESS_STATS } from '../constants';
import { ProcessStep } from '../types';
import { Search, Globe, ArrowRight, ShieldCheck, FileText, CreditCard, FileSignature, Ship, Truck } from 'lucide-react';

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
  const renderIllustration = () => {
    switch (step.id) {
      case '01':
        return (
          <div className="flex flex-col gap-3 mt-1">
            <div className="flex items-center gap-4 bg-muted/30 p-3 border border-border/40">
              <div className="w-10 h-10 bg-[#2B59FF]/10 flex items-center justify-center text-[#2B59FF] shrink-0">
                <Search size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Specifications</span>
                <span className="text-xs font-medium">Make, Model, Year, Budget</span>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-muted/30 p-3 border border-border/40">
              <div className="w-10 h-10 bg-[#2B59FF]/10 flex items-center justify-center text-[#2B59FF] shrink-0">
                <Globe size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Market Sourcing</span>
                <span className="text-xs font-medium">USA & Canada Auctions</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground px-1 font-mono tracking-widest uppercase opacity-60">
              Bid <ArrowRight size={10} /> Verify <ArrowRight size={10} /> Secure
            </div>
          </div>
        );
      case '02':
        return (
          <div className="flex flex-col gap-3 mt-1">
            <div className="flex items-center gap-4 bg-muted/30 p-3 border border-border/40">
              <div className="w-10 h-10 bg-[#2B59FF]/10 flex items-center justify-center text-[#2B59FF] shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Certification</span>
                <span className="text-xs font-medium">150+ Point Inspection</span>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-muted/30 p-3 border border-border/40">
              <div className="w-10 h-10 bg-[#2B59FF]/10 flex items-center justify-center text-[#2B59FF] shrink-0">
                <FileText size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Media Report</span>
                <span className="text-xs font-medium">Full HD Photos & Logs</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#2B59FF] px-1 font-mono tracking-widest uppercase opacity-80 font-bold">
              No Surprise Guarantee
            </div>
          </div>
        );
      case '03':
        return (
          <div className="flex flex-col gap-3 mt-1">
            <div className="flex items-center gap-4 bg-muted/30 p-3 border border-border/40">
              <div className="w-10 h-10 bg-[#2B59FF]/10 flex items-center justify-center text-[#2B59FF] shrink-0">
                <CreditCard size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Settlement</span>
                <span className="text-xs font-medium">Flexible Payment Plans</span>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-muted/30 p-3 border border-border/40">
              <div className="w-10 h-10 bg-[#2B59FF]/10 flex items-center justify-center text-[#2B59FF] shrink-0">
                <FileSignature size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Compliance</span>
                <span className="text-xs font-medium">Titles & Customs Papers</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground px-1 font-mono tracking-widest uppercase opacity-60">
              End-to-End Handling
            </div>
          </div>
        );
      case '04':
        return (
          <div className="flex flex-col gap-3 mt-1">
            <div className="flex items-center gap-4 bg-muted/30 p-3 border border-border/40">
              <div className="w-10 h-10 bg-[#2B59FF]/10 flex items-center justify-center text-[#2B59FF] shrink-0">
                <Ship size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Transit</span>
                <span className="text-xs font-medium">Secure Container Loading</span>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-muted/30 p-3 border border-border/40">
              <div className="w-10 h-10 bg-[#2B59FF]/10 flex items-center justify-center text-[#2B59FF] shrink-0">
                <Truck size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Arrival</span>
                <span className="text-xs font-medium">Port Clearance & Delivery</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#2B59FF] px-1 font-mono tracking-widest uppercase opacity-80 font-bold">
              Real-time Global Tracking
            </div>
          </div>
        );
      default:
        return (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        );
    }
  };

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
      {renderIllustration()}
    </motion.div>
  );
}
