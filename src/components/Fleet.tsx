import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Plus, Minus, ArrowRight } from 'lucide-react';
import { FLEET } from '../constants';
import AnimatedText from './ui/AnimatedText';
import Reveal from './ui/Reveal';

export default function Fleet() {
  const [isSectionOpen, setIsSectionOpen] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="fleet" className="px-4 sm:px-6 md:px-12 py-20 bg-[var(--surface)] text-[var(--ink)] border-t border-[var(--line)]">
      <div className="max-w-7xl mx-auto">
        <Reveal variant="rise">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-6">
            <div>
              <span className="inline-block text-[11px] font-mono uppercase tracking-[0.22em] text-[var(--accent)] font-bold mb-2">
                Sourcing Categories
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal leading-tight text-[var(--ink)]">
                <AnimatedText text="What we source" variant="word-stagger" />
              </h2>
            </div>
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => setIsSectionOpen(!isSectionOpen)}
                aria-expanded={isSectionOpen}
                className="lx-pill-btn border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--accent)] text-xs font-mono uppercase tracking-wider"
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
              From executive SUVs to heavy-duty commercial fleet units — tap any category to inspect sourcing specifications.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {FLEET.map((item, index) => {
                const isExpanded = expandedIndex === index;
                return (
                  <Reveal key={item.title} variant="scale" delay={index * 60}>
                    <div className="lx-card overflow-hidden">
                      <div
                        onClick={() => toggleItem(index)}
                        className="relative overflow-hidden aspect-[16/9] bg-[var(--bg)] cursor-pointer group"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors duration-300" />
                        <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[var(--card)] text-[var(--accent)] flex items-center justify-center shadow-lg">
                          {isExpanded ? <Minus size={16} /> : <Plus size={16} />}
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                          <span className="font-mono text-xs uppercase tracking-widest bg-black/65 px-3 py-1 rounded-full backdrop-blur-sm">
                            {item.label}
                          </span>
                          <span className="font-mono text-xs text-white/90">{item.category}</span>
                        </div>
                      </div>

                      <div className="p-6">
                        <button
                          type="button"
                          onClick={() => toggleItem(index)}
                          aria-expanded={isExpanded}
                          className="w-full flex items-center justify-between text-left cursor-pointer focus:outline-none"
                        >
                          <h3 className="font-serif text-2xl font-normal text-[var(--ink)]">{item.title}</h3>
                          <ChevronDown
                            size={20}
                            className={`text-[var(--accent)] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>

                        <div className="lx-accordion-body" data-open={isExpanded ? 'true' : 'false'}>
                          <div className="lx-accordion-inner">
                            <div className="mt-4 pt-4 border-t border-[var(--line)]">
                              <p className="text-[var(--ink-2)] text-sm leading-relaxed mb-4">
                                We handle direct auction bidding, thorough pre-purchase inspections, container securing, marine insurance, and port clearance for all {item.title.toLowerCase()} listings sourced from USA and Canadian markets.
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-mono text-[var(--accent)] font-bold">
                                  Category: {item.category}
                                </span>
                                <Link
                                  to="/inventory/"
                                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[var(--accent)] hover:underline"
                                >
                                  View Inventory <ArrowRight size={13} />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
