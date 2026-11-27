import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FAQ_ITEMS } from '../constants';
import { FAQItem } from '../types';
import AnimatedText from './ui/AnimatedText';
import Reveal from './ui/Reveal';

export default function FAQ() {
  return (
    <section
      id="faq"
      className="lx-band-surface relative border-t border-[var(--line)] transition-colors duration-500 px-4 sm:px-6 md:px-12 py-16 overflow-x-clip"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="lx-bg-dots absolute inset-0 opacity-60" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 45% at 50% 10%, var(--accent-soft) 0%, transparent 70%)',
          }}
        />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto">
        <Reveal variant="rise">
          <div className="text-center mb-12">
            <span className="inline-block text-[11px] font-mono uppercase tracking-[0.22em] text-[var(--accent)] font-bold mb-2">
              Clear Answers
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-[var(--ink)]">
              <AnimatedText text="Frequently Asked Questions" variant="underline-squiggle" />
            </h2>
          </div>
        </Reveal>

        <div className="lx-card px-5 sm:px-8 divide-y divide-[var(--line)]">
          {FAQ_ITEMS.map((item, index) => (
            <FAQAccordionItem key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FAQAccordionItemProps {
  item: FAQItem;
}

const FAQAccordionItem: React.FC<FAQAccordionItemProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between py-5 text-left cursor-pointer group"
      >
        <span className="text-sm sm:text-base font-medium leading-snug pr-6 text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
          {item.question}
        </span>
        <div className="shrink-0 w-8 h-8 rounded-full border border-[var(--line)] flex items-center justify-center text-[var(--accent)] group-hover:border-[var(--accent)] transition-colors">
          {isOpen ? <Minus size={15} /> : <Plus size={15} />}
        </div>
      </button>

      <div className="lx-accordion-body" data-open={isOpen ? 'true' : 'false'}>
        <div className="lx-accordion-inner">
          <p className="text-sm leading-relaxed pb-5 pr-8 text-[var(--ink-2)]">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
};
