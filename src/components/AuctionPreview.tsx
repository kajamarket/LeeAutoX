import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, Clock, ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Zap, Gavel, X, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CONTACT_INFO } from '../constants';

import { INITIAL_AUCTION_VEHICLES, AuctionVehicle } from "../data/auctionVehicles";

export default function AuctionPreview() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'closing-soon' | 'upcoming' | 'buy-it-now' | 'recently-sold'>('closing-soon');
  const [savedBookmarks, setSavedBookmarks] = useState<Record<string, boolean>>({});
  const [timers, setTimers] = useState<Record<string, number>>({});
  const [selectedLotForModal, setSelectedLotForModal] = useState<AuctionVehicle | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Initialize and run ticking countdown timers with setInterval
  useEffect(() => {
    const initialTimers: Record<string, number> = {};
    INITIAL_AUCTION_VEHICLES.forEach(v => {
      initialTimers[v.id] = v.secondsRemaining;
    });
    setTimers(initialTimers);

    const intervalId = setInterval(() => {
      setTimers(prev => {
        const next: Record<string, number> = { ...prev };
        Object.keys(next).forEach(id => {
          if (next[id] > 0) {
            next[id] = next[id] - 1;
          }
        });
        return next;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatCountdown = (totalSeconds: number | undefined) => {
    if (!totalSeconds || totalSeconds <= 0) return '00h 00m 00s';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedBookmarks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  // Filter items by tab
  const items = INITIAL_AUCTION_VEHICLES.filter(v => v.category === activeTab);

  // Count badges
  const closingSoonCount = INITIAL_AUCTION_VEHICLES.filter(v => v.category === 'closing-soon').length;
  const upcomingCount = INITIAL_AUCTION_VEHICLES.filter(v => v.category === 'upcoming').length;
  const buyItNowCount = INITIAL_AUCTION_VEHICLES.filter(v => v.category === 'buy-it-now').length;
  const recentlySoldCount = INITIAL_AUCTION_VEHICLES.filter(v => v.category === 'recently-sold').length;

  return (
    <section
      id="auction-listings"
      className={`relative py-24 px-6 md:px-12 border-t transition-colors duration-500 overflow-hidden ${
        theme === 'dark' ? 'bg-[#0d0d0d] text-white border-white/10' : 'bg-[#F4F6F9] text-slate-900 border-slate-200'
      }`}
    >
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 right-1/4 w-[40vw] h-[30vw] bg-[#2B59FF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Heading & Breadcrumb Tag */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#2B59FF]">
                Live North American Auction Block
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Browse Auction Listings{' '}
              <span className="text-lg sm:text-2xl font-mono font-normal opacity-60">
                (Copart · IAA)
              </span>
            </h2>
            <p className={`mt-3 text-sm sm:text-base max-w-xl font-light leading-relaxed ${
              theme === 'dark' ? 'text-white/70' : 'text-slate-600'
            }`}>
              Monitor active salvage, clean title, and insurance lots across Ontario, Quebec, and US border auction yards. LeeAutoX handles inspection, bidding proxy, and overseas loading.
            </p>
          </div>

          {/* Carousel Arrows (Desktop) */}
          <div className="flex items-center gap-3">
            <button
              onClick={scrollLeft}
              className={`p-3 rounded-xl border transition-all active:scale-[0.95] cursor-pointer ${
                theme === 'dark'
                  ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                  : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800 shadow-xs'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollRight}
              className={`p-3 rounded-xl border transition-all active:scale-[0.95] cursor-pointer ${
                theme === 'dark'
                  ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                  : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800 shadow-xs'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* 4 Filter Tabs with Count Badges */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setActiveTab('closing-soon')}
            className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide flex items-center gap-2 whitespace-nowrap transition-all active:scale-[0.98] cursor-pointer ${
              activeTab === 'closing-soon'
                ? 'bg-[#2B59FF] text-white shadow-lg shadow-blue-500/25'
                : theme === 'dark'
                ? 'bg-white/5 text-white/70 hover:text-white border border-white/10'
                : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-200'
            }`}
          >
            <Clock size={15} />
            Closing Soon
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
              activeTab === 'closing-soon' ? 'bg-white/20 text-white' : 'bg-slate-200/60 text-slate-700 dark:bg-white/10 dark:text-white/80'
            }`}>
              {closingSoonCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide flex items-center gap-2 whitespace-nowrap transition-all active:scale-[0.98] cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-[#2B59FF] text-white shadow-lg shadow-blue-500/25'
                : theme === 'dark'
                ? 'bg-white/5 text-white/70 hover:text-white border border-white/10'
                : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-200'
            }`}
          >
            <Gavel size={15} />
            All Upcoming
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
              activeTab === 'upcoming' ? 'bg-white/20 text-white' : 'bg-slate-200/60 text-slate-700 dark:bg-white/10 dark:text-white/80'
            }`}>
              {upcomingCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('buy-it-now')}
            className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide flex items-center gap-2 whitespace-nowrap transition-all active:scale-[0.98] cursor-pointer ${
              activeTab === 'buy-it-now'
                ? 'bg-[#2B59FF] text-white shadow-lg shadow-blue-500/25'
                : theme === 'dark'
                ? 'bg-white/5 text-white/70 hover:text-white border border-white/10'
                : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-200'
            }`}
          >
            <Zap size={15} />
            Buy It Now
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
              activeTab === 'buy-it-now' ? 'bg-white/20 text-white' : 'bg-slate-200/60 text-slate-700 dark:bg-white/10 dark:text-white/80'
            }`}>
              {buyItNowCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recently-sold')}
            className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide flex items-center gap-2 whitespace-nowrap transition-all active:scale-[0.98] cursor-pointer ${
              activeTab === 'recently-sold'
                ? 'bg-[#2B59FF] text-white shadow-lg shadow-blue-500/25'
                : theme === 'dark'
                ? 'bg-white/5 text-white/70 hover:text-white border border-white/10'
                : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-200'
            }`}
          >
            <ShieldCheck size={15} />
            Recently Sold
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
              activeTab === 'recently-sold' ? 'bg-white/20 text-white' : 'bg-slate-200/60 text-slate-700 dark:bg-white/10 dark:text-white/80'
            }`}>
              {recentlySoldCount}
            </span>
          </button>
        </div>

        {/* Horizontally Scrollable Cards Container */}
        {/* On desktop: 3 cards visible + peek; On mobile: 1.2 cards visible */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory [scrollbar-width:thin] scroll-smooth"
        >
          {items.length === 0 ? (
            <div className={`w-full py-16 px-6 text-center border rounded-2xl ${
              theme === 'dark' ? 'bg-white/5 border-white/10 text-white/70' : 'bg-white border-slate-200 text-slate-600'
            }`}>
              <ShieldCheck size={36} className="mx-auto text-[#2B59FF] mb-3 opacity-80" />
              <h4 className="font-serif text-xl font-bold mb-2">No listings currently in this category</h4>
              <p className="text-xs font-mono max-w-md mx-auto">
                All lots in this auction block have finalized or are transitioning to the next bidding window.
              </p>
            </div>
          ) : (
            items.map((vehicle) => {
              const isBookmarked = !!savedBookmarks[vehicle.id];
              const remainingTimeStr = formatCountdown(timers[vehicle.id]);

              return (
                <div
                  key={vehicle.id}
                  className={`w-[85vw] sm:w-[48vw] lg:w-[calc(33.333%-16px)] shrink-0 snap-start rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between ${
                    theme === 'dark'
                      ? 'bg-[#151515] border-white/10 hover:border-white/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  {/* Top 60%: Media Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 group">
                    <img
                      src={vehicle.image}
                      alt={vehicle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Source & Condition Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                      <span className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md text-white shadow-sm ${
                        vehicle.source === 'Copart' ? 'bg-blue-600' : 'bg-red-600'
                      }`}>
                        {vehicle.source}
                      </span>
                      <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md bg-black/70 backdrop-blur-md text-emerald-400 border border-white/10 shadow-sm">
                        {vehicle.condition}
                      </span>
                    </div>

                    {/* Bookmark Toggle */}
                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(vehicle.id, e)}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-transform active:scale-90 cursor-pointer ${
                        isBookmarked
                          ? 'bg-[#2B59FF] text-white shadow-md'
                          : 'bg-black/60 text-white/80 hover:text-white border border-white/15'
                      }`}
                      aria-label="Bookmark lot"
                    >
                      <Bookmark size={14} className={isBookmarked ? 'fill-current' : ''} />
                    </button>

                    {/* Live Ticking Countdown Timer Overlay Bar */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-6 flex items-center justify-between text-white">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300">
                        <Clock size={13} className="animate-spin" style={{ animationDuration: '4s' }} />
                        <span>{remainingTimeStr}</span>
                      </div>
                      <span className="text-[10px] font-mono text-white/70">
                        Lot #{vehicle.lotNumber}
                      </span>
                    </div>
                  </div>

                  {/* Bottom 40%: 2x2 Specs Grid + Actions */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold truncate mb-1" title={vehicle.title}>
                        {vehicle.title}
                      </h3>
                      <p className={`text-xs font-mono truncate mb-4 ${
                        theme === 'dark' ? 'text-white/50' : 'text-slate-500'
                      }`}>
                        {vehicle.location}
                      </p>

                      {/* 2x2 Specs Grid */}
                      <div className={`grid grid-cols-2 gap-2 p-3 rounded-xl mb-4 border ${
                        theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'
                      }`}>
                        <div>
                          <span className={`text-[10px] font-mono uppercase block ${
                            theme === 'dark' ? 'text-white/40' : 'text-slate-400'
                          }`}>
                            {vehicle.isBuyItNow ? 'Buy It Now' : 'Current Bid'}
                          </span>
                          <span className="font-bold text-sm text-[#2B59FF]">
                            {vehicle.isBuyItNow ? vehicle.buyItNowPrice : vehicle.currentBid}
                          </span>
                        </div>
                        <div>
                          <span className={`text-[10px] font-mono uppercase block ${
                            theme === 'dark' ? 'text-white/40' : 'text-slate-400'
                          }`}>
                            Est. Retail
                          </span>
                          <span className="font-semibold text-xs opacity-80">
                            {vehicle.estRetail}
                          </span>
                        </div>
                        <div>
                          <span className={`text-[10px] font-mono uppercase block ${
                            theme === 'dark' ? 'text-white/40' : 'text-slate-400'
                          }`}>
                            Odometer
                          </span>
                          <span className="font-medium text-xs">
                            {vehicle.odometer}
                          </span>
                        </div>
                        <div>
                          <span className={`text-[10px] font-mono uppercase block ${
                            theme === 'dark' ? 'text-white/40' : 'text-slate-400'
                          }`}>
                            Damage
                          </span>
                          <span className="font-medium text-xs truncate block" title={vehicle.damage}>
                            {vehicle.damage}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedLotForModal(vehicle)}
                        className="flex-1 py-2.5 px-3 bg-[#2B59FF] hover:bg-blue-600 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Gavel size={13} />
                        Bid via LeeAutoX
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedLotForModal(vehicle)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer ${
                          theme === 'dark'
                            ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                            : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800'
                        }`}
                        title="View lot report"
                      >
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Link: Browse all auction vehicles */}
        <div className="mt-12 text-center">
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 text-sm font-bold text-[#2B59FF] hover:underline cursor-pointer tracking-wide"
          >
            <span>Browse all auction vehicles & lot catalogs</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Lot Bidding / Inquiry Modal */}
      <AnimatePresence>
        {selectedLotForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`max-w-lg w-full rounded-3xl p-6 sm:p-8 border shadow-2xl relative ${
                theme === 'dark' ? 'bg-[#181818] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <button
                type="button"
                onClick={() => setSelectedLotForModal(null)}
                className={`absolute top-5 right-5 p-2 rounded-full border transition-colors ${
                  theme === 'dark' ? 'border-white/10 hover:bg-white/10 text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-md text-white ${
                  selectedLotForModal.source === 'Copart' ? 'bg-blue-600' : 'bg-red-600'
                }`}>
                  {selectedLotForModal.source} Lot #{selectedLotForModal.lotNumber}
                </span>
                <span className="text-xs font-mono text-emerald-500 font-bold">
                  {selectedLotForModal.condition}
                </span>
              </div>

              <h3 className="font-serif text-2xl font-bold mb-2">
                {selectedLotForModal.title}
              </h3>
              <p className={`text-xs font-mono mb-4 ${theme === 'dark' ? 'text-white/60' : 'text-slate-500'}`}>
                Yard: {selectedLotForModal.location} • Odo: {selectedLotForModal.odometer}
              </p>

              <div className={`p-4 rounded-2xl mb-6 border ${
                theme === 'dark' ? 'bg-black/50 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono opacity-70">Current Auction Bid:</span>
                  <span className="font-bold text-base text-[#2B59FF]">{selectedLotForModal.currentBid}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono opacity-70">Estimated Retail Value:</span>
                  <span className="font-semibold text-xs opacity-90">{selectedLotForModal.estRetail}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono opacity-70">LeeAutoX Procurement:</span>
                  <span className="text-xs font-mono text-emerald-500 font-bold">Verified Inspection + Export</span>
                </div>
              </div>

              <p className={`text-xs leading-relaxed mb-6 font-light ${
                theme === 'dark' ? 'text-white/70' : 'text-slate-600'
              }`}>
                Live Copart & IAA API bidding execution is coordinated directly through our licensed Ontario brokerage. Connect with our desk to lock in your proxy bid ceiling and secure this lot before closing.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(
                    `Hello LeeAutoX! I am interested in bidding on ${selectedLotForModal.title} (${selectedLotForModal.source} Lot #${selectedLotForModal.lotNumber}) located in ${selectedLotForModal.location}. Please provide inspection and bidding proxy details.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <MessageSquare size={16} />
                  Bid on WhatsApp
                </a>
                <a
                  href="#contact"
                  onClick={() => setSelectedLotForModal(null)}
                  className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border text-center transition-all active:scale-[0.98] ${
                    theme === 'dark'
                      ? 'border-white/20 hover:bg-white/10 text-white'
                      : 'border-slate-300 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  Request Call
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
