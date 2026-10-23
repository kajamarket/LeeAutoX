import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, ArrowDownRight, Search, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { useReviews } from '../context/ReviewsContext';
import { STATIC_FILTER_METADATA } from '../data/auctionFilters';
import { getAuctionFilterOptions, buildFilterQuery } from '../services/auctionService';
import { AuctionFilterValues } from '../types/auction';

export default function Hero() {
  const navigate = useNavigate();
  const { averageRating, totalCount } = useReviews();
  const [showAdvancedMobile, setShowAdvancedMobile] = useState(false);

  // Available makes & dynamic models
  const [makesList, setMakesList] = useState<string[]>(STATIC_FILTER_METADATA.makes);
  const [keyword, setKeyword] = useState('');
  const [platform, setPlatform] = useState<string>('both');
  const [make, setMake] = useState('All');
  const [model, setModel] = useState('All');
  const [bodyType, setBodyType] = useState('All');
  const [runningCond, setRunningCond] = useState('All');
  const [lotStatus, setLotStatus] = useState('All');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [locState, setLocState] = useState('All');

  // Load dynamic makes list on mount
  useEffect(() => {
    let isMounted = true;
    getAuctionFilterOptions().then((res) => {
      if (isMounted && res.makes && res.makes.length > 0) {
        setMakesList(res.makes);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute available models for selected make
  const availableModels = useMemo(() => {
    if (!make || make === 'All') return [];
    const upper = make.toUpperCase();
    return STATIC_FILTER_METADATA.modelsByMake[upper] || [];
  }, [make]);

  // Reset model when make changes
  const handleMakeChange = (newMake: string) => {
    setMake(newMake);
    setModel('All');
  };

  const handleAuctionSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filters: AuctionFilterValues = {};

    if (keyword.trim()) filters.s = keyword.trim();
    if (platform && platform !== 'both') filters.platform = platform;
    if (make && make !== 'All') filters.make = make;
    if (model && model !== 'All') filters.model = model;
    if (bodyType && bodyType !== 'All') filters.body_style = bodyType;
    if (runningCond && runningCond !== 'All') filters.running_condition = runningCond;
    if (lotStatus && lotStatus !== 'All') filters.lot_status = lotStatus;
    if (yearFrom.trim()) filters.year_from = yearFrom.trim();
    if (yearTo.trim()) filters.year_to = yearTo.trim();
    if (locState && locState !== 'All') filters.loc_state = locState.split(' ')[0];

    const queryString = buildFilterQuery(filters);
    navigate(`/auction-search${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <section className="relative py-10 md:py-12 px-6 md:px-12 bg-black text-white overflow-hidden">
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
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-6 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="text"
                  placeholder="Enter Make, Model, Keyword, or Lot / VIN #..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 pl-12 pr-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#2B59FF] transition-colors"
                />
              </div>

              <div className="md:col-span-3">
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/20 px-3 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#2B59FF] transition-colors cursor-pointer"
                >
                  <option value="both" className="bg-zinc-900 text-white">Auction: Copart & IAAI</option>
                  <option value="copart" className="bg-zinc-900 text-white">Copart Auctions Only</option>
                  <option value="iaai" className="bg-zinc-900 text-white">IAAI Auto Auctions Only</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <select
                  value={locState}
                  onChange={(e) => setLocState(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/20 px-3 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#2B59FF] transition-colors cursor-pointer"
                >
                  <option value="All" className="bg-zinc-900 text-white">Location: All US/CA States</option>
                  {STATIC_FILTER_METADATA.states.map((s) => (
                    <option key={s} value={s} className="bg-zinc-900 text-white">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile filter toggle */}
            <div className="flex md:hidden justify-between items-center pt-1">
              <button
                type="button"
                onClick={() => setShowAdvancedMobile((prev) => !prev)}
                className="text-xs font-mono text-[#2B59FF] flex items-center gap-1.5 cursor-pointer py-1"
              >
                <SlidersHorizontal size={13} />
                {showAdvancedMobile ? 'Hide Detailed Filters' : 'More Filters (Make, Model, Year, Run Status)'}
                {showAdvancedMobile ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {/* Expanded Advanced Filters */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2 border-t border-white/10 ${
              showAdvancedMobile ? 'grid' : 'hidden md:grid'
            }`}>
              <select
                value={make}
                onChange={(e) => handleMakeChange(e.target.value)}
                className="bg-zinc-950 border border-white/15 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#2B59FF] cursor-pointer"
              >
                <option value="All" className="bg-zinc-900 text-white">Make: All</option>
                {makesList.map((m) => (
                  <option key={m} value={m} className="bg-zinc-900 text-white">
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={!make || make === 'All'}
                className="bg-zinc-950 border border-white/15 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#2B59FF] cursor-pointer disabled:opacity-40"
              >
                <option value="All" className="bg-zinc-900 text-white">
                  {!make || make === 'All' ? 'Model: Pick Make First' : 'Model: All'}
                </option>
                {availableModels.map((mod) => (
                  <option key={mod} value={mod} className="bg-zinc-900 text-white">
                    {mod}
                  </option>
                ))}
              </select>

              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                className="bg-zinc-950 border border-white/15 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#2B59FF] cursor-pointer"
              >
                <option value="All" className="bg-zinc-900 text-white">Body: All</option>
                {STATIC_FILTER_METADATA.types.map((t) => (
                  <option key={t.id} value={t.name} className="bg-zinc-900 text-white">
                    {t.name}
                  </option>
                ))}
              </select>

              <select
                value={runningCond}
                onChange={(e) => setRunningCond(e.target.value)}
                className="bg-zinc-950 border border-white/15 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#2B59FF] cursor-pointer"
              >
                <option value="All" className="bg-zinc-900 text-white">Condition: All</option>
                <option value="RUNS AND DRIVES" className="bg-zinc-900 text-white">Runs & Drives</option>
                <option value="ENGINE START PROGRAM" className="bg-zinc-900 text-white">Starts (Engine Program)</option>
                <option value="STATIONARY / NO INFORMATION" className="bg-zinc-900 text-white">Stationary</option>
              </select>

              <div className="flex items-center gap-1 bg-white/5 border border-white/15 px-2.5 py-2 text-xs text-white">
                <span className="text-white/50 text-[10px]">Year:</span>
                <input
                  type="text"
                  placeholder="From"
                  value={yearFrom}
                  onChange={(e) => setYearFrom(e.target.value)}
                  className="w-11 bg-transparent text-white focus:outline-none text-center placeholder-white/30 text-xs"
                />
                <span className="text-white/40">-</span>
                <input
                  type="text"
                  placeholder="To"
                  value={yearTo}
                  onChange={(e) => setYearTo(e.target.value)}
                  className="w-11 bg-transparent text-white focus:outline-none text-center placeholder-white/30 text-xs"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 bg-[#2B59FF] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#1a41cc] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(43,89,255,0.4)] cursor-pointer"
              >
                <Search size={14} /> Search Lots
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
