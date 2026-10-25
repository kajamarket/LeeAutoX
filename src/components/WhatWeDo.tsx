import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Send, ShieldCheck, CreditCard, Ship, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import cargoContainersImg from '../assets/cargo-containers.jpg';
import carPartsImg from '../assets/images/car_parts_accessories_1792921764930.jpg';

export default function WhatWeDo() {
  const { theme } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const shouldReduceMotion = useReducedMotion();

  const cards = [
    {
      title: 'Cars & SUVs',
      description: 'Buy Cars, SUVs, trucks, and vans from US and Canadian auctions. Pay in installments/stages.',
      image: 'https://leeplugshub.com/wp-content/uploads/2026/05/Luxury.jpg',
      linkText: 'View Cars →',
      href: '/inventory',
      isExternal: false,
      badge: null,
    },
    {
      title: 'Car Parts & Accessories',
      description: "Shop parts and accessories on our website. Can't find one? We'll source it for you.",
      image: carPartsImg,
      linkText: 'Shop Parts →',
      href: 'https://leeautox.leeplugshub.com/shop',
      isExternal: true,
      badge: null,
    },
    {
      title: 'Cargo, Bikes & More',
      description: 'Ship cargo, motorcycles, phones, laptops and general goods in containers to Nigeria. Message us to get started.',
      image: cargoContainersImg,
      linkText: 'Message Us →',
      href: 'https://wa.me/16473896162?text=Hello%20LeeAutoX!%20I%20would%20like%20to%20inquire%20about%20shipping%20cargo,%20motorcycles,%20phones,%20and%20general%20goods.',
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
      className={`relative px-6 md:px-12 py-12 transition-colors duration-500 overflow-hidden ${
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
            Tell us what you need. We find it, check it, ship it, and deliver it. We also sell cars directly, with vehicles physically on ground in Lagos as well as in Canada & USA — view our available inventory in the next section.
          </motion.p>
        </div>

        {/* 3 Merged Cards (Staggered Reveal, Glassmorphic, Responsive) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-10">
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

        {/* Integrated Minimalist How It Works Flow (Reduced ~80% in vertical footprint) */}
        <div className={`pt-6 border-t transition-colors duration-500 ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2B59FF]">
              How it works
            </h3>
            <span className="text-[11px] font-mono uppercase tracking-wider opacity-60">
              4-Step Transparent Fulfillment
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {steps.map((step) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.num}
                  className={`p-3.5 rounded-2xl border transition-all duration-300 shadow-xs flex items-start gap-3 ${
                    theme === 'dark'
                      ? 'bg-white/[0.03] border-white/10 hover:border-[#2B59FF]/40'
                      : 'bg-white border-slate-200 hover:border-[#2B59FF]/40'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-[#2B59FF]/10 text-[#2B59FF] flex items-center justify-center shrink-0 mt-0.5">
                    <StepIcon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold tracking-wider text-[#2B59FF]">
                        {step.num}
                      </span>
                      <h4 className="font-serif text-sm font-bold truncate">
                        {step.title}
                      </h4>
                    </div>
                    <p className={`text-xs leading-relaxed font-light ${
                      theme === 'dark' ? 'text-white/70' : 'text-slate-600'
                    }`}>
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Relocated CTA Button at the bottom of What we do */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <p className="font-serif text-base sm:text-lg font-bold">
              Ready to start? Tell us what you need.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2B59FF] hover:bg-blue-600 active:scale-[0.98] text-white text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(43,89,255,0.35)]"
            >
              <span>Send Us Your Request →</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
