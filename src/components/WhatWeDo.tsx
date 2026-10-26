import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, CreditCard, Ship, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import cargoContainersImg from '../assets/cargo-containers.jpg';
import carPartsImg from '../assets/images/car_parts_accessories_1792921764930.jpg';
import TypewriterText from './TypewriterText';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WhatWeDo() {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

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

  // GSAP ScrollTrigger Pinned Scroll Animation
  useEffect(() => {
    const pinTarget = pinWrapperRef.current;
    if (!pinTarget) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const mm = gsap.matchMedia();

    // Desktop & Tablet (Horizontal overlapping card stack)
    mm.add('(min-width: 768px)', () => {
      const cards = gsap.utils.toArray<HTMLElement>('.wwd-anim-card');
      if (cards.length < 4) return;

      // Initial state:
      // Card 1 starts at full focus (scale: 1, rotation: 0)
      // Cards 2, 3, 4 start offset in a stack to the right, slightly tilted
      gsap.set(cards[0], { scale: 1, rotation: 0, opacity: 1 });
      gsap.set(cards[1], { xPercent: 35, scale: 0.82, rotation: -4, opacity: 0.9 });
      gsap.set(cards[2], { xPercent: 70, scale: 0.78, rotation: 5, opacity: 0.85 });
      gsap.set(cards[3], { xPercent: 105, scale: 0.75, rotation: -5, opacity: 0.8 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinTarget,
          start: 'top top',
          end: '+=1600',
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Scroll Phase 1: Card 1 shrinks to 80% (tilts down on right side: +2.5deg) without fading; Card 2 drives into focus (straightens, scale 1.0, full opacity)
      tl.to(cards[0], {
        scale: 0.8,
        rotation: 2.5,
        duration: 1,
        ease: 'power2.out',
      }, 0)
      .to(cards[1], {
        xPercent: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
      }, 0);

      // Scroll Phase 2: Card 2 shrinks to 80% (tilts up on right side: -2.5deg) without fading; Card 3 drives into focus
      tl.to(cards[1], {
        scale: 0.8,
        rotation: -2.5,
        duration: 1,
        ease: 'power2.out',
      }, 1)
      .to(cards[2], {
        xPercent: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
      }, 1);

      // Scroll Phase 3: Card 3 shrinks to 80% (tilts down on right side: +2.5deg); Card 4 (text card) drives into focus
      tl.to(cards[2], {
        scale: 0.8,
        rotation: 2.5,
        duration: 1,
        ease: 'power2.out',
      }, 2)
      .to(cards[3], {
        xPercent: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
      }, 2);

      // Final settle: Card 4 settles into stack with alternating tilt (-2.5deg)
      tl.to(cards[3], {
        rotation: -2.5,
        duration: 0.5,
        ease: 'power1.out',
      }, 3);
    });

    // Mobile (< 768px): Responsive card deck scroll
    mm.add('(max-width: 767px)', () => {
      const cards = gsap.utils.toArray<HTMLElement>('.wwd-anim-card');
      if (cards.length < 4) return;

      gsap.set(cards[0], { scale: 1, rotation: 0, opacity: 1 });
      gsap.set(cards[1], { yPercent: 40, scale: 0.82, rotation: -3, opacity: 0.9 });
      gsap.set(cards[2], { yPercent: 70, scale: 0.78, rotation: 3, opacity: 0.85 });
      gsap.set(cards[3], { yPercent: 100, scale: 0.75, rotation: -3, opacity: 0.8 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinTarget,
          start: 'top top',
          end: '+=1200',
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(cards[0], { scale: 0.8, rotation: 2, duration: 1 }, 0)
        .to(cards[1], { yPercent: 0, scale: 1, rotation: 0, opacity: 1, duration: 1 }, 0)
        .to(cards[1], { scale: 0.8, rotation: -2, duration: 1 }, 1)
        .to(cards[2], { yPercent: 0, scale: 1, rotation: 0, opacity: 1, duration: 1 }, 1)
        .to(cards[2], { scale: 0.8, rotation: 2, duration: 1 }, 2)
        .to(cards[3], { yPercent: 0, scale: 1, rotation: -2, opacity: 1, duration: 1 }, 2);
    });

    // Handle resize & cleanup
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section 
      id="what-we-do" 
      ref={sectionRef}
      className={`relative px-4 sm:px-6 md:px-12 py-10 transition-colors duration-500 overflow-hidden ${
        theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60vw] h-[40vw] bg-[#2B59FF]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* PINNED SECTION WRAPPER: Headings remain fixed behind cards */}
      <div ref={pinWrapperRef} className="w-full min-h-[92vh] flex flex-col justify-center items-center relative z-10 py-6">
        {/* Section Header: Fixed Behind Cards */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 pointer-events-none select-none">
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

        {/* 4 CARDS: 3 Existing Cards + 1 New Smaller Text Card in Horizontal Row (Desktop/Tablet) */}
        <div
          ref={cardsContainerRef}
          className="relative w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-stretch justify-center -space-y-12 md:space-y-0 md:-space-x-5 lg:-space-x-7 xl:-space-x-8 pb-4"
        >
          {/* Card 1: Cars & SUVs */}
          <div
            className={`wwd-anim-card wwd-card relative rounded-3xl overflow-hidden border transition-all duration-300 shadow-xl flex flex-col justify-between shrink-0 group z-10 ${
              theme === 'dark'
                ? 'bg-zinc-900/85 border-white/10 hover:border-[#2B59FF]/50 shadow-black/40 backdrop-blur-xl'
                : 'bg-white/90 border-slate-200/90 hover:border-[#2B59FF]/50 shadow-slate-200/60 backdrop-blur-xl'
            }`}
            style={{
              width: 'clamp(270px, 24vw, 340px)',
              minHeight: 'clamp(390px, 36vw, 460px)',
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

              <div className="p-5">
                <p className={`text-xs sm:text-sm leading-relaxed font-light ${
                  theme === 'dark' ? 'text-white/75' : 'text-slate-600'
                }`}>
                  {mainCards[0].description}
                </p>
              </div>
            </div>

            <div className={`p-5 pt-0 border-t mt-auto ${
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
            className={`wwd-anim-card wwd-card relative rounded-3xl overflow-hidden border transition-all duration-300 shadow-xl flex flex-col justify-between shrink-0 group z-20 ${
              theme === 'dark'
                ? 'bg-zinc-900/85 border-white/10 hover:border-[#2B59FF]/50 shadow-black/40 backdrop-blur-xl'
                : 'bg-white/90 border-slate-200/90 hover:border-[#2B59FF]/50 shadow-slate-200/60 backdrop-blur-xl'
            }`}
            style={{
              width: 'clamp(270px, 24vw, 340px)',
              minHeight: 'clamp(390px, 36vw, 460px)',
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

              <div className="p-5">
                <p className={`text-xs sm:text-sm leading-relaxed font-light ${
                  theme === 'dark' ? 'text-white/75' : 'text-slate-600'
                }`}>
                  {mainCards[1].description}
                </p>
              </div>
            </div>

            <div className={`p-5 pt-0 border-t mt-auto ${
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
            className={`wwd-anim-card wwd-card relative rounded-3xl overflow-hidden border transition-all duration-300 shadow-xl flex flex-col justify-between shrink-0 group z-30 ${
              theme === 'dark'
                ? 'bg-zinc-900/85 border-white/10 hover:border-[#2B59FF]/50 shadow-black/40 backdrop-blur-xl'
                : 'bg-white/90 border-slate-200/90 hover:border-[#2B59FF]/50 shadow-slate-200/60 backdrop-blur-xl'
            }`}
            style={{
              width: 'clamp(270px, 24vw, 340px)',
              minHeight: 'clamp(390px, 36vw, 460px)',
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

              <div className="p-5">
                <p className={`text-xs sm:text-sm leading-relaxed font-light ${
                  theme === 'dark' ? 'text-white/75' : 'text-slate-600'
                }`}>
                  {mainCards[2].description}
                </p>
              </div>
            </div>

            <div className={`p-5 pt-0 border-t mt-auto ${
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

          {/* Card 4: TASK 3 & 4 - NEW SMALLER TEXT CARD (70-75% proportions, serene white space) */}
          <div
            className={`wwd-anim-card wwd-card relative rounded-3xl overflow-hidden border transition-all duration-300 shadow-xl flex flex-col justify-start shrink-0 group z-40 ${
              theme === 'dark'
                ? 'bg-zinc-900/90 border-white/10 shadow-black/40 backdrop-blur-xl text-white'
                : 'bg-white/95 border-slate-200/90 shadow-slate-200/60 backdrop-blur-xl text-slate-800'
            }`}
            style={{
              width: 'clamp(215px, 18.5vw, 260px)',
              minHeight: 'clamp(290px, 27vw, 345px)',
              padding: 'clamp(1.2rem, 2.2vw, 2rem)',
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
      <div className="max-w-7xl mx-auto relative z-10 pt-6">
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
