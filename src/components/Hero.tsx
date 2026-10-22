import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ArrowDownRight, Search, SlidersHorizontal, X, Globe, Shield, Car } from 'lucide-react';
import { useReviews } from '../context/ReviewsContext';

export default function Hero() {
  const { averageRating, totalCount } = useReviews();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  
  // Auction search filters
  const [keyword, setKeyword] = useState('');
  const [make, setMake] = useState('All Makes');
  const [model, setModel] = useState('');
  const [yearFrom, setYearFrom] = useState('2015');
  const [yearTo, setYearTo] = useState('2024');
  const [bodyType, setBodyType] = useState('All');
  const [condition, setCondition] = useState('All');
  const [titleType, setTitleType] = useState('All');
  const [auctionSource, setAuctionSource] = useState('Both');
  const [locationState, setLocationState] = useState('All States');

  const handleAuctionSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchSubmitted(true);
  };

  return (
    <section className="relative py-20 md:py-24 px-6 md:px-12 bg-black text-white overflow-hidden">
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
          We buy from Copart, IAA, all USA/Canadian auctions, dealerships, and ship to Nigeria or Anywhere in West Africa, and clear customs. Pay in installments, track every step, then collect.
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

        {/* CHANGE 1b — Copart / IAA Auction Vehicle Search UI */}
        <motion.div
          id="auction-search"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="bg-black/80 backdrop-blur-2xl border border-white/25 p-6 md:p-8 shadow-2xl relative scroll-mt-24"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2B59FF] animate-pulse" />
              <h3 className="font-serif text-lg font-bold text-white tracking-wide">Live Copart & IAA Auction Lot Search</h3>
            </div>
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest hidden sm:inline">USA & Canada Live Inventory Feed</span>
          </div>

          <form onSubmit={handleAuctionSearch} className="flex flex-col gap-4">
            {/* Primary keyword & Source row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="text"
                  placeholder="Enter Make, Model, Keyword, or Lot / VIN #..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 pl-12 pr-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#2B59FF]"
                />
              </div>
              <div className="md:col-span-3">
                <select
                  value={auctionSource}
                  onChange={(e) => setAuctionSource(e.target.value)}
                  className="w-full bg-black border border-white/20 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2B59FF]"
                >
                  <option value="Both">Auction: Copart & IAA</option>
                  <option value="Copart">Copart Auctions Only</option>
                  <option value="IAA">IAA Insurance Auto Auctions</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <select
                  value={locationState}
                  onChange={(e) => setLocationState(e.target.value)}
                  className="w-full bg-black border border-white/20 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2B59FF]"
                >
                  <option value="All States">Location: All US/CA States</option>
                  <option value="ON">Ontario, Canada</option>
                  <option value="QC">Quebec, Canada</option>
                  <option value="TX">Texas, USA</option>
                  <option value="CA">California, USA</option>
                  <option value="NY">New York, USA</option>
                </select>
              </div>
            </div>

            {/* Expanded Advanced Filters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2 border-t border-white/10">
              <select
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="bg-white/5 border border-white/15 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#2B59FF]"
              >
                <option value="All Makes">Make: All</option>
                <option value="Toyota">Toyota</option>
                <option value="Lexus">Lexus</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Ford">Ford</option>
                <option value="Mercedes">Mercedes-Benz</option>
              </select>

              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                className="bg-white/5 border border-white/15 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#2B59FF]"
              >
                <option value="All">Body: All</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
              </select>

              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="bg-white/5 border border-white/15 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#2B59FF]"
              >
                <option value="All">Condition: All</option>
                <option value="Run & Drive">Run & Drive</option>
                <option value="Enhanced">Enhanced</option>
                <option value="Stationary">Stationary</option>
              </select>

              <select
                value={titleType}
                onChange={(e) => setTitleType(e.target.value)}
                className="bg-white/5 border border-white/15 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#2B59FF]"
              >
                <option value="All">Title: All Types</option>
                <option value="Clean">Clean Title</option>
                <option value="Salvage">Salvage</option>
                <option value="Parts">Parts Only</option>
              </select>

              <div className="flex items-center gap-1 bg-white/5 border border-white/15 px-3 py-2 text-xs text-white">
                <span className="text-white/50 text-[10px]">Year:</span>
                <input type="text" placeholder="From" value={yearFrom} onChange={(e) => setYearFrom(e.target.value)} className="w-12 bg-transparent text-white focus:outline-none text-center" />
                <span>-</span>
                <input type="text" placeholder="To" value={yearTo} onChange={(e) => setYearTo(e.target.value)} className="w-12 bg-transparent text-white focus:outline-none text-center" />
              </div>

              <button
                type="submit"
                className="py-2.5 bg-[#2B59FF] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#1a41cc] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(43,89,255,0.4)]"
              >
                <Search size={14} /> Search Lots
              </button>
            </div>
          </form>

          {/* Search Result Placeholder Modal / Drawer if submitted */}
          <AnimatePresence>
            {searchSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 p-5 bg-black/95 border border-[#2B59FF] relative"
              >
                <button
                  onClick={() => setSearchSubmitted(false)}
                  className="absolute top-4 right-4 text-white/60 hover:text-white"
                >
                  <X size={16} />
                </button>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#2B59FF]/20 text-[#2B59FF] border border-[#2B59FF]/40">
                    <Car size={24} />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold mb-1">Copart & IAA API Integration State</h4>
                    <p className="text-xs text-white/70 leading-relaxed mb-3 font-mono">
                      Query received for "{keyword || 'All vehicles'}" ({auctionSource}, {locationState}, {yearFrom}-{yearTo}). 
                      No live auction API connection is currently active.
                    </p>
                    <div className="flex items-center gap-3">
                      <a
                        href="#contact"
                        onClick={() => setSearchSubmitted(false)}
                        className="px-4 py-2 bg-[#2B59FF] text-white text-xs font-bold uppercase tracking-widest"
                      >
                        Request Manual Auction Sourcing
                      </a>
                      <span className="text-[10px] font-mono text-white/40">Connect your API to display live lot results here.</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
