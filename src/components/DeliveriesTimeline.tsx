import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AnimatedText from './ui/AnimatedText';
import Reveal from './ui/Reveal';
import { prefersReducedMotion } from '../motion/scrollEngine';

interface TimelineStage {
  stage: string;
  title: string;
  description: string;
  image: string;
}

interface VehicleTimeline {
  id: number;
  name: string;
  price: string;
  stages: TimelineStage[];
}

export default function DeliveriesTimeline() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = prefersReducedMotion();

  const VEHICLES_DATA: VehicleTimeline[] = [
    {
      id: 1,
      name: '2021 HYUNDAI SONATA',
      price: '₦22,000,000 Total Landing Cost',
      stages: [
        {
          stage: 'STAGE 1',
          title: 'Auction Purchase',
          description: 'A custom enquiry was processed for a clean "Run and Drive" 2021 Sonata. Our procurement specialists researched vehicle histories, reviewed bid files, and successfully won the car at a competitive dealer-only auction.',
          image: 'https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260521-WA0007.jpg'
        },
        {
          stage: 'STAGE 2',
          title: 'Pickup from Copart Yard',
          description: 'The Sonata was transferred to the Copart auction lot, where on-site technicians verified vehicle details, structural integrity, 4 CYL engine performance, and the guaranteed 85,000 mileage prior to transport clearance.',
          image: 'https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260515-WA0001.jpg'
        },
        {
          stage: 'STAGE 3',
          title: 'Secure Shipping',
          description: 'Loaded securely into a steel export container, bound for West Africa. Full documentation, custom seals, and maritime tracking keys were issued to keep both our team and the customer fully informed.',
          image: 'https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/XRecorder_23052026_124117-scaled.jpg'
        },
        {
          stage: 'STAGE 4',
          title: 'Port Clearance in Nigeria',
          description: 'Arrived at the Lagos port (Apapa/Tin Can). Our clearing agency managed customs papers, port levies, and secure local transport. The car is now delivered safely to our lot, fully cleared and pristine.',
          image: 'https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260515-WA0000.jpg'
        }
      ]
    },
    {
      id: 2,
      name: '2021 HYUNDAI SONATA ULTIMATE',
      price: '₦23,000,000 Total Landing Cost',
      stages: [
        {
          stage: 'STAGE 1',
          title: 'Auction Purchase',
          description: 'Matching a highly specific client search for the elite "Ultimate" trim. Secured directly from a top-tier Canadian dealer auction featuring premium tech upgrades.',
          image: 'https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260521-WA0007.jpg'
        },
        {
          stage: 'STAGE 2',
          title: 'Pickup from Copart Yard',
          description: 'On-site lot confirmation of the Sonata Ultimate\'s premium accessories: panoramic sunroof, 360 camera lines, head-up display (HUD), ambient lighting grids, and self-parking feature checks.',
          image: 'https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260512-WA0021-scaled.jpg'
        },
        {
          stage: 'STAGE 3',
          title: 'Shipping & Trucking',
          description: 'Protected within a heavy duty cargo container, transit begins across global seas. Rigorous logistics checklists prevent any movement or environmental wear during deep sea transit.',
          image: 'https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260522-WA0019-scaled.jpg'
        },
        {
          stage: 'STAGE 4',
          title: 'Port Clearance in Nigeria',
          description: 'Customs cleared directly from Lagos port, detailed to a mirror showroom finish, and delivered straight to the happy client\'s hands. An uncompromised milestone of professional service.',
          image: 'https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260512-WA0014-scaled.jpg'
        }
      ]
    }
  ];

  const totalSlides = VEHICLES_DATA.length;
  const next = () => setActiveSlide((prev) => (prev + 1) % totalSlides);
  const prev = () => setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isIntersecting || reducedMotion) return;
    const interval = setInterval(() => next(), 10000);
    return () => clearInterval(interval);
  }, [isIntersecting, reducedMotion]);

  const activeVehicle = VEHICLES_DATA[activeSlide];

  return (
    <section
      id="deliveries"
      ref={sectionRef}
      className="lx-band-surface relative px-4 sm:px-6 md:px-12 py-16 overflow-x-clip border-t border-b border-[var(--line)] transition-colors duration-500"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="lx-bg-lanes absolute inset-0 opacity-85" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 65% 45% at 50% 10%, var(--accent-soft) 0%, transparent 70%)',
          }}
        />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <Reveal variant="rise">
          <div className="text-center mb-14">
            <span className="inline-block text-[11px] font-mono font-bold tracking-[0.22em] text-[var(--accent)] uppercase bg-[var(--accent-soft)] border border-[var(--accent)]/25 px-3.5 py-1.5 rounded-full mb-4">
              Legitimacy in Action
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal tracking-tight max-w-3xl mx-auto mb-4 text-[var(--ink)]">
              <AnimatedText text="Verified Deliveries: From Global Auctions to Nigerian Roads" variant="word-stagger" />
            </h2>
            <p className="text-sm sm:text-base max-w-2xl mx-auto text-[var(--ink-2)] leading-relaxed">
              Follow the transparent lifecycle journey of our premium vehicles as they move seamlessly from auction yards to port clearance and client handovers in Lagos.
            </p>
          </div>
        </Reveal>

        <div className="relative min-h-[480px] mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0, x: -18 }}
              transition={{ duration: 0.45 }}
              className="w-full"
            >
              <div className="text-center mb-10 max-w-lg mx-auto">
                <h3 className="text-xl md:text-2xl font-serif font-normal tracking-tight border-b-2 border-[var(--accent)]/35 pb-2 inline-block text-[var(--ink)]">
                  {activeVehicle.name}
                </h3>
                <p className="text-xs md:text-sm font-mono mt-2 font-semibold tabular-nums text-[var(--ink-2)]">
                  {activeVehicle.price}
                </p>
              </div>

              <div className="relative max-w-4xl mx-auto">
                <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-[var(--line)] md:-translate-x-1/2" />

                <div className="space-y-10 relative">
                  {activeVehicle.stages.map((item, idx) => {
                    const isEven = idx % 2 === 1;

                    return (
                      <div
                        key={idx}
                        className={`flex flex-col md:flex-row items-stretch justify-between w-full relative pl-[48px] md:pl-0 ${
                          isEven ? 'md:flex-row-reverse' : ''
                        }`}
                      >
                        <div className="w-full md:w-[45%] text-left">
                          <div className="lx-card-padded relative">
                            <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--accent)] uppercase bg-[var(--accent-soft)] px-2.5 py-1 rounded-full inline-block mb-2">
                              {item.stage}
                            </span>

                            <h4 className="text-base font-serif font-normal mb-2 leading-tight text-[var(--ink)]">
                              {item.title}
                            </h4>

                            <p className="text-xs leading-relaxed text-[var(--ink-2)] mb-4">
                              {item.description}
                            </p>

                            <div className="rounded-2xl border border-[var(--line)] overflow-hidden bg-[var(--surface)]">
                              <img
                                src={item.image}
                                alt={`${activeVehicle.name} - ${item.stage}`}
                                loading="lazy"
                                decoding="async"
                                referrerPolicy="no-referrer"
                                className="w-full h-44 object-cover object-center transition-transform duration-500 hover:scale-105"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="absolute left-[20px] md:left-1/2 w-4 h-4 bg-[var(--accent)] border-2 border-[var(--card)] rounded-full -translate-x-[8px] md:-translate-x-1/2 top-6 z-10 flex items-center justify-center shadow-md">
                          <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>

                        <div className="hidden md:block w-[45%]" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider Controls */}
        <div className="flex items-center justify-center gap-6 mt-10 relative z-10">
          <button
            type="button"
            onClick={prev}
            className="w-11 h-11 rounded-full border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-pointer flex items-center justify-center shadow-xs"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2.5">
            {VEHICLES_DATA.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveSlide(i)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeSlide === i ? 'w-7 bg-[var(--accent)]' : 'w-2.5 bg-[var(--line)] hover:bg-[var(--ink-2)]'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="w-11 h-11 rounded-full border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-pointer flex items-center justify-center shadow-xs"
            aria-label="Next Slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="text-center italic font-serif text-sm mt-14 pt-8 border-t border-[var(--line)] max-w-md mx-auto text-[var(--ink-2)]">
          &ldquo;Still delivering verified, clean, and top-tier vehicles securely to our client&apos;s doorstep.&rdquo;
        </div>
      </div>
    </section>
  );
}