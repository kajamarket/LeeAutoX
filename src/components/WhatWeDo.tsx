import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Send, ShieldCheck, CreditCard, Ship, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function WhatWeDo() {
  const { theme } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const shouldReduceMotion = useReducedMotion();

  const cards = [
    {
      title: 'Cars & Trucks',
      description: 'Luxury cars, SUVs, trucks and vans from US and Canadian auctions. Pay in installments.',
      image: 'https://leeplugshub.com/wp-content/uploads/2026/05/Luxury.jpg',
      linkText: 'View Cars →',
      href: '/inventory',
      isExternal: false,
      badge: null,
    },
    {
      title: 'Car Parts & Accessories',
      description: "Shop parts and accessories on our website. Can't find one? We'll source it for you.",
      image: 'https://leeplugshub.com/wp-content/uploads/2026/05/Shipping.jpeg',
      linkText: 'Shop Parts →',
      href: 'https://leeautox.leeplugshub.com/shop',
      isExternal: true,
      badge: 'New',
    },
    {
      title: 'Bikes, Phones & More',
      description: 'Motorcycles, phones, laptops and general goods via Leeplugshub.com.',
      image: 'https://leeplugshub.com/wp-content/uploads/2026/05/Vans.jpeg',
      linkText: 'Visit Leeplugshub →',
      href: 'https://leeplugshub.com',
      isExternal: true,
      badge: null,
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Tell Us',
      detail: 'Send the car or part you want.',
      icon: MessageSquare,
    },
    {
      num: '02',
      title: 'We Check It',
      detail: '150+ point inspection, full HD photos.',
      icon: ShieldCheck,
    },
    {
      num: '03',
      title: 'You Pay',
      detail: 'Flexible plans. We handle customs papers.',
      icon: CreditCard,
    },
    {
      num: '04',
      title: 'We Deliver',
      detail: 'Container shipping, port clearance, live tracking.',
      icon: Ship,
    },
  ];

  return (
    <section 
      id="what-we-do" 
      ref={ref}
      className={`relative px-6 md:px-12 py-24 transition-colors duration-500 overflow-hidden ${
        theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60vw] h-[40vw] bg-[#2B59FF]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, letterSpacing: '0.25em' }}
            animate={inView ? { opacity: 1, letterSpacing: '0.15em' } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#2B59FF] mb-4"
          >
            <span>What we do</span>
          </motion.div>

          <motion.h2
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98, filter: 'blur(14px)', y: 12 }}
            animate={inView ? { opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className={`font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08] tracking-tight mb-6 ${
              theme === 'dark'
                ? 'text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.06)]'
                : 'text-slate-950 drop-shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
            }`}
          >
            Buy Cars and Car Parts. We Ship Them Home.
          </motion.h2>

          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7, ease: 'easeOut' }}
            className={`text-base sm:text-lg leading-relaxed font-light ${
              theme === 'dark' ? 'text-white/70' : 'text-slate-600'
            }`}
          >
            Tell us what you need. We find it, check it, ship it, and deliver it. Explore our genuine auto parts catalogue next.
          </motion.p>
        </div>

        {/* 3 Merged Cards (Staggered Reveal, Glassmorphic, Responsive) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-24">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.98 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.65, ease: 'easeOut' }}
              whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.02 }}
              className={`group flex flex-col justify-between rounded-3xl overflow-hidden border transition-all duration-300 shadow-xl ${
                theme === 'dark'
                  ? 'bg-zinc-900/60 border-white/10 hover:border-[#2B59FF]/50 shadow-black/40 backdrop-blur-xl'
                  : 'bg-white/80 border-slate-200/90 hover:border-[#2B59FF]/50 shadow-slate-200/60 backdrop-blur-xl'
              }`}
            >
              <div>
                {/* Image Container with preserved asset */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {card.badge && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white text-[11px] font-mono font-bold uppercase tracking-wider rounded-full shadow-lg">
                        <Sparkles size={11} /> {card.badge}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-5 right-5">
                    <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
                      {card.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className={`text-sm leading-relaxed font-light ${
                    theme === 'dark' ? 'text-white/75' : 'text-slate-600'
                  }`}>
                    {card.description}
                  </p>
                </div>
              </div>

              <div className={`p-6 pt-0 border-t mt-auto ${
                theme === 'dark' ? 'border-white/5' : 'border-slate-100'
              }`}>
                {card.isExternal ? (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 pt-4 text-xs font-mono font-bold uppercase tracking-widest text-[#2B59FF] hover:text-blue-400 group-hover:translate-x-1 transition-all"
                  >
                    <span>{card.linkText}</span>
                  </a>
                ) : (
                  <Link
                    to={card.href}
                    className="inline-flex items-center gap-2 pt-4 text-xs font-mono font-bold uppercase tracking-widest text-[#2B59FF] hover:text-blue-400 group-hover:translate-x-1 transition-all"
                  >
                    <span>{card.linkText}</span>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 4 Steps: "How it works" (Staggered Reveal, Responsive: 4 in row on desktop, stacked on mobile) */}
        <div className="border-t pt-20 transition-colors duration-500 ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}">
          <div className="text-center mb-12">
            <motion.h3
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#2B59FF]"
            >
              How it works
            </motion.h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.45 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                  whileHover={shouldReduceMotion ? {} : { y: -3 }}
                  className={`p-6 rounded-2xl border transition-all duration-300 shadow-sm ${
                    theme === 'dark' 
                      ? 'bg-white/[0.03] border-white/10 hover:border-white/20' 
                      : 'bg-white/80 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold tracking-[0.25em] text-[#2B59FF]">
                      {step.num}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#2B59FF]/10 text-[#2B59FF] flex items-center justify-center">
                      <StepIcon size={16} />
                    </div>
                  </div>
                  <h4 className="font-serif text-lg font-bold mb-2">
                    {step.title}
                  </h4>
                  <p className={`text-xs leading-relaxed font-light ${
                    theme === 'dark' ? 'text-white/70' : 'text-slate-600'
                  }`}>
                    {step.detail}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
          className={`mt-16 p-8 sm:p-10 rounded-3xl border text-center max-w-3xl mx-auto shadow-xl backdrop-blur-xl ${
            theme === 'dark'
              ? 'bg-zinc-950/70 border-white/10'
              : 'bg-white/90 border-slate-200'
          }`}
        >
          <p className="font-serif text-xl sm:text-2xl font-bold mb-6">
            Ready to start? Tell us what you need.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#2B59FF] hover:bg-blue-600 active:scale-[0.98] text-white text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(43,89,255,0.4)]"
          >
            <span>Send Us Your Request →</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
