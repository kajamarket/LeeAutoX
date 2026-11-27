import React, { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { SERVICES } from '../constants';
import AnimatedText from './ui/AnimatedText';
import Reveal from './ui/Reveal';

export default function Services() {
  const [isSectionOpen, setIsSectionOpen] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>('01');

  const toggleService = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="services" className="px-4 sm:px-6 md:px-12 py-20 max-w-7xl mx-auto">
      <Reveal variant="rise">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-6">
          <div>
            <span className="inline-block text-[11px] font-mono uppercase tracking-[0.22em] text-[var(--accent)] font-bold mb-2">
              End-to-End Scope
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal leading-tight text-[var(--ink)]">
              <AnimatedText text="What we offer" variant="blur-in" />
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
        <div className="lx-accordion-inner">
          <p className="text-[var(--ink-2)] text-sm sm:text-base max-w-xl leading-relaxed mb-10">
            End-to-end vehicle procurement and import services — select any service below to view inspection and shipping scope.
          </p>

          <div className="lx-card px-5 sm:px-8 divide-y divide-[var(--line)]">
            {SERVICES.map((service) => {
              const isExpanded = expandedId === service.id;
              return (
                <div key={service.id}>
                  <button
                    type="button"
                    onClick={() => toggleService(service.id)}
                    aria-expanded={isExpanded}
                    className="w-full py-7 flex items-center justify-between gap-6 text-left group cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center gap-5 md:gap-10">
                      <span className="text-xs font-mono tracking-[0.2em] text-[var(--accent)] font-bold w-8 shrink-0">
                        {service.id}
                      </span>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-normal text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                        {service.title}
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-[var(--line)] flex items-center justify-center shrink-0 text-[var(--ink)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] transition-all">
                      {isExpanded ? <Minus size={17} /> : <Plus size={17} />}
                    </div>
                  </button>

                  <div className="lx-accordion-body" data-open={isExpanded ? 'true' : 'false'}>
                    <div className="lx-accordion-inner pb-7 pl-12 md:pl-18 pr-4">
                      <p className="text-[var(--ink-2)] text-sm sm:text-base leading-relaxed max-w-3xl mb-4">
                        {service.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--accent)]">
                        <span>✓ Professional End-to-End Handling</span>
                        <span>✓ Transparent Inspection Reports</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
