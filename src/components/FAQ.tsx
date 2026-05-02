import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { FAQ_ITEMS } from '../constants';

import { FAQItem } from '../types';

export default function FAQ() {
  return (
    <section id="faq" className="relative bg-black text-white px-6 md:px-12 py-24 overflow-hidden">
      {/* Background Graffiti - Sophisticated Typography Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-[0.03]">
        <div className="absolute -top-10 -left-20 text-[20vw] font-black leading-none tracking-tighter rotate-[15deg] whitespace-nowrap">
          QUESTIONS
        </div>
        <div className="absolute top-1/2 -right-40 text-[18vw] font-serif font-bold leading-none rotate-[-12deg] whitespace-nowrap">
          SUPPORT
        </div>
        <div className="absolute -bottom-20 -left-10 text-[25vw] font-black leading-none tracking-tighter rotate-[5deg] whitespace-nowrap">
          HELP
        </div>

        {/* Random Pattern Accents */}
        <div className="absolute top-[10%] right-[30%] rotate-[-45deg] flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-[1px] h-32 bg-white" />
          ))}
        </div>
        <div className="absolute bottom-[40%] left-[20%] grid grid-cols-4 gap-4 opacity-50">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-white" />
          ))}
        </div>
        <div className="absolute top-[20%] right-[5%] text-[10vw] font-light leading-none rotate-[10deg]">
          //////
        </div>
        <div className="absolute bottom-[60%] left-[10%] text-[8vw] font-light leading-none rotate-[-20deg] border-b border-white pb-2">
          003//X
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-16 text-white">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-white/10 border-t border-b border-white/10">
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
    <div className="py-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left cursor-pointer group"
      >
        <span className="text-white text-sm font-medium leading-snug pr-8 group-hover:text-white/80 transition-colors">
          {item.question}
        </span>
        <div className="shrink-0 text-white/40 group-hover:text-white/70 transition-colors">
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-white/50 text-sm font-light leading-relaxed pb-5 pr-10">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
