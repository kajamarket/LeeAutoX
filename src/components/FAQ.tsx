import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { FAQ_ITEMS } from '../constants';

import { FAQItem } from '../types';

export default function FAQ() {
  return (
    <section id="faq" className="bg-black text-white px-6 md:px-12 py-24">
      <div className="max-w-3xl mx-auto">
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
