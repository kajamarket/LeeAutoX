import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { FAQ_ITEMS } from '../constants';
import { FAQItem } from '../types';
import { useTheme } from '../context/ThemeContext';

export default function FAQ() {
  const { theme } = useTheme();

  return (
    <section id="faq" className={`relative transition-colors duration-500 px-6 md:px-12 py-24 overflow-hidden ${
      theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      {/* Background Graffiti - Sophisticated Typography Layer */}
      <div className={`absolute inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-[0.03] transition-colors duration-500 ${
        theme === 'dark' ? 'text-white' : 'text-black'
      }`}>
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
            <div key={i} className={`w-[1px] h-32 transition-colors duration-500 ${theme === 'dark' ? 'bg-white' : 'bg-black'}`} />
          ))}
        </div>
        <div className="absolute bottom-[40%] left-[20%] grid grid-cols-4 gap-4 opacity-50">
          {[...Array(16)].map((_, i) => (
            <div key={i} className={`w-1 h-1 rounded-full transition-colors duration-500 ${theme === 'dark' ? 'bg-white' : 'bg-black'}`} />
          ))}
        </div>
        <div className="absolute top-[20%] right-[5%] text-[10vw] font-light leading-none rotate-[10deg]">
          //////
        </div>
        <div className={`absolute bottom-[60%] left-[10%] text-[8vw] font-light leading-none rotate-[-20deg] border-b pb-2 transition-colors duration-500 ${
          theme === 'dark' ? 'border-white' : 'border-black'
        }`}>
          003//X
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <h2 className={`font-serif text-4xl md:text-5xl font-bold text-center mb-16 transition-colors duration-500 ${
          theme === 'dark' ? 'text-white' : 'text-black'
        }`}>
          Frequently Asked Questions
        </h2>

        <div className={`divide-y border-t border-b transition-colors duration-500 ${
          theme === 'dark' ? 'divide-white/10 border-white/10' : 'divide-black/10 border-black/10'
        }`}>
          {FAQ_ITEMS.map((item, index) => (
            <FAQAccordionItem key={index} item={item} theme={theme} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FAQAccordionItemProps {
  item: FAQItem;
  theme: string;
}

const FAQAccordionItem: React.FC<FAQAccordionItemProps> = ({ item, theme }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left cursor-pointer group"
      >
        <span className={`text-sm font-medium leading-snug pr-8 transition-colors ${
          theme === 'dark' ? 'text-white group-hover:text-white/80' : 'text-black group-hover:text-black/80'
        }`}>
          {item.question}
        </span>
        <div className={`shrink-0 transition-colors ${
          theme === 'dark' ? 'text-[#2B59FF] group-hover:text-[#4d73ff]' : 'text-[#2B59FF] group-hover:text-[#1a41cc]'
        }`}>
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
            <p className={`text-sm font-light leading-relaxed pb-5 pr-10 transition-colors ${
              theme === 'dark' ? 'text-white/50' : 'text-black/50'
            }`}>
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
