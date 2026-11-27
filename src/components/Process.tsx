import React, { useState } from 'react';
import { PROCESS_STEPS, PROCESS_STATS } from '../constants';
import { ProcessStep } from '../types';
import { Search, Globe, ArrowRight, ShieldCheck, FileText, CreditCard, FileSignature, Ship, Truck, ChevronDown } from 'lucide-react';
import AnimatedText from './ui/AnimatedText';
import Reveal from './ui/Reveal';
import { StepTrack } from './ui/ImportedControls';

export default function Process() {
  const [isSectionOpen, setIsSectionOpen] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  const trackSteps = PROCESS_STEPS.map((s) => ({
    number: s.id,
    title: s.title,
  }));

  return (
    <section id="process" className="px-4 sm:px-6 md:px-12 py-20 max-w-7xl mx-auto">
      <Reveal variant="rise">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-6">
          <div>
            <span className="inline-block text-[11px] font-mono uppercase tracking-[0.22em] text-[var(--accent)] font-bold mb-2">
              Procurement Architecture
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal leading-tight text-[var(--ink)]">
              <AnimatedText text="How it works" variant="mask-rise" />
            </h2>
          </div>
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setIsSectionOpen(!isSectionOpen)}
              aria-expanded={isSectionOpen}
              className="lx-pill-btn border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--accent)] text-xs font-mono uppercase tracking-wider"
            >
              <span>{isSectionOpen ? 'Collapse Section' : 'Expand Section'}</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${isSectionOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        </div>
      </Reveal>

      <div className="lx-accordion-body" data-open={isSectionOpen ? 'true' : 'false'}>
        <div className="lx-accordion-inner pt-4">
          <div className="mb-10">
            <StepTrack steps={trackSteps} activeStep={activeStep} onSelect={setActiveStep} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROCESS_STEPS.map((step, index) => (
              <ProcessStepCard
                key={step.id}
                step={step}
                index={index}
                active={activeStep === index}
                onSelect={() => setActiveStep(index)}
              />
            ))}
          </div>

          <div className="mt-16 border-t border-[var(--line)] pt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {PROCESS_STATS.map((stat) => (
              <div key={stat.label}>
                <div className="font-serif text-4xl sm:text-5xl font-normal text-[var(--accent)] tabular-nums">
                  <AnimatedText text={stat.value} variant="counter" />
                </div>
                <div className="text-xs font-mono text-[var(--ink-2)] mt-2 tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface ProcessStepCardProps {
  step: ProcessStep;
  index: number;
  active: boolean;
  onSelect: () => void;
}

const ProcessStepCard: React.FC<ProcessStepCardProps> = ({ step, index, active, onSelect }) => {
  const renderIllustration = () => {
    switch (step.id) {
      case '01':
        return (
          <div className="flex flex-col gap-3 mt-1">
            <div className="flex items-center gap-3 bg-[var(--surface)] p-3 rounded-2xl border border-[var(--line)]">
              <div className="w-9 h-9 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shrink-0">
                <Search size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-[var(--ink-2)] uppercase tracking-wider">Specifications</span>
                <span className="text-xs font-medium text-[var(--ink)]">Make, Model, Year, Budget</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-[var(--surface)] p-3 rounded-2xl border border-[var(--line)]">
              <div className="w-9 h-9 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shrink-0">
                <Globe size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-[var(--ink-2)] uppercase tracking-wider">Market Sourcing</span>
                <span className="text-xs font-medium text-[var(--ink)]">USA &amp; Canada Auctions</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[var(--ink-2)] px-1 font-mono tracking-widest uppercase">
              Bid <ArrowRight size={10} /> Verify <ArrowRight size={10} /> Secure
            </div>
          </div>
        );
      case '02':
        return (
          <div className="flex flex-col gap-3 mt-1">
            <div className="flex items-center gap-3 bg-[var(--surface)] p-3 rounded-2xl border border-[var(--line)]">
              <div className="w-9 h-9 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-[var(--ink-2)] uppercase tracking-wider">Certification</span>
                <span className="text-xs font-medium text-[var(--ink)]">150+ Point Inspection</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-[var(--surface)] p-3 rounded-2xl border border-[var(--line)]">
              <div className="w-9 h-9 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shrink-0">
                <FileText size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-[var(--ink-2)] uppercase tracking-wider">Media Report</span>
                <span className="text-xs font-medium text-[var(--ink)]">Full HD Photos &amp; Logs</span>
              </div>
            </div>
            <div className="text-[10px] text-[var(--accent)] px-1 font-mono tracking-widest uppercase font-bold">
              No Surprise Guarantee
            </div>
          </div>
        );
      case '03':
        return (
          <div className="flex flex-col gap-3 mt-1">
            <div className="flex items-center gap-3 bg-[var(--surface)] p-3 rounded-2xl border border-[var(--line)]">
              <div className="w-9 h-9 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shrink-0">
                <CreditCard size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-[var(--ink-2)] uppercase tracking-wider">Settlement</span>
                <span className="text-xs font-medium text-[var(--ink)]">Flexible Payment Plans</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-[var(--surface)] p-3 rounded-2xl border border-[var(--line)]">
              <div className="w-9 h-9 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shrink-0">
                <FileSignature size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-[var(--ink-2)] uppercase tracking-wider">Compliance</span>
                <span className="text-xs font-medium text-[var(--ink)]">Titles &amp; Customs Papers</span>
              </div>
            </div>
            <div className="text-[10px] text-[var(--ink-2)] px-1 font-mono tracking-widest uppercase">
              End-to-End Handling
            </div>
          </div>
        );
      case '04':
        return (
          <div className="flex flex-col gap-3 mt-1">
            <div className="flex items-center gap-3 bg-[var(--surface)] p-3 rounded-2xl border border-[var(--line)]">
              <div className="w-9 h-9 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shrink-0">
                <Ship size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-[var(--ink-2)] uppercase tracking-wider">Transit</span>
                <span className="text-xs font-medium text-[var(--ink)]">Secure Container Loading</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-[var(--surface)] p-3 rounded-2xl border border-[var(--line)]">
              <div className="w-9 h-9 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shrink-0">
                <Truck size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-[var(--ink-2)] uppercase tracking-wider">Arrival</span>
                <span className="text-xs font-medium text-[var(--ink)]">Port Clearance &amp; Delivery</span>
              </div>
            </div>
            <div className="text-[10px] text-[var(--accent)] px-1 font-mono tracking-widest uppercase font-bold">
              Real-time Global Tracking
            </div>
          </div>
        );
      default:
        return <p className="text-sm text-[var(--ink-2)] leading-relaxed">{step.description}</p>;
    }
  };

  return (
    <Reveal variant="rise" delay={index * 60}>
      <div
        onClick={onSelect}
        className={`lx-card p-6 h-full flex flex-col gap-4 cursor-pointer transition-all ${
          active ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]/30' : ''
        }`}
      >
        <span className="font-mono text-xs tracking-[0.25em] text-[var(--accent)] font-bold">
          {step.id}
        </span>
        <h3 className="font-serif text-2xl font-normal text-[var(--ink)]">{step.title}</h3>
        {renderIllustration()}
      </div>
    </Reveal>
  );
};
