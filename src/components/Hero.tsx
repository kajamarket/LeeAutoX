import React from 'react';
import { motion } from 'motion/react';
import { Star, ArrowDownRight } from 'lucide-react';
import { useReviews } from '../context/ReviewsContext';
import HeroSearchWidget from './HeroSearchWidget';
import TypewriterText from './TypewriterText';

export default function Hero() {
  const { averageRating, totalCount } = useReviews();

  return (
    <section className="relative pt-28 sm:pt-32 md:pt-36 pb-10 md:pb-12 px-6 md:px-12 bg-black text-white overflow-hidden">
      {/* Restored Hero Background Image - Visible across Mobile, Tablet, and Desktop */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="https://leeplugshub.com/wp-content/uploads/2026/05/leeautoxhero.png"
          alt="LeeAutoX North American Sourced Vehicle"
          className="w-full h-full object-cover object-center opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      </div>

      {/* Ambient Lighting & Headlights */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-35">
        <div className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-[#2B59FF]/20 to-transparent blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-cyan-500/10 to-transparent blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 mb-12">
        {/* Eyebrow & Dynamic Rating Badge */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-xs font-mono tracking-[0.3em] text-[#2B59FF] uppercase"
          >
            BUY — BID — EXPORT
          </motion.p>
          <motion.a
            href="#testimonials"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 rounded-full text-white text-xs font-medium cursor-pointer transition-all"
          >
            <div className="flex items-center text-amber-400">
              <Star size={13} className="fill-amber-400 text-amber-400" />
            </div>
            <span className="font-bold text-white">{averageRating}</span>
            <span className="text-white/60">/ 5.0</span>
            <span className="text-white/40 text-[10px] hidden sm:inline">·</span>
            <span className="text-white/70 text-[11px] underline underline-offset-2">
              {totalCount} Verified Reviews
            </span>
          </motion.a>
        </div>

        {/* Headline */}
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
          className="font-serif text-5xl md:text-7xl font-black leading-[0.95] tracking-tight text-white text-balance mb-6 max-w-3xl"
        >
          Buy in Canada & USA.<br />
          <span className="italic font-normal">Collect anywhere in Nigeria.</span>
        </motion.h1>

        {/* Body */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="text-white/70 font-light text-base md:text-lg max-w-xl leading-relaxed mb-8"
        >
          <TypewriterText
            text="We buy from Copart, IAA, all USA/Canadian auctions, dealerships, and ship to Nigeria or Anywhere in West Africa, and clear customs. Pay in installments, track every step, then collect."
            speed={18}
            delay={350}
          />
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="flex flex-col sm:flex-row items-start gap-4 mb-10"
        >
          <a
            href="#contact"
            className="px-7 py-3.5 bg-[#2B59FF] text-white text-sm font-semibold border border-[#2B59FF] hover:bg-transparent hover:text-white transition-colors cursor-pointer tracking-wide shadow-[0_0_20px_rgba(43,89,255,0.4)]"
          >
            Get a Free Quote
          </a>
          <a
            href="#auction-search"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('auction-search')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group flex items-center gap-3 text-sm font-medium cursor-pointer hover:opacity-70 transition-opacity text-white py-3.5"
          >
            <span className="tracking-wide">Search Auction Cars Below</span>
            <div className="w-8 h-8 border border-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
              <ArrowDownRight size={16} />
            </div>
          </a>
        </motion.div>

        {/* Hero Search Widget - Task 1 */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="w-full relative scroll-mt-24"
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2B59FF] animate-pulse" />
              <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                Live Copart & IAAI Auction Search
              </h3>
            </div>
            <span className="text-[11px] font-mono text-white/60 uppercase tracking-widest hidden sm:inline">
              Real-time North American Inventory Feeds
            </span>
          </div>

          <HeroSearchWidget />
        </motion.div>
      </div>
    </section>
  );
}
