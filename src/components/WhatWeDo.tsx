import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CreditCard, Ship, MessageSquare } from 'lucide-react';
import cargoContainersImg from '../assets/cargo-containers.jpg';
import carPartsImg from '../assets/images/car_parts_accessories_1792921764930.jpg';
import AnimatedText from './ui/AnimatedText';
import Reveal from './ui/Reveal';
import gsap from 'gsap';

export default function WhatWeDo() {
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
      tilt: 2.5,
    },
    {
      title: 'Car Parts & Accessories',
      description: "Shop parts and accessories on our website. Can't find one? We'll source it for you.",
      image: carPartsImg,
      linkText: 'Shop Parts →',
      href: 'https://leeautox.leeplugshub.com/shop',
      isExternal: true,
      tilt: -2.5,
    },
    {
      title: 'Cargo, Bikes & More',
      description: 'Ship cargo, motorcycles, phones, laptops and general goods in containers to Nigeria. Message us to get started.',
      image: cargoContainersImg,
      linkText: 'Message Us →',
      href: 'https://wa.me/16473896162?text=Hello%20LeeAutoX!%20I%20would%20like%20to%20inquire%20about%20shipping%20cargo,%20motorcycles,%20phones,%20and%20general%20goods.',
      isExternal: true,
      tilt: 2.5,
    },
  ];

  const defaultTilts = [2.5, -2.5, 2.5, -2.5];

  const steps = [
    {
      num: '01',
      title: 'Tell Us',
      detail: 'Send the car or part you want.',
      icon: MessageSquare,
      tiltClass: 'rotate-[1.5deg]',
    },
    {
      num: '02',
      title: 'We Check It',
      detail: '150+ point inspection, full HD photos.',
      icon: ShieldCheck,
      tiltClass: 'rotate-[-1.5deg]',
    },
    {
      num: '03',
      title: 'You Pay',
      detail: 'Flexible plans. We handle customs papers.',
      icon: CreditCard,
      tiltClass: 'rotate-[1.5deg]',
    },
    {
      num: '04',
      title: 'We Deliver',
      detail: 'Container shipping, port clearance, live tracking.',
      icon: Ship,
      tiltClass: 'rotate-[-1.5deg]',
    },
  ];

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 0 : 0.5;

    cards.forEach((card, idx) => {
      const isFocused = idx === focusedIndex;
      const targetScale = isFocused ? 1.0 : idx === 3 ? 0.9 : 0.72;
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
      className="lx-band-surface relative isolate overflow-hidden px-4 sm:px-6 md:px-12 py-16 sm:py-24 transition-colors duration-500"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="lx-bg-dots absolute inset-0 opacity-65" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 50% 25%, var(--accent-soft) 0%, transparent 72%)',
          }}
        />
      </div>
      <div className="w-full max-w-7xl mx-auto flex flex-col justify-center items-center relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 pointer-events-none select-none relative z-0">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-[var(--accent)] tracking-[0.22em] mb-3">
            <span>What we do</span>
          </div>

          <h2 className="font-serif text-[clamp(1.85rem,4.2vw,3.5rem)] font-normal leading-[1.08] tracking-tight text-[var(--ink)]">
            <AnimatedText text="Buy Cars and Car Parts." variant="word-stagger" />{' '}
            <span className="italic text-[var(--ink-2)]">
              <AnimatedText text="We Ship Them Home." variant="blur-in" delay={140} />
            </span>
          </h2>
        </div>

        {/* 4 Interactive GSAP Focus Cards */}
        <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-center -space-y-12 md:space-y-0 md:-space-x-10 lg:-space-x-14 xl:-space-x-16 pb-12 pt-4">
          {mainCards.map((card, idx) => (
            <div
              key={card.title}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              tabIndex={0}
              role="group"
              aria-label={card.title}
              aria-current={focusedIndex === idx ? 'true' : undefined}
              onMouseEnter={() => setFocusedIndex(idx)}
              onClick={() => setFocusedIndex(idx)}
              onFocus={() => setFocusedIndex(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  if ((e.target as HTMLElement) === e.currentTarget) {
                    e.preventDefault();
                    setFocusedIndex(idx);
                  }
                }
              }}
              className="wwd-card lx-card-padded relative flex flex-col justify-between shrink-0 group cursor-pointer will-change-transform outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={{
                width: 'clamp(300px, 30vw, 440px)',
                minHeight: 'clamp(410px, 38vw, 500px)',
                transformOrigin: 'center center',
              }}
            >
              <div>
                <div className="relative aspect-[16/10] lx-media bg-black/30">
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-serif text-xl sm:text-2xl font-normal text-white tracking-wide">
                      {card.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <p className="text-xs sm:text-sm leading-relaxed text-[var(--ink-2)]">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 pt-0 border-t border-[var(--line)] mt-auto">
                {card.isExternal ? (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 pt-3 text-xs font-mono font-bold uppercase tracking-widest text-[var(--accent)] group-hover:translate-x-1 transition-transform"
                  >
                    <span>{card.linkText}</span>
                  </a>
                ) : (
                  <Link
                    to={card.href}
                    className="inline-flex items-center gap-2 pt-3 text-xs font-mono font-bold uppercase tracking-widest text-[var(--accent)] group-hover:translate-x-1 transition-transform"
                  >
                    <span>{card.linkText}</span>
                  </Link>
                )}
              </div>
            </div>
          ))}

          {/* 4th Interactive Text Card */}
          <div
            ref={(el) => {
              cardRefs.current[3] = el;
            }}
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
            className="wwd-card lx-card relative flex flex-col justify-start shrink-0 group cursor-pointer will-change-transform outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{
              width: 'clamp(220px, 18.5vw, 260px)',
              minHeight: 'clamp(290px, 27vw, 345px)',
              padding: 'clamp(1.2rem, 2.2vw, 2rem)',
              transformOrigin: 'center center',
            }}
          >
            <div className="w-full text-left">
              <p
                className="font-normal tracking-[0.015em] leading-[1.58] max-w-[34ch] text-left text-[var(--ink-2)]"
                style={{
                  fontSize: 'clamp(0.875rem, 0.6rem + 0.7vw, 1rem)',
                }}
              >
                <AnimatedText
                  text="Tell us what you need. We find it, check it, ship it, and deliver it. We also sell cars directly, with vehicles physically on ground in Lagos as well as in Canada & USA — view our available inventory in the next section."
                  variant="typewriter"
                  delay={120}
                />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS STRIP */}
      <div className="max-w-7xl mx-auto relative z-10 pt-4">
        <div className="pt-8 border-t border-[var(--line)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <h3 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-[var(--accent)]">
              How it works
            </h3>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--ink-2)]">
              4-Step Transparent Fulfillment
            </span>
          </div>

          <div className="lx-perspective grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <Reveal key={step.num} variant="isometric" col={idx}>
                  <div
                    className={`lx-card p-5 flex items-start gap-3 transition-transform duration-300 ${step.tiltClass} hover:rotate-0 hover:scale-[1.02]`}
                  >
                    <div className="w-9 h-9 rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center shrink-0 mt-0.5">
                      <StepIcon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold tracking-wider text-[var(--accent)]">
                          {step.num}
                        </span>
                        <h4 className="font-serif text-sm font-normal text-[var(--ink)] truncate">
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-xs leading-relaxed text-[var(--ink-2)]">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <p className="font-serif text-base sm:text-lg text-[var(--ink)]">
              Ready to start? Tell us what you need.
            </p>
            <a
              href="#contact"
              className="lx-pill-btn bg-[var(--accent)] text-[var(--accent-ink)] text-xs sm:text-sm uppercase tracking-wider shadow-sm hover:opacity-92"
            >
              <span>Send Us Your Request →</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
