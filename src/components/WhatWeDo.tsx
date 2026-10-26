import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CreditCard, Ship, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import cargoContainersImg from '../assets/cargo-containers.jpg';
import carPartsImg from '../assets/images/car_parts_accessories_1792921764930.jpg';
import TypewriterText from './TypewriterText';
import gsap from 'gsap';

export default function WhatWeDo() {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  const mainCards = [
    {
      title: 'Cars & SUVs',
      description: 'Buy Cars, SUVs, trucks, and vans from US and Canadian auctions. Pay in installments/stages.',
      image: 'https://leeplugshub.com/wp-content/uploads/2026/05/Luxury.jpg',
      linkText: 'View Cars →',
      href: '/inventory',
      isExternal: false,
      badge: null,
      tilt: 2.5, // tilts down on right side
    },
    {
      title: 'Car Parts & Accessories',
      description: "Shop parts and accessories on our website. Can't find one? We'll source it for you.",
      image: carPartsImg,
      linkText: 'Shop Parts →',
      href: 'https://leeautox.leeplugshub.com/shop',
      isExternal: true,
      badge: null,
      tilt: -2.5, // tilts up on right side
    },
    {
      title: 'Cargo, Bikes & More',
      description: 'Ship cargo, motorcycles, phones, laptops and general goods in containers to Nigeria. Message us to get started.',
      image: cargoContainersImg,
      linkText: 'Message Us →',
      href: 'https://wa.me/16473896162?text=Hello%20LeeAutoX!%20I%20would%20like%20to%20inquire%20about%20shipping%20cargo,%20motorcycles,%20phones,%20and%20general%20goods.',
      isExternal: true,
      badge: null,
      tilt: 2.5, // tilts down on right side
    },
  ];

  const defaultTilts = [2.5, -2.5, 2.5, -2.5];

  const steps = [
    {
      num: '01',
      title: 'Tell Us',
      detail: 'Send the car or part you want.',
      icon: MessageSquare,
      tiltClass: 'rotate-[1.5deg]', // tilts down on right side
    },
    {
      num: '02',
      title: 'We Check It',
      detail: '150+ point inspection, full HD photos.',
      icon: ShieldCheck,
      tiltClass: 'rotate-[-1.5deg]', // tilts up on right side
    },
    {
      num: '03',
      title: 'You Pay',
      detail: 'Flexible plans. We handle customs papers.',
      icon: CreditCard,
      tiltClass: 'rotate-[1.5deg]', // tilts down on right side
    },
    {
      num: '04',
      title: 'We Deliver',
      detail: 'Container shipping, port clearance, live tracking.',
      icon: Ship,
      tiltClass: 'rotate-[-1.5deg]', // tilts up on right side
    },
  ];

  // GSAP Interaction-driven focus animation (Hover / Click / Keyboard)
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 0 : 0.5;

    cards.forEach((card, idx) => {
      const isFocused = idx === focusedIndex;
      // Focused: full scale 1.0, straight rotation 0, top z-index 50
      // Unfocused: scale reduced by ~10-15% of original (0.72 for image cards, 0.9 for text card), default tilt, lower z-index
      const targetScale = isFocused ? 1.0 : (idx === 3 ? 0.9 : 0.72);
      const targetRotation = isFocused ? 0 : defaultTilts[idx];
      const targetZ = isFocused ? 50 : 10 + idx;

      gsap.to(card, {
        scale: targetScale,
        rotation: targetRotation,
        zIndex: targetZ,
        duration,
        ease: 'power3.out',
        force3D: true,
        overwrite: 'auto',
      });
    });

    return () => {
      gsap.killTweensOf(cards);
    };
  }, [focusedIndex]);

  return (
    <section 
      id="what-we-do" 
      ref={sectionRef}
      className={`relative isolate overflow-hidden px-4 sm:px-6 md:px-12 py-16 sm:py-20 transition-colors duration-500 ${
        theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60vw] h-[40vw] bg-[#2B59FF]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* STATIC FLOW SECTION WRAPPER: Headings positioned behind cards */}
      <div className="w-full max-w-7xl mx-auto flex flex-col justify-center items-center relative z-10">
        {/* Section Header: Positioned Behind Cards */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 pointer-events-none select-none relative z-0">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#2B59FF] mb-3">
            <span>What we do</span>
          </div>

          <h2
            className={`font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight ${
              theme === 'dark'
                ? 'text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.06)]'
                : 'text-slate-950 drop-shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
            }`}
          >
            Buy Cars and Car Parts. We Ship Them Home.
          </h2>
        </div>

        {/* 4 CARDS: 3 Enlarged Image Cards + 1 Untouched Text Card in Horizontal Row (Desktop/Tablet) */}
        {/* Overflow containment & stacking context preserved */}
        <div
          className="relative z-10 w-full flex flex-col md:flex-row items-center md:items-center justify-center -space-y-12 md:space-y-0 md:-space-x-10 lg:-space-x-14 xl:-space-x-16 pb-12 pt-4"
        >
          {/* Card 1: Cars & SUVs */}
          <div
            ref={(el) => { cardRefs.current[0] = el; }}
            tabIndex={0}
            role="group"
            aria-label="Cars & SUVs"
            aria-current={focusedIndex === 0 ? 'true' : undefined}
            onMouseEnter={() => setFocusedIndex(0)}
            onClick={() => setFocusedIndex(0)}
            onFocus={() => setFocusedIndex(0)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if ((e.target as HTMLElement) === e.currentTarget) {
                  e.preventDefault();
                  setFocusedIndex(0);
                }
              }
            }}
            className={`wwd-card relative rounded-3xl overflow-hidden border transition-colors duration-300 shadow-2xl flex flex-col justify-between shrink-0 group cursor-pointer will-change-transform outline-none focus-visible:ring-2 focus-visible:ring-[#2B59FF] ${
              theme === 'dark'
                ? 'bg-zinc-900 border-white/10 hover:border-[#2B59FF]/50 shadow-black/50'
                : 'bg-white border-slate-200 hover:border-[#2B59FF]/50 shadow-slate-300/60'
            }`}
            style={{
              width: 'clamp(340px, 30vw, 440px)',
              minHeight: 'clamp(430px, 38vw, 500px)',
              transformOrigin: 'center center',
            }}
          >
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                <img
                  src={mainCards[0].image}
                  alt={mainCards[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                    {mainCards[0].title}
                  </h3>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <p className={`text-xs sm:text-sm leading-relaxed font-light ${
                  theme === 'dark' ? 'text-white/75' : 'text-slate-600'
                }`}>
                  {mainCards[0].description}
                </p>
              </div>
            </div>

            <div className={`p-5 sm:p-6 pt-0 border-t mt-auto ${
              theme === 'dark' ? 'border-white/5' : 'border-slate-100'
            }`}>
              <Link
                to={mainCards[0].href}
                className="inline-flex items-center gap-2 pt-3 text-xs font-mono font-bold uppercase tracking-widest text-[#2B59FF] hover:text-blue-400 group-hover:translate-x-1 transition-all"
              >
                <span>{mainCards[0].linkText}</span>
              </Link>
            </div>
          </div>

          {/* Card 2: Car Parts & Accessories */}
          <div
            ref={(el) => { cardRefs.current[1] = el; }}
            tabIndex={0}
            role="group"
            aria-label="Car Parts & Accessories"
            aria-current={focusedIndex === 1 ? 'true' : undefined}
            onMouseEnter={() => setFocusedIndex(1)}
            onClick={() => setFocusedIndex(1)}
            onFocus={() => setFocusedIndex(1)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if ((e.target as HTMLElement) === e.currentTarget) {
                  e.preventDefault();
                  setFocusedIndex(1);
                }
              }
            }}
            className={`wwd-card relative rounded-3xl overflow-hidden border transition-colors duration-300 shadow-2xl flex flex-col justify-between shrink-0 group cursor-pointer will-change-transform outline-none focus-visible:ring-2 focus-visible:ring-[#2B59FF] ${
              theme === 'dark'
                ? 'bg-zinc-900 border-white/10 hover:border-[#2B59FF]/50 shadow-black/50'
                : 'bg-white border-slate-200 hover:border-[#2B59FF]/50 shadow-slate-300/60'
            }`}
            style={{
              width: 'clamp(340px, 30vw, 440px)',
              minHeight: 'clamp(430px, 38vw, 500px)',
              transformOrigin: 'center center',
            }}
          >
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                <img
                  src={mainCards[1].image}
                  alt={mainCards[1].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                    {mainCards[1].title}
                  </h3>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <p className={`text-xs sm:text-sm leading-relaxed font-light ${
                  theme === 'dark' ? 'text-white/75' : 'text-slate-600'
                }`}>
                  {mainCards[1].description}
                </p>
              </div>
            </div>

            <div className={`p-5 sm:p-6 pt-0 border-t mt-auto ${
              theme === 'dark' ? 'border-white/5' : 'border-slate-100'
            }`}>
              <a
                href={mainCards[1].href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 pt-3 text-xs font-mono font-bold uppercase tracking-widest text-[#2B59FF] hover:text-blue-400 group-hover:translate-x-1 transition-all"
              >
                <span>{mainCards[1].linkText}</span>
              </a>
            </div>
          </div>

          {/* Card 3: Cargo, Bikes & More */}
          <div
            ref={(el) => { cardRefs.current[2] = el; }}
            tabIndex={0}
            role="group"
            aria-label="Cargo, Bikes & More"
            aria-current={focusedIndex === 2 ? 'true' : undefined}
            onMouseEnter={() => setFocusedIndex(2)}
            onClick={() => setFocusedIndex(2)}
            onFocus={() => setFocusedIndex(2)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if ((e.target as HTMLElement) === e.currentTarget) {
                  e.preventDefault();
                  setFocusedIndex(2);
                }
              }
            }}
            className={`wwd-card relative rounded-3xl overflow-hidden border transition-colors duration-300 shadow-2xl flex flex-col justify-between shrink-0 group cursor-pointer will-change-transform outline-none focus-visible:ring-2 focus-visible:ring-[#2B59FF] ${
              theme === 'dark'
                ? 'bg-zinc-900 border-white/10 hover:border-[#2B59FF]/50 shadow-black/50'
                : 'bg-white border-slate-200 hover:border-[#2B59FF]/50 shadow-slate-300/60'
            }`}
            style={{
              width: 'clamp(340px, 30vw, 440px)',
              minHeight: 'clamp(430px, 38vw, 500px)',
              transformOrigin: 'center center',
            }}
          >
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                <img
                  src={mainCards[2].image}
                  alt={mainCards[2].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                    {mainCards[2].title}
                  </h3>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <p className={`text-xs sm:text-sm leading-relaxed font-light ${
                  theme === 'dark' ? 'text-white/75' : 'text-slate-600'
                }`}>
                  {mainCards[2].description}
                </p>
              </div>
            </div>

            <div className={`p-5 sm:p-6 pt-0 border-t mt-auto ${
              theme === 'dark' ? 'border-white/5' : 'border-slate-100'
            }`}>
              <a
                href={mainCards[2].href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 pt-3 text-xs font-mono font-bold uppercase tracking-widest text-[#2B59FF] hover:text-blue-400 group-hover:translate-x-1 transition-all"
              >
                <span>{mainCards[2].linkText}</span>
              </a>
            </div>
          </div>

          {/* Card 4: UNTOUCHED 4TH (TEXT) CARD */}
          <div
            ref={(el) => { cardRefs.current[3] = el; }}
            tabIndex={0}
            role="group"
            aria-label="LeeAutoX direct sales and custom request notice"
            aria-current={focusedIndex === 3 ? 'true' : undefined}
            onMouseEnter={() => setFocusedIndex(3)}
            onClick={() => setFocusedIndex(3)}
            onFocus={() => setFocusedIndex(3)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if ((e.target as HTMLElement) === e.currentTarget) {
                  e.preventDefault();
                  setFocusedIndex(3);
                }
              }
            }}
            className={`wwd-card relative rounded-3xl overflow-hidden border transition-colors duration-300 shadow-2xl flex flex-col justify-start shrink-0 group cursor-pointer will-change-transform outline-none focus-visible:ring-2 focus-visible:ring-[#2B59FF] ${
              theme === 'dark'
                ? 'bg-zinc-900 border-white/10 hover:border-[#2B59FF]/50 shadow-black/50 text-white'
                : 'bg-white border-slate-200 hover:border-[#2B59FF]/50 shadow-slate-300/60 text-slate-800'
            }`}
            style={{
              width: 'clamp(215px, 18.5vw, 260px)',
              minHeight: 'clamp(290px, 27vw, 345px)',
              padding: 'clamp(1.2rem, 2.2vw, 2rem)',
              transformOrigin: 'center center',
            }}
          >
            <div className="w-full text-left">
              <p
                className={`font-normal tracking-[0.015em] leading-[1.58] max-w-[34ch] text-left ${
                  theme === 'dark' ? 'text-white/85' : 'text-slate-700'
                }`}
                style={{
                  fontSize: 'clamp(0.875rem, 0.6rem + 0.7vw, 1rem)',
                }}
              >
                <TypewriterText
                  text="Tell us what you need. We find it, check it, ship it, and deliver it. We also sell cars directly, with vehicles physically on ground in Lagos as well as in Canada & USA — view our available inventory in the next section."
                  speed={18}
                  delay={200}
                />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS SECTION (Immediately Following the Cards) */}
      <div className="max-w-7xl mx-auto relative z-10 pt-4">
        <div className={`pt-8 border-t transition-colors duration-500 ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2B59FF]">
              How it works
            </h3>
            <span className="text-[11px] font-mono uppercase tracking-wider opacity-60">
              4-Step Transparent Fulfillment
            </span>
          </div>

          {/* 4 Cards with Alternating Tilt (+1.5deg down-right, -1.5deg up-right, +1.5deg, -1.5deg) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.num}
                  className={`p-4 rounded-2xl border transition-all duration-300 shadow-xs flex items-start gap-3 transform ${step.tiltClass} hover:rotate-0 hover:scale-[1.02] ${
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

          {/* Bottom CTA Button */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
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
