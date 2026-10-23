import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Clock, ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Zap, Gavel, MapPin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { VehicleLotItem } from '../types/auction';
import { searchAuctionVehicles } from '../services/auctionService';
import { generateBidWhatsAppUrl, getAuctionLotUrl } from '../utils/auctionBid';
import { MOCK_AUCTION_VEHICLES } from '../data/mockAuctionLots';

type AuctionTab = 'closing-soon' | 'upcoming' | 'buy-it-now' | 'recently-sold';

export default function AuctionPreview() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<AuctionTab>('closing-soon');
  const [savedBookmarks, setSavedBookmarks] = useState<Record<string, boolean>>({});
  const [lotsByTab, setLotsByTab] = useState<Record<AuctionTab, VehicleLotItem[]>>({
    'closing-soon': [],
    'upcoming': [],
    'buy-it-now': [],
    'recently-sold': [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [now, setNow] = useState<number>(Date.now());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Ticking timer for real-time countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
      } catch (err) {
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

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSavedBookmarks((prev) => ({
      ...prev,
      [id]: !prev[id],
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

  const formatCountdown = (dateString?: string) => {
    if (!dateString) return '00h 00m 00s';
    const target = new Date(dateString).getTime();
    const diff = Math.max(0, Math.floor((target - now) / 1000));
    if (diff <= 0) return 'Auction Live / Ended';

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    if (days > 0) {
      return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
    }
    return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
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
            currentItems.map((vehicle) => {
              const isBookmarked = !!savedBookmarks[vehicle.id];
              const remainingTimeStr = formatCountdown(vehicle.auction.auction_date);
              const mainPhoto = vehicle.media.photo?.[0] || 'https://images.unsplash.com/photo-1590362891988-f7780479c656?w=800';
              const lotUrl = getAuctionLotUrl(vehicle);
              const whatsappUrl = generateBidWhatsAppUrl(vehicle);
              const isBuyNow = !!vehicle.pricing.buy_now_price;

              return (
                <div
                  key={vehicle.id}
                  className={`w-[85vw] sm:w-[48vw] lg:w-[calc(33.333%-16px)] shrink-0 snap-start rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between ${
                    theme === 'dark'
                      ? 'bg-[#151515] border-white/10 hover:border-white/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  {/* Top: Media Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950 group">
                    <Link to={lotUrl} className="block w-full h-full">
                      <img
                        src={mainPhoto}
                        alt={vehicle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </Link>

                    {/* Source & Condition Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 pointer-events-none">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md text-white shadow-sm ${
                          vehicle.platform === 'copart' ? 'bg-blue-600' : 'bg-red-600'
                        }`}
                      >
                        {vehicle.platform.toUpperCase()}
                      </span>
                      <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md bg-black/75 backdrop-blur-md text-emerald-400 border border-white/10 shadow-sm">
                        {vehicle.specs.run_and_drive || 'RUNS AND DRIVES'}
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

                    {/* Countdown Timer Overlay Bar */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-6 flex items-center justify-between text-white pointer-events-none">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300">
                        <Clock size={13} className="animate-spin" style={{ animationDuration: '6s' }} />
                        <span>{remainingTimeStr}</span>
                      </div>
                      <span className="text-[10px] font-mono text-white/70">Lot #{vehicle.lot_number}</span>
                    </div>
                  </div>

                  {/* Bottom: 2x2 Specs Grid + Actions */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold truncate mb-1" title={vehicle.title}>
                        <Link to={lotUrl} className="hover:text-[#2B59FF] transition-colors">
                          {vehicle.title}
                        </Link>
                      </h3>
                      <p
                        className={`text-xs font-mono truncate mb-4 flex items-center gap-1 ${
                          theme === 'dark' ? 'text-white/50' : 'text-slate-500'
                        }`}
                      >
                        <MapPin size={12} className="shrink-0" />
                        {vehicle.location.city ? `${vehicle.location.city}, ${vehicle.location.state}` : vehicle.location.name}
                      </p>

                      {/* 2x2 Specs Grid */}
                      <div
                        className={`grid grid-cols-2 gap-2 p-3 rounded-xl mb-4 border ${
                          theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'
                        }`}
                      >
                        <div>
                          <span
                            className={`text-[10px] font-mono uppercase block ${
                              theme === 'dark' ? 'text-white/40' : 'text-slate-400'
                            }`}
                          >
                            {isBuyNow ? 'Buy It Now' : 'Current Bid'}
                          </span>
                          <span className="font-bold text-sm text-[#2B59FF]">
                            ${(isBuyNow ? vehicle.pricing.buy_now_price : vehicle.pricing.current_bid || 0).toLocaleString()} USD
                          </span>
                        </div>

                        <div>
                          <span
                            className={`text-[10px] font-mono uppercase block ${
                              theme === 'dark' ? 'text-white/40' : 'text-slate-400'
                            }`}
                          >
                            Est. Retail
                          </span>
                          <span className="font-semibold text-xs opacity-80">
                            ${(vehicle.pricing.est_retail_value || 0).toLocaleString()} USD
                          </span>
                        </div>

                        <div>
                          <span
                            className={`text-[10px] font-mono uppercase block ${
                              theme === 'dark' ? 'text-white/40' : 'text-slate-400'
                            }`}
                          >
                            Odometer
                          </span>
                          <span className="font-medium text-xs">
                            {(vehicle.specs.odometer || 0).toLocaleString()} {vehicle.specs.odometer_unit || 'mi'}
                          </span>
                        </div>

                        <div>
                          <span
                            className={`text-[10px] font-mono uppercase block ${
                              theme === 'dark' ? 'text-white/40' : 'text-slate-400'
                            }`}
                          >
                            Damage
                          </span>
                          <span className="font-medium text-xs truncate block" title={vehicle.damage.primary}>
                            {vehicle.damage.primary || 'Normal Wear'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-3 bg-[#2B59FF] hover:bg-blue-600 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Gavel size={13} />
                        Bid via LeeAutoX
                      </a>
                      <Link
                        to={lotUrl}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer ${
                          theme === 'dark'
                            ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                            : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800'
                        }`}
                        title="View lot report"
                      >
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Link: Browse all auction vehicles */}
        <div className="mt-12 text-center">
          <Link
            to="/auction-search"
            className="group inline-flex items-center gap-2 text-sm font-bold text-[#2B59FF] hover:underline cursor-pointer tracking-wide"
          >
            <span>Browse all auction vehicles & lot catalogs</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
