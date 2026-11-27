import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { WHY_CHOOSE_LABELS } from '../constants';
import { useTheme } from '../context/ThemeContext';
import { CheckCircle2 } from 'lucide-react';
import LexusLX700hShowcase from './whyChooseShowcase/LexusLX700hShowcase';
import AnimatedText from './ui/AnimatedText';

export default function WhyChooseUs() {
  const { theme } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="why-us"
      className="lx-band-white relative border-t border-[var(--line)] transition-colors duration-500 px-4 sm:px-6 md:px-12 py-16 overflow-x-clip"
    >
      {/* Visible architectural watermark & dot backdrop */}
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <div className="lx-bg-dots absolute inset-0 opacity-45" />
        <div className="opacity-[0.065] text-[var(--ink)]">
          <div className="absolute -top-10 -left-20 text-[18vw] font-black leading-none tracking-tighter rotate-[-15deg] whitespace-nowrap">
            LOGISTICS
          </div>
          <div className="absolute top-1/2 -right-40 text-[16vw] font-serif font-bold leading-none rotate-[12deg] whitespace-nowrap">
            PREMIUM
          </div>
        </div>
      </div>

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-[var(--accent)] tracking-[0.2em] mb-4">
          <AnimatedText text="Why choose us" variant="tracking-expanding" />
        </div>

        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.08] mb-5 tracking-tight text-[var(--ink)]">
          <AnimatedText text="Delivered to Customers Like You." variant="blur-in" />
        </h2>

        <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-6 text-[var(--ink-2)]">
          <AnimatedText
            text="Every car we ship is inspected, tracked and documented. Here's what customers say. Browse our recent verified delivery timeline."
            variant="fade-up"
          />
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-mono font-bold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <span>More than 30 Vehicles delivered so far</span>
        </div>
      </div>

      <div className="relative mx-auto max-w-2xl select-none">
        {/* Soft transparent radial backdrop */}
        <div
          className="absolute inset-0 z-0 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, var(--accent-soft) 0%, transparent 78%)',
          }}
        />

        {/* 3D Vehicle Showcase Slot - Exact same container dimensions, transparent canvas layered behind chips */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { scale: 0.96, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.75, ease: 'easeOut' }}
          className="relative z-0 w-full flex items-center justify-center"
        >
          <LexusLX700hShowcase theme={theme} />
        </motion.div>

        {/* Floating Chips - Desktop */}
        <div className="hidden md:block">
          <Chip
            text={WHY_CHOOSE_LABELS[0]}
            className="top-[14%] right-[2%]"
            delay={0.35}
            inView={inView}
            shouldReduceMotion={shouldReduceMotion}
          />
          <Chip
            text={WHY_CHOOSE_LABELS[1]}
            className="top-[36%] left-[0%]"
            delay={0.45}
            inView={inView}
            shouldReduceMotion={shouldReduceMotion}
          />
          <Chip
            text={WHY_CHOOSE_LABELS[2]}
            className="bottom-[24%] right-[2%]"
            delay={0.55}
            inView={inView}
            shouldReduceMotion={shouldReduceMotion}
          />
          <Chip
            text={WHY_CHOOSE_LABELS[3]}
            className="bottom-[10%] left-[0%]"
            delay={0.65}
            inView={inView}
            shouldReduceMotion={shouldReduceMotion}
          />
        </div>

        {/* Mobile Grid */}
        <div className="relative z-[2] mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
          {WHY_CHOOSE_LABELS.map((label, i) => (
            <motion.div
              key={label}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25 + i * 0.08, duration: 0.5 }}
              className="lx-glass border border-[var(--line)] rounded-2xl px-4 py-3 flex items-center gap-2.5 text-[var(--ink)] shadow-sm"
            >
              <CheckCircle2 size={15} className="text-[var(--accent)] shrink-0" />
              <span className="font-semibold text-xs tracking-tight">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Chip({
  text,
  className,
  delay,
  inView,
  shouldReduceMotion,
}: {
  text: string;
  className: string;
  delay: number;
  inView: boolean;
  shouldReduceMotion: boolean | null;
}) {
  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { scale: 0.94, opacity: 0, y: 8 }}
      animate={inView ? { scale: 1, opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={shouldReduceMotion ? {} : { y: -2 }}
      className={`absolute z-20 lx-glass border border-[var(--line)] rounded-2xl px-5 py-3 shadow-lg text-[var(--ink)] flex items-center gap-2.5 cursor-default ${className}`}
    >
      <CheckCircle2 size={16} className="text-[var(--accent)] shrink-0" />
      <span className="font-semibold text-xs sm:text-sm tracking-tight whitespace-nowrap">
        {text}
      </span>
    </motion.div>
  );
}
