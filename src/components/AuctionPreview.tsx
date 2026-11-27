import React, { useState, useEffect, useRef } from 'react';
import { Clock, ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Zap, Gavel } from 'lucide-react';
import { VehicleLotItem } from '../types/auction';
import { searchAuctionVehicles } from '../services/auctionService';
import { MOCK_AUCTION_VEHICLES } from '../data/mockAuctionLots';
import AuctionVehicleCard from './AuctionVehicleCard';
import AnimatedText from './ui/AnimatedText';
import Reveal from './ui/Reveal';
import { LeafTabs, RippleLink, BreathOrb, TabOption } from './ui/ImportedControls';

type AuctionTab = 'closing-soon' | 'upcoming' | 'buy-it-now' | 'recently-sold';

export default function AuctionPreview() {
  const [activeTab, setActiveTab] = useState<AuctionTab>('closing-soon');
  const [lotsByTab, setLotsByTab] = useState<Record<AuctionTab, VehicleLotItem[]>>({
    'closing-soon': [],
    'upcoming': [],
    'buy-it-now': [],
    'recently-sold': [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    if (lotsByTab[activeTab] && lotsByTab[activeTab].length > 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    async function loadTabLots() {
      try {
        const filters: any = { per_page: 8 };

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
    scrollContainerRef.current?.scrollBy({ left: -360, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 360, behavior: 'smooth' });
  };

  const tabOptions: TabOption[] = [
    {
      value: 'closing-soon',
      label: (
        <span className="inline-flex items-center gap-1.5">
          <Clock size={14} /> Closing Soon
        </span>
      ),
    },
    {
      value: 'upcoming',
      label: (
        <span className="inline-flex items-center gap-1.5">
          <Gavel size={14} /> All Upcoming
        </span>
      ),
    },
    {
      value: 'buy-it-now',
      label: (
        <span className="inline-flex items-center gap-1.5">
          <Zap size={14} /> Buy It Now
        </span>
      ),
    },
    {
      value: 'recently-sold',
      label: (
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck size={14} /> Recently Sold
        </span>
      ),
    },
  ];

  const currentItems = lotsByTab[activeTab] || [];

  return (
    <section
      id="auction-listings"
      className="lx-band-white relative pt-5 pb-16 px-4 sm:px-6 md:px-12 border-t border-[var(--line)] transition-colors duration-500 overflow-x-clip"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="lx-bg-grid absolute inset-0 opacity-45" />
        <BreathOrb className="w-[40vw] h-[30vw] -top-12 right-[12%] opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <Reveal variant="rise">
          <div className="mb-8">
            <span className="inline-block text-[11px] font-mono uppercase tracking-[0.22em] text-[var(--accent)] font-bold mb-2">
              Copart &amp; IAAI Direct Feed
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[var(--ink)]">
              <AnimatedText text="Live Auction Cars" variant="mask-rise" />{' '}
              <span className="text-base sm:text-lg font-mono font-normal text-[var(--ink-2)]">(Copart · IAAI)</span>
            </h2>
            <p className="text-xs sm:text-sm font-mono mt-2 text-[var(--ink-2)] max-w-2xl">
              Direct North American salvage, clean title, and wholesale auction feeds updated in real-time.
            </p>
          </div>
        </Reveal>

        {/* Filter Tabs & Carousel Navigation Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="overflow-x-auto pb-1 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <LeafTabs
              options={tabOptions}
              value={activeTab}
              onChange={(val) => setActiveTab(val as AuctionTab)}
            />
          </div>

          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={scrollLeft}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all active:scale-95 cursor-pointer shadow-xs"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all active:scale-95 cursor-pointer shadow-xs"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel / Cards Grid */}
        <div
          ref={scrollContainerRef}
          className="lx-perspective flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory [scrollbar-width:thin] scroll-smooth"
        >
          {isLoading ? (
            [1, 2, 3].map((n) => (
              <div
                key={n}
                className="w-[85vw] sm:w-[48vw] lg:w-[calc(33.333%-16px)] shrink-0 lx-card-padded animate-pulse"
              >
                <div className="aspect-[16/10] bg-[var(--surface)] rounded-2xl mb-4" />
                <div className="h-5 bg-[var(--surface)] rounded w-3/4 mb-2" />
                <div className="h-4 bg-[var(--surface)] rounded w-1/2 mb-4" />
                <div className="h-16 bg-[var(--surface)] rounded mb-4" />
                <div className="h-10 bg-[var(--surface)] rounded-full" />
              </div>
            ))
          ) : currentItems.length === 0 ? (
            <div className="w-full py-16 px-6 text-center lx-card-padded">
              <ShieldCheck size={36} className="mx-auto text-[var(--accent)] mb-3 opacity-85" />
              <h4 className="font-serif text-xl font-normal mb-2 text-[var(--ink)]">
                No lots found in this category
              </h4>
              <p className="text-xs font-mono max-w-md mx-auto mb-5 text-[var(--ink-2)]">
                Try searching our full auction catalog or refresh to see newly scheduled lane entries.
              </p>
              <RippleLink to="/auction-search/" variant="primary" className="px-6 py-2.5 text-xs uppercase tracking-wider">
                Browse Auction Inventory <ArrowRight size={14} />
              </RippleLink>
            </div>
          ) : (
            currentItems.map((vehicle, idx) => (
              <div
                key={vehicle.id}
                className="w-[85vw] sm:w-[48vw] lg:w-[calc(33.333%-16px)] shrink-0 snap-start"
              >
                <Reveal variant="isometric" col={idx % 3}>
                  <AuctionVehicleCard vehicle={vehicle} viewMode="grid" />
                </Reveal>
              </div>
            ))
          )}
        </div>

        {/* View All Live Inventory CTA */}
        <div className="mt-8 text-center">
          <RippleLink
            to="/auction-search/"
            variant="primary"
            className="px-8 py-3.5 text-xs sm:text-sm font-mono uppercase tracking-wider shadow-lg"
          >
            <span>Explore All 50,000+ Auction Lots</span>
            <ArrowRight size={16} />
          </RippleLink>
        </div>
      </div>
    </section>
  );
}
