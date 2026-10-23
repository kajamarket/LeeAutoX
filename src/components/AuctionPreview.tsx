import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Zap, Gavel } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { VehicleLotItem } from '../types/auction';
import { searchAuctionVehicles } from '../services/auctionService';
import { MOCK_AUCTION_VEHICLES } from '../data/mockAuctionLots';
import AuctionVehicleCard from './AuctionVehicleCard';

type AuctionTab = 'closing-soon' | 'upcoming' | 'buy-it-now' | 'recently-sold';

export default function AuctionPreview() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<AuctionTab>('closing-soon');
  const [lotsByTab, setLotsByTab] = useState<Record<AuctionTab, VehicleLotItem[]>>({
    'closing-soon': [],
    'upcoming': [],
    'buy-it-now': [],
    'recently-sold': [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch auction data for activeTab with caching per tab
  useEffect(() => {
    let isMounted = true;

    // Check if we already have items for this tab
    if (lotsByTab[activeTab] && lotsByTab[activeTab].length > 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    async function loadTabLots() {
      try {
        let filters: any = { per_page: 8 };

        if (activeTab === 'closing-soon') {
          filters.upcoming = 'only';
          filters.lot_sub_status = 'Open';
        } else if (activeTab === 'upcoming') {
          filters.upcoming = 'all';
        } else if (activeTab === 'buy-it-now') {
          filters.lot_status = 'Buy Now';
        } else if (activeTab === 'recently-sold') {
          filters.lot_sub_status = 'Ended';
        }

        const response = await searchAuctionVehicles(filters);
        if (isMounted) {
          const items = response.data && response.data.length > 0 ? response.data : MOCK_AUCTION_VEHICLES;
          setLotsByTab((prev) => ({
            ...prev,
            [activeTab]: items,
          }));
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setLotsByTab((prev) => ({
            ...prev,
            [activeTab]: MOCK_AUCTION_VEHICLES,
          }));
          setIsLoading(false);
        }
      }
    }

    loadTabLots();

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

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

  const currentItems = lotsByTab[activeTab] || [];

  return (
    <section
      id="auction-listings"
      className={`relative pt-10 pb-16 px-6 md:px-12 border-t transition-colors duration-500 overflow-hidden ${
        theme === 'dark' ? 'bg-[#0d0d0d] text-white border-white/10' : 'bg-[#F4F6F9] text-slate-900 border-slate-200'
      }`}
    >
      <div className="absolute top-0 right-1/4 w-[40vw] h-[30vw] bg-[#2B59FF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Live Auction Cars <span className="text-base sm:text-lg font-mono font-normal opacity-60">(Copart · IAAI)</span>
          </h2>
          <p className={`text-xs sm:text-sm font-mono mt-1 ${theme === 'dark' ? 'text-white/60' : 'text-slate-600'}`}>
            Direct North American salvage, clean title, and wholesale auction feeds updated in real-time.
          </p>
        </div>

        {/* Filter Tabs & Carousel Navigation Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
            </button>
          </div>

          {/* Carousel Arrows */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={scrollLeft}
              className={`p-2.5 rounded-xl border transition-all active:scale-[0.95] cursor-pointer ${
                theme === 'dark'
                  ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                  : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800 shadow-xs'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={scrollRight}
              className={`p-2.5 rounded-xl border transition-all active:scale-[0.95] cursor-pointer ${
                theme === 'dark'
                  ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                  : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800 shadow-xs'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel / Cards Grid */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory [scrollbar-width:thin] scroll-smooth"
        >
          {isLoading ? (
            // Loading Skeletons
            [1, 2, 3].map((n) => (
              <div
                key={n}
                className={`w-[85vw] sm:w-[48vw] lg:w-[calc(33.333%-16px)] shrink-0 rounded-2xl border overflow-hidden p-4 animate-pulse ${
                  theme === 'dark' ? 'bg-[#151515] border-white/10' : 'bg-white border-slate-200'
                }`}
              >
                <div className="aspect-[16/10] bg-slate-200 dark:bg-white/10 rounded-xl mb-4" />
                <div className="h-5 bg-slate-200 dark:bg-white/10 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-1/2 mb-4" />
                <div className="h-16 bg-slate-200 dark:bg-white/10 rounded mb-4" />
                <div className="h-10 bg-slate-200 dark:bg-white/10 rounded" />
              </div>
            ))
          ) : currentItems.length === 0 ? (
            <div
              className={`w-full py-16 px-6 text-center border rounded-2xl ${
                theme === 'dark' ? 'bg-white/5 border-white/10 text-white/70' : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <ShieldCheck size={36} className="mx-auto text-[#2B59FF] mb-3 opacity-80" />
              <h4 className="font-serif text-xl font-bold mb-2">No lots found in this category</h4>
              <p className="text-xs font-mono max-w-md mx-auto mb-4">
                Try searching our full auction catalog or refresh to see newly scheduled lane entries.
              </p>
              <Link
                to="/auction-search"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2B59FF] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-blue-600"
              >
                Browse Auction Inventory <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            currentItems.map((vehicle) => (
              <div 
                key={vehicle.id} 
                className="w-[85vw] sm:w-[48vw] lg:w-[calc(33.333%-16px)] shrink-0 snap-start"
              >
                <AuctionVehicleCard vehicle={vehicle} viewMode="grid" />
              </div>
            ))
          )}
        </div>

        {/* View All Live Inventory CTA */}
        <div className="mt-8 text-center">
          <Link
            to="/auction-search"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#2B59FF] text-white text-xs sm:text-sm font-mono font-bold uppercase tracking-wider rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
          >
            <span>Explore All 50,000+ Auction Lots</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
